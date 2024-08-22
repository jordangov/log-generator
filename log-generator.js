#!/usr/bin/env node

const fs = require('fs')
const { Command } = require('commander')
const moment = require('moment')
const package = require('./package.json')
const generators = require('./field-generators')
const { replaceTemplateValues } = require('./helpers')

const FIELDS = require('./fields.json')
const TEMPLATES = {
    app: '{{log_date_iso}}T{{log_time_hhmmss}} {{level}} {{source_ip}} {{username}}:  {{app_message}}',
    // apache: '{{source_ip}} - - [log_date_eu:log_time_hhmmss log_tz_offset] "{{http_method}} {{resource}} HTTP/1.1" {{http_status}} {{resp_bytes}} "-" "{{user_agent}}"',
    // mysql: 'SET TIMESTAMP={{log_timestamp_sec}}/*!*/;\n{{query}}\n/*!*/;',
    // iis: '{{source_ip}}, -, {{log_date_us}}, {{log_time_hhmmss}}, W3SVC1, BIZ1, {{server_ip}}, {{process_time_ms}}, {{req_bytes}}, {{resp_bytes}}, {{http_status}}, 0, {{http_method}}, {{resource}}, -,',
    // git: 'commit {{hash}} (HEAD -> {{branch}}, origin/{{branch}}, origin/HEAD)\nAuthor: {{full_name}} <{{email}}>\nDate:   {{log_date_spelled}} {{log_time_hhmmss}} {{log_year}} {{log_tz_offset}}\n\n    {{git_message}}'
}


const program = new Command()

program
    .name(package.name)
    .description(package.description)
    .version(package.version)

program.command('templates')
    .description('Show a log template (lists all templates if none specified)')
    .argument('template-name', 'The template to show (specify "all" to list templates)')
    .action(showTemplate)

program.command('fields')
    .description('Show a list of available log template fields')
    .action(showFields)

program.command('app')
    .description('Generate application log entries')
    .action((o) => { generateLogs({ tempalte: TEMPLATES.app, ...o }) })

program
    .option('-c, --count <number>', 'Number of log entries to generate', forceInteger, 10)
    .option('-d, --delay <number>', 'Maximum random delay (in ms) between entries', forceInteger, 300000)
    .option('-e, --extension <string>', 'An extension to use with most resources in logs (i.e. "php" for admin.php)')
    .option('-f, --filename <string>', 'Output filename, can use {{date}} placeholder in filename (specify "null" to suppress)', 'generated_{{date}}.log')
    .option('-r, --reuse <decimal>', 'The chance (0-1) that a reusable field value is reused (i.e. usernames, IP addresses, etc)', forceNumber, 0.3)
    .option('-s, --start <datetime>', 'Start date/time (ISO format) for entries', setStart, new Date())
    .option('-w, --write', 'Write log entries to the terminal', false)
    

program.parse()


// -------------------- Command Option Methods --------------------- //
function setStart(s = '') {
    return new Date(s)
}
function forceInteger(n = '') {
    return Math.floor(Number(n))
}
function forceNumber(n = '') {
    return Number(n) || 0
}


// -------------------- Command Help Actions --------------------- //

function showTemplate(template = 'all') {
    if (template === 'all') {
        console.log(Object.keys(TEMPLATES))
    } else if (TEMPLATES[template]) {
        console.log(TEMPLATES[template])
    } else {
        console.error('Sorry, but that is not a known template!')
    }
}

function showFields() {
    console.log(`These are ALL of the fields used across all templates.
You can create a custom template using these fields like so:
    {{log_date_us}} {{source_ip}} {{message}}

You can see the fields used by any template using the "template <templateName> command`)
    console.log(Object.keys(FIELDS).map((n) => { return { [n]: FIELDS[n].description } }))
}


// ----------------------- Action Methods ------------------------ //


function generateLogs(options = {}) {
    options = { ...program.opts(), ...options, now: moment(options.start) }

    const logFields = Array.from(TEMPLATES.app.matchAll(/\{\{([a-z\_]+)\}\}/g)
        .map(m => m[1]))
        .filter(f => FIELDS[f])

    const logs = []
    for (let i=0; i<options.count; ++i) {
        options.now = options.now.add(Math.ceil(Math.random() * options.delay), 'ms')
        const fieldValues = generateFieldValues(options, logFields)
        logs.push(replaceTemplateValues(TEMPLATES.app, fieldValues))
    }
    writeLogs(options, logs)
}


// --------------------- Action Helper Methods ---------------------- //

function writeLogs(options = {}, logs = []) {
    if (options.write) {
        console.log(`Showing ${logs.length} log entries:\n`, logs)
    }
    if (options.filename && options.filename !== 'null') {
        const filename = options.filename.replace('{{date}}', moment().format('YYYY-MM-DD'))
        console.log(`writing ${logs.length} log entries to ${filename}`)
        
        fs.writeFileSync(filename, logs.join('\n'))
    }
}

function generateFieldValues (options = {}, logFields = []) {
    const fieldValues = {}
    logFields.forEach((f) => {
        if (generators[FIELDS[f].fn]) {
            fieldValues[f] = generators[FIELDS[f].fn](options, fieldValues, f)
        }
    })
    return fieldValues
}

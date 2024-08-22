
const moment = require('moment')
const { shuffle, replaceTemplateValues } = require('./helpers')


const DATE_FIELDS = {
    log_date_iso: 'YYYY-MM-DD',
    log_date_spelled: 'ddd MMM D',
    log_date_us: 'MM/DD/YYYY',
    log_time_hhmmss: 'HH:mm:ss',
    log_timestamp_sec: 'X',
    log_tz_offset: 'ZZ',
    log_year: 'YYYY'
}

const LEVEL_WEIGHTS = {
    DEBUG: 1, INFO: 0.3, WARN: 0.15, ERROR: 0.05
}
const SORTED_LEVELS = Object.keys(LEVEL_WEIGHTS).sort((a,b) => LEVEL_WEIGHTS[a] - LEVEL_WEIGHTS[b])

// TODO: add some extension-specific resources (i.e. wp-admin, etc)
// TODO: add more resources, username pieces, and app messages
const RESOURCE_DIRS = [
    ['admin', 'api', 'api/v2'],
    ['resources', 'pages', 'sites', 'spo', 'servlet', 'blog']
]
const RESOURCES = ['users', 'admin', 'orders', 'account', 'site', 'p{{num}}']

const USER_PIECES = ['jo', 'na', 'da', 'pa', 'ro', 'te', 'he', 'lu', 'mi', 'wo', 'si']

const APP_MESSAGES = {
    debug: ['user {{username}} edited {{resource}}', 'new message added to send queue'],
    info: ['new login from user {{username}}', 'user {{username}} changed their password'],
    warn: ['invalid password entry by {{username}}', 'send queue depth approaching limit'],
    error: ['user {{username}} attempted to access restricted resource: /admin{{resource}}', 'send queue depth exceeded pre-defined limit']
}


const ip_cache = []
const user_cache = []
const resource_cache = []

module.exports = {
    dateTimeValue: (o, v, f) => {
        const d = moment.isMoment(o.now) ? o.now : moment()
        if (DATE_FIELDS[f]) {
            return d.format(DATE_FIELDS[f])
        } else {
            return '?'
        }
    },

    ipAddress: (o, v, f) => {
        if (Math.random() < o.reuse && ip_cache.length) {
            return shuffle(ip_cache)
        }

        const ip = `${generateIPSection()}.${generateIPSection()}.${generateIPSection()}.${generateIPSection()}`
        ip_cache.push(ip)
        return ip
    },

    logLevel: (o, v, f) => {
        const r = Math.random()
        for (let i=0; i<SORTED_LEVELS.length; ++i) {
            if (r <= LEVEL_WEIGHTS[SORTED_LEVELS[i]]) { return SORTED_LEVELS[i].padEnd(5, ' ') }
        }
    },

    resource: (o, v, f) => {
        if (Math.random() < o.reuse && resource_cache.length) {
            return shuffle(resource_cache)
        }

        const path = []
        if (Math.random() < 0.5) {
            path.push(shuffle(RESOURCE_DIRS[0]))
        }
        if (Math.random() < 0.5) {
            path.push(shuffle(RESOURCE_DIRS[1]))
        }
        let res = shuffle(RESOURCES)
        res = res.replace('{{num}}', Math.ceil(Math.random() * 999999))
        if (o.extension) {
            res = `${res}.${o.extension}`
        }
        path.push(res)
        const resPath = '/' + path.join('/')

        resource_cache.push(resPath)
        return resPath
    },

    username: (o, v, f) => {
        if (Math.random() < o.reuse && user_cache.length) {
            return shuffle(user_cache)
        }

        const letterPieces = Math.ceil(Math.random() * 5) + 1
        let pieces = (new Array(letterPieces))
        for (let i=0; i<pieces.length; ++i) {
            pieces[i] = shuffle(USER_PIECES)
        }
        if (Math.random() < 0.5) {
            pieces.push(Math.ceil(Math.random() * 999))
        }
        const name = pieces.join('')
        user_cache.push(name)
        return name
    },

    appMessage: (o, v, f) => {
        const level = (v.level || 'debug').toLowerCase().trim()
        
        let message = replaceTemplateValues(shuffle(APP_MESSAGES[level]), v)
        message = message.replace('{{resource}}', module.exports.resource(o, v, f))

        return message
    }
}

function generateIPSection() {
    return Math.ceil(Math.random() * 254)
}

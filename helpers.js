
const generators = require('./field-generators')
const FIELDS = require('./fields.json')

module.exports = {
    shuffle: (a = []) => {
        return a[Math.floor(Math.random() * a.length)]
    },
    
    replaceTemplateValues: (template, fieldValues) => {
        let log = template
        Object.keys(fieldValues).forEach(f => {
            log = log.replace(`{{${f}}}`, fieldValues[f])
        })
        return log
    }
}

const en = require('./translations.en.json')
const fa = require('./translations.fa.json')

const i18n = {
  translations: {
    en: en.i18n,
    fa: fa.i18n
  },
  defaultLang: 'en',
  useBrowserDefault: true
}

module.exports = i18n

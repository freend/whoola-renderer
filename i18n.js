/**
 * i18n setting
 * support language : https://docs.microsoft.com/ko-kr/previous-versions/web-development/windows-live/aa751023(v=msdn.10)?redirectedfrom=MSDN
 * @type {{}|(function(*=, *=, *): *)}
 */
const i18n = require('i18n');

i18n.configure(
    {
        locales:['en', 'ko'],
        directory: __dirname + '/locales',
        defaultLocale: 'en',
        cookie: 'lang',
        syncFiles:true,
        updateFiles:true
    }
)

module.exports = function (req, res, next) {
    i18n.init(req, res);
    res.locals.__ = res.__;
    let current_locale = i18n.getLocale();
    return next();
}
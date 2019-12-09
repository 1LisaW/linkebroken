module.exports = {
    // TODO не в демо - только наши домены?
    linksToSkip: [
        /^tel:/,
        /^mailto:/,
        // skip the news and some garbage
        /newsID=/,
        /portalserver\/sb-portal-ru/,
        // some recursion redirect
        /sbpremier\/services\/distant\/assets/,
        // http/2
        /youtube\.com/,
        'vk.com',
        // rr
        'tracking.retailrocket.net',
        'rrstatic.retailrocket.net',
        // cert issues
        'sberbank-talents.ru',
        'sberbankins.ru',
        'www.gibdd.ru',
        // lk
        /(online\.sberbank\.ru)/,
        'lk2.service.nalog.ru',
        // metrics & services
        // TODO zen.yandex?
        /(yandex\.ru|google\.com|google-analytics\.com|googletagmanager\.com)/i,
    ]
};

const linksToSkip = [
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
    'www.nalog.ru',
    // lk
    /(online\.sberbank\.ru)/,
    'lk2.service.nalog.ru',
    // metrics & services
    // TODO zen.yandex?
    /(yandex\.ru|google\.com|google-analytics\.com|googletagmanager\.com)/i,
];

module.exports = {
    // только для фронт-механизма
    filterPages: (links, hostnames = []) => {
        return links
            // на базовом домене
            .filter(({ url }) => hostnames.find(hostname => url.match(hostname)))
            // не ассеты
            .filter(({ url }) => !url.match(/\.(js|css|woff|ttf|otf|webmanifest)/i))
            // не картинки
            .filter(({ url }) => !url.match(/\.(png|jpg|svg|jpeg|gif|webp|bmp|ico)/i))
            // не картинки/json из контент-сервисов?
            .filter(({ url }) => !url.match(/\/portalserver\/(atom|content)/i))
            // так же скипаем, как на сервере
            .filter(({ url }) => !linksToSkip.find(linkToSkip => {
                return url.match(linkToSkip);
            }));
    },
    // Наши картинки
    linksAttributes: {
        'data-src': [
            'img'
        ],
        'data-bg': [
            'div'
        ],
    },
    linksToSkip,
};

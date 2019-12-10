const INTERNAL_DOMAIN = /www\.sberbank\.ru/;

const linksToSkipList = [
    /^tel:/,
    /^mailto:/,
    /^data:image/,
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
    // TODO 'asv.org.ru',
    'sberbank-talents.ru',
    'sberbankins.ru',
    'www.gibdd.ru',
    'www.nalog.ru',
    // lk
    /(online\.sberbank\.ru)/,
    'lk2.service.nalog.ru',
    'online.rostatus.ru',
    // metrics & services
    // TODO zen.yandex?
    /(yandex\.ru|google\.com|google-analytics\.com|googletagmanager\.com)/i,
];

function linkToSkipCheck(link) {
    // Отключение внешних ссылок
    if (process.env.DISABLE_EXTERNAL && !link.match(INTERNAL_DOMAIN)) {
        return true;
    }

    const isToSkip = linksToSkipList.find(rule => link.match(rule));
    return !!isToSkip;
}

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
            .filter(({ url }) => !linkToSkipCheck(url));
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
    linksToSkip: link => Promise.resolve(linkToSkipCheck(link)),
};

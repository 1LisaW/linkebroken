// TODO пока только для поддоменов сбербанка, но можно переделать
const INTERNAL_DOMAIN = /\.sberbank\.ru/;

// базовый скип
const linksToSkipList = [
    // не http-ссылки, которые кроулить не надо, конечно же
    /^tel:/,
    /^mailto:/,
    /^data:image/,

    // пропускаем весь бэкенд обязательно!
    // это и новые сервисы, и старые /portalserver/proxy
    '/proxy/',
    // внутренние ссылки на рендер g:include
    '/contenttemplates/',

    // FIXME some recursion redirect
    /sbpremier\/services\/distant\/assets/,

    // http/2 + некорректная работа с HEAD
    /youtube\.com/,
    'vk.com',
    // rr
    'tracking.retailrocket.net',
    'rrstatic.retailrocket.net',
    // проблемы с сертификатами
    'asv.org.ru',
    'sberbank-talents.ru',
    'sberbankins.ru',
    'www.gibdd.ru',
    'www.nalog.ru',

    // Личные кабинеты
    /(online\.sberbank\.ru)/,
    'lk2.service.nalog.ru',
    'online.rostatus.ru',
    'securepayments.sberbank.ru',

    // Разные метрики
    /(mc\.yandex\.ru|google\.com|google-analytics\.com|googletagmanager\.com)/i,
];

// правила скипа ссылок
function linkToSkipCheck(link) {
    // Отключение внешних ссылок для OKD
    if (process.env.DISABLE_EXTERNAL && !link.match(INTERNAL_DOMAIN)) {
        return true;
    }

    const isToSkip = linksToSkipList.find(rule => link.match(rule));
    return !!isToSkip;
}

// на фронте так выбираем ссылки, которые надо поставить в очередь
// то, что на каждую странциу шлем запрос создает проблемы, но зато в интерфейсе результаты начинают появляться сразу
// отфильтровываем то, что точно не страницы
function filterPages (links, hostnames = []) {
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
}

module.exports = {
    filterPages,
    // расширяем поиск ссылок до дата-трибутов лейзи-лоадинга
    linksAttributes: {
        'data-srcset': [
            'img'
        ],
        'data-src': [
            'img'
        ],
        'data-bg': [
            'div'
        ],
    },
    linksToSkip: link => Promise.resolve(linkToSkipCheck(link)),
};

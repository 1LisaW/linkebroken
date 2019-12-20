"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const url_1 = require("url");
function getBaseLinkAttributes() {
    return {
        background: ['body'],
        cite: ['blockquote', 'del', 'ins', 'q'],
        data: ['object'],
        href: ['a', 'area', 'embed', 'link'],
        icon: ['command'],
        longdesc: ['frame', 'iframe'],
        manifest: ['html'],
        poster: ['video'],
        pluginspage: ['embed'],
        pluginurl: ['embed'],
        src: [
            'audio',
            'embed',
            'frame',
            'iframe',
            'img',
            'input',
            'script',
            'source',
            'track',
            'video',
        ],
        srcset: ['img', 'source'],
        style: [''],
    };
}
exports.getBaseLinkAttributes = getBaseLinkAttributes;
function getLinks(source, baseUrl, linksAttr) {
    const $ = cheerio.load(source);
    const links = new Array();
    Object.keys(linksAttr).forEach(attr => {
        const elements = linksAttr[attr].map(tag => `${tag}[${attr}]`).join(',');
        $(elements).each((i, element) => {
            const values = parseAttr(attr, element.attribs[attr]);
            links.push(...values);
        });
    });
    let realBaseUrl = baseUrl;
    const base = $('base[href]');
    if (base.length) {
        // only first <base by specification
        const htmlBaseUrl = base.first().attr('href');
        if (htmlBaseUrl) {
            realBaseUrl = getBaseUrl(htmlBaseUrl, baseUrl);
        }
    }
    const sanitized = links
        .filter(link => !!link)
        .map(link => parseLink(link, realBaseUrl));
    return sanitized;
}
exports.getLinks = getLinks;
function getBaseUrl(htmlBaseUrl, oldBaseUrl) {
    if (isAbsoluteUrl(htmlBaseUrl)) {
        return htmlBaseUrl;
    }
    const url = new url_1.URL(htmlBaseUrl, oldBaseUrl);
    url.hash = '';
    return url.href;
}
function isAbsoluteUrl(url) {
    // Don't match Windows paths
    if (/^[a-zA-Z]:\\/.test(url)) {
        return false;
    }
    // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
    // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
    return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}
function parseAttr(name, value) {
    switch (name) {
        case 'style':
            return value
                .split(';')
                .filter(val => !!val)
                .map((rules) => {
                if (!rules) {
                    return '';
                }
                const [attr, value] = rules.split(':');
                const urlValueRegexp = /^.*url\(('|"|)?([^)]+?)('|"|)?\).*/;
                if (['background', 'background-image'].includes(attr.trim()) &&
                    value.match(urlValueRegexp)) {
                    return value.replace(urlValueRegexp, '$2');
                }
                return '';
            });
        case 'srcset':
            return value
                .split(',')
                .map((pair) => pair.trim().split(/\s+/)[0]);
        default:
            return [value];
    }
}
function parseLink(link, baseUrl) {
    try {
        const url = new url_1.URL(link, baseUrl);
        url.hash = '';
        return { link, url };
    }
    catch (error) {
        return { link, error };
    }
}
//# sourceMappingURL=links.js.map
import {STATE_BROKEN, STATE_SKIPPED} from '../../constants';

export const TYPE_ALL = 1;
export const TYPE_BROKEN = 2;

export function getCsv(urls, type) {
    const head = [
        'status', 'state', 'originalUri', 'url', 'parent'
    ];

    let csv = head.join(',');

    Object.keys(urls).forEach(pageUrl => {
        const links = urls[pageUrl].links;
        links.forEach(link => {
            if (link.state === STATE_SKIPPED) {
                return;
            }
            if (type === TYPE_BROKEN && link.state !== STATE_BROKEN) {
                return;
            }
            csv += '\n' + head.map(field => {
                if (!link[field] && field === 'status') {
                    return '200';
                }
                if (!link[field] && field === 'state') {
                    return '???';
                }
                return link[field];
            }).join(',');
            // добавляем мету
            if (link.meta) {
                csv += ',' + link.meta.join(',');
            }
        });
    });

    const blob = new Blob([csv]);
    return window.URL.createObjectURL(blob);
}

export function getCsvName(type) {
    const date = new Date();

    let name;
    switch (type) {
        case TYPE_ALL:
            name = 'links';
            break;
        case TYPE_BROKEN:
            name = 'broken';
            break;
        default:
            name = 'unknown';
    }

    const timestamp = `${date.getFullYear()}${date.getMonth()}${date.getDate()}-${date.getHours()}${date.getFullYear()}`;
    return `${name}${timestamp}.csv`;
}

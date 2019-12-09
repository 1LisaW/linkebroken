import { STATUS_BROKEN } from '../constants';

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
            if (type === TYPE_BROKEN && link.state === STATUS_BROKEN) {
                return;
            }
            csv += '\n' + head.map(field => link[field]).join(',');
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

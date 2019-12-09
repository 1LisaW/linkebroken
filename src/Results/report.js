export function getCsv(urls) {
    const head = [
        'status', 'state', 'originalUri', 'url', 'parent'
    ];

    let csv = head.join(',');

    Object.keys(urls).forEach(pageUrl => {
        const links = urls[pageUrl].links;
        links.forEach(link => {
            csv += '\n' + head.map(field => link[field]).join(',');
        });
    });

    const blob = new Blob([csv]);
    return window.URL.createObjectURL(blob);
}

export function getCsvName() {
    const date = new Date();

    return 'broken' +
        `${date.getFullYear()}${date.getMonth()}${date.getDate()}-${date.getHours()}${date.getFullYear()}` +
        '.csv';
}

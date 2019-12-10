const errResponse = url => ({
    links: [
        {
            url,
            status: '???',
            state: 'BROKEN'
        }
    ],
    passed: false,
});

export async function crawl(url) {
    return new Promise((resolve, reject) => {
        console.log(`fetch ${url}...`);
        fetch(`/api/broken?url=${url}`)
            .then(res => {
                if (res && res.ok) {
                    res.json()
                } else {
                    console.error(`url is ${res.statusCode}`);
                    reject(errResponse(url));
                }
            })
            .then(data => resolve(data))
            .catch(err => {
                console.error(err);
                reject(errResponse(url));
            });
    });
}

export async function crawl(url) {
    return new Promise((resolve, reject) => {
        console.log(`fetch ${url}...`);
        fetch(`/api/broken?url=${url}`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => {
                console.error(err);
                reject({
                    links: [
                        {
                            url,
                            status: '???',
                            state: 'BROKEN'
                        }
                    ],
                    passed: false,
                });
            });
    });
}

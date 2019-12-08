export async function crawl(url) {
    return new Promise((resolve, reject) => {
        console.log(`fetch ${url}...`);
        fetch(`/api/broken?url=${url}`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => {
                throw Error(err);
                // reject(err);
            });
    });
}

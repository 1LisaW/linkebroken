const path = require('path');
const conf = require('dotenv').config();

//const linkinator = require('linkinator');
const linkinator = require('linkinator-css-edition');

const IS_DEV = !!process.env.DEV;
const IS_DISABLE_EXTERNAL = !!process.env.DISABLE_EXTERNAL;

// create a new `LinkChecker` that we'll use to run the scan.
const checker = new linkinator.LinkChecker();
if (IS_DEV) {
    // Respond to the beginning of a new page being scanned
    checker.on('pagestart', url => {
        console.log(`Scanning ${url}`);
    });

    // After a page is scanned, check out the results!
    checker.on('link', res => {
        if (res.state === 'SKIPPED') {
            return;
        }
        // check the specific url that was scanned
        console.log(`${res.state} ${res.status} ${res.url}`);
    });
}

const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');

if (conf.error) {
    throw result.error;
}

const server = express();

server.use(express.static(path.resolve('./dist')));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.get('/', (req, res) => {
    res.send('linkebroken server');
});

server.get('/api/broken', async function (req, res) {
    if (!req.query.url) {
        res.send({
            message: 'Please specify url',
        }, 400);
    }

    // Go ahead and start the scan! As events orccur, we will see them above.
    const result = await checker.check({
        path: req.query.url,
        recurse: false,
        silent: true,
        concurrency: 30,
        ...config,
    });

    if (IS_DEV) {
        // Check to see if the scan passed!
        console.log(result.passed ? 'PASSED :D' : 'FAILED :(');

        // How many links did we scan?
        console.log(`Scanned total of ${result.links.length} links!`);

        // The final result will contain the list of checked links, and the pass/fail
        const brokeLinksCount = result.links.filter(x => x.state === 'BROKEN');
        console.log(`Detected ${brokeLinksCount.length} broken links.`);
    }

    res.send(result);
});

server.listen(process.env.SERVER_PORT, () => {
    console.log('\r\n', `${IS_DEV ? '[DEV MODE] ' : ''}server listening on port ${process.env.SERVER_PORT}...`, '\r\n')
    console.log('\r\n', `${IS_DISABLE_EXTERNAL ? 'Отключена проверка внешних ссылок!' : ''}`, '\r\n')
});

module.exports = server;

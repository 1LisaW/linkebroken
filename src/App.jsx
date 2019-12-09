import React, { useState, useEffect } from 'react';

import Form from './Form';
import Results from './Results';
import { crawl } from './api';
import config from '../config';

import { STATUS_OK } from './constants';

import './App.css';

export default function App() {
    const [options, setOptions] = useState({
        urls: `https://www.sberbank.ru/ru/person`,
        depth: 0,
        started: false,
    });
    const [results, setResults] = useState({
        urls: {},
        queue: [],
        hostnames: [],
        checked: {},
        currentUrl: '',
    });

    useEffect(() => {
        if (!options.started || results.currentUrl) {
            return;
        }
        if (results.queue.length <= 0) {
            console.log('ended');
            setOptions({
                ...options,
                started: false,
            });
            return;
        }

        const {
            url,
            level,
        } = results.queue.shift();
        setResults({
            ...results,
            currentUrl: url,
        });

        (async function process() {
            let pageResult;
            try {
                pageResult = await crawl(url);
            } catch (errorData) {
                pageResult = errorData;
            }

            console.log(`${url} handled with ${pageResult.passed ? 'passed' : 'not passed'}`);

            if (level < options.depth) {
                // текущая страница чеканная
                if (!results.checked[url]) {
                    results.checked[url] = 0;
                }
                results.checked[url]++;

                // добавляем в очередь вс, что страницы
                (pageResult.links || [])
                    .filter(link => link.state === STATUS_OK)
                    .map(link => link.url)
                    .filter(linkUrl => !results.checked[linkUrl])
                    // на базовом домене
                    .filter(linkUrl => results.hostnames.find(hostname => linkUrl.match(hostname)))
                    .filter(linkUrl => !linkUrl.match(/\.(js|css|woff|ttf|otf|png|jpg|svg|jpeg|gif|webp|bmp|ico|webmanifest)/i))
                    .filter(linkUrl => !linkUrl.match(/\/portalserver\/(atom|content)/i))
                    // так же скипаем, как на сервере
                    .filter(linkUrl => !config.linksToSkip.find(linkToSkip => {
                        return linkUrl.match(linkToSkip);
                    }))
                    .forEach(linkUrl => {
                        results.queue.push({
                            url: linkUrl,
                            level: level + 1,
                        });
                    });

                // помечаем как чеканные все остальные
                pageResult.links.forEach(linkUrl => {
                    const checked = results.checked;
                    if (!checked[linkUrl]) {
                        checked[linkUrl] = 0;
                    }
                    checked[linkUrl]++;
                });
            } else {
                console.log(`maximum depth is ${level}`);
            }

            if (results.urls[url]) {
                console.error('уже есть в проверенных!', url);
                console.error(results.urls);
            }

            // неуспешные - в начало
            // успешные - в конец
            const newUrls = pageResult.passed ? {
                ...results.urls,
                [url]: pageResult,
            } : {
                [url]: pageResult,
                ...results.urls,
            };

            setResults({
                ...results,
                currentUrl: '',
                urls: newUrls,
            })
        })();
    });

    return (
        <div className="app">
            <h1>ЛинкеБрокен</h1>
            <Form options={options} onChange={setOptions} onStart={() => {
                handleStart(options, setOptions, results, setResults);
            }} />
            <Results
                results={results}
            />
        </div>
    );
}

function handleStart(options, setOptions, results, setResults) {
    if (options.started) {
        console.log('stopping...');
        setOptions({
            ...options,
            started: false,
        });

        // не теряем найденное
        setResults({
            ...results,
            queue: [],
            currentUrl: '',
        });

        return;
    }

    console.log('init...');
    setOptions({
        ...options,
        started: true,
    });

    const queue = options.urls.split('\n')
        .map(val => val.trim())
        .filter(Boolean)
        .map(url => ({
            url,
            level: 0,
        }));

    const hostnames = [];
    queue.forEach(({ url }) => {
        try {
            const baseUrl = new URL(url);
            if (!hostnames.includes(baseUrl.hostname)) {
                hostnames.push(baseUrl.hostname);
            }
        } catch (e) {
            // do nothing
        }
    });
    console.log(`crawl with hostnames ${hostnames.join(', ')}..`);

    setResults({
        ...results,
        checked: {},
        hostnames,
        urls: {},
        queue,
        currentUrl: '',
    });
}

import React, { useState, useEffect } from 'react';

import Form from './Form/Form';
import Results from './Results/Results';

import pkg from '../package.json';
import { crawl } from './api';
import config from '../server/config';

import { STATUS_OK } from './constants';

import './App.css';

export default function App() {
    const search = window.location.search.slice(1)
        .split('&')
        .reduce((result, str) => {
            if (!str) {
                return result;
            }
            const [key, value = ''] = str.split('=');

            return {
                ...result,
                [key]: value,
            };
        }, {});
    const [options, setOptions] = useState({
        urls: search.url || `https://www.sberbank.ru/ru/person`,
        depth: search.depth ? parseInt(search.depth) : 0,
        started: false,
    });
    const [results, setResults] = useState({
        urls: {},
        queue: [],
        hostnames: [],
        checked: {},
        currentUrl: '',
        startDate: null,
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
            setResults({
                ...results,
                startDate: null,
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
            try {
                let pageResult;

                if (results.urls[url]) {
                    console.warn('уже есть в проверенных!', url);
                    setResults({
                        ...results,
                        currentUrl: '',
                    });
                    return;
                }

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

                    // отбираем несломанное, не в чеках
                    const newNotBrokenLinks = (pageResult.links || [])
                        .filter(link => link.state === STATUS_OK)
                        .filter(({url: linkUrl}) => !results.checked[linkUrl]);
                    // отбираем страницы
                    const toCheck = config.filterPages(newNotBrokenLinks, results.hostnames);

                    // добавляем в очередь вс, что страницы
                    toCheck.map(link => link.url)
                        .forEach(linkUrl => {
                            results.queue.push({
                                url: linkUrl,
                                level: level + 1,
                            });
                        });

                    // помечаем как чеканные все, что считаем страницами
                    toCheck.forEach(({url: linkUrl, originalUri}) => {
                        const checked = results.checked;
                        if (!checked[linkUrl]) {
                            checked[linkUrl] = 0;
                        }
                        checked[linkUrl]++;
                        if (originalUri) {
                            if (!checked[originalUri]) {
                                checked[originalUri] = 0;
                            }
                            checked[originalUri]++;
                        }
                    });
                } else {
                    console.log(`maximum depth is ${level}`);
                }

                // краулер может несколько раз прислать урл,
                // схлопываем, оставляем худший статус?
                const checkedLinks = [];
                pageResult.links.forEach(link => {
                    const findLink = checkedLinks.find(curLink => curLink.url === link.url);
                    if (findLink) {
                        if (link.status === STATUS_OK) {
                            findLink.originalUri = link.originalUri;
                            findLink.state = link.state;
                            findLink.status = link.status;
                        }
                        return;
                    }

                    checkedLinks.push({
                        ...link,
                        visibleUrl: getVisibleUrl(link.url, results.hostnames),
                        visibleOriginalUri: getVisibleUrl(link.originalUri, results.hostnames),
                    });
                });

                // неуспешные - в начало
                // успешные - в конец
                const newUrls = pageResult.passed ? {
                    ...results.urls,
                    [url]: {
                        ...pageResult,
                        links: checkedLinks,
                    },
                } : {
                    [url]: {
                        ...pageResult,
                        links: checkedLinks,
                    },
                    ...results.urls,
                };

                if (results.queue.length === 1 && results.queue[0].stop) {
                    console.log('do nothing');
                    return;
                }
                
                setResults({
                    ...results,
                    currentUrl: '',
                    urls: newUrls,
                });
            } catch (error) {
                setResults({ error })
            }
        })();
    });

    if (results.error) {
        // async to boundary
        throw new Error(results.error);
    }

    return (
        <div className="app">
            <h1>ЛинкеБрокен, v{pkg.version}</h1>
            <Form options={options} onChange={setOptions} onStart={() => {
                handleStart(options, setOptions, results, setResults);
            }} />
            {process.env.DISABLE_EXTERNAL && (
                <em>⚠️В этом режиме на сервере не проверяются внешние ссылки!</em>
            )}
            <Results
                results={results}
            />
        </div>
    );
}

function getVisibleUrl(url, hostnames = []) {
    // сохраняем видимое имя без хоста
    let visibleUrl = url;
    if (!visibleUrl) {
        return url;
    }
    try {
        hostnames.forEach(hostname => {
            // хак, чтобы красивые ссылки были
            if (hostname === 'sberbank.ru') {
                hostname = 'www.sberbank.ru';
            }
            // но только если https
            const regExp = new RegExp(`^https://${hostname.replace(/\./, '\\.')}`);
            visibleUrl = visibleUrl.replace(regExp, '');
        });
    } catch (err) {
        console.warn(err);
        // do nothing
    }
    // раскодируем, если кириллица или символы
    return decodeURIComponent(visibleUrl);
}

function handleStart(options, setOptions, results, setResults) {
    if (options.started) {
        console.log('stopping...');
        setOptions({
            ...options,
            started: false,
        });

        // TODO просто абортить фетч!
        // если в процессе запрос, очищаем очередь
        while (results.queue.length) {
            results.queue.shift();
        }
        results.queue.push({stop: true});
        // не теряем найденное
        setResults({
            ...results,
            queue: [],
            startDate: null,
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
    console.log(`crawl with hostnames ${hostnames.join(', ')}...`);

    setResults({
        ...results,
        checked: {},
        hostnames,
        urls: {},
        startDate: new Date(),
        queue,
        currentUrl: '',
    });
}

import React, { useState } from 'react';

import { STATUS_SKIPPED, STATUS_BROKEN, STATUS_OK } from './constants';
import { pluralize } from './utils';

import './Results.css';

export default function Results({
    results = {
        urls: {},
        queue: [],
        currentUrl: '',
    }
}) {
    const [filters, setFilters] = useState({
        skipped: false,
        ok: false,
    });
    return (
        <div className="results">
            <form>
                    <label className="results__filter">
                    <input name="skipped" type="checkbox" value="1" checked={filters.skipped} onChange={() => setFilters({
                        ...filters,
                        skipped: !filters.skipped,
                    })}/>
                    пропущенные ссылки
                </label>
                <label className="results__filter">
                    <input name="ok" type="checkbox" value="1" checked={filters.ok} onChange={() => setFilters({
                        ...filters,
                        ok: !filters.ok,
                    })}/>
                    успешные ссылки
                </label>
            </form>
            <Header
                queue={results.queue}
                urls={results.urls}
            />
            {results.currentUrl && (
                <div>
                    Обрабатывается {results.currentUrl}...
                </div>
            )}
            <ul>
                {Object.keys(results.urls).map(pageUrl => (
                    <Page
                        key={pageUrl}
                        filters={filters}
                        pageUrl={pageUrl}
                        page={results.urls[pageUrl]}
                    />
                ))}
            </ul>
        </div>
    );
}

function Header({
    queue = [],
    urls = {},
}) {
    const errors = Object.keys(urls).map(pageUrl => {
        return urls[pageUrl].links.filter(({ state }) => state === STATUS_BROKEN).length;
    }).reduce((sum, cur) => sum + parseInt(cur, 10), 0);

    return (
        <h2>
            {queue.length > 0 ?
                `В очереди ${queue.length} ${pluralize(errors, ['ссылка', 'ссылки', 'ссылок'])}` :
                'Закончено'
            }
            {errors ?
                ` (${errors} ${pluralize(errors, ['проблема найдена', 'проблемы найдено', 'проблем найдено'])})` :
                ''
            }
        </h2>
    );
}

function getPageModifier(passed) {
    return passed ? 'ok' : 'broken';
}

function Page({
    filters,
    pageUrl,
    page = {
        passed: false,
        links: [],
    }
}) {
    return (
        <li>
            <h3>
                <a
                    href={pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`results__page results__page_${getPageModifier(page.passed)}`}
                >
                    {pageUrl}
                </a>
            </h3>
            <ul>
                {page.links.map(({ url, state }) => (
                    <Link
                        key={url}
                        url={url}
                        state={state}
                        filters={filters}
                    />
                ))}
            </ul>
        </li>
    );
}

function getLinkModifier(state) {
    switch (state) {
        case STATUS_BROKEN:
            return 'broken';
        case STATUS_SKIPPED:
            return 'skipped';
        default:
        case STATUS_OK:
            return 'ok';
    }
}

function Link({ url, state, filters }) {
    if (
        !filters.ok && state === STATUS_OK ||
        !filters.skipped && state === STATUS_SKIPPED
    ) {
        return <></>;
    }
    return (
        <li>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`results__link results__link_${getLinkModifier(state)}`}
            >
                {url}
            </a>
        </li>
    );
}

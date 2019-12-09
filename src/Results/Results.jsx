import React, { useState } from 'react';

import LinkInfo from './LinkInfo/LinkInfo';
import Filters from './Filters/Filters';

import { STATUS_SKIPPED, STATUS_BROKEN, STATUS_OK } from '../constants';
import pluralize from './pluralize';

import './Results.css';

export default function Results({
    results = {
        urls: {},
        queue: [],
        currentUrl: '',
    }
}) {
    const [filters, setFilters] = useState({
        broken: {
            value: true,
            name: 'сломанные ссылки',
        },
        redirects: {
            value: false,
            name: 'редиректы',
        },
        ok: {
            value: false,
            name: 'успешные ссылки',
        },
        skipped: {
            value: false,
            name: 'игнорируемые ссылки',
        },
    });

    return (
        <div className="results">
            <Filters filters={filters} onChange={setFilters} />
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
            В очереди {queue.length} {pluralize(errors, ['ссылка', 'ссылки', 'ссылок'])}
            {errors ?
                ` (${errors} ${pluralize(errors, ['проблема найдена', 'проблемы найдено', 'проблем найдено'])})` :
                ''
            }
        </h2>
    );
}

function Page({
    filters,
    pageUrl,
    page = {
        passed: false,
        links: [],
    }
}) {
    const pageLink = page.links.find(link => !link.parent) || {
        url: pageUrl,
        state: page.passed ? STATUS_OK : STATUS_BROKEN,
    };

    return (
        <li>
            <h3>
                <LinkInfo
                    link={pageLink}
                    showRedirects={true}
                    filters={filters}
                />
            </h3>
            <ul>
                {page.links.map(link => (
                    <PageLink
                        key={link.url}
                        link={link}
                        filters={filters}
                    />
                ))}
            </ul>
        </li>
    );
}

function showLink(link, filters) {
    const { originalUri, state } = link;
    // редиректы - более полный фильтр
    if (filters.redirects.value && originalUri) {
        return true;
    }

    // остаточные фильтры
    return !(
        !filters.broken.value && state === STATUS_BROKEN ||
        !filters.ok.value && state === STATUS_OK ||
        !filters.skipped.value && state === STATUS_SKIPPED
    );
}

function PageLink({ filters, link }) {
    if (!showLink(link, filters)) {
        return <></>;
    }

    return (
        <li>
            <LinkInfo
                link={link}
                showRedirects={filters.redirects}
            />
        </li>
    );
}

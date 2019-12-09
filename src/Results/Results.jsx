import React, { useState } from 'react';

import LinkInfo from './LinkInfo/LinkInfo';
import Filters from './Filters/Filters';

import { STATUS_SKIPPED, STATUS_BROKEN, STATUS_OK } from '../constants';
import pluralize from './pluralize';
import { TYPE_ALL, TYPE_BROKEN, getCsv, getCsvName } from './report';

import './Results.css';

export default function Results({
    results = {
        urls: {},
        queue: [],
        currentUrl: '',
    },
}) {
    const {
        urls,
        queue,
        currentUrl,
        startDate,
    } = results;

    const [filters, setFilters] = useState({
        broken: {
            value: true,
            name: 'сломанные ссылки',
        },
        passed: {
            value: false,
            name: 'страницы без сломанных ссылок',
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
                startDate={startDate}
                queue={queue}
                urls={urls}
            />
            <div>
                {currentUrl ?
                    `Обрабатывается ${currentUrl}...` :
                    'Ничего не делаю...'
                }
            </div>
            <ul className="results__page-list">
                {Object.keys(urls).map(pageUrl => (
                    <Page
                        key={pageUrl}
                        filters={filters}
                        pageUrl={pageUrl}
                        page={urls[pageUrl]}
                    />
                ))}
            </ul>
        </div>
    );
}

function Header({
    queue = [],
    urls = {},
    startDate,
}) {
    const urlsKeys = Object.keys(urls);
    const errors = urlsKeys.map(pageUrl => {
        return urls[pageUrl].links.filter(({ state }) => state === STATUS_BROKEN).length;
    }).reduce((sum, cur) => sum + parseInt(cur, 10), 0);

    const [reportGenerated, setReportGenerated] = useState(0);

    if (!startDate) {
        if (!Object.keys(urls).length) {
            return (
                <h2>Ничего нет</h2>
            );
        }
        const reportName = getCsvName(reportGenerated);

        return (
            <h2>
                Сгенерировать
                {' '}
                <a href="#" onClick={() => setReportGenerated(TYPE_ALL)}>отчет со всеми ссылками</a>
                {' '}
                или
                {' '}
                <a href="#" onClick={() => setReportGenerated(TYPE_BROKEN)}>только с битыми ссылками</a>
                {!!reportGenerated && (
                    <>
                        <br />
                        <br />
                        <a key={reportName} href={getCsv(urls, reportGenerated)} download={reportName}>
                            Скачать {reportName}
                        </a>
                    </>
                )}
            </h2>
        );
    }
    if (reportGenerated) {
        setReportGenerated(0);
    }

    return (
            <h2>
                Начато: {startDate.toLocaleDateString('ru')} {startDate.toLocaleTimeString('ru')}.
                {' '}
                В очереди {queue.length} {pluralize(queue.length, ['ссылка', 'ссылки', 'ссылок'])},
                проверено {urlsKeys.length} {pluralize(urlsKeys.length, ['ссылка', 'ссылки', 'ссылок'])}
                {errors ?
                    `, ${errors} ${pluralize(errors, ['проблема найдена', 'проблемы найдено', 'проблем найдено'])}` :
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
    const showPage = filters.passed.value || page.links.filter(({ state }) => state === STATUS_BROKEN).length;
    if (!showPage) {
        return <></>;
    }

    const pageLink = page.links.find(link => !link.parent) || {
        url: pageUrl,
        state: page.passed ? STATUS_OK : STATUS_BROKEN,
    };

    return (
        <li className="results__page-block">
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
                showRedirects={filters.redirects.value}
            />
        </li>
    );
}

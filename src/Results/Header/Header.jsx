import React, { useState } from 'react';

import {STATE_BROKEN} from "../../constants";
import {getCsv, getCsvName, TYPE_ALL, TYPE_BROKEN} from "./report";
import pluralize from "./pluralize";

import './Header.css';

export default function Header({
    queue = [],
    urls = {},
    startDate,
}) {
    const urlsKeys = Object.keys(urls);
    const errors = urlsKeys.map(pageUrl => {
        return urls[pageUrl].links.filter(({ state }) => state === STATE_BROKEN).length;
    }).reduce((sum, cur) => sum + parseInt(cur, 10), 0);

    const [reportGenerated, setReportGenerated] = useState(0);

    if (!startDate) {
        if (!Object.keys(urls).length) {
            return (
                <h2 className="header">Ничего нет</h2>
            );
        }
        const reportName = getCsvName(reportGenerated);

        return (
            <h2 className="header">
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
        <h2 className="header">
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

import React from 'react';

import {STATUS_BROKEN, STATUS_OK, STATUS_REDIRECT, STATUS_SKIPPED} from "../../constants";

import './LinkInfo.css';

function getLinkModifier(state) {
    switch (state) {
        case STATUS_BROKEN:
            return 'broken';
        case STATUS_SKIPPED:
            return 'skipped';
        case STATUS_REDIRECT:
            return 'redirect';
        case STATUS_OK:
            return 'ok';
        default:
            return 'no';
    }
}

function Link({ visibleUrl, url, state }) {
    return (
        <a
            href={url}
            title={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`link link_${getLinkModifier(state)}`}
        >
            {visibleUrl}
        </a>
    );
}

export default function LinkInfo({ link, showRedirects }) {
    const { url, visibleOriginalUri, visibleUrl, state, status, originalUri } = link;

    if (!showRedirects) {
        // показываем оригинал ссылки сначала
        return (
            <>
                {state === STATUS_BROKEN ? `${status} ` : ''}
                <Link
                    url={originalUri || url}
                    visibleUrl={visibleOriginalUri || visibleUrl}
                    state={state}
                />
            </>
        )
    }

    return (
        <>
            {originalUri && (
                <>
                    <Link
                        url={originalUri}
                        visibleUrl={visibleOriginalUri}
                        state={STATUS_REDIRECT}
                    />
                    {' ➜ '}
                </>
            )}
            {state === STATUS_BROKEN ? `${status} ` : ''}
            <Link
                url={url}
                visibleUrl={visibleUrl}
                state={state}
            />
        </>
    );
}

import React from 'react';

import {STATE_BROKEN, STATE_OK, STATE_REDIRECT, STATE_SKIPPED} from "../../constants";

import './LinkInfo.css';

function getLinkModifier(state) {
    switch (state) {
        case STATE_BROKEN:
            return 'broken';
        case STATE_SKIPPED:
            return 'skipped';
        case STATE_REDIRECT:
            return 'redirect';
        case STATE_OK:
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
                {state === STATE_BROKEN ? `${status} ` : ''}
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
                        state={STATE_REDIRECT}
                    />
                    {' ➜ '}
                </>
            )}
            {state === STATE_BROKEN ? `${status} ` : ''}
            <Link
                url={url}
                visibleUrl={visibleUrl}
                state={state}
            />
        </>
    );
}

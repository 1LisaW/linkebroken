import React from 'react';

import {STATUS_BROKEN, STATUS_OK, STATUS_REDIRECT, STATUS_SKIPPED} from "./constants";

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

function SanitizedLink({ url, state }) {
    return (
        <a
            href={url}
            title={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`link link_${getLinkModifier(state)}`}
        >
            {decodeURIComponent(url)}
        </a>
    );
}

export default function LinkInfo({ link, showRedirects }) {
    const { url, state, status, originalUri } = link;
    return (
        <>
            {showRedirects && originalUri && (
                <>
                    <SanitizedLink url={originalUri} state={STATUS_REDIRECT} />
                    {' ➜ '}
                </>
            )}
            {state === STATUS_BROKEN ? `${status} ` : ''}
            <SanitizedLink url={url} state={state} />
        </>
    );
}

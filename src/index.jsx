import React from 'react';
import { render } from 'react-dom';

import App from './App';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

import '!file-loader?name=[name].[ext]!./favicon.ico';

render(
    (
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    ),
    document.getElementById('app'),
);

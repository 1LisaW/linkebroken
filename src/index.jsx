import React from 'react';
import { render } from 'react-dom';
import App from './App';

import '!file-loader?name=[name].[ext]!./favicon.ico';

render(
    <App />,
    document.getElementById('app'),
);

import React from 'react';

import './Form.css';

const DEPTH = {
    'Весь сайт в глубину': 20, // максимлаьная глубина?
    'Указанные страницы': 0,
};

export default function Form({
    options = {},
    onChange,
    onStart,
}) {
    return (
        <form className="form">
            <div>
                <textarea
                    name="urls"
                    className="form__urls"
                    value={options.urls}
                    onChange={event => onChange({
                        ...options,
                        urls: event.target.value,
                    })}
                />
            </div>
            <div>
                <select
                    name="depth"
                    value={options.depth}
                    onChange={event => onChange({
                        ...options,
                        depth: event.target.value,
                    })}
                >
                    {Object.keys(DEPTH).map(key => (
                        <option
                            key={`${DEPTH[key]}`}
                            value={DEPTH[key]}
                        >
                            {key}
                        </option>
                    ))}
                </select>
            </div>
            <button
                className={`form__button form__button_${options.started ? 'disabled': ''}`}
                type="button"
                disabled={options.started ? 'disabled': ''}
                onClick={onStart}
            >
                Начать
            </button>
        </form>
    );
}

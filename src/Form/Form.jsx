import React from 'react';

import './Form.css';

const DEPTH = {
    'Весь сайт в глубину': 20, // максимлаьная глубина?
    'В глубину 1': 1,
    'В глубину 2': 2,
    'В глубину 3': 3,
    'Только указанные страницы': 0,
};

export default function Form({
    options = {},
    onChange,
    onStart,
}) {
    return (
        <form className={`form ${options.started ? 'form_process': ''}`}>
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
                className={`form__button form__button_${options.started ? 'process': ''}`}
                type="button"
                onClick={onStart}
            >
                {options.started ? 'Стоп': 'Начать'}
            </button>
        </form>
    );
}

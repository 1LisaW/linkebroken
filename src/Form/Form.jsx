import React from 'react';

import './Form.css';

const DEPTH = {
    'Только указанные страницы': 0,
    'В глубину на 1 страницу': 1,
    'В глубину на 2 страницы': 2,
    'В глубину на 3 страницы': 3,
    'Весь сайт в глубину': 20, // максимальная глубина?
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
                    disabled={options.started ? 'disabled': ''}
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
                    disabled={options.started ? 'disabled': ''}
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

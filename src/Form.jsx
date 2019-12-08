import React from 'react';

const DEPTH = {
    'Весь сайт': 20, // максимлаьная глубина?
    'Одну страницу': 0,
};

export default function Form({
    options = {},
    onChange,
    onStart,
}) {
    return (
        <form>
            <label>
                Базовый домен
                <input
                    name="domain"
                    value={options.hostname}
                    onChange={event => onChange({
                        ...options,
                        hostname: event.target.value,
                    })}
                />
            </label>
            <label>
                Ссылки
                <textarea
                    name="urls"
                    style={{ width: '100%', height: '60px' }}
                    value={options.urls}
                    onChange={event => onChange({
                        ...options,
                        urls: event.target.value,
                    })}
                />
            </label>
            <label>
                Глубина
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
            </label>
            <button
                type="button"
                disabled={options.started ? 'disabled': ''}
                onClick={onStart}
            >
                Начать
            </button>
        </form>
    );
}

import React from 'react';

import './Filters.css';

export default function Filters({
    filters = {},
    onChange,
}) {
    return (
        <form>
            {Object.keys(filters).map(filterKey => {
                const { name, value } = filters[filterKey];
                return (
                    <label key={filterKey} className="filters__filter">
                        <input
                            name={filterKey} type="checkbox"
                            value="1"
                            checked={value}
                           onChange={() => onChange({
                               ...filters,
                               [filterKey]: {
                                   ...filters[filterKey],
                                   value: !value,
                               },
                           })}
                        />
                        {name}
                    </label>
                );
            })}
        </form>
    );
}

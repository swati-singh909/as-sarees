import { useState } from 'react';
import Icon from './Icon.jsx';
import { paths } from '../lib/router.js';

// Search form. On Home it opens the results page; on the fabric page it
// filters the list as you type (pass `value` and `onChange`).
export default function SearchBox({ id = 'search-input', value, onChange, placeholder = 'Search colour, fabric, occasion…' }) {
  const [own, setOwn] = useState('');
  const controlled = typeof onChange === 'function';
  const text = controlled ? value : own;

  return (
    <form
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (!controlled) window.location.hash = paths.fabric('all', own.trim());
        else e.currentTarget.querySelector('input')?.blur();
      }}
    >
      <label className="search__box" htmlFor={id}>
        <Icon name="search" size={20} />
        <span className="visually-hidden">Search sarees</span>
        <input
          id={id}
          type="search"
          enterKeyHint="search"
          value={text}
          placeholder={placeholder}
          onChange={(e) => (controlled ? onChange(e.target.value) : setOwn(e.target.value))}
        />
      </label>
    </form>
  );
}

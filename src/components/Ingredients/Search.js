import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === inputRef.current.value) {
        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
        fetch('https://react-hooks-d11f7.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(data => {
            const loadedIngredients = [];
            for (const key in data) {
              loadedIngredients.push({
                id: key,
                title: data[key].title,
                amount: data[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          })
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    }
  }, [filter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={filter}
            ref={inputRef}
            onChange={event => setFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;

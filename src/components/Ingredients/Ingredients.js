import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-d11f7.firebaseio.com/ingredients.json')
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
        setIngredients(loadedIngredients);
      })
  }, []);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", ingredients);
  }, [ingredients])

  const addIngredientHandler = (ingredient) => {
    fetch(`https://react-hooks-d11f7.firebaseio.com/ingredients.json`,
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        return response.json();
      }).then(data => {
        // console.log(data.name);
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: data.name, ...ingredient }
        ]);
      })
  }


  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  // const removeIngredientHandler = () => {

  // }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} onRemoveItem={() => { }} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={ingredients} />
      </section>
    </div>
  );
}

export default Ingredients;

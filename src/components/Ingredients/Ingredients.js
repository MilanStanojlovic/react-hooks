import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

// const ingredientReducer = (currentIngredients, action) => {
//   switch (action.type) {
//     case 'SET':
//       return action.ingredients;
//     case 'ADD':
//       return [...currentIngredients, action.ingredient]
//     case 'DELETE':
//       return currentIngredients.filter(ing => ing.id !== action.id)
//     default:
//       throw new Error('SHould not get there');
//   }
// }

function Ingredients() {
  // const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

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
        // setIngredients(loadedIngredients);

      })
  }, []);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", ingredients);
  }, [ingredients])

  const addIngredientHandler = useCallback((ingredient) => {
    setIsLoading(true);
    fetch(`https://react-hooks-d11f7.firebaseio.com/ingredients.json`,
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        setIsLoading(false);
        return response.json();
      }).then(data => {
        console.log(data.name);
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: data.name, ...ingredient }
        ]);
        // dispatch({ type: 'ADD', 
        // ingredient: { id: data.name, ...ingredient } })
      })
  }, [])


  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
    // dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-d11f7.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }).then(() => {
        setIsLoading(false);
        setIngredients(prevIngredients =>
          prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
        // dispatch({type: 'DELETE', id: ingredientId})
      }).catch(error => {
        setError(error.message)
      });

  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    )
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error ? <ErrorModal onClose={clearError}>{error}</ErrorModal> : null}
      <IngredientForm onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;

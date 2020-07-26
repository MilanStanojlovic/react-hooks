const useHttp = (url, method, body) => { 
  fetch(url,
      {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        // setIsLoading(false);
        // setIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
        // // dispatch({type: 'DELETE', id: ingredientId})
      }).catch(error => {
        // setError(error.message)
      });

};

export default useHttp;
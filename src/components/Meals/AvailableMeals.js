import { useState, useEffect } from 'react/cjs/react.development';
import useHttpRequest from '../../hooks/use-http-request';
import Card from '../UI/Card';
import classes from './AvailableMeals.module.css';
import MealItem from './MealItem/MealItem';

const AvailableMeals = () => {
  const [mealsArray, setMealsArray] = useState([]);

  const { isLoading, error, sendRequest: fetchMeals } = useHttpRequest();

  useEffect(() => {
    const transformMeals = (mealsObj) => {
      const loadedMeals = [];
      for (const mealKey in mealsObj) {
        loadedMeals.push({
          id: mealKey,
          description: mealsObj[mealKey].description,
          name: mealsObj[mealKey].name,
          price: mealsObj[mealKey].price,
        });
      }
      setMealsArray(loadedMeals);
    };
    fetchMeals(
      {
        url: process.env.REACT_APP_FIREBASE_URL,
      },
      transformMeals
    );
  }, [fetchMeals]);

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={classes.MealsError}>
        <p>{error}</p>
      </section>
    );
  }

  const mealsList = mealsArray.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  // transform js object into jsx elements
  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;

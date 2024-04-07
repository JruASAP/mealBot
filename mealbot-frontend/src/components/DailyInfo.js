import React, { useEffect, useState } from 'react';

function DailyInfo({ day, weather }) {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/meals')
      .then(response => response.json())
      .then(data => {
        setMeals(data); // Assuming data is an array of meals
      })
      .catch(error => console.error('There was an error!', error));
  }, [day]); // If you want to re-fetch when 'day' changes

  return (
    <div>
      <h2>{day}</h2>
      {meals.map((meal, index) => (
        <div key={index}>
          <p>Meal: {meal.name}</p> {/* Adjust according to your data structure */}
          <p>Ingredients: {meal.ingredients}</p> {/* Adjust according to your data structure */}
        </div>
      ))}
      {weather && (
        <>
          <p>Weather: {weather.description}</p>
          <p>High: {weather.temp.max}°, Low: {weather.temp.min}°</p>
        </>
      )}
    </div>
  );
}

export default DailyInfo;

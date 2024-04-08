import React, { useEffect, useState } from 'react';

function DailyInfo() {
  const [weeklyData, setWeeklyData] = useState(null);

  useEffect(() => {
    fetch('https://d37vttglcc8p3u.cloudfront.net/api/meals')
      .then(response => response.json())
      .then(data => {
        setWeeklyData(data); 
      })
      .catch(error => console.error('There was an error!', error));
  }, []); 

  return (
    <div>
      {weeklyData && weeklyData.meals.map((meal, index) => (
        <div key={index}>
          <h2>{meal.date}</h2> 
          <p>Meal: {meal.meal}</p>
          <p>Ingredients: {meal.ingredients}</p>
          <p>Weather: {meal.forecast}</p> 
          <p>High: {meal.tempHigh}°, Low: {meal.tempLow}°</p>
        </div>
      ))}
    </div>
  );
}

export default DailyInfo;

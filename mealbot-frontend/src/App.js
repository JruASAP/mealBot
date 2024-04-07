import React from 'react';
import Greeting from './components/Greeting';
import DailyInfo from './components/DailyInfo';

function App() {
  // Simulated data - replace this with actual data fetching logic
  const meals = [
    { Day: 'Sunday', Meal: { value: 'Spaghetti' }, Ingredients: { value: 'Pasta, Tomato Sauce, Cheese' } },
    // Add other days
  ];
  
  const weather = [
    { day: 'Sunday', description: 'Sunny', temp: { max: 75, min: 65 } },
    // Add other days
  ];

  return (
    <div>
      <Greeting />
      {meals.map((meal, index) => (
        <DailyInfo key={index} day={meal.Day} meal={meal} weather={weather[index]} />
      ))}
    </div>
  );
}

export default App;

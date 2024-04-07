import React from 'react';
import Greeting from './components/Greeting';
import DailyInfo from './components/DailyInfo';

function App() {
  // placeholder data
  const meals = [
    { Day: 'Sunday', Meal: { value: 'Spaghetti' }, Ingredients: { value: 'Pasta, Tomato Sauce, Cheese' } },
  ];
  
  const weather = [
    { day: 'Sunday', description: 'Sunny', temp: { max: 75, min: 65 } },
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

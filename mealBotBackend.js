const Sheets = require("node-sheets").default;
const dotenv = require("dotenv");
const axios = require('axios');
const chalk = require('chalk');
const moment = require("moment");
dotenv.config();


const getMeals = async()=> {
  try {
    const gs = new Sheets(process.env.GOOGLE_SHEET_ID);
    await gs.authorizeApiKey(process.env.GOOGLE_SHEET_KEY);
    const Sunday = await gs.tables("Sunday");
    const Monday = await gs.tables("Monday");
    const Tuesday = await gs.tables("Tuesday");
    const Wednesday = await gs.tables("Wednesday");
    const Thursday = await gs.tables("Thursday");
    const Friday = await gs.tables("Friday");
    return [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday]
  } catch (err) { console.error(err); }
}

const checkWeather = async()=> {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${process.env.lat}&lon=${process.env.lon}&exclude=current,hourly,minutely&APPID=${process.env.WEATHER_KEY}&units=imperial`;
  const weather = await axios.get(url)
  return weather.data
}


const init = async()=> {
  const meals = await getMeals();
  const weather = await checkWeather();
  let mealArray = [];

  const chalkColors = [chalk.blue, chalk.magenta, chalk.green, chalk.yellow, chalk.whiteBright, chalk.red];
  let discordAndEmailMessage = '**This week\'s meals and weather forecast:**\n';

  meals.forEach((dayMeals, index) => {
    if (index < weather.daily.length) {
      const randomMealNum = Math.floor(Math.random() * dayMeals.rows.length);
      const randomMealRecipe = dayMeals.rows[randomMealNum];
      const dayForecast = weather.daily[index];
      const formattedDate = moment.unix(dayForecast.dt).format('dddd, MMMM DD, YYYY');

      console.log(chalkColors[index % chalkColors.length](`Congratulations, your meal for ${formattedDate} is ${randomMealRecipe.Meal.value}. Please review the ingredients needed- ${randomMealRecipe.Ingredients.value} Weather Forecast: ${dayForecast.weather[0].description}, High: ${dayForecast.temp.max}°, Low: ${dayForecast.temp.min}°`));

      discordAndEmailMessage += `
**${formattedDate}:** Congratulations, your meal is ${randomMealRecipe.Meal.value}. Please review the ingredients needed: ${randomMealRecipe.Ingredients.value}
Weather Forecast: ${dayForecast.weather[0].description}, High: ${dayForecast.temp.max}°, Low: ${dayForecast.temp.min}°
`;

mealArray.push({date:formattedDate, meal:randomMealRecipe.Meal.value, ingredients: randomMealRecipe.Ingredients.value, forecast:dayForecast.weather[0].description, tempHigh: dayForecast.temp.max, tempLow: dayForecast.temp.min })
    }
  });
return {meals: mealArray, mealMessage: discordAndEmailMessage}
  
};


module.exports = { init, getMeals, checkWeather };

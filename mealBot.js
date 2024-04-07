const Sheets = require("node-sheets").default;
const dotenv = require("dotenv");
const axios = require('axios');
const chalk = require('chalk');
const nodemailer = require("nodemailer");
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

const mailMeals = async(message)=> {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.emailUser,
      pass: process.env.emailAppPass,
    },
  });

  let info = await transporter.sendMail({
    from: `"Meal Bot" <${process.env.emailUser}>`,
    to: process.env.emailRecipients,
    subject: "Meal Bot Generated Meals 🤖",
    text: message,
  });

  console.log("Message sent: %s", info.messageId);
}

const discordPost = async(mealMessage)=> {
  const discordHook = process.env.discordHook;
  const message = {
    username: "Meal Bot",
    avatar_url: "https://files.oaiusercontent.com/file-gzrBICmMw1H6vn8i0DxohudW?se=2024-04-07T00%3A21%3A36Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D9ed19cf9-0d38-4d29-9450-27a0a63b1d1c.webp&sig=BtKYMOHPOZvH3nLyauaoP0pN3Ckny8kiy7PcrIuW5KA%3D",
    content: mealMessage,
  };

  try {
    await axios.post(discordHook, message);
    console.log("Message posted to Discord successfully!");
  } catch (error) {
    console.error("Error posting message to Discord:", error);
  }
}



const init = async()=> {
  const meals = await getMeals();
  const weather = await checkWeather();

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const chalkColors = [chalk.blue, chalk.magenta, chalk.green, chalk.yellow, chalk.whiteBright, chalk.red];
  let discordAndEmailMessage = '**This week\'s meals and weather forecast:**\n';

  meals.forEach((dayMeals, index) => {
    if (index < weather.daily.length) {
      const randomMealNum = Math.floor(Math.random() * dayMeals.rows.length);
      const randomMealRecipe = dayMeals.rows[randomMealNum];
      const dayForecast = weather.daily[index];
      const formattedDate = moment.unix(dayForecast.dt).format('dddd MMMM DD, YYYY');

      console.log(chalkColors[index % chalkColors.length](`Congratulations, your meal for ${formattedDate} is ${randomMealRecipe.Meal.value}. Please review the ingredients needed- ${randomMealRecipe.Ingredients.value} Weather Forecast: ${dayForecast.weather[0].description}, High: ${dayForecast.temp.max}°, Low: ${dayForecast.temp.min}°`));

      discordAndEmailMessage += `
**${formattedDate}:** Congratulations, your meal is ${randomMealRecipe.Meal.value}. Please review the ingredients needed: ${randomMealRecipe.Ingredients.value}
Weather Forecast: ${dayForecast.weather[0].description}, High: ${dayForecast.temp.max}°, Low: ${dayForecast.temp.min}°
`;
    }
  });

  try {
    await discordPost(discordAndEmailMessage);
  } catch (err) {
    console.log(chalk.red(err));
  };

  try {
    await mailMeals(discordAndEmailMessage);
  } catch (err) {
    console.log(chalk.red('Error sending email:'), err);
  };
};


init();

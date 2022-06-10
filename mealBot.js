const Sheets = require("node-sheets").default;
const dotenv = require("dotenv");
const axios = require('axios');
const chalk = require('chalk');
const nodemailer = require("nodemailer");
dotenv.config(); 


async function getMeals(){
    try {
        const gs = new Sheets(process.env.GOOGLE_SHEET_ID);
        await gs.authorizeApiKey(process.env.GOOGLE_SHEET_KEY);
        const Sunday = await gs.tables("Sunday");
        const Monday = await gs.tables("Monday");
        const Tuesday = await gs.tables("Tuesday");
        const Wednesday = await gs.tables("Wednesday");
        const Thursday = await gs.tables("Thursday");
        const Friday = await gs.tables("Friday");
  /*      console.log(Sundaytable.headers);
        console.log(Sundaytable.rows);*/
        return [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday]
        } catch (err) {    console.error(err);  }
}

async function checkWeather(){
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${process.env.lat}&lon=${process.env.lon}&exclude=current,hourly,minutely&APPID=${process.env.WEATHER_KEY}&units=imperial`;
   // console.log(url) 
    const weather = await axios.get(url)
return weather.data
}

async function mailMeals(sundaymeal,sundayweather) {
 
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.emailUser, 
        pass: process.env.emailAppPass, 
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Meal Bot" <${process.env.emailUser}>`,
      to: `${process.env.emailRecipients}`, 
      subject: "Meal Bot Generated Meals 🤖", 
      text: `Congratulations, your meal for Sunday is ${sundaymeal.Meal.value}\n Please review the ingredients needed-\n ${sundaymeal.Ingredients.value}\n If you would prefer to grill the weather will be ${sundayweather}`, 
//      html: "<b>Hello world?</b>", 
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  

async function init(){
    const meals = await getMeals();
   // console.log(meals[0].rows);
   const weather = await checkWeather();
   // let forecast = weather.weather[0].description;
    //console.log(weather);
    let randomMealNumSun = Math.floor(Math.random() * meals[0].rows.length);
    let randomMealNumMon = Math.floor(Math.random() * meals[1].rows.length);
    let randomMealNumTues = Math.floor(Math.random() * meals[2].rows.length);
    let randomMealNumWed = Math.floor(Math.random() * meals[3].rows.length);
    let randomMealNumThurs = Math.floor(Math.random() * meals[4].rows.length);
    let randomMealNumFri = Math.floor(Math.random() * meals[5].rows.length);
    let randomMealRecipeSun = meals[0].rows[randomMealNumSun];
    let randomMealRecipeMon = meals[1].rows[randomMealNumMon];
    let randomMealRecipeTues = meals[2].rows[randomMealNumTues];
    let randomMealRecipeWed = meals[3].rows[randomMealNumWed];
    let randomMealRecipeThurs = meals[4].rows[randomMealNumThurs];
    let randomMealRecipeFri = meals[5].rows[randomMealNumFri];
    console.log(chalk.blue(`Congratulations, your meal for Sunday is ${randomMealRecipeSun.Meal.value} please review the ingredients needed- ${randomMealRecipeSun.Ingredients.value}`));
    console.log(chalk.magenta(`Congratulations, your meal for Monday is ${randomMealRecipeMon.Meal.value} please review the ingredients needed- ${randomMealRecipeMon.Ingredients.value}`));
    console.log(chalk.green(`Congratulations, your meal for Tuesday is ${randomMealRecipeTues.Meal.value} please review the ingredients needed- ${randomMealRecipeTues.Ingredients.value}`));
    console.log(chalk.yellow(`Congratulations, your meal for Wednesday is ${randomMealRecipeWed.Meal.value} please review the ingredients needed- ${randomMealRecipeWed.Ingredients.value}`));
    console.log(chalk.whiteBright(`Congratulations, your meal for Thursday is ${randomMealRecipeThurs.Meal.value} please review the ingredients needed- ${randomMealRecipeThurs.Ingredients.value}`));
    console.log(chalk.red(`Congratulations, your meal for Friday is ${randomMealRecipeFri.Meal.value} please review the ingredients needed- ${randomMealRecipeFri.Ingredients.value}`));
    const mailed = await mailMeals(randomMealRecipeSun,weather.daily[2].weather[0].description);
}

init();

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001; // Use a port different from your React app
const {init} = require('./mealBotBackend'); 

app.use(cors());

app.get('/api/meals', async (req, res) => {
  const meals = await init();
  console.log(meals)
  res.json(meals);
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

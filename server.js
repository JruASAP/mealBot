const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001; // Use a port different from your React app
const {init} = require('./mealBotBackend'); 

app.use(cors());

app.get('/api/meals', async (req, res) => {
    try {
      const meals = await init();
      console.log(meals);
      res.json(meals);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

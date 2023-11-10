const express = require('express');
const app = express();

// Setting up routes
app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
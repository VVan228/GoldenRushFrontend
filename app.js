const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.join(__dirname, 'public')))


  

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});
app.get('/dispatcher', (req, res) => {
    res.sendFile(`${__dirname}/public/dispatcher.html`);
});
app.get('/client', (req, res) => {
    res.sendFile(`${__dirname}/public/client.html`);
});
app.listen(8080, () => {
    console.log('Application listening on port 8080!');
});
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRoutes');
const itineraryBuilder = require('./utils/ItineraryBuilder')
const app = express();
const port = process.env.PORT || 5000;

// for parsing application/json
app.use(bodyParser.json())
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))
//static
app.use(express.static('public'));
//api routes
app.use('/api/', apiRouter)

app.listen(port, () => {
    console.log(`Server up - port::${port}`)
});
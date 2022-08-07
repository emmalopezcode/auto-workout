var express = require('express');
const bodyParser = require('body-parser');
const {Database} = require('./database/db');
path = require('path');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const db = new Database('./database/database.json');

app.get('/', async (req, res) => {

    res.render('public/index', {error: null});
});

app.post('/movement', async (req, res) => {
    let error = null;
    try {
        db.addMovement(req.body);

    } catch(er) {
        console.log('there was an error: ' + er.message)
        error = er.message;

    }
    res.render('public/index', {error});

});

app.post('/updatePR', async (req, res) => {
    console.log(req.body);
    let error = null;
    try {
        db.updatePR(req.body);

    } catch(er) {
        console.log('there was an error: ' + er.message)
        error = er.message;

    }
    let movements = db.getWorkout();
    res.render('public/workout', {movements});});

app.get('/workout', async (req, res) => {
    let movements = db.getWorkout();
    res.render('public/workout', {movements});
});

publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir))
app.set('views', __dirname);
app.use(express.urlencoded({ extended: true }))

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port);
}

var server = app.listen(process.env.PORT || 4000, listen);
module.exports = server;
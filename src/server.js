const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Create connections to both databases
const loginDb = mongoose.createConnection('mongodb+srv://shreyanayakb26:shreyamongodb%4026@cluster0.ecrwf.mongodb.net/details?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const volunteerDb = mongoose.createConnection('mongodb+srv://shreyanayakb26:shreyamongodb%4026@cluster0.ecrwf.mongodb.net/volunteer?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Monitor login database connection
loginDb.on('connected', () => {
    console.log('Login database connected');
});
loginDb.on('disconnected', () => {
    console.log('Login database disconnected');
});
loginDb.on('error', (err) => {
    console.error('Login database connection error:', err);
});

// Monitor volunteer database connection
volunteerDb.on('connected', () => {
    console.log('Volunteer database connected');
});
volunteerDb.on('disconnected', () => {
    console.log('Volunteer database disconnected');
});
volunteerDb.on('error', (err) => {
    console.error('Volunteer database connection error:', err);
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Import models with respective connections
const Details = require('./login')(loginDb);
const Volunteer = require('./volunteerSchema')(volunteerDb);

app.get('/', (req, res) => {
    res.redirect('/index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newDetail = new Details({
            name: data.name,
            email: data.email,
            password: data.password
        });
        await newDetail.save();
        res.render('index', { name: newDetail.name.split('@')[0] });
    } catch (err) {
        console.log('Error:', err);
        res.render('signup', { error: 'Error occurred during signup' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await Details.findOne({ email: req.body.email });
        if (check) {
            if (req.body.password === check.password) {
                res.render('index', { name: check.name.split('@')[0] });
            } else {
                res.render('login', { error: 'Incorrect password' });
            }
        } else {
            res.render('login', { error: 'Email not found' });
        }
    } catch (err) {
        console.log('Error occurred:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.post('/form', async (req, res) => {
    try {
        const { fullName, region, contact } = req.body;
        console.log('Received data:', { fullName, region, contact });

        const newVolunteer = new Volunteer({ fullName, region, contact });
        await newVolunteer.save();

        console.log('Volunteer saved successfully');
        res.redirect('/thanks');
    } catch (err) {
        console.error('Error saving volunteer:', err);
        res.status(500).send('Error saving volunteer');
    }
});

app.get('/main', async (req, res) => {
    try {
        const { region } = req.query;
        let volunteers;

        if (region) {
            volunteers = await Volunteer.find({ region: new RegExp(region, 'i') });
        } else {
            volunteers = await Volunteer.find();
        }

        res.render('main', { volunteers });
    } catch (err) {
        console.error('Error fetching volunteers:', err);
        res.status(500).send('Error fetching volunteers');
    }
});

app.get('/thanks', (req, res) => {
    res.render('thanks');
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});

module.exports = app;

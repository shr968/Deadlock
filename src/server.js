const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { parse } = require('url');

const app = express();
const server = createServer(app);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection URIs
const loginDbUri = 'mongodb+srv://shreyanayakb26:shreyamongodb%4026@cluster0.ecrwf.mongodb.net/details?retryWrites=true&w=majority';
const volunteerDbUri = 'mongodb+srv://shreyanayakb26:shreyamongodb%4026@cluster0.ecrwf.mongodb.net/volunteer?retryWrites=true&w=majority';

// Create connections to both databases
const loginDb = mongoose.createConnection(loginDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
});

const volunteerDb = mongoose.createConnection(volunteerDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
});

// Monitor database connections
loginDb.on('connected', () => console.log('Login database connected'));
loginDb.on('disconnected', () => console.log('Login database disconnected'));
loginDb.on('error', (err) => console.error('Login database connection error:', err));

volunteerDb.on('connected', () => console.log('Volunteer database connected'));
volunteerDb.on('disconnected', () => console.log('Volunteer database disconnected'));
volunteerDb.on('error', (err) => console.error('Volunteer database connection error:', err));

// Define the Details and Volunteer models
const Details = loginDb.model('Details', new mongoose.Schema({
    name: String,
    email: String,
    password: String
}));
const Volunteer = volunteerDb.model('Volunteer', new mongoose.Schema({
    fullName: String,
    region: String,
    contact: String
}));

// Define routes
app.get('/', (req, res) => res.redirect('/index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

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

app.get('/form', (req, res) => res.render('form'));

app.post('/form', async (req, res) => {
    try {
        const data = req.body;
        const newVolunteer = new Volunteer({
            fullName: data.fullName,
            region: data.region,
            contact: data.contact
        });
        await newVolunteer.save();
        res.render('thanks');
    } catch (err) {
        console.error('Error saving volunteer:', err);
        res.status(500).send('Error saving volunteer');
    }
});

app.get('/main', async (req, res) => {
    try {
        const { region } = req.query;  // Get the search query from the URL
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

app.get('/thanks', (req, res) => res.render('thanks'));
app.get('/index', (req, res) => res.render('index', { name: "Volunteer" }));

// Vercel specific export
module.exports = (req, res) => {
    const { url } = parse(req.url, true);
    req.url = url; // Ensure URL parsing for Vercel
    return server(req, res);
};

// Listen on the default Vercel port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));

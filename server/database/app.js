const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// DEBUG: Connection Events
console.log("Attempting to connect to MongoDB...");
mongoose.connect("mongodb://db_container:27017/dealershipsDB");

mongoose.connection.on('connected', () => {
    console.log('>>> SUCCESS: Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('>>> ERROR: Mongoose connection error:', err);
});

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Initial Data Load
try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data['dealerships']);
  });
} catch (error) {
  console.log("Error loading data:", error);
}

app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

app.get('/fetchDealers', async (req, res) => {
  console.log(">>> REQUEST RECEIVED: /fetchDealers"); // Log when request hits
  try {
    const documents = await Dealerships.find();
    console.log(">>> DATA FOUND: Sending " + documents.length + " records"); // Log when data is found
    res.json(documents);
  } catch (error) {
    console.log(">>> ERROR in /fetchDealers:", error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// ... (Other routes kept simple for now) ... 
app.get('/fetchReviews', async (req, res) => {
  const documents = await Reviews.find();
  res.json(documents);
});

app.get('/fetchDealer/:id', async (req, res) => {
  const documents = await Dealerships.find({id: req.params.id});
  res.json(documents);
});

app.get('/fetchDealers/:state', async (req, res) => {
  const documents = await Dealerships.find({state: req.params.state});
  res.json(documents);
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  const documents = await Reviews.find({dealership: req.params.id});
  res.json(documents);
});

app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  data = JSON.parse(req.body);
  const documents = await Reviews.find().sort( { id: -1 } );
  let new_id = documents[0]['id']+1;
  const review = new Reviews({
        "id": new_id,
        "name": data['name'],
        "dealership": data['dealership'],
        "review": data['review'],
        "purchase": data['purchase'],
        "purchase_date": data['purchase_date'],
        "car_make": data['car_make'],
        "car_model": data['car_model'],
        "car_year": data['car_year'],
  });
  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

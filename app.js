const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const engine = require('ejs-mate')
const cors = require('cors');
const ExpressError = require('./helpers/ExpressError');


const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Database connected");
})

const app = express();

app.engine('ejs', engine);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


app.use(morgan('tiny'))
app.use(cors({
  origin: 'http://localhost:3002', methods: 'GET, POST, DELETE, PUT', credentials: true
}))
app.options("*", cors());

app.get('/', (req, res) => {
  res.render('home')
})


app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);




app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})



app.listen(3000, () => {
  console.log('Serving on Port 3000')
})
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const morgan = require('morgan');
const engine = require('ejs-mate')
const cors = require('cors');
const catchAsync = require('./helpers/catchAsync')
const ExpressError = require('./helpers/ExpressError');
const { reviewSchema } = require('./schemas')
const Review = require('./models/review');


const campgrounds = require('./routes/campground');

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

//Reviews

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}



app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review)
  campground.reviews.push(review);
  await review.save()
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))


app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndRemove(reviewId);
  res.redirect(`/campgrounds/${id}`)
}))

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
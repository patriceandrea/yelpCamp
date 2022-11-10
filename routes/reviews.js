const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../helpers/catchAsync')
const ExpressError = require('../helpers/ExpressError');
const Review = require('../models/review');
const Campground = require('../models/campground')
const { reviewSchema } = require('../schemas')

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review)
  console.log(campground)
  campground.reviews.push(review);
  await review.save()
  await campground.save();
  req.flash('success', 'Successfully created new reviews!');
  res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndRemove(reviewId);
  req.flash('success', 'Sucessfully deleted reviews!');
  res.redirect(`/campgrounds/${id}`)
}))


module.exports = router; 
const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync')
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')



router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds })
}))


router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
  res.render("campgrounds/new");
}));



router.post("/", validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground)
  campground.author = req.user._id;
  await campground.save()
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews').populate('author');
  if (!campground) {
    req.flash('error', 'Cannot find that campground')
  }
  res.render("campgrounds/show", { campground })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground')
  }
  res.render("campgrounds/edit", { campground })
}));

router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Sucessfully updated campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}));

router.get('/makecampground', catchAsync(async (req, res) => {
  const camp = new Campground({ title: 'My Backyard', description: 'cheap camping spot!' });
  await camp.save()
  res.send(camp)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Sucessfully deleted campground!');
  res.redirect('/campgrounds')
}));


module.exports = router;
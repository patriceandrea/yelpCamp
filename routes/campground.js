const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds');


router.get('/', catchAsync(campgrounds.index));
router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm));

router.post("/", validateCampground, isLoggedIn, catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;
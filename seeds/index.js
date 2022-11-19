const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require("./seedHelpers");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '636fea921cfd9816558dc185',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem 2 is a lorem ipsum generator brought to you by Manoverboard, a purpose-driven design studio based in beautiful Canada.',
      price: price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dv8b1blow/image/upload/v1668626583/YelpCamp/lm6vbppfxd4giknunlja.jpg',
          filename: 'YelpCamp/lm6vbppfxd4giknunlja'
        },
        {
          url: 'https://res.cloudinary.com/dv8b1blow/image/upload/v1668883538/YelpCamp/bqkuohwckvsytyfai33a.jpg',
          filename: 'YelpCamp/bqkuohwckvsytyfai33a',
        }
      ]
    })
    await camp.save();
  }
  const c = new Campground({ title: 'purple field' });
  c.save();
}

seedDB()
  .then(() => {
    // mongoose.connection.close();
    // mongoose.disconnect()
  }); 
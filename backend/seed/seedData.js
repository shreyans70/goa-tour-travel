const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Package = require('../models/Package');
const Place = require('../models/Place');
const Gallery = require('../models/Gallery');

dotenv.config({ path: '../.env' }); // Fallback if run from seed folder directly
// try standard relative if root
if(!process.env.MONGO_URI) {
    dotenv.config();
}

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Package.deleteMany();
    await Place.deleteMany();
    await Gallery.deleteMany();

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    });

    // Seed Packages
    const packages = [
      {
        title: '3 Days Goa Getaway',
        price: 5999,
        originalPrice: 7999,
        discountPercent: 25,
        offerTag: 'Best Value',
        duration: '2 Nights / 3 Days',
        category: 'budget',
        location: 'North Goa',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1560179406-1c6c60e0faa2?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1620802051772-51a5e786b593?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1572237599255-2e63b6cb5922?auto=format&fit=crop&q=80'
        ],
        description: 'A quick budget-friendly getaway to enjoy the vibrant beaches of North Goa.',
        placesCovered: ['Baga Beach', 'Calangute Beach', 'Aguada Fort'],
        hotelIncluded: true,
        foodIncluded: false,
        transportIncluded: true,
        itinerary: [
          'Day 1: Arrival & Baga Beach\n- Pickup from Airport/Railway Station\n- Check-in to hotel\n- Evening relax at Baga Beach',
          'Day 2: Calangute & Aguada Fort\n- Breakfast at hotel\n- Visit Calangute Beach\n- Explore historic Aguada Fort',
          'Day 3: Departure\n- Checkout from hotel\n- Drop off to Airport/Railway Station'
        ]
      },
      {
        title: 'Luxury South Goa Retreat',
        price: 15999,
        originalPrice: 19999,
        discountPercent: 20,
        offerTag: 'Luxury Deal',
        duration: '4 Nights / 5 Days',
        category: 'luxury',
        location: 'South Goa',
        image: 'https://images.unsplash.com/photo-1540202404-b711c0683ca9?auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1540202404-b711c0683ca9?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1629807530643-4e4b17f54d4a?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600854291880-60b6426eb617?auto=format&fit=crop&q=80'
        ],
        description: 'Experience tranquility and luxury in the serene beaches of South Goa.',
        placesCovered: ['Palolem Beach', 'Colva Beach', 'Dudhsagar Waterfalls'],
        hotelIncluded: true,
        foodIncluded: true,
        transportIncluded: true,
        itinerary: [
          'Day 1: Arrival at Luxury Resort\n- Premium transfer to South Goa resort\n- Welcome drinks and relaxation',
          'Day 2: Palolem Beach\n- Full day at Palolem Beach\n- Evening candlelight dinner',
          'Day 3: Dudhsagar Waterfalls\n- Guided Jeep Safari to Dudhsagar\n- Spice plantation visit',
          'Day 4: Colva Beach Relaxation\n- Free day for spa and Colva beach',
          'Day 5: Departure\n- Premium transfer to airport'
        ]
      },
      {
        title: 'Goa Adventure Trip',
        price: 8999,
        originalPrice: 10999,
        discountPercent: 18,
        offerTag: 'Trending',
        duration: '3 Nights / 4 Days',
        category: 'adventure',
        location: 'Goa (Mixed)',
        image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1563261642-f28c2ff9a557?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1629215082159-d6e872ff7e35?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1601614949544-774f75727fb7?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80'
        ],
        description: 'Packed with water sports and adventure activities.',
        placesCovered: ['Anjuna Beach', 'Grand Island', 'Chapora Fort'],
        hotelIncluded: true,
        foodIncluded: true,
        transportIncluded: true,
        itinerary: [
          'Day 1: Arrival & Anjuna Beach\n- Arrival and check-in\n- Evening at Anjuna Beach',
          'Day 2: Scuba Diving at Grand Island\n- Full day boat trip to Grand Island\n- Scuba diving with instructors',
          'Day 3: Water Sports & Chapora Fort\n- Parasailing, Jet Ski at Calangute\n- Sunset at Chapora Fort',
          'Day 4: Departure\n- Transfer to airport'
        ]
      },
      {
        title: 'Romantic Goa Honeymoon',
        price: 12999,
        originalPrice: 15999,
        discountPercent: 19,
        offerTag: 'Couples Choice',
        duration: '4 Nights / 5 Days',
        category: 'honeymoon',
        location: 'South Goa',
        image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1629807530643-4e4b17f54d4a?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1540202404-b711c0683ca9?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80'
        ],
        description: 'Perfect romantic setup for newly married couples with candlelight dinner.',
        placesCovered: ['Butterfly Beach', 'Cavelossim Beach', 'Dona Paula'],
        hotelIncluded: true,
        foodIncluded: true,
        transportIncluded: true,
        itinerary: [
          'Day 1: Arrival & Welcome Drink\n- Private transfer to resort\n- Room decoration and welcome drinks',
          'Day 2: Butterfly Beach\n- Private boat ride to Butterfly beach\n- Picnic lunch setup',
          'Day 3: Cruise Ride & Dona Paula\n- Evening Mandovi River Cruise\n- Visit Dona Paula viewpoint',
          'Day 4: Leisure & Candlelight Dinner\n- Relaxing day at the resort\n- Special beachside candlelight dinner',
          'Day 5: Departure\n- Sweet memories and drop to airport'
        ]
      },
      {
        title: 'Goa Heritage Tour',
        price: 6999,
        originalPrice: 8999,
        discountPercent: 22,
        offerTag: 'Family Special',
        duration: '3 Nights / 4 Days',
        category: 'family',
        location: 'Old Goa',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1587313886566-df3082531a7d?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1596445989122-38ff40c31671?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1629215082159-d6e872ff7e35?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1563261642-f28c2ff9a557?auto=format&fit=crop&q=80'
        ],
        description: 'Explore the rich Portuguese heritage, churches, and spice plantations.',
        placesCovered: ['Basilica of Bom Jesus', 'Se Cathedral', 'Spice Plantation'],
        hotelIncluded: true,
        foodIncluded: true,
        transportIncluded: true,
        itinerary: [
          'Day 1: Arrival & Hotel Check-in\n- Transfer to heritage hotel in Panjim',
          'Day 2: Old Goa Churches Tour\n- Guided tour of Basilica of Bom Jesus\n- Visit Se Cathedral and museums',
          'Day 3: Spice Plantation Tour\n- Traditional Goan lunch at Spice Plantation\n- Elephant ride (optional)',
          'Day 4: Departure\n- Airport transfer'
        ]
      },
      {
        title: 'Goa Weekend Party',
        price: 7500,
        originalPrice: 10000,
        discountPercent: 25,
        offerTag: 'Weekend Deal',
        duration: '2 Nights / 3 Days',
        category: 'party',
        location: 'North Goa',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1559403816-43b817bc1683?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1620802051772-51a5e786b593?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1560179406-1c6c60e0faa2?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80'
        ],
        description: 'Experience the crazy nightlife of Goa.',
        placesCovered: ['Tito\'s Lane', 'Curlies', 'Vagator Beach'],
        hotelIncluded: true,
        foodIncluded: false,
        transportIncluded: false,
        itinerary: [
          'Day 1: Arrival & Tito\'s Lane\n- Check-in to Baga hotel\n- Club hopping at Tito\'s Lane',
          'Day 2: Vagator Beach & Curlies Party\n- Evening sunset at Vagator\n- Night party at Curlies, Anjuna',
          'Day 3: Departure\n- Late checkout and departure'
        ]
      }
    ];

    await Package.insertMany(packages);

    // Seed Places
    const places = [
      {
        name: 'Baga Beach',
        category: 'Beach',
        image: 'https://images.unsplash.com/photo-1600854291880-60b6426eb617?auto=format&fit=crop&q=80',
        description: 'One of the most popular beaches in North Goa, known for its nightlife and water sports.',
        location: 'North Goa',
        bestTime: 'October to March',
        entryFee: 'Free'
      },
      {
        name: 'Dudhsagar Waterfalls',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1601614949544-774f75727fb7?auto=format&fit=crop&q=80',
        description: 'A majestic four-tiered waterfall located on the Mandovi River.',
        location: 'Sanguem Taluka',
        bestTime: 'Monsoon (July to October)',
        entryFee: 'INR 400 (Jeep Safari)'
      },
      {
        name: 'Aguada Fort',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1596445989122-38ff40c31671?auto=format&fit=crop&q=80',
        description: 'A well-preserved seventeenth-century Portuguese fort and lighthouse.',
        location: 'Sinquerim Beach',
        bestTime: 'September to March',
        entryFee: 'INR 25'
      },
      {
        name: 'Palolem Beach',
        category: 'Beach',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80',
        description: 'Known for its beautiful crescent shape and calm waters.',
        location: 'South Goa',
        bestTime: 'November to March',
        entryFee: 'Free'
      },
      {
        name: 'Basilica of Bom Jesus',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1587313886566-df3082531a7d?auto=format&fit=crop&q=80',
        description: 'A UNESCO World Heritage Site holding the mortal remains of St. Francis Xavier.',
        location: 'Old Goa',
        bestTime: 'All year round',
        entryFee: 'Free'
      },
      {
        name: 'Anjuna Flea Market',
        category: 'Shopping',
        image: 'https://images.unsplash.com/photo-1559403816-43b817bc1683?auto=format&fit=crop&q=80',
        description: 'Famous Wednesday market offering everything from clothes to jewelry.',
        location: 'Anjuna',
        bestTime: 'Wednesdays (October to May)',
        entryFee: 'Free'
      },
      {
        name: 'Grand Island',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1563261642-f28c2ff9a557?auto=format&fit=crop&q=80',
        description: 'A hotspot for snorkeling and scuba diving in Goa.',
        location: 'Arabian Sea',
        bestTime: 'October to April',
        entryFee: 'Starts at INR 1500 (Activity cost)'
      },
      {
        name: 'Chapora Fort',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1629215082159-d6e872ff7e35?auto=format&fit=crop&q=80',
        description: 'Famous for its panoramic views and as a shooting location for movies.',
        location: 'Vagator',
        bestTime: 'Evening for sunset',
        entryFee: 'Free'
      }
    ];

    await Place.insertMany(places);

    const galleryImages = [
      { title: 'Goa Beaches', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80', category: 'Beach' },
      { title: 'Nightlife', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80', category: 'Party' },
      { title: 'Water Sports', image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80', category: 'Adventure' },
      { title: 'Old Goa', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80', category: 'Heritage' }
    ];

    await Gallery.insertMany(galleryImages);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();

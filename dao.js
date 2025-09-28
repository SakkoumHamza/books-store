const Mongoose = require('mongoose')
 
const bookSchema = new Mongoose.Schema({
  id: String,
  title: String,
  cover: String,
  publishDate: String,
  rating: String,
  author: String,
  description: String
})

module.exports = {
  init: () => {
    return Mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('✅ Successfully connected to MongoDB'))
      .catch(err => console.error('❌ MongoDB connection error:', err));
  },
  close: () => Mongoose.disconnect(),
  Book: Mongoose.model('books', bookSchema),
  Favorite: Mongoose.model('favorite', bookSchema),
};


import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  cover: String,
  publishDate: String,
  rating: String,
  author: String,
  description: String
});

const Book = mongoose.model('books', bookSchema);
const Favorite = mongoose.model('favorite', bookSchema);

export const init = () => {
  return mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
    .then(() => console.log('✅ Successfully connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
};

export const close = () => mongoose.disconnect();

export { Book, Favorite };

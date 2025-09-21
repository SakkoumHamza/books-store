const Expect = require('chai').expect
const MongoUnit = require('mongo-unit')
const DAO = require('../dao')
const TestData = require('./books.json')

describe('StoreDAO', () => {
  before(() =>  MongoUnit.start().then(() => {
    console.log('fake mongo is started: ', MongoUnit.getUrl())
    process.env.MONGO_URL = MongoUnit.getUrl()
    process.env.MONGO_DATABASE = 'test'
    DAO.init() 
  }))
  beforeEach(() => MongoUnit.load(TestData))
  afterEach(() => MongoUnit.drop())
  after(() => {
    DAO.close()
    return MongoUnit.stop()
  })

 it('should find all books', () => {
   return DAO.Book.find()
    .then(books => {
      Expect(books.length).to.equal(3)
      Expect(books[0].title).to.equal('To Kill a Mockingbird')
    })
 })

 it('should add to favorites', () => {
   let favorite = new DAO.Favorite({
      title: 'To Kill a Mockingbird',
      rating: '4.264.26',
      publishDate: '1960',
      cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1612238791i/56916837.jpg',
      description : "One of the best-loved stories of all time, To Kill a Mockingbird has been translated into more than forty languages, sold more than forty million copies worldwide, served as the basis for an enormously popular motion picture, and was voted one of the best novels of the twentieth century by librarians across the country. A gripping, heart-wrenching, and wholly remarkable coming-of-age tale in a South poisoned by virulent prejudice, it views a world of great beauty and savage iniquities through the eyes of a young girl, as her father — a crusading local lawyer — risks everything to defend a black man unjustly accused of a terrible crime.",
      author : 'Harper Lee'
    })
   return favorite.save()
    .then(book => {
      Expect(book.title).to.equal('To Kill a Mockingbird')
    })
 })

 it('should find a Book', () => {
   return DAO.Book.findOne({'$or': [
      {title: new RegExp( "1984", "i")},
   ]})
   .then(book => {
     Expect(book.title).to.equal('1984')
     Expect(book.publishDate).to.equal('1949')
     Expect(book.rating).to.equal('4.204.20')
   })
 })
})
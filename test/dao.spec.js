const MongoUnit = require("mongo-unit");
import DAO from '../dao.js';
import TestData from './books.json' assert { type: 'json' };

describe("StoreDAO", () => {
  beforeAll(async () => {
    await MongoUnit.start();
    console.log("fake mongo is started: ", MongoUnit.getUrl());
    process.env.MONGO_URL = MongoUnit.getUrl();
    process.env.MONGO_DATABASE = "test";
    DAO.init();
  });

  beforeEach(async () => {
    await MongoUnit.load(TestData);
  });

  afterEach(async () => {
    await MongoUnit.drop();
  });

  afterAll(async () => {
    DAO.close();
    await MongoUnit.stop();
  });

  it("should find all books", async () => {
    const books = await DAO.Book.find();
    expect(books).toHaveLength(3);
    expect(books[0].title).toBe("To Kill a Mockingbird");
  });

  it("should add to favorites", async () => {
    const favorite = new DAO.Favorite({
      title: "To Kill a Mockingbird",
      rating: "4.264.26",
      publishDate: "1960",
      cover:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1612238791i/56916837.jpg",
      description:
        "One of the best-loved stories of all time, To Kill a Mockingbird has been translated into more than forty languages, sold more than forty million copies worldwide, served as the basis for an enormously popular motion picture, and was voted one of the best novels of the twentieth century by librarians across the country. A gripping, heart-wrenching, and wholly remarkable coming-of-age tale in a South poisoned by virulent prejudice, it views a world of great beauty and savage iniquities through the eyes of a young girl, as her father — a crusading local lawyer — risks everything to defend a black man unjustly accused of a terrible crime.",
      author: "Harper Lee",
    });

    const book = await favorite.save();
    expect(book.title).toBe("To Kill a Mockingbird");
  });

  it("should find a Book", async () => {
    const book = await DAO.Book.findOne({
      $or: [{ title: new RegExp("1984", "i") }],
    });

    expect(book.title).toBe("1984");
    expect(book.publishDate).toBe("1949");
    expect(book.rating).toBe("4.204.20");
  });
});

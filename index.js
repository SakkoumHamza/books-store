const Express = require('express');
require('dotenv').config();
const BodyParser= require('body-parser');
const DAO = require('./dao');
const Cors = require('cors');
const App = Express();

App.use(Cors())
App.use(BodyParser.urlencoded({ extended: true }))
App.use(BodyParser.json())

DAO.init()

App.get('/', async (req, res) => {
    return res.send({
        version: '1.0.0'
    });
})

App.get('/books', async (req, res) => {
    const books = await DAO.Book.find();
    if (!books) 
        return res.status(404).send("Books were not found");
    return res.send(books);
})

App.get('/books/:name', async (req, res) => {
    let book = await DAO.Book.findOne({'$or': [
        {title: new RegExp(req.params.name, "i") },
        {id: req.params.name},
    ]})
    if (!book) 
        return res.status(404).send("Book was not found");
    return res.send(book);
})

App.post('/favorites', async (req, res) => {
    let favorite = new DAO.Favorite(req.body);
    await favorite.save();
    res.send({message:'success'})
})

App.get('/favorites', async (req, res) => {
    const favorites = await DAO.Favorite.find();
    if (!favorites) 
        return res.status(404).send("Favorites list is empty");
    return res.send(favorites);
})

App.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
})
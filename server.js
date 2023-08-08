const express = require('express');
const mongoose = require('mongoose')

const userModel = require('./Dao/Models/products.model')

const app = express();

MONGODB_CONNECT= 'mongodb+srv://sofianavasg:Coder01!@cluster0.8ieczog.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODB_CONNECT)
.catch(err =>{
    if (err) {
        console.log('No se pudo conectar a la DB', err)
        process.exit()
    }
})

// const Router = express.Router;
const handlebars = require ('express-handlebars')
const {Server} = require('socket.io')


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('public'))

const productRouter = require('./routers/productRouter')
const cartRouter = require('./routers/cartRouter')

const products = require('./prueba.json');

const PORT = 8080
const httpServer = app.listen (PORT, ()  => console.log (`Servidor iniciado en http://localhost:${PORT}`))

const io = new Server(httpServer);

app.use('/api/products', (req, res, next) => {
  req.io = io; // Pass the io instance to the request object
  next();
}, productRouter);


app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)


app.get('/home',(req,res) => {

  const params = {
      title: 'Productos',
      products: products

  }
  return res.render('home', params)
  
})


app.get('/realtimeproducts',(req,res) => {

  const params = {
      title: 'realtimeproducts',
      products: products,

  }
  return res.render('realTimeProducts', params)
  
})

io.on('connection', (socket) => {
  console.log('New client connected');
});


app.get('/healthcheck', (req,res) => {
    return res.json({
        status: 'running',
        date: new Date()
    })
})

app.get('/api/users', async (req,res) => {
    
    const user = await userModel.find()

    return res.json(user)
})

app.post('/api/users', async (req,res) => {
    
    const body = req.body

    try {
        const result = await userModel.create({
            title: body.title,
            description: body.description,
            code: body.code,
            price: body.price,
            status: body.status,
            stock: body.stock,
            category: body.category,
            thumbnail: body.thumbnail
            })
            return res.status(201).json(result)
                }
    catch (e)
    {return res.status(500).json(e)}
    
   
})

app.get('/api/users/:id', async (req,res) => {
    
    const user = await userModel.findById(req.params.id)

    return res.json(user)
})

app.put('/api/users/:id', async (req,res) => {
    
    const body = req.body

    try {
        const user = await userModel.findById(req.params.id)

        const userUpdated = {
            title: body.title || user.title,
            description: body.description || user.description,
            code: body.code || user.code,
            price: body.price || user.price,
            status: body.status || user.status,
            stock: body.stock || user.stock,
            category: body.category || user.category,
            thumbnail: body.thumbnail || user.thumbnail
        }

        const result = await userModel.updateOne(
            {_id: req.params.id} , userUpdated)
            return res.json(userUpdated)
                }
    catch (e)
    {return res.status(500).json(e)}
    
   
})

app.delete('/api/users/:id', async (req,res) => {
    
    const user = await userModel.deleteOne({_id: req.params.id})

    return res.json(user)
})


const express = require('express');
const mongoose = require('mongoose')
const app = express();


MONGODB_CONNECT= 'mongodb+srv://sofianavasg:Coder01!@cluster0.8ieczog.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODB_CONNECT)
.catch(err =>{
    if (err) {
        console.log('No se pudo conectar a la DB', err)
        process.exit()
    }
})

const handlebars = require ('express-handlebars')
const {Server} = require('socket.io')

const ProductModel = require('./Dao/Models/products.model')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('public'))

const productRouter = require('./routers/productRouter')
const cartRouter = require('./routers/cartRouter')


const PORT = 8080
const httpServer = app.listen (PORT, ()  => console.log (`Servidor iniciado en http://localhost:${PORT}`))

const io = new Server(httpServer);


app.use('/api/carts', cartRouter)

app.use('/api/products', (req, res, next) => {
    req.io = io; // Pass the io instance to the request object
    next();
  }, productRouter);

  
io.on ('connection', (socket) =>{
  console.log('Nuevo cliente conectado')

  socket.on('mi_mensaje', (data) =>{  //para recibir mensajes del lado del servidor
    console.log(data)
  })

  socket.emit('recibiendomensajebackend', 'primer mensaje enviado desde el backend')

})

  
  app.get('/healthcheck', (req,res) => {
      return res.json({
          status: 'running',
          date: new Date()
      })
  })


  app.get('/realtimeproducts', async (req,res) => {

try{
const products = await ProductModel.find({});
    
    // Convert ObjectId to string for each product
    const formattedProducts = products.map(product => ({
      ...product.toObject(), // Convert Mongoose object to plain object
       _id: product._id.toString()
    }));

    const params = {
      title: 'Productos',
      products: formattedProducts
    };

return res.render('realTimeProducts', params)

} catch (e) {
    console.error(e)
    
}     
})
const express = require('express');
const mongoose = require('mongoose')

const ProductModel = require('./Dao/Models/products.model')

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

app.get('/realtimeproducts', async (req, res) => {
    try {
        console.log('PC1'); // Punto de control
        const products = await ProductModel.find({});
        const params = {
            title: 'realtimeproducts',
            products: products,
        };
        console.log('PC2'); // Punto de control
        return res.render('realTimeProducts', params);
        
    } catch (error) {
        console.error('Error retrieving products:', error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


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



app.get('/healthcheck', (req,res) => {
    return res.json({
        status: 'running',
        date: new Date()
    })
})




// io.on('connection', (socket) => {
//     console.log('New client connected');
    
//     // Esta parte debe ser movida aquí para estar a la misma altura que el evento 'connection'
//     socket.on('getInitialProducts', async () => {
//         try {
//             const products = await ProductModel.find({});
//             socket.emit('initialProducts', { products });
//         } catch (error) {
//             console.error('Error retrieving initial products:', error);
//         }
//     });

//     socket.on('deleteProduct', async (productId) => {
//         try {
//             await ProductModel.findByIdAndDelete(productId);
//             const updatedProducts = await ProductModel.find({});
//             io.emit('nuevoProducto', updatedProducts);
//             console.log('Product deleted:', productId);
//         } catch (error) {
//             console.error('Error deleting product:', error);
//         }
//     });
// });


io.on('connection', (socket) => {
    console.log('New client connected - PC3');
    
    // Emitir los productos iniciales al cliente inmediatamente después de la conexión
    emitInitialProducts(socket);
    console.log(' PC4');

    socket.on('getInitialProducts', async () => {
        emitInitialProducts(socket); // Esto es para manejar el caso en el que el cliente se reconecta
        console.log(' PC5');
    });

    socket.on('nuevoProducto', (data) => {
        console.log('New product received:', data);
        updateProductTable(data);
      });

    socket.on('deleteProduct', async (productId) => {
        try {
            await ProductModel.findByIdAndDelete(productId);
            const updatedProducts = await ProductModel.find({});
            //io.emit('nuevoProducto', { products: updatedProducts });
            io.emit('deleteProduct', productId);
            console.log('Product deleted: PC1', productId);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });

    socket.on('addProduct', async (productData) => {
        try {
          const newProduct = await ProductModel.create(productData);
          const updatedProducts = await ProductModel.find({}); // Obtener la lista actualizada de productos
          io.emit('nuevoProducto', { products: updatedProducts }); // Emitir evento con la lista actualizada
          console.log('Product added:', newProduct);
        } catch (error) {
          console.error('Error adding product:', error);
        }
      });
      
    

    
});

// Función para emitir los productos iniciales al cliente
async function emitInitialProducts(socket) {
    try {
        const products = await ProductModel.find({});
        socket.emit('initialProducts', { products });
    } catch (error) {
        console.error('Error retrieving initial products:', error);
    }
}



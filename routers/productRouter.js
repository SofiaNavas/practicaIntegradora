const express = require('express');
const ProductModel = require('../Dao/Models/products.model');
const ProductManager = require('../Dao/ProductManager');
const Router = express.Router;

const app = express();
const productRouter = Router()
const productManager = new ProductManager('./prueba.json');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Obtener todos los productos
productRouter.get('/', async (req, res) => {
    try {
      const limit = req.query.limit; // Obtener el límite de resultados del query param
  
      // const products = productManager.getProducts(); //Esto es lo que se hace en FS
      const products = await ProductModel.find({}); // Usar el método find() de Mongoose para obtener todos los productos
      // Aplicar el límite si se especificó en el query param
      const limitedProducts = limit ? products.slice(0, limit) : products;
  
      res.json(limitedProducts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });
  
  // Endpoint dinamico para obtener un producto por su ID 
  productRouter.get('/:pid', async (req, res) => {
    const productId = req.params.pid; // Obtener el ID del producto como entero
   console.log('paso 1')
    try {
      const product = await ProductModel.findById(productId); // Usar el método findById() de Mongoose para buscar el producto por su ID
      console.log('paso 2')
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        console.log('paso 3-1')
      } else {
        res.json(product);
        console.log('paso 3-2')
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto' });
      console.log('paso 4')
    }
  });

//   // Agregar un nuevo producto
// productRouter.post('/', async (req, res) => {
//   try {
//     const productData = req.body;
//     const newProduct = await ProductModel.create(productData); // Usar el método create() de Mongoose para crear un nuevo producto
//     const updatedProducts = await ProductModel.find({}); // Obtener la lista actualizada de productos
//     req.io.emit('nuevoProducto', updatedProducts); // Emitir el evento de nuevo producto a través del socket.io
//     console.log('Product added:', newProduct);
    
//     res.status(201).json({ message: 'Product added successfully.', product: newProduct });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Agregar un nuevo producto
productRouter.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await ProductModel.create(productData); // Usar el método create() de Mongoose para crear un nuevo producto
    const updatedProducts = await ProductModel.find({}); // Obtener la lista actualizada de productos

    // Emitir el evento de nuevo producto y actualizar productos a través del socket.io
    req.io.emit('nuevoProducto', updatedProducts);
    console.log('Product added:', newProduct);
    
    res.status(201).json({ message: 'Product added successfully.', product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  // Actualizar un producto
productRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedFields = req.body;
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true } // La opción { new: true } devuelve el producto actualizado después de la actualización
    );

    if (!updatedProduct) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Product updated successfully.', product: updatedProduct });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
  


productRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (deletedProduct) {
      const updatedProducts = await ProductModel.find({});
      req.io.emit('deleteProduct', productId);
      req.io.emit('nuevoProducto', updatedProducts);
      console.log('Product deleted:', productId);
      res.json({ message: 'Product deleted successfully.', product: deletedProduct });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



  module.exports=productRouter
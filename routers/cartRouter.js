const fs = require('fs');
const express = require('express');
const CartManager = require('../Dao/fileSystem/CartManager');
const Router = express.Router;

const app = express();
const cartRouter = Router()
const cartManager = new CartManager('./cart.json');

app.use(express.json())
app.use(express.urlencoded({extended: true}))



// Obtener todos los carritos
cartRouter.get('/', async (req, res) => {
    try {
      const limit = req.query.limit; // Obtener el límite de resultados del query param
  
      const carts = cartManager.getProducts();
  
      // Aplicar el límite si se especificó en el query param
      const limitedCarts = limit ? products.slice(0, limit) : carts;
  
      res.json(limitedCarts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });
  
  // Endpoint dinamico para obtener un carrito por su ID 
  cartRouter.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid); // Obtener el ID del producto como entero
    try {
       
      const cart = cartManager.getProductById(cartId);
  
      res.json(cart);
    } catch (error) {
      if (error.message === 'ID not found') {
        res.status(404).json({ error: 'Carrito no encontrado' });
      } else {
        res.status(500).json({ error: 'Error al obtener el carrito' });
      }
    }
  });


// Crear un nuevo carrito
cartRouter.post('/', (req, res) => {
    try {
        const cartData = req.body;
      cartManager.addProduct(cartData);
      res.status(201).json({ message: 'Product added successfully.' });
      return res.send(productData)
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
    
  });


  // Actualizar un carrito
  cartRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;
  
    try {
      cartManager.updateProduct(cartId, productId, quantity);
      res.status(200).json({ message: 'Product updated successfully.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  


module.exports=cartRouter
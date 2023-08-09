document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  socket.on('connect', () => {
    console.log('Connected to server');
    console.log(' PC6');
    // Solicitar los datos iniciales de los productos al conectar
    socket.emit('getInitialProducts');
    console.log(' PC7');
  });

  socket.on('initialProducts', (data) => {
    console.log('Initial products received:', data);
    console.log(' PC8');
    renderProductTable(data.products);
    console.log(' PC9');
  });

  socket.on('nuevoProducto', (data) => {
    console.log('New product received:', data);
    renderProductTable(data.products);
    console.log(' PC10');
  });

  socket.on('deleteProduct', (productId) => {
    console.log('Product deleted:', productId);
    removeProductRow(productId);
    console.log(' PC11');
  });

  function renderProductTable(products) {
    const table = document.getElementById('productos');
    table.innerHTML = ''; // Limpia la tabla antes de renderizar los nuevos productos
  
    products.forEach((product) => {
      const row = createProductRow(product);
      table.appendChild(row);
    });
  }
  

  function createProductRow(product) {
    console.log(' PC15');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product._id}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.code}</td>
      <td>${product.price}</td>
      <td>${product.status}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td><button onclick="deleteProduct('${product._id}')">Delete</button></td>
    `;
    return row;
  }

  function removeProductRow(productId) {
    const deletedRow = document.querySelector(`tr[data-product-id="${productId}"]`);
    if (deletedRow) {
      deletedRow.remove();
    }
  }

  function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
  }
});

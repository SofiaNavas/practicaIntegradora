const socket = io()  // al cliente lo estamos mandando a conectar con el servdor websocket

console.log(socket)

socket.on('connect', () => {
    console.log('Connected to server'); 
  });


socket.on('nuevoProducto', (data) => {
  console.log('New product received:', data);
  updateProductTable(data); // Actualizar la tabla con la lista de productos completa
});

function updateProductTable(products) {
  const table = document.getElementById('productos');
  table.innerHTML = `<tr>
  <th>ID</th>
  <th>Title</th>
  <th>Description</th>
  <th>Code</th>
  <th>Price</th>
  <th>Status</th>
  <th>Stock</th>
  <th>Category</th>
</tr>`; // Limpiar la tabla antes de agregar los productos actualizados

  products.forEach((product) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.code}</td>
      <td>${product.price}</td>
      <td>${product.status}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
    `;

    table.appendChild(row);
  });
}


  
  socket.on('deleteProduct', (productId) => {
    console.log('Product deleted:', productId);
    updateProductTable(products.filter((product) => product.id !== productId)); // Actualizar la tabla sin el producto eliminado
});

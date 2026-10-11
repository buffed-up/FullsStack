const productosModel = require('../models/productosModel');

function validarPrecio(precio) {
  const n = Number(precio);
  if (!Number.isInteger(n) || n < 0) {
    const error = new Error('precio debe ser un número entero mayor o igual a 0');
    error.status = 400;
    throw error;
  }
  return n;
}

function validarStock(stock) {
  if (stock === undefined || stock === null || stock === '') return 0;
  const n = Number(stock);
  if (!Number.isInteger(n) || n < 0) {
    const error = new Error('stock debe ser un número entero mayor o igual a 0');
    error.status = 400;
    throw error;
  }
  return n;
}

async function listarTodos() {
  return await productosModel.findAll();
}

async function listarIndividuales() {
  return await productosModel.findIndividuales();
}

async function obtenerProducto(id) {
  return await productosModel.findById(id);
}

async function listarDestacados() {
  return await productosModel.findDestacados();
}

async function listarPorColeccion(nombre) {
  return await productosModel.findByColeccion(nombre);
}

async function crearProducto(datos) {
  if (!datos.titulo) {
    const error = new Error('titulo es obligatorio');
    error.status = 400;
    throw error;
  }
  const precio = validarPrecio(datos.precio);
  const stock = validarStock(datos.stock);
  return await productosModel.insert({
    titulo: datos.titulo,
    precio,
    img: datos.img || null,
    descripcion: datos.descripcion || null,
    categoria_id: datos.categoria_id || null,
    coleccion: datos.coleccion || null,
    stock
  });
}

async function actualizarProducto(id, datos) {
  const precio = validarPrecio(datos.precio);
  const stock = validarStock(datos.stock);
  return await productosModel.update(id, {
    titulo: datos.titulo,
    precio,
    img: datos.img || null,
    descripcion: datos.descripcion || null,
    categoria_id: datos.categoria_id || null,
    coleccion: datos.coleccion || null,
    stock
  });
}

async function eliminarProducto(id) {
  return await productosModel.remove(id);
}

module.exports = {
  listarTodos,
  listarIndividuales,
  obtenerProducto,
  listarDestacados,
  listarPorColeccion,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
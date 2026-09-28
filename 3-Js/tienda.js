const productos = [
  {
    nombre: "Cabezal Sparring",
    description: "Cabezal de Sparring.",
    categoria: "Protectores",
    marca: "Gran Marc",
    talle: ["1", "2", "3"],
    precio: 35000,
    web: "https://www.granmarctiendaonline.com.ar/productos/cabezal-cerrado/",
    imagen: "cabezal-cerrado.webp",
  },
  {
    nombre: "Dobok Dan",
    description: "Dobok aprobado para torneos internacionales.",
    categoria: "Dobok",
    marca: "Daedo",
    talle: ["1", "2", "3", "4", "5", "6", "7", "8"],
    precio: 115000,
    web: "https://www.daedo.com/products/taitf-10813",
    imagen: "dobok.webp",
  },
  {
    nombre: "Escudo de Potencia",
    description: "Escudo de potencia para entrenamientos.",
    categoria: "Entrenamiento",
    marca: "Gran Marc",
    talle: ["s/talle"],
    precio: 51700,
    web: "https://www.granmarctiendaonline.com.ar/productos/escudo-de-potencia-grande/",
    imagen: "escudo-potencia.webp",
  },
  {
    nombre: "Par de focos redondos",
    description: "Par de focos de 25cm x 25cm para hacer entrenamiento.",
    categoria: "Entrenamiento",
    marca: "Gran Marc",
    talle: ["s/talle"],
    precio: 15000,
    web: "https://www.granmarctiendaonline.com.ar/productos/foco-con-dedos/",
    imagen: "foco-con-dedos.webp",
  },
  {
    nombre: "Guantes 10 onzas",
    description:
      "Guantes de Sparring de 10 onzas habilitados para torneos internacionales",
    categoria: "Protectores",
    marca: "Daedo",
    talle: ["s/talle"],
    precio: 35000,
    web: "https://www.daedo.com/products/pritf-2020",
    imagen: "protectores-manos.webp",
  },
  {
    nombre: "Protectores Pie",
    description: "Protectores de Pie habilitados para torneos internacionales",
    categoria: "Protectores",
    marca: "Daedo",
    talle: ["XXS", "XS", "S", "M", "L", "XL"],
    precio: 35000,
    web: "https://www.daedo.com/collections/collection-itf-gloves/products/pritf-2022",
    imagen: "protectores-pie.webp",
  },
];

const URL_IMAGENES = "https://ucc-tallerdesarrolloweb.github.io/filminas/images/ejercicios/";

/**
 * Devuelve el precio con formato $3.123,45
 * @method formatearPrecio
 * @param {number} precio - Precio a formatear
 * @return {string} Precio formateado
 */
let formatearPrecio = (precio) => {
  const formato = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return "$" + formato.format(precio);
};

/**
 * Obtiene el carrito guardado en el localStorage
 * @method obtenerCarrito
 * @return {Array} Array de productos del carrito ({nombre, precio, imagen, cantidad})
 */
let obtenerCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];

/**
 * Guarda el carrito en el localStorage y actualiza el contador
 * @method guardarCarrito
 * @param {Array} carrito - Array de productos del carrito
 */
let guardarCarrito = (carrito) => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
};

/**
 * Muestra al lado del botón del carrito la cantidad de productos agregados
 * @method actualizarContador
 */
let actualizarContador = () => {
  let cantidad = 0;
  obtenerCarrito().forEach((item) => (cantidad += item.cantidad));
  document.getElementById("contador").innerHTML = cantidad;
};

/* ---------- CATÁLOGO (productos.html) ---------- */

/**
 * Crea una tarjeta por cada producto recibido
 * @method mostrarProductos
 * @param {Array} lista - Productos a mostrar
 */
let mostrarProductos = (lista) => {
  let tarjetas = "";

  lista.forEach((producto) => {
    const indice = productos.indexOf(producto);
    tarjetas += `
      <div class="tarjeta">
        <img src="${URL_IMAGENES + producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="precio">${formatearPrecio(producto.precio)}</p>
        <button class="btn-tarjeta" onclick="verDetalle(${indice})">Ver detalle de Producto</button>
        <button class="btn-tarjeta" onclick="agregarAlCarrito(${indice})">Agregar al carrito</button>
      </div>`;
  });

  if (lista.length === 0) {
    tarjetas = "<p>No se encontraron productos.</p>";
  }

  document.getElementById("catalogo").innerHTML = tarjetas;
};

/**
 * Se ejecuta al cargar productos.html
 * @method cargarCatalogo
 */
let cargarCatalogo = () => {
  mostrarProductos(productos);
  actualizarContador();
};

/**
 * Carga el dialog con los datos del producto seleccionado y lo muestra
 * @method verDetalle
 * @param {number} indice - Posición del producto en el array productos
 */
let verDetalle = (indice) => {
  const producto = productos[indice];

  document.getElementById("detalleContenido").innerHTML = `
    <h2>${producto.nombre}</h2>
    <img src="${URL_IMAGENES + producto.imagen}" alt="${producto.nombre}">
    <p>${producto.description}</p>
    <p><strong>Categoría:</strong> ${producto.categoria}</p>
    <p><strong>Marca:</strong> ${producto.marca}</p>
    <p><strong>Talles:</strong> ${producto.talle.join(", ")}</p>
    <p class="precio">${formatearPrecio(producto.precio)}</p>
    <p><a href="${producto.web}" target="_blank">Ver en la web del fabricante</a></p>`;

  document.getElementById("detalle").showModal();
};

/**
 * Cierra el dialog de detalle
 * @method cerrarDetalle
 */
let cerrarDetalle = () => {
  document.getElementById("detalle").close();
};

/**
 * Agrega un producto al carrito. Si ya estaba, suma 1 a la cantidad
 * @method agregarAlCarrito
 * @param {number} indice - Posición del producto en el array productos
 */
let agregarAlCarrito = (indice) => {
  const producto = productos[indice];
  const carrito = obtenerCarrito();
  const itemExistente = carrito.find((item) => item.nombre === producto.nombre);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
    });
  }

  guardarCarrito(carrito);
};

/**
 * Filtra por palabra, rango de precio, marca y categoría, y ordena según el select
 * @method filtrarProductos
 * @param {Event} evento - Evento submit del formulario (se cancela para no recargar la página)
 */
let filtrarProductos = (evento) => {
  if (evento) {
    evento.preventDefault();
  }

  const palabra = document.getElementById("buscar").value.toLowerCase();
  const minimo = document.getElementById("minimo").value;
  const maximo = document.getElementById("maximo").value;
  const marca = document.getElementById("marca").value;
  const categorias = [];
  document.querySelectorAll("input[name='categoria']:checked").forEach((check) => categorias.push(check.value));

  let resultado = productos.filter(
    (producto) =>
      (producto.nombre.toLowerCase().includes(palabra) ||
        producto.description.toLowerCase().includes(palabra)) &&
      (minimo === "" || producto.precio >= Number(minimo)) &&
      (maximo === "" || producto.precio <= Number(maximo)) &&
      (marca === "" || producto.marca === marca) &&
      (categorias.length === 0 || categorias.includes(producto.categoria))
  );

  resultado = ordenarProductos(resultado, document.getElementById("orden").value);
  mostrarProductos(resultado);
};

/**
 * Ordena una copia del array de productos
 * @method ordenarProductos
 * @param {Array} lista - Productos a ordenar
 * @param {string} criterio - "precio-asc", "precio-desc", "nombre-asc", "nombre-desc" o "" (sin orden)
 * @return {Array} Nuevo array ordenado
 */
let ordenarProductos = (lista, criterio) => {
  const copia = [...lista];

  switch (criterio) {
    case "precio-asc":
      copia.sort((a, b) => a.precio - b.precio);
      break;
    case "precio-desc":
      copia.sort((a, b) => b.precio - a.precio);
      break;
    case "nombre-asc":
      copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case "nombre-desc":
      copia.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    default:
      break;
  }

  return copia;
};

/**
 * Al limpiar el formulario vuelve a mostrar todos los productos
 * @method limpiarFiltros
 */
let limpiarFiltros = () => {
  // el reset limpia los campos después de este evento, por eso se espera un instante
  setTimeout(() => filtrarProductos(), 0);
};

/* ---------- CARRITO (carrito.html) ---------- */

/**
 * Muestra el listado de productos del carrito, sus cantidades y el total a pagar
 * @method mostrarCarrito
 */
let mostrarCarrito = () => {
  const carrito = obtenerCarrito();
  let filas = "";
  let total = 0;

  carrito.forEach((item, indice) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    filas += `
      <div class="item-carrito">
        <img src="${URL_IMAGENES + item.imagen}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
        <p>${formatearPrecio(item.precio)} x ${item.cantidad}</p>
        <p class="precio">${formatearPrecio(subtotal)}</p>
        <button class="btn-tarjeta" onclick="eliminarProducto(${indice})">Eliminar el producto</button>
      </div>`;
  });

  if (carrito.length === 0) {
    filas = "<p>El carrito está vacío.</p>";
  }

  document.getElementById("listaCarrito").innerHTML = filas;
  document.getElementById("total").innerHTML = formatearPrecio(total);
  actualizarContador();
};

/**
 * Elimina un producto del carrito
 * @method eliminarProducto
 * @param {number} indice - Posición del producto en el carrito
 */
let eliminarProducto = (indice) => {
  const carrito = obtenerCarrito();
  carrito.splice(indice, 1);
  guardarCarrito(carrito);
  mostrarCarrito();
};

/**
 * Vacía el carrito completo
 * @method vaciarCarrito
 */
let vaciarCarrito = () => {
  localStorage.removeItem("carrito");
  mostrarCarrito();
};

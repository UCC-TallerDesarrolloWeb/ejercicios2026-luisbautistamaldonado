"use strict";

/* ==========================================================
   HELADERÍA — Ejercicio de JavaScript

   Completá cada "TODO" en orden (están numerados del 1 al 10).
   Lo que NO tiene TODO ya viene hecho: leelo para entender cómo
   se conecta todo, pero no hace falta que lo cambies.

   Vas a practicar: arrays, funciones flecha, .map, .filter,
   .find, .reduce, .sort, .some, .every, .flatMap, spread,
   destructuring, template literals y async/await.
   ========================================================== */

const RUTA_DB = "data/db.json";

/* ---------- Estado de la app (YA HECHO) ----------
   sabor  = { id, nombre, categoria, precio, stock, vegano, sinTacc, color, descripcion }
   carrito = [ { id, cantidad } ]            <- guarda solo el id y la cantidad
   pedido = { id, cliente, fecha, items: [ { saborId, cantidad } ] }
*/
const estado = {
  heladeria: null,
  sabores: [],
  pedidos: [],
  promociones: [],
  carrito: [],
  filtros: { texto: "", categoria: "todas", vegano: false, sinTacc: false, orden: "nombre" },
};

/* ---------- Referencias al DOM (YA HECHO) ---------- */
const $ = (selector) => document.querySelector(selector);

const els = {
  nombre: $("#nombre-heladeria"),
  eslogan: $("#eslogan"),
  formFiltros: $("#filtros"),
  buscador: $("#buscador"),
  categoria: $("#filtro-categoria"),
  vegano: $("#filtro-vegano"),
  sinTacc: $("#filtro-sin-tacc"),
  orden: $("#orden"),
  contador: $("#contador-resultados"),
  lista: $("#lista-sabores"),
  carrito: $("#carrito-items"),
  subtotal: $("#subtotal"),
  descuento: $("#descuento"),
  total: $("#total"),
  btnFinalizar: $("#btn-finalizar"),
  btnVaciar: $("#btn-vaciar"),
  mensaje: $("#mensaje-pedido"),
  estadisticas: $("#estadisticas"),
};

/* ---------- Utilidades (YA HECHAS) ---------- */
const formatearPrecio = (numero) =>
  numero.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const mostrarMensaje = (texto) => {
  els.mensaje.textContent = texto;
};

/* Busca un sabor por id (la uso en varios TODO) */
const buscarSabor = (id) => estado.sabores.find((sabor) => sabor.id === id);

/* ==========================================================
   TODO 1 — Cargar los datos (fetch + async/await)
   ========================================================== */
const cargarDatos = async () => {
  const respuesta = await fetch(RUTA_DB);

  if (!respuesta.ok) {
    throw new Error(`No se pudo leer ${RUTA_DB} (estado ${respuesta.status})`);
  }

  const { heladeria, sabores, pedidos, promociones } = await respuesta.json();

  estado.heladeria = heladeria;
  estado.sabores = sabores;
  estado.pedidos = pedidos;
  estado.promociones = promociones;
};

/* ==========================================================
   TODO 2 — Encabezado y categorías
   ========================================================== */
const renderEncabezado = () => {
  const { nombre, eslogan } = estado.heladeria;
  els.nombre.textContent = nombre;
  els.eslogan.textContent = eslogan;
};

const obtenerCategorias = () => {
  return [...new Set(estado.sabores.map((sabor) => sabor.categoria))];
};

const renderCategorias = () => {
  const opciones = obtenerCategorias()
    .map((categoria) => `<option value="${categoria}">${categoria}</option>`)
    .join("");

  // += para no borrar la opción "todas"
  els.categoria.innerHTML += opciones;
};

/* ==========================================================
   TODO 3 — Filtrar y ordenar (.filter, .includes, .sort)
   ========================================================== */
const filtrarSabores = () => {
  const { texto, categoria, vegano, sinTacc, orden } = estado.filtros;
  const busqueda = texto.trim().toLowerCase();

  const comparadores = {
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    "precio-asc": (a, b) => a.precio - b.precio,
    "precio-desc": (a, b) => b.precio - a.precio,
    stock: (a, b) => b.stock - a.stock,
  };

  const filtrados = estado.sabores
    .filter((sabor) => sabor.nombre.toLowerCase().includes(busqueda))
    .filter((sabor) => categoria === "todas" || sabor.categoria === categoria)
    .filter((sabor) => !vegano || sabor.vegano)
    .filter((sabor) => !sinTacc || sabor.sinTacc);

  // ordeno una copia para no mutar el array
  return [...filtrados].sort(comparadores[orden] ?? comparadores.nombre);
};

/* ==========================================================
   TODO 4 — Dibujar el catálogo (.map + template literals)
   ========================================================== */
const cantidadEnCarrito = (id) => {
  return estado.carrito.find((item) => item.id === id)?.cantidad ?? 0;
};

const tarjetaSabor = (sabor) => {
  const disponible = sabor.stock - cantidadEnCarrito(sabor.id);
  const agotado = disponible <= 0;

  const etiquetas = [sabor.vegano && "Vegano", sabor.sinTacc && "Sin TACC"]
    .filter(Boolean)
    .map((etiqueta) => `<li>${etiqueta}</li>`)
    .join("");

  return `
    <article class="sabor ${agotado ? "sabor--agotado" : ""}">
      <div class="sabor__bola" style="--color: ${sabor.color}" aria-hidden="true"></div>
      <h3>${sabor.nombre}</h3>
      <p class="sabor__desc">${sabor.descripcion}</p>
      <ul class="etiquetas">${etiquetas}</ul>
      <div class="sabor__pie">
        <strong>${formatearPrecio(sabor.precio)}</strong>
        <button class="btn" data-accion="agregar" data-id="${sabor.id}" ${agotado ? "disabled" : ""}>
          ${agotado ? "Sin stock" : "Agregar"}
        </button>
      </div>
      <small class="sabor__stock">Quedan ${disponible}</small>
    </article>`;
};

const renderCatalogo = () => {
  const sabores = filtrarSabores();
  const cantidad = sabores.length;

  els.contador.textContent = `${cantidad} ${cantidad === 1 ? "sabor" : "sabores"}`;

  els.lista.innerHTML =
    cantidad > 0
      ? sabores.map(tarjetaSabor).join("")
      : `<p class="vacio">No hay sabores con esos filtros. Probá sacar alguno.</p>`;
};

/* ==========================================================
   TODO 5 — Operaciones del carrito (.find, .filter, push)
   ========================================================== */
const agregarAlCarrito = (id) => {
  const sabor = buscarSabor(id);
  if (!sabor) return;

  if (cantidadEnCarrito(id) >= sabor.stock) {
    mostrarMensaje(`No queda más stock de ${sabor.nombre}.`);
    return;
  }

  const item = estado.carrito.find((item) => item.id === id);

  if (item) {
    item.cantidad += 1;
  } else {
    estado.carrito.push({ id, cantidad: 1 });
  }

  mostrarMensaje("");
  actualizarVista();
};

const cambiarCantidad = (id, delta) => {
  const item = estado.carrito.find((item) => item.id === id);
  if (!item) return;

  const sabor = buscarSabor(id);
  const nuevaCantidad = item.cantidad + delta;

  if (nuevaCantidad <= 0) {
    quitarDelCarrito(id);
    return;
  }

  if (nuevaCantidad > sabor.stock) {
    mostrarMensaje(`Solo hay ${sabor.stock} bolas de ${sabor.nombre}.`);
    return;
  }

  item.cantidad = nuevaCantidad;
  mostrarMensaje("");
  actualizarVista();
};

const quitarDelCarrito = (id) => {
  estado.carrito = estado.carrito.filter((item) => item.id !== id);
  actualizarVista();
};

const vaciarCarrito = () => {
  estado.carrito = [];
  actualizarVista();
};

/* ==========================================================
   TODO 6 — Totales (.map con spread + .reduce)
   ========================================================== */
const detalleCarrito = () => {
  return estado.carrito.map(({ id, cantidad }) => {
    const sabor = buscarSabor(id);
    return { ...sabor, cantidad, subtotal: sabor.precio * cantidad };
  });
};

const calcularTotales = () => {
  const items = detalleCarrito();

  const subtotal = items.reduce((acumulado, item) => acumulado + item.subtotal, 0);
  const bolas = items.reduce((acumulado, item) => acumulado + item.cantidad, 0);

  // .filter devuelve un array nuevo, así que el .sort no toca estado.promociones
  const promo =
    estado.promociones
      .filter((promocion) => promocion.minimoBolas <= bolas)
      .sort((a, b) => b.porcentaje - a.porcentaje)[0] ?? null;

  const descuento = promo ? Math.round((subtotal * promo.porcentaje) / 100) : 0;

  return { subtotal, bolas, promo, descuento, total: subtotal - descuento };
};

/* ==========================================================
   TODO 7 — Dibujar el carrito
   ========================================================== */
const renderCarrito = () => {
  const items = detalleCarrito();
  const totales = calcularTotales();
  const vacio = items.length === 0;

  els.carrito.innerHTML = vacio
    ? `<li class="vacio">Todavía no elegiste sabores.</li>`
    : items
        .map(
          ({ id, nombre, precio, cantidad, subtotal }) => `
      <li class="item">
        <div class="item__info">
          <strong>${nombre}</strong>
          <span>${formatearPrecio(precio)} c/u</span>
        </div>
        <div class="item__controles">
          <button type="button" data-accion="restar" data-id="${id}" aria-label="Restar uno">−</button>
          <span>${cantidad}</span>
          <button type="button" data-accion="sumar" data-id="${id}" aria-label="Sumar uno">+</button>
          <button type="button" data-accion="quitar" data-id="${id}" aria-label="Quitar ${nombre}">✕</button>
        </div>
        <span class="item__subtotal">${formatearPrecio(subtotal)}</span>
      </li>`
        )
        .join("");

  els.subtotal.textContent = formatearPrecio(totales.subtotal);
  els.descuento.textContent = totales.promo
    ? `− ${formatearPrecio(totales.descuento)} (${totales.promo.porcentaje}%)`
    : formatearPrecio(0);
  els.total.textContent = formatearPrecio(totales.total);

  els.btnFinalizar.disabled = vacio;
  els.btnVaciar.disabled = vacio;
};

/* ---------- Refresca todo lo visual que depende del carrito (YA HECHO) ---------- */
const actualizarVista = () => {
  renderCatalogo();
  renderCarrito();
};

/* ==========================================================
   TODO 8 — Confirmar el pedido
   ========================================================== */
const finalizarPedido = () => {
  if (estado.carrito.length === 0) return;

  // guardo el resumen y el total ANTES de vaciar el carrito
  const resumen = detalleCarrito()
    .map(({ nombre, cantidad }) => `${cantidad} × ${nombre}`)
    .join(", ");
  const { total } = calcularTotales();

  estado.sabores = estado.sabores.map((sabor) => {
    const cantidad = cantidadEnCarrito(sabor.id);
    return cantidad > 0 ? { ...sabor, stock: sabor.stock - cantidad } : sabor;
  });

  const siguienteId = estado.pedidos.reduce((maximo, pedido) => Math.max(maximo, pedido.id), 0) + 1;

  estado.pedidos.push({
    id: siguienteId,
    cliente: "Mostrador",
    fecha: new Date().toISOString().slice(0, 10),
    items: estado.carrito.map(({ id, cantidad }) => ({ saborId: id, cantidad })),
  });

  estado.carrito = [];
  mostrarMensaje(`Pedido confirmado: ${resumen}. Total ${formatearPrecio(total)}.`);
  actualizarVista();
  renderEstadisticas();
};

/* ==========================================================
   TODO 9 — Estadísticas (reduce, flatMap, some, every...)
   ========================================================== */
// 9a
const precioPromedio = () => {
  if (estado.sabores.length === 0) return 0;
  return estado.sabores.reduce((acumulado, sabor) => acumulado + sabor.precio, 0) / estado.sabores.length;
};

// 9b
const saborMasCaro = () =>
  estado.sabores.reduce((masCaro, sabor) => (sabor.precio > masCaro.precio ? sabor : masCaro), {
    nombre: "-",
    precio: 0,
  });

// 9c
const saboresPorCategoria = () =>
  estado.sabores.reduce((conteo, sabor) => {
    conteo[sabor.categoria] = (conteo[sabor.categoria] ?? 0) + 1;
    return conteo;
  }, {});

// 9d
const nombresSinStock = () =>
  estado.sabores
    .filter((sabor) => sabor.stock <= 0)
    .map((sabor) => sabor.nombre)
    .join(", ");

// 9e
const todosLosFrutalesSonVeganos = () =>
  estado.sabores.filter((sabor) => sabor.categoria === "Frutales").every((sabor) => sabor.vegano);

// 9f
const ingresosPedidos = () =>
  estado.pedidos
    .flatMap((pedido) => pedido.items)
    .reduce((acumulado, { saborId, cantidad }) => {
      const precio = buscarSabor(saborId)?.precio ?? 0;
      return acumulado + precio * cantidad;
    }, 0);

// 9g
const rankingPedidos = () => {
  const cantidades = estado.pedidos
    .flatMap((pedido) => pedido.items)
    .reduce((conteo, { saborId, cantidad }) => {
      conteo[saborId] = (conteo[saborId] ?? 0) + cantidad;
      return conteo;
    }, {});

  return Object.entries(cantidades)
    .map(([saborId, cantidad]) => ({
      nombre: buscarSabor(Number(saborId))?.nombre ?? "-",
      cantidad,
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 3);
};

const tarjetaStat = (titulo, valor) => `
  <article class="stat">
    <h3>${titulo}</h3>
    <p>${valor}</p>
  </article>`;

/* ==========================================================
   TODO 10 — Dibujar las estadísticas
   ========================================================== */
const renderEstadisticas = () => {
  const masCaro = saborMasCaro();

  const porCategoria = Object.entries(saboresPorCategoria())
    .map(([categoria, cantidad]) => `${categoria}: ${cantidad}`)
    .join("<br>");

  const masPedidos = rankingPedidos()
    .map(({ nombre, cantidad }, indice) => `${indice + 1}. ${nombre} (${cantidad})`)
    .join("<br>");

  const stats = [
    ["Sabores en carta", estado.sabores.length],
    ["Precio promedio por bola", formatearPrecio(precioPromedio())],
    ["Sabor más caro", `${masCaro.nombre} (${formatearPrecio(masCaro.precio)})`],
    ["Sabores por categoría", porCategoria],
    ["Los más pedidos", masPedidos || "Todavía no hay pedidos"],
    ["Sin stock", nombresSinStock() || "Ninguno"],
    ["Ingresos de los pedidos cargados", formatearPrecio(ingresosPedidos())],
    ["¿Todos los frutales son veganos?", todosLosFrutalesSonVeganos() ? "Sí" : "No"],
  ];

  els.estadisticas.innerHTML = stats.map(([titulo, valor]) => tarjetaStat(titulo, valor)).join("");
};

/* ---------- Eventos (YA HECHO) ----------
   Fijate cómo usamos "delegación de eventos": un solo listener en document
   y los botones dicen qué hacer con data-accion y data-id. */
const registrarEventos = () => {
  els.formFiltros.addEventListener("submit", (e) => e.preventDefault());

  els.buscador.addEventListener("input", (e) => {
    estado.filtros.texto = e.target.value;
    renderCatalogo();
  });
  els.categoria.addEventListener("change", (e) => {
    estado.filtros.categoria = e.target.value;
    renderCatalogo();
  });
  els.vegano.addEventListener("change", (e) => {
    estado.filtros.vegano = e.target.checked;
    renderCatalogo();
  });
  els.sinTacc.addEventListener("change", (e) => {
    estado.filtros.sinTacc = e.target.checked;
    renderCatalogo();
  });
  els.orden.addEventListener("change", (e) => {
    estado.filtros.orden = e.target.value;
    renderCatalogo();
  });

  const acciones = {
    agregar: (id) => agregarAlCarrito(id),
    sumar: (id) => cambiarCantidad(id, 1),
    restar: (id) => cambiarCantidad(id, -1),
    quitar: (id) => quitarDelCarrito(id),
  };

  document.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-accion]");
    if (!boton) return;
    acciones[boton.dataset.accion]?.(Number(boton.dataset.id));
  });

  els.btnVaciar.addEventListener("click", vaciarCarrito);
  els.btnFinalizar.addEventListener("click", finalizarPedido);
};

/* ---------- Arranque (YA HECHO) ---------- */
const init = async () => {
  try {
    await cargarDatos();
    renderEncabezado();
    renderCategorias();
    registrarEventos();
    actualizarVista();
    renderEstadisticas();
  } catch (error) {
    els.lista.innerHTML = `
      <p class="vacio">No pudimos cargar la carta. ¿Abriste la página con un servidor local
      (y no con doble clic en el archivo)? Detalle: ${error.message}</p>`;
    console.error(error);
  }
};

init();
/**
 * Redondea un número a 2 decimales.
 * @method redondear
 * @param {number} num - Número a redondear
 * @return {number} Número redondeado a 2 decimales
 */
let redondear = (num) => Math.round(num * 100) / 100;

/**
 * Convierte el valor ingresado en una unidad (metro, pulgada, pie o yarda) a las demás unidades
 * y muestra los resultados con 2 decimales en los inputs correspondientes.
 * @method cambiarUnidades
 * @param {string} id - Id del input que cambió: "metro", "pulgada", "pie" o "yarda"
 * @param {string} valor - Valor ingresado por el usuario en ese input
 * @return {void} No retorna valor, asigna los resultados en los inputs del formulario
 */
let cambiarUnidades = (id, valor) => {
    let metro = "", pulgada = "", pie = "", yarda = "";

    valor = valor.replace(",", ".");

    if (valor === "") {
        // campo vacío: se limpian todos los campos
    } else if (isNaN(valor)) {
        alert("Se ingresó un valor inválido en " + id);
    } else if (id === "metro") {
        metro = valor;
        pulgada = redondear(valor * 39.3701);
        pie = redondear(valor * 3.28084);
        yarda = redondear(valor * 1.09361);
    } else if (id === "pulgada") {
        pulgada = valor;
        metro = redondear(valor * 0.0254);
        pie = redondear(valor * 0.08333);
        yarda = redondear(valor * 0.027778);
    } else if (id === "pie") {
        pie = valor;
        metro = redondear(valor * 0.3048);
        pulgada = redondear(valor * 12);
        yarda = redondear(valor * 0.333333);
    } else if (id === "yarda") {
        yarda = valor;
        metro = redondear(valor * 0.9144);
        pulgada = redondear(valor * 36);
        pie = redondear(valor * 3);
    }

    document.getElementById("metro").value = metro;
    document.getElementById("pulgada").value = pulgada;
    document.getElementById("pie").value = pie;
    document.getElementById("yarda").value = yarda;
}

/**
 * Convierte entre grados y radianes usando Math.PI y muestra el resultado en el otro input.
 * @method convertirGR
 * @param {string} id - Id del input que cambió: "grados" o "radianes"
 * @param {string} valor - Valor ingresado por el usuario en ese input
 * @return {void} No retorna valor, asigna el resultado en el input opuesto
 */
let convertirGR = (id, valor) => {
    let grados = "", radianes = "";

    valor = valor.replace(",", ".");

    if (valor === "") {
        // campo vacío: se limpian ambos campos
    } else if (isNaN(valor)) {
        alert("Se ingresó un valor inválido en " + id);
    } else if (id === "grados") {
        grados = valor;
        radianes = valor * Math.PI / 180;
    } else if (id === "radianes") {
        radianes = valor;
        grados = valor * 180 / Math.PI;
    }

    document.getElementById("grados").value = grados;
    document.getElementById("radianes").value = radianes;
}

/**
 * Muestra u oculta el div según el radio button seleccionado.
 * @method mostrarOcultar
 * @param {string} valor - Value del radio seleccionado: "val_mostrar" o "val_ocultar"
 * @return {void} No retorna valor, cambia el estilo display del div
 */
let mostrarOcultar = (valor) => {
    if (valor === "val_mostrar") {
        document.getElementById("unDiv").style.display = "block";
    } else if (valor === "val_ocultar") {
        document.getElementById("unDiv").style.display = "none";
    }
}

/**
 * Resuelve una operación matemática cuando ambos inputs tienen un valor numérico
 * y muestra el resultado en un span mediante innerHTML.
 * @method calcular
 * @param {string} operacion - Operación a realizar: "+", "-", "x" o "/"
 * @param {string} idNum1 - Id del input del primer número
 * @param {string} idNum2 - Id del input del segundo número
 * @param {string} idResultado - Id del span donde se muestra el resultado
 * @return {void} No retorna valor, asigna el resultado en el span
 */
let calcular = (operacion, idNum1, idNum2, idResultado) => {
    const valor1 = document.getElementById(idNum1).value.replace(",", ".");
    const valor2 = document.getElementById(idNum2).value.replace(",", ".");
    const num1 = Number(valor1);
    const num2 = Number(valor2);
    let resultado = "";

    if (valor1 === "" || valor2 === "") {
        // falta un valor: no se muestra resultado
    } else if (isNaN(num1) || isNaN(num2)) {
        resultado = "Valor inválido";
    } else {
        switch (operacion) {
            case "+":
                resultado = num1 + num2;
                break;
            case "-":
                resultado = num1 - num2;
                break;
            case "x":
                resultado = num1 * num2;
                break;
            case "/":
                resultado = num2 === 0 ? "No se puede dividir por 0" : redondear(num1 / num2);
                break;
            default:
                resultado = "Operación desconocida";
        }
    }

    document.getElementById(idResultado).innerHTML = resultado;
}

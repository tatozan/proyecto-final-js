
/********************************************************************************************************/
//Se ejecuta al tocar el boton CALCULAR, es el evento principal del proyecto
form.addEventListener("submit", (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();

    if (modoSeleccion === true) {
        modoSeleccion = false;
        seleccionarOperacion("deseleccionar");
        visibilidadBotones(botonEliminarOperacion, botonDeseleccionarOperacion, botonSeleccionarOperacion, "hidden", "hidden", "hidden");
    }

    let uuid, tipoOperacion, par, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas;

    let dataForm = new FormData(event.target);

    tipoOperacion = dataForm.get("operacion");
    par = dataForm.get("parName");
    distanciaPorcentajeRecompraReventa = parseFloat(dataForm.get("distanciaPorcentajeRecompraReventaName"));
    aumentoPorcentajeRecompraReventa = parseFloat(dataForm.get("aumentoPorcentajeRecompraReventaName"));
    sl = parseFloat(dataForm.get("slName"));
    precioMoneda = parseFloat(dataForm.get("precioMonedaName"));
    cantidadMonedas = parseFloat(dataForm.get("cantidadMonedasName"));

    if ((distanciaPorcentajeRecompraReventa && aumentoPorcentajeRecompraReventa && sl && precioMoneda && cantidadMonedas) > 0) {

        const operacionesIniciales = comprobarLocalStorage("operacionesIniciales");

        //contiene las operaciones, de recompra o reventa, incluida compra/venta incial
        const operaciones = [];
        //contiene todas las operaciones promediadas
        const operacionesProm = [];

        //devuelve fecha y hora de la forma por ejemplo 7/2/2021, 2:05:07 PM. Se utiliza para la hora de cada operacion
        const date = new Date().toLocaleString();

        const divDatosCompraInicial = document.getElementById("divDatosCompraInicial");
        divDatosCompraInicial.innerHTML = "";

        const gridOperaciones = document.getElementById("gridOperaciones");
        gridOperaciones.innerHTML = "";

        //genero un id unico
        uuid = self.crypto.randomUUID();

        //creo el objeto inicial, con los datos que me ingresaron en el html
        const operacion0 = new Operacion(uuid, 0, tipoOperacion, par, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas, date);
        operaciones.push(operacion0);
        operaciones[0].calcularMontoInvertido(precioMoneda, cantidadMonedas);

        let precioMonedaEnSl = 0;
        let porcentajeDistanciaSl = 0;
        let i = 0;
        let pnl = 0;

        if (operaciones[0].tipoOperacion === "short" || operaciones[0].tipoOperacion === "long") {

            do {
                i += 1;

                //creo una variable nroOperacion y nroOperacionAnterior para que sea mas legible
                let nroOperacion = i;
                let nroOperacionAnterior = i - 1;
                let nroOperacionProm = i;

                //datos Recompras
                let precioMoneda = calcularPrecioMoneda(operaciones[nroOperacionAnterior].precioMoneda, operaciones[nroOperacionAnterior].distanciaPorcentajeRecompraReventa, operaciones[0].tipoOperacion);
                let cantidadMonedas = calcularCantidadMonedas(operaciones[nroOperacionAnterior].cantidadMonedas, operaciones[nroOperacionAnterior].aumentoPorcentajeRecompraReventa);
                let inversion = calcularInversion(precioMoneda, cantidadMonedas);

                //Datos operaciones Promediadas
                let cantidadMonedasProm;
                let precioMonedaProm;
                let inversionProm;

                if (i === 1) {
                    pnl = calcularPnL(operaciones[0].cantidadMonedas, operaciones[nroOperacionAnterior].precioMoneda, precioMoneda, operaciones[0].tipoOperacion);
                } else {
                    nroOperacionProm = nroOperacionAnterior - 1;
                    pnl = calcularPnL(operacionesProm[nroOperacionProm].cantidadMonedas, operacionesProm[nroOperacionProm].precioMoneda, precioMoneda, operaciones[0].tipoOperacion);
                }

                if (pnl <= operaciones[0].sl) {

                    uuid = self.crypto.randomUUID();

                    const operacion = new Operacion(uuid, nroOperacion, operaciones[0].tipoOperacion, par, operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMoneda, cantidadMonedas, date, inversion);
                    operaciones.push(operacion);

                    if (i === 1) {
                        precioMonedaProm = (operaciones[nroOperacionAnterior].montoInvertido + operaciones[nroOperacion].montoInvertido) / (operaciones[nroOperacionAnterior].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas);
                        cantidadMonedasProm = operaciones[nroOperacionAnterior].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas;

                    } else {
                        precioMonedaProm = (operacionesProm[nroOperacionProm].montoInvertido + operaciones[nroOperacion].montoInvertido) / (operacionesProm[nroOperacionProm].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas);
                        cantidadMonedasProm = operacionesProm[nroOperacionProm].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas;
                    }

                    inversionProm = calcularInversion(precioMonedaProm, cantidadMonedasProm);

                    uuid = self.crypto.randomUUID();

                    const operacionProm = new Operacion(uuid, nroOperacion, operaciones[0].tipoOperacion, par, operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMonedaProm, cantidadMonedasProm, date, inversionProm);
                    operacionesProm.push(operacionProm);
                }
                //La calculadora no permite mas que calcular 8 recompras, mas recompras, no se recomienda          
            } while (pnl <= operaciones[0].sl && i < 8);

            //Si i = 1 quiere decir que pnl excede el sl, por lo tanto no podemos hacer ninguna recompra
            if (i === 1) {
                Swal.fire({
                    icon: 'error',
                    title: 'SL insuficiente',
                    text: 'Aumente SL, no puede realizarse ninguna recompra.',
                    confirmButtonColor: '#98a0ff',
                });

            } else {

                operacionesIniciales.push(operacion0);

                almacenarLocalStorage("operacionesIniciales", operacionesIniciales);

                //extraigo la ultima operacion del arreglo
                let operacionPromUltima = operacionesProm.length - 1;

                //formula calculo precio de moneda cuando toca SL que elegi como dato de entrada en USDT.
                precioMonedaEnSl = calcularPrecioMonedaEnSl(operacionesProm[operacionPromUltima].precioMoneda, operacionesProm[operacionPromUltima].cantidadMonedas, operaciones[0].sl, operaciones[0].tipoOperacion);

                //formula calculo distancia de mi operacion #0 al monto de SL que quiero perder, en porcentaje
                porcentajeDistanciaSl = calcularPorcentajeDistanciaSl(precioMonedaEnSl, operaciones[0].precioMoneda, operaciones[0].tipoOperacion);

                mostrarOperaciones(operaciones, gridOperaciones);
                mostrarDatosFinales(porcentajeDistanciaSl, precioMonedaEnSl, operacionesProm[operacionPromUltima].cantidadMonedas, operacionesProm[operacionPromUltima].montoInvertido);
                operaciones[0].mostrarDatosOperacionInicial();

                crearCardsHistorialOperaciones();

                form.reset();
            }
        }
    }
});


/********************************************************************************************************/
//Evento que cambia el color del boton CALCULAR segun vaya a short o long
tipoOperacion.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    cambiarColorBoton(tipoOperacion.value, botonCalcular);
});


/********************************************************************************************************/
//Cada vez que doy al boton reset, se cambia el color del boton calcular por defecto
botonReset.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    tipoOperacion.value = "";
    cambiarColorBoton(tipoOperacion.value, botonCalcular);

});


/********************************************************************************************************/
//Elimino del dom, array y localStorage las operaciones que selecciono con checkboxs
botonEliminarOperacion.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    const operacionesIniciales = comprobarLocalStorage("operacionesIniciales");

    Swal.fire({
        title: 'Desea eliminar las operaciones?',
        text: "Luego, no será capaz de recuperarlas!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5fb6ff',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.isConfirmed) {

            listaEliminar.forEach((operacion, indice) => {
                document.getElementById(`operacion${indice}`).remove();
            });

            const operacionesFiltradas = operacionesIniciales.filter((operacion, indice) => !listaEliminar.includes(indice.toString()));

            almacenarLocalStorage("operacionesIniciales", operacionesFiltradas);

            listaEliminar = [];

            Swal.fire({
                title: 'Borradas!',
                text: "Las operaciones han sido eliminadas.",
                icon: 'success',
                confirmButtonColor: '#5fb6ff',
                confirmButtonText: 'Ok'
            });

            crearCardsHistorialOperaciones();
        }
    });
});

/********************************************************************************************************/
//Muestra historial de operaciones al presionar boton Historial operaciones
let primerClick = true;
botonMostrarOperacionesIniciales.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    if (modoSeleccion === true) {
        modoSeleccion = false;
        seleccionarOperacion("deseleccionar");

        if (operacionesIniciales.length == 0) {
            visibilidadBotones(botonEliminarOperacion, botonDeseleccionarOperacion, botonSeleccionarOperacion, "hidden", "hidden", "hidden")
        }

        disponibilidadBotones(botonEliminarOperacion, botonDeseleccionarOperacion, botonSeleccionarOperacion, true, true, true);
    }

    if (primerClick == true) {
        primerClick = false;
        botonMostrarOperacionesIniciales.style.background = "#5fb6ff";

        crearCardsHistorialOperaciones();
    } else {
        primerClick = true;
        botonMostrarOperacionesIniciales.style.background = "#6c757d";
        divOperacionesIniciales.innerHTML = "";

        visibilidadBotones(botonEliminarOperacion, botonDeseleccionarOperacion, botonSeleccionarOperacion, "hidden", "hidden", "hidden");
    }
});


/********************************************************************************************************/
//Boton que permite destildar todas las operaciones
botonDeseleccionarOperacion.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    seleccionarOperacion("deseleccionar");
});

/********************************************************************************************************/
//Boton que permite tildar todas las operaciones
botonSeleccionarOperacion.addEventListener("click", (event) => {
    event.stopImmediatePropagation();

    seleccionarOperacion("seleccionar");
});


/********************************************************************************************************/
//Cuando se clickea fuera, se sale del modo seleccion de cards
divModoSeleccionOff.addEventListener("click", (event) => {
    if (modoSeleccion == true) {
        selectorModoSeleccion("desactivar");
    }
});


/********************************************************************************************************/
//solo evito que cuando de click en calcular no se active el evento click de divModoSeleccionOff
botonCalcular.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
});


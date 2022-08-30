/*
variables:
//visibles en calculadora
-tipo de operacion: short o long (tipoOperacion)
-% recompra/reventa: porcentaje de recompra-distancia (distanciaRecompra)
-% monedas: porcentaje de aumento por cada recompra (montoPorRecompra)
-$ stop loss: sl en usdt (slUSDT)
-$ precio de entrada: precio de compra de la moneda, en usdt (precioMoneda)
-cantidad de monedas: cantidad de monedas en la primera compra (cantidadMonedasPrimeraCompra)

//no visibles
-cantidad de usdt invertidos en primera compra (montoInvertido)

*/

/*
proceso

1. voy a entrar a una moneda con 5 usdt (montoInvertido)
2. Cotizacion moneda al momento de comprarla (precioMoneda)
3. Cantidad de monedas en la primera compra:
    montoInvertido / precioMoneda = cantidadMonedasPrimeraCompra
4. Calculo de las recompras:

*/

/*function redondear(numero, numeroDecimales){
    if (typeof numero != 'number' || typeof numeroDecimales != 'number'){
        return null;
    }

    let signo = numero >= 0? 1 : -1;

    return (Math.round((numero * Math.pow(10, numeroDecimales)) + (signo * 0.0001)) / Math.pow(10, numeroDecimales)).toFixed(numeroDecimales);
}
*/

//const coloresSitio = [{gris_claro: "#f4f4f4"}, {verde_claro: "#46f687"}, {rojo_claro: "#f6465d"}];

//activo popovers en todo el documento
let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});

//obtengo las monedas de la api de futuros de Binance
const obtenerMonedas = async() => {
    try{
        const respuesta = await axios.get("https://www.binance.com/fapi/v1/exchangeInfo");

        par.innerHTML = "";

        par.innerHTML += `
            <option selected disabled value=""> SELECT </option>
        `
        respuesta.data.symbols.forEach((moneda) => {
            par.innerHTML += `
                <option value="${moneda.pair}">${moneda.pair}</option>
            `
        });
    }
    catch(error){
        console.log(error);
    }
}

//declaro objeto operacion
class Operacion{
    //constructor de la clase
    constructor(numeroOperacion = 0, tipoOperacion, par = "predeterminado", distanciaPorcentajeRecompraReventa = 0, aumentoPorcentajeRecompraReventa = 0, sl, precioMoneda = 0, cantidadMonedas = 0, date="indeterminado", montoInvertido = 0){
        this.numeroOperacion = numeroOperacion;
        this.tipoOperacion = tipoOperacion;
        this.par = par
        this.distanciaPorcentajeRecompraReventa = distanciaPorcentajeRecompraReventa;
        this.aumentoPorcentajeRecompraReventa = aumentoPorcentajeRecompraReventa;
        this.sl = sl;
        this.precioMoneda = precioMoneda;
        this.cantidadMonedas = cantidadMonedas;
        this.montoInvertido = montoInvertido;
        this.date = date;
    }

    //metodos de la clase
    calcularMontoInvertido(precioMoneda, cantidadMonedas){
        this.montoInvertido = precioMoneda * cantidadMonedas;
    }

    mostrarDatosOperacionInicial(){
        const divDatosCompraInicial = document.getElementById('divDatosCompraInicial');
        divDatosCompraInicial.style.border = "1px solid #ddd";
        divDatosCompraInicial.innerHTML = "";

        divDatosCompraInicial.innerHTML += `
            <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Datos Operación Inicial
                </button>
            </h2>

            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample" style="">
                <div class="accordion-body">
                        <p> <span class="itemInfo"> Moneda: </span>${this.par} </p>
                        <p> <span class="itemInfo"> Precio de compra: </span>$${this.precioMoneda.toFixed(3)} </p>
                        <p> <span class="itemInfo"> Monto invertido en dólares: </span> $${this.montoInvertido.toFixed(3)} </p>
                        <p> <span class="itemInfo"> Tamaño compra: </span> ${this.cantidadMonedas.toFixed(2)} monedas </p>
                        <p> <span class="itemInfo"> Tipo de operación: </span> ${this.tipoOperacion} </p>
                </div>
            </div>
        `;
    }

    /*mostrarDatosOperacionInicial(){
        const divDatosCompraInicial = document.getElementById('divDatosCompraInicial');
        divDatosCompraInicial.style.border = "1px solid #ddd";
        divDatosCompraInicial.innerHTML = "";

        divDatosCompraInicial.innerHTML += `
            
            <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                    Datos Operación Inicial
                </button>
            </h2>

            <div id="collapseTwo" class="accordion-collapse collapse collapse" aria-labelledby="headingTwo" style="">
                <div class="accordion-body">
                        <p> Moneda: ${this.par} </p>
                        <p> Precio de compra: $${this.precioMoneda.toFixed(3)} </p>
                        <p> Monto invertido en dólares: $${this.montoInvertido.toFixed(3)} </p>
                        <p> Tamaño compra: ${this.cantidadMonedas.toFixed(2)} monedas </p>
                        <p> Tipo de operación: ${this.tipoOperacion} </p>
                </div>
            </div>
        `;
    }*/

}


/*-------------------------------------------FUNCIONES-------------------------------------------*/
/*
//Funcion asincrona que crea elemento del dom para mostrar todas las monedas almacenadas en un archivo json
async function mostrarMonedas(){
    const monedas = await fetch("./json/monedas.json");
    const monedasParseadas = await monedas.json();

    par.innerHTML = "";

    par.innerHTML += `
        <option selected disabled value=""> SELECT </option>
    `
    monedasParseadas.forEach((moneda) => {
        par.innerHTML += `
        <option value="${moneda.symbol}">${moneda.symbol}</option>

        `
    });
}
*/
//Mostrar operaciones de recompra / reventa
function mostrarOperaciones(operaciones, gridOperaciones){
    let codigoHTMLTabla;
    gridOperaciones.innerHTML = "";

    codigoHTMLTabla = `
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col"> # </th>
                <th scope="col"> PRECIO </th>
                <th scope="col"> MONEDAS </th>
                <th scope="col"> USDT </th>
            </tr>
        </thead>
        <tbody>
    `;

    operaciones.forEach((operacion, indice) => {

        //no muestro operacion inicial, solo las recompras / reventas que es lo que me interesa para operar
        if(indice != 0){
            if(indice % 2 == 0){
                codigoHTMLTabla += `
                    <tr class="table-light">
                        <th scope="row"> ${operacion.numeroOperacion} </th>
                        <td>$${operacion.precioMoneda.toFixed(3)}</td>
                        <td>${operacion.cantidadMonedas.toFixed(3)}</td>
                        <td>$${operacion.montoInvertido.toFixed(2)}</td>
                    </tr>  
                `

            } else {
                codigoHTMLTabla += `
                    <tr>
                        <th scope="row"> ${operacion.numeroOperacion} </th>
                        <td>$${operacion.precioMoneda.toFixed(3)}</td>
                        <td>${operacion.cantidadMonedas.toFixed(3)}</td>
                        <td>$${operacion.montoInvertido.toFixed(2)}</td>
                    </tr>  
                ` 
            }
        }
    });

    codigoHTMLTabla += `
            </tbody>
        </table>
    `
    gridOperaciones.innerHTML = codigoHTMLTabla;

/*
    gridOperaciones.innerHTML += `
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col"> # </th>
                <th scope="col"> PRECIO </th>
                <th scope="col"> MONEDA </th>
                <th scope="col"> USDT </th>
            </tr>
        </thead>
        <tbody>
    `

    operaciones.forEach((operacion, indice) => {

        //no muestro operacion inicial, solo las recompras / reventas que es lo que me interesa para operar
        if(indice != 0){
            gridOperaciones.innerHTML += `
            <tr class="table-secondary">
                <th scope="row"> ${operacion.numeroOperacion} </th>
                <td>$${operacion.precioMoneda.toFixed(3)}</td>
                <td>${operacion.cantidadMonedas.toFixed(3)}</td>
                <td>$${operacion.montoInvertido.toFixed(2)}</td>
            </tr>  
          `    
        }


    });


    gridOperaciones.innerHTML += `
            </tbody>
        </table>
    `

*/
}

//Calcular PnL de operaciones, ya sea de short o long
function calcularPnL(cantidadMonedas, precioMonedaInicial, precioMonedaFinal, tipoOperacion){
    let pnl;

    if(tipoOperacion == "short"){
        pnl = cantidadMonedas * (precioMonedaFinal - precioMonedaInicial);
    } else if(tipoOperacion == "long"){
        pnl = (cantidadMonedas * (precioMonedaFinal - precioMonedaInicial)) * -1;
    }
    
    return pnl;
}

//Almacenar array de objetos en localStorage
function almacenarLocalStorage(index, objectsArray){
    localStorage.setItem(index, JSON.stringify(objectsArray));
}

//comprobar si existe un array de objetos en un indice determinado, si existe lo devuelve, sino, crea un array de objetos vacio
function comprobarLocalStorage(index){
    //compruebo si esta creado mi localStorage, si no esta creado lo creo, y si esta, le envio las operaciones que tenia previamente
    return JSON.parse(localStorage.getItem(index)) ?? [];
}

//Calcular precio de moneda por operacion
function calcularPrecioMoneda(precioMoneda, distanciaPorcentajeRecompraReventa, tipoOperacion){
    //let precioMonedaCalculada = ((precioMoneda * distanciaPorcentajeRecompraReventa) / 100);
    let precioMonedaCalculada;

    if(tipoOperacion === "short"){
        //precioMonedaCalculada += precioMoneda;
        precioMonedaCalculada = precioMoneda * ( 1 + distanciaPorcentajeRecompraReventa / 100);
    } else if(tipoOperacion === "long"){
        //precioMonedaCalculada = -1 * precioMonedaCalculada + precioMoneda;
        precioMonedaCalculada = precioMoneda * ( 1 - distanciaPorcentajeRecompraReventa / 100);
    }
    return precioMonedaCalculada;  
}

//Calcular cantidad de monedas por operacion
function calcularCantidadMonedas(cantidadMonedas, aumentoPorcentajeRecompraReventa){
    return cantidadMonedas * (1 + aumentoPorcentajeRecompraReventa / 100);
    //return ((cantidadMonedas * aumentoPorcentajeRecompraReventa) / 100) + cantidadMonedas;
}

//Calcular inversion
function calcularInversion(precioMoneda, cantidadMonedas){
    return precioMoneda * cantidadMonedas;
}

//Calcular precio de moneda para un sl determinado
function calcularPrecioMonedaEnSl(precioMoneda, cantidadMonedas, sl, tipoOperacion){
    if(tipoOperacion === "short"){
        return precioMoneda + (sl / cantidadMonedas);
    } else if(tipoOperacion === "long"){
        return (-1 * sl / cantidadMonedas) + precioMoneda;
    }

}

//Calcular porcentaje distancia a SL
function calcularPorcentajeDistanciaSl(precioMonedaEnSl, precioMoneda, tipoOperacion){
    let porcentajeDistancia;
    if(tipoOperacion === "short"){
        porcentajeDistancia = ((precioMonedaEnSl - precioMoneda) / precioMoneda) * 100;
    } else if(tipoOperacion === "long"){
        porcentajeDistancia = ((precioMoneda - precioMonedaEnSl) / precioMoneda) * 100;
    }

    return porcentajeDistancia;
    
}
//style="max-width: 20rem; ;"
//Crear HTML de historial de operaciones, dado un div contenedor, y el array de objetos a mostrar
function crearHTMLHistorialOperaciones(divContenedor, arrayObject){
    divContenedor.innerHTML = "";

    arrayObject.forEach((operacion, indice) => {
        divContenedor.innerHTML += `  
            <div class="card bg-light border-light" id="operacion${indice}">
                <div class="card-header">${indice + 1}. ${operacion.par}</div>
                <div class="card-body" id="card-operacion">
                    <p class="card-text"> <span class="itemInfo"> Tipo operación:  </span> ${operacion.tipoOperacion}  </p>
                    <p class="card-text"> <span class="itemInfo"> Timestamp:  </span> ${operacion.date}  </p>
                    <p class="card-text"> <span class="itemInfo"> Precio moneda:   </span> $${operacion.precioMoneda.toFixed(3)} </p>
                    <p class="card-text"> <span class="itemInfo"> Cantidad monedas:  </span> ${operacion.cantidadMonedas.toFixed(3)}  </p>
                    <p class="card-text"> <span class="itemInfo"> Monto invertido:  </span> $${operacion.montoInvertido.toFixed(2)}  </p>
                    <button type="button" class="btn btn-danger"> <i class="fa-solid fa-trash"></i> </button>
                    <button type="button" class="btn btn-success"> <i class="fa-solid fa-book"></i> </button>
                </div>
            </div>
        `
    });
}

//Carga operaciones en el formulario, para luego poder recalcular los datos de esa operacion
function cargarOperacionFormulario(tipoOperacion, par, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas, operationObject){
    tipoOperacion.value = operationObject.tipoOperacion;
    par.value = operationObject.par;
    distanciaPorcentajeRecompraReventa.value = operationObject.distanciaPorcentajeRecompraReventa;
    aumentoPorcentajeRecompraReventa.value = operationObject.aumentoPorcentajeRecompraReventa;
    sl.value = operationObject.sl;
    precioMoneda.value = operationObject.precioMoneda;
    cantidadMonedas.value = operationObject.cantidadMonedas;
}

//Crea un acordion con datos adicionales al calculo de las operaciones
function mostrarDatosFinales(porcentajeDistanciaSl, precioMonedaEnSl, cantidadMonedas, montoInvertido){
    const divDatosFinales = document.getElementById('divDatosFinales');
    divDatosFinales.style.border = "1px solid #ddd";
    divDatosFinales.innerHTML = "";

    divDatosFinales.innerHTML += `
        <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Datos Adicionales
            </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
            <div class="accordion-body">
                <p> <span class="itemInfo"> SL(${porcentajeDistanciaSl.toFixed(2)}%) </span></p>
                <p> Precio moneda al tocar SL: <span class="itemInfo">$${precioMonedaEnSl.toFixed(3)} </span></p>
                <p> Cantidad de monedas compradas utilizando todas las recompras: <span class="itemInfo">${cantidadMonedas.toFixed(3)} </span> </p>
                <p> Monto total invertido utilizando todas las recompras: <span class="itemInfo"> $${montoInvertido.toFixed(3)} </span> </p>
            </div>
        </div>
    `
}

/*

//Crea un acordion con datos adicionales al calculo de las operaciones
function mostrarDatosFinales(porcentajeDistanciaSl, precioMonedaEnSl, cantidadMonedas, montoInvertido){
    const divDatosFinales = document.getElementById('divDatosFinales');
    divDatosFinales.style.border = "1px solid #ddd";
    divDatosFinales.innerHTML = "";

    divDatosFinales.innerHTML += `
        <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Datos Adicionales
            </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" style="">
            <div class="accordion-body">
                <p> <strong> SL(${porcentajeDistanciaSl.toFixed(2)}%) </strong> </p>
                <p> Precio moneda al tocar SL: <strong> $${precioMonedaEnSl.toFixed(3)} </strong> </p>
                <p> Cantidad de monedas compradas utilizando todas las recompras: <strong> ${cantidadMonedas.toFixed(3)} </strong></p>
                <p> Monto total invertido utilizando todas las recompras: <strong> $${montoInvertido.toFixed(3)} </strong></p>
            </div>
        </div>
    `
}
*/
//Cambia el color del boton CALCULAR dependiendo del tipo de operacion
function cambiarColorBoton(tipoOperacion, boton){
    switch (tipoOperacion) {
        case "short":
            boton.style.background = "rgb(246, 70, 93)";
            break;
        case "long":
            boton.style.background = "rgb(14, 203, 129)";
            break;
        default:
            boton.style.background = "#6c757d";
            break;
    }
}

//Elimina elemento del dom y de un array de objetos
function eliminarOperacion(elementoDOM, indice, arrayObject){
    //primero elimino elemento del dom
    document.getElementById(elementoDOM).remove();

    //luego lo elimino del array de objetos
    arrayObject.splice(indice, 1);

    //luego lo borro del localStorage
    almacenarLocalStorage("operacionesIniciales", arrayObject);
}

function crearCardsHistorialOperaciones(){

    const operacionesIniciales = comprobarLocalStorage("operacionesIniciales");

    crearHTMLHistorialOperaciones(divOperacionesIniciales, operacionesIniciales);
       
    operacionesIniciales.forEach((operacion, indice) => {

        let operacionEliminar = document.getElementById(`operacion${indice}`).lastElementChild.children[5];

        let operacionInicialDatos = document.getElementById(`operacion${indice}`).lastElementChild.lastElementChild;

        //Boton cargar datos de operaciones
        operacionInicialDatos.addEventListener("click", () => {

            cargarOperacionFormulario(
                document.getElementById("tipoOperacion"), 
                document.getElementById("par"), 
                document.getElementById("distanciaPorcentajeRecompraReventa"), 
                document.getElementById("aumentoPorcentajeRecompraReventa"), 
                document.getElementById("sl"), 
                document.getElementById("precioMoneda"), 
                document.getElementById("cantidadMonedas"), 
                operacion
            );

            cambiarColorBoton(tipoOperacion.value, botonCalcular);
        });

        operacionEliminar.addEventListener("click", () => {
            Swal.fire({
                title: 'Desea eliminar la operación?',
                text: "Luego, no será capaz de recuperarla!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5fb6ff',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarOperacion(`operacion${indice}`, indice, operacionesIniciales);

                    crearCardsHistorialOperaciones();
                    Swal.fire({
                        title: 'Borrada!',
                        text:"La operación ha sido eliminada.",
                        icon: 'success',
                        confirmButtonColor: '#5fb6ff',
                        confirmButtonText: 'Ok'
                    });
                }
            });
        });
    });
}

/*-------------------------------------------CODIGO-------------------------------------------*/

//obtencion elementos del dom
const operacionesIniciales = comprobarLocalStorage("operacionesIniciales");
const form = document.getElementById('idForm');
const botonMostrarOperacionesIniciales = document.getElementById("idBtnDropDown");
//const idOperacionesInicialesLista = document.getElementById("idOperacionesInicialesLista");
const divOperacionesIniciales = document.getElementById("divOperacionesIniciales");
const gridOperaciones = document.getElementById("gridOperaciones");
const tipoOperacion = document.getElementById("tipoOperacion");
const botonCalcular = document.getElementById("botonCalcular");
const botonReset = document.getElementById("botonReset");

//muestro las monedas de futuros de Binance
obtenerMonedas();


//Historial de operaciones iniciales
let primerClick = true;
botonMostrarOperacionesIniciales.addEventListener("click", () => {
    if (primerClick == true){
        primerClick = false;
        botonMostrarOperacionesIniciales.style.background="#5fb6ff";
    
        crearCardsHistorialOperaciones();
    } else {
        primerClick = true;
        botonMostrarOperacionesIniciales.style.background="#6c757d";
        divOperacionesIniciales.innerHTML = "";
    }
});

//Evento que cambia el color del boton CALCULAR segun vaya a short o long
tipoOperacion.addEventListener("click", () => {
    cambiarColorBoton(tipoOperacion.value, botonCalcular);
});

//Cada vez que doy al boton reset, se cambia el color del boton calcular por defecto
botonReset.addEventListener("click", () => {
    tipoOperacion.value="";
    cambiarColorBoton(tipoOperacion.value, botonCalcular);

});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let tipoOperacion, par, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas;

    //metodo de js que extrae la informacion de los campos de un formulario objetivo
    let dataForm = new FormData(event.target);
    //hago este paso para que sea mas legible pero podria directamente crear el objeto con los datos que vengan del objeto dataForm
    tipoOperacion = dataForm.get("operacion");
    par = dataForm.get("parName");
    distanciaPorcentajeRecompraReventa = parseFloat(dataForm.get("distanciaPorcentajeRecompraReventaName"));
    aumentoPorcentajeRecompraReventa = parseFloat(dataForm.get("aumentoPorcentajeRecompraReventaName"));
    sl = parseFloat(dataForm.get("slName"));
    precioMoneda = parseFloat(dataForm.get("precioMonedaName"));

    cantidadMonedas = parseFloat(dataForm.get("cantidadMonedasName"));

    if((distanciaPorcentajeRecompraReventa && aumentoPorcentajeRecompraReventa && sl && precioMoneda && cantidadMonedas) > 0){

        //almaceno el valor de los input del html en variables let
        /*tipoOperacion = (document.getElementById('tipoOperacion').value);
        par = (document.getElementById('par').value).toUpperCase();
        distanciaPorcentajeRecompraReventa = parseFloat(document.getElementById('distanciaPorcentajeRecompraReventa').value);
        aumentoPorcentajeRecompraReventa = parseFloat(document.getElementById('aumentoPorcentajeRecompraReventa').value);
        sl = parseFloat(document.getElementById('sl').value);
        precioMoneda = parseFloat(document.getElementById('precioMoneda').value);

        cantidadMonedas = parseFloat(document.getElementById('cantidadMonedas').value);*/

        //compruebo si mi localStorage hay almacenadas operaciones, sino creo una nueva
        //la coloco aqui tambien porque si...
        const operacionesIniciales = comprobarLocalStorage("operacionesIniciales");

        //contiene las operaciones, de recompra o reventa, incluida compra/venta incial
        const operaciones = [];
        //contiene todas las operaciones promediadas
        const operacionesProm = [];

        //devuelve fecha y hora de la forma por ejemplo 7/2/2021, 2:05:07 PM. Se utiliza para la hora de cada operacion
        const date = new Date().toLocaleString();

        const divDatosCompraInicial = document.getElementById("divDatosCompraInicial");
        divDatosCompraInicial.innerHTML ="";

        const gridOperaciones = document.getElementById("gridOperaciones");
        gridOperaciones.innerHTML = "";

        //creo el objeto inicial, con los datos que me ingresaron en el html
        const operacion0 = new Operacion(0, tipoOperacion, par, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas, date);
        operaciones.push(operacion0);
        operaciones[0].calcularMontoInvertido(precioMoneda, cantidadMonedas);

        //La calculadora no permite mas que calcular 8 recompras, mas recompras, no se recomienda

        let precioMonedaEnSl = 0;
        let porcentajeDistanciaSl = 0;
        let i = 0;
        let pnl = 0;

        if(operaciones[0].tipoOperacion === "short" || operaciones[0].tipoOperacion === "long"){

            do{
                i += 1; 

                //creo una variable nroOperacion y nroOperacionAnterior para que sea mas legible
                let nroOperacion = i;
                let nroOperacionAnterior = i-1;
                let nroOperacionProm = i;

                //datos Recompras
                let precioMoneda = calcularPrecioMoneda(operaciones[nroOperacionAnterior].precioMoneda, operaciones[nroOperacionAnterior].distanciaPorcentajeRecompraReventa, operaciones[0].tipoOperacion);
                let cantidadMonedas = calcularCantidadMonedas(operaciones[nroOperacionAnterior].cantidadMonedas, operaciones[nroOperacionAnterior].aumentoPorcentajeRecompraReventa);
                let inversion = calcularInversion(precioMoneda, cantidadMonedas);

                //Datos operaciones Promediadas
                let cantidadMonedasProm;
                let precioMonedaProm;
                let inversionProm;
                
                if(i === 1){
                    pnl = calcularPnL(operaciones[0].cantidadMonedas, operaciones[nroOperacionAnterior].precioMoneda, precioMoneda, operaciones[0].tipoOperacion);
                } else {
                    nroOperacionProm = nroOperacionAnterior - 1;
                    pnl = calcularPnL(operacionesProm[nroOperacionProm].cantidadMonedas, operacionesProm[nroOperacionProm].precioMoneda, precioMoneda, operaciones[0].tipoOperacion);
                    //pnl = operacionesProm[nroOperacionProm].cantidadMonedas * (precioMoneda - operacionesProm[nroOperacionProm].precioMoneda);

                }

                if(pnl <= operaciones[0].sl){

                    const operacion = new Operacion(nroOperacion, operaciones[0].tipoOperacion, par, operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMoneda, cantidadMonedas, date, inversion);    
                    operaciones.push(operacion);

                    if(i === 1){
                        precioMonedaProm = (operaciones[nroOperacionAnterior].montoInvertido + operaciones[nroOperacion].montoInvertido) / (operaciones[nroOperacionAnterior].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas);
                        cantidadMonedasProm = operaciones[nroOperacionAnterior].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas;

                    } else{
                        precioMonedaProm = (operacionesProm[nroOperacionProm].montoInvertido + operaciones[nroOperacion].montoInvertido) / (operacionesProm[nroOperacionProm].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas);
                        cantidadMonedasProm = operacionesProm[nroOperacionProm].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas;
                    }

                    inversionProm = calcularInversion(precioMonedaProm, cantidadMonedasProm);

                    const operacionProm = new Operacion(nroOperacion, operaciones[0].tipoOperacion, par, operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMonedaProm, cantidadMonedasProm, date, inversionProm);
                    operacionesProm.push(operacionProm);
                }
                      
            } while(pnl <= operaciones[0].sl && i < 8);      
            
            //Si i = 1 quiere decir que pnl excede el sl, por lo tanto no podemos hacer ni una recompra
            if(i === 1){
                Swal.fire({
                    icon: 'error',
                    title: 'SL insuficiente',
                    text: 'Aumente SL, no puede realizarse ninguna recompra.',
                    confirmButtonColor: '#98a0ff',
                  });

            } else {
                //guardo datos de mis operaciones para localStorage
                operacionesIniciales.push(operacion0);
            
                //localStorage.setItem("operacionesIniciales", JSON.stringify(operacionesIniciales));
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
                //reseteo el formulario
                form.reset();
            }
        }
    }
});





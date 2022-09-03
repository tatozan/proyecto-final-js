//activo popovers en todo el documento
let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});


/*-------------------------------------------CLASES-------------------------------------------*/
//declaro objeto operacion
class Operacion{
    //constructor de la clase
    constructor(id, numeroOperacion = 0, tipoOperacion, par = "predeterminado", distanciaPorcentajeRecompraReventa = 0, aumentoPorcentajeRecompraReventa = 0, sl, precioMoneda = 0, cantidadMonedas = 0, date="indeterminado", montoInvertido = 0){
        this.id = id;
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
}


/*---------------------------------------------FUNCIONES---------------------------------------------*/


/**************************************almacenarLocalStorage*************************************/
//Almacenar array de objetos en localStorage
function almacenarLocalStorage(index, objectsArray){
    localStorage.setItem(index, JSON.stringify(objectsArray));
}


/***************************************comprobarLocalStorage*****************************************/
//comprobar si existe un array de objetos en un indice determinado, si existe lo devuelve, sino, crea un array de objetos vacio
function comprobarLocalStorage(index){
    //compruebo si esta creado mi localStorage, si no esta creado lo creo, y si esta, le envio las operaciones que tenia previamente
    return JSON.parse(localStorage.getItem(index)) ?? [];
}


/**************************************obtenerListadoMonedas********************************************/
//obtengo las monedas de la api de futuros de Binance
const obtenerListadoMonedas = async() => {
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


/******************************************mostrarOperaciones***************************************/
//Mostrar operaciones de recompra / reventa
function mostrarOperaciones(operaciones, gridOperaciones){
    let codigoHTMLTabla;
    gridOperaciones.innerHTML = "";

    codigoHTMLTabla = `
    <table class="table table-hover animate__animated animate__fadeIn">
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
}


/******************************************mostrarDatosFinales*****************************************/
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


/****************************************crearHTMLHistorialOperaciones*************************************/
//Crear HTML de historial de operaciones, dado un div contenedor, y el array de objetos a mostrar
function crearHTMLHistorialOperaciones(divContenedor, arrayObject){
    divContenedor.innerHTML = "";

    arrayObject.forEach((operacion, indice) => {
        divContenedor.innerHTML += `
            <div class="card bg-light border-light animate__animated animate__fadeIn" id="operacion${indice}">
                <div class="card-header">${indice + 1}. ${operacion.par}
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                </div>
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


/*************************************crearCardsHistorialOperaciones***********************************/
//Crea el historial de operaciones
function crearCardsHistorialOperaciones(){

    const operacionesIniciales = comprobarLocalStorage("operacionesIniciales");

    crearHTMLHistorialOperaciones(divOperacionesIniciales, operacionesIniciales);

    operacionesIniciales.forEach((operacion, indice) => {

        let operacionEliminar = document.getElementById(`operacion${indice}`).lastElementChild.children[5];
        let operacionInicialDatos = document.getElementById(`operacion${indice}`).lastElementChild.lastElementChild;
        //let cardOperacion = document.getElementById(`operacion${indice}`);
        let checkBox = document.getElementById(`operacion${indice}`).firstElementChild.firstElementChild;
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

                    botonDeseleccionarOperacion.style.visibility = "hidden";
                    botonEliminarOperacion.style.visibility = "hidden";
                    listaEliminar = [];
                    
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

        checkBox.addEventListener("click", () => {
            comprobarOperacionesAEliminar(checkBox, listaEliminar, indice);    
        });
    });
}


/***********************************cargarOperacionFormulario*************************************/
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


/**********************************comprobarOperacionesAEliminar***************************************/
//Comprueba las operaciones seleccionadas mediante los checkboxs, para hacer multiple eliminacion
function comprobarOperacionesAEliminar(checkBox, listaEliminar, indice){
    if(checkBox.checked === true){
        botonEliminarOperacion.style.visibility = "visible";
        listaEliminar.push(`${indice}`);
    } else if(checkBox.checked === false){
        let indiceElementoAEliminar = listaEliminar.indexOf(`${indice}`);
        //se compara con -1 porque es una condicion de error del metodo indexOf, por si no encuentra el elemento buscado
        if(indice != -1){ 
            listaEliminar.splice(indiceElementoAEliminar, 1);
        }
    }

    if(listaEliminar.length == 0){
        botonEliminarOperacion.style.visibility = "hidden";
        botonDeseleccionarOperacion.style.visibility = "hidden";
    }else if(listaEliminar.length > 0){
        botonDeseleccionarOperacion.style.visibility = "visible";
    }
}


/***************************************eliminarOperacion***********************************/
//Elimina operacion del dom, del array y finalmente del localStorage
function eliminarOperacion(elementoDOM, indice, arrayObject){
    document.getElementById(elementoDOM).remove();

    arrayObject.splice(indice, 1);

    almacenarLocalStorage("operacionesIniciales", arrayObject);
}


/*************************************cambiarColorBoton*****************************************/
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



/*-------------------------------------------CODIGO-------------------------------------------*/

//obtencion elementos del dom
const operacionesIniciales = comprobarLocalStorage("operacionesIniciales");

const form = document.getElementById('idForm');
const botonMostrarOperacionesIniciales = document.getElementById("idBtnDropDown");
const divOperacionesIniciales = document.getElementById("divOperacionesIniciales");
const gridOperaciones = document.getElementById("gridOperaciones");
const tipoOperacion = document.getElementById("tipoOperacion");
const botonCalcular = document.getElementById("botonCalcular");
const botonReset = document.getElementById("botonReset");
const botonEliminarOperacion = document.getElementById("botonEliminarOperacion");
const botonDeseleccionarOperacion = document.getElementById("botonDeseleccionarOperacion");

let listaEliminar = [];

//obtengo listado de monedas de Binance Futures
obtenerListadoMonedas();




/*let uuid = self.crypto.randomUUID();*/


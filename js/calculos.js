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
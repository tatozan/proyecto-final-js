# Calculadora de trading futuros con historial de operaciones

## **CALCULADORA:**
Arroja una determinada cantidad de recompras (máximo 8) en base a unos valores de entrada, utilizando una variante de la estrategia martingala.

### **Valores de entrada:**  
- **Tipo de operación:** short o long.  
- **Moneda a operar:** par en la cual vamos a operar.  
- **Distancia entre cada recompra:** distancia respecto al precio anterior medido en porcentaje entre cada recompra.  
- **Aumento de inversión entre cada recompra:** aumento de inversión medido en porcentaje entre cada recompra.  
- **Stop Loss:** Cantidad total medido en USDT que estoy dispuesto a perder si va en contra la operación.  
- **Precio moneda:** Precio de la moneda al entrar a la operación.  
- **Cantidad de monedas:** Cantidad de monedas al entrar a la operación.  

### **HISTORIAL DE OPERACIONES:**   
Listado de operaciones iniciales de la cual derivan las recompras. Contiene:
- **Tipo de operación**
- **Fecha y hora de la operación**
- **Precio de la moneda**
- **Cantidad de monedas**
- **Monto invertido**

Todas las operaciones pueden cargarse para recalcular sus recompras respectivas, al igual que borrarse individualmente.

### **MODO SELECCIÓN:**  
En este modo se puede seleccionar varias operaciones a la vez, para luego eliminar el lote.  

Se habilitan tres botones:  
- **Eliminación:**  elimina lote seleccionado.
- **Selección:**  selecciona todas las operaciones.
- **Deselección:** deselecciona todas las operaciones.  

Habilitar y salir del modo selección:  
- **Habilitar modo selección:** mantener click en el cuerpo de una card del listado.   
- **Salir modo selección:** dar click por fuera del listado de cards, los checkboxs desapareceran y el listado se reiniciará.  

#### **AUTOR:** Esteban Zanolli  
#### **PROFESOR:** Francisco Pugh  







// Función que actualiza el reloj en la interfaz de usuario cada segundo
function refreshClock(clock) {
    const actualTime = new Date();  // Obtiene la hora actual

    // Formatea las horas, añadiendo un 0 si es menor a 10
    const hours = actualTime.getHours() < 10 ? `0${actualTime.getHours()}` : actualTime.getHours(); 
    // Formatea los minutos, añadiendo un 0 si es menor a 10
    const minutes = actualTime.getMinutes() < 10 ? `0${actualTime.getMinutes()}` : actualTime.getMinutes(); 

    // Muestra la hora formateada en el elemento de reloj
    clock.innerText = `${hours}:${minutes}`;
    
    // Llama a la función nuevamente después de 1 segundo
    setTimeout(() => refreshClock(clock), 1000);
}

// Función que extrae solo el primer nombre de un nombre completo
function takeJustName(fullName) {
    const trimmedFullName = fullName.trim();  // Elimina espacios innecesarios

    const fullNameSplitted = trimmedFullName.split(" ");  // Divide el nombre completo en partes

    const name = fullNameSplitted[0];  // Toma solo el primer nombre

    return name;  // Devuelve solo el primer nombre
}

// Función que formatea una fecha como 'día/mes/año'
function getFormattedDayMonthYear(date) { 
    return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getFullYear()}`; // Formatea la fecha
}

// Función que formatea una fecha y hora como 'día/mes/año a las hora:minuto'
function getFormattedDayMonthYearHoursSeconds(date) { 
    return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${date.getMonth() + 1 < 10 ? `0${date.getMonth()}` : date.getMonth() + 1}/${date.getFullYear()}  a las ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`; // Formatea la fecha con horas y minutos
}

// Función que formatea una fecha completa como 'año-mes-día hora:minuto:segundo'
function getFormattedDate(date) {
    // Obtener partes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes (0-indexado)
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Formatear la fecha
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Devuelve la fecha formateada
}

// Función que cambia el estilo del input cuando la validación es exitosa
function successInput(input) {
    input.style.borderColor = "rgb(93, 226, 102)";  // Cambia el borde a verde
    input.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";  // Añade sombra verde
}

// Función que cambia el estilo del input cuando la validación falla
function failInput(input) {
    input.style.borderColor = "rgb(226, 93, 93)";  // Cambia el borde a rojo
    input.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";  // Añade sombra roja
}

// Función que devuelve el estilo por defecto del input
function defaultInput(input) {
    input.style.border = "1px solid #D6DBDF";  // Establece el borde por defecto
    input.style.boxShadow = "none";  // Elimina la sombra
}

// Función que verifica si una fecha es 30 días o más en el futuro
function isDate30DaysLater(fecha) {
    const fechaActual = new Date();  // Obtiene la fecha actual
    
    const fechaLimite = new Date(fechaActual);  // Crea una nueva instancia de la fecha actual
    fechaLimite.setDate(fechaActual.getDate() + 30);  // Establece la fecha límite a 30 días después

    return fecha >= fechaLimite;  // Compara si la fecha es mayor o igual a la fecha límite
}

// Función que verifica si una fecha es 60 días o más en el futuro
function isDate60DaysLater(fecha) {
    const fechaActual = new Date();  // Obtiene la fecha actual
    
    const fechaLimite = new Date(fechaActual);  // Crea una nueva instancia de la fecha actual
    fechaLimite.setDate(fechaActual.getDate() + 60);  // Establece la fecha límite a 60 días después

    return fecha >= fechaLimite;  // Compara si la fecha es mayor o igual a la fecha límite
}

// Función que crea una fila de tabla que muestra un mensaje cuando no hay datos
function createNoDataRow(message, colSpan) {
    const tableRow = document.createElement('tr');  // Crea una nueva fila de tabla

    const tableCell = document.createElement('td');  // Crea una nueva celda de tabla

    tableCell.innerText = message;  // Asigna el mensaje al texto de la celda

    tableCell.colSpan = colSpan;  // Establece el número de columnas que debe abarcar la celda

    tableRow.appendChild(tableCell);  // Añade la celda a la fila

    tableRow.style.cursor = "default";  // Establece el cursor en "predeterminado" para la fila

    return tableRow;  // Devuelve la fila creada
}

// Objeto con todas las funciones utilitarias
const utils = { 
    refreshClock, 
    takeJustName, 
    getFormattedDate, 
    successInput, 
    failInput, 
    defaultInput, 
    isDate30DaysLater, 
    createNoDataRow, 
    isDate60DaysLater, 
    getFormattedDayMonthYear, 
    getFormattedDayMonthYearHoursSeconds 
}

// Exporta las utilidades para su uso en otros archivos
export default utils;
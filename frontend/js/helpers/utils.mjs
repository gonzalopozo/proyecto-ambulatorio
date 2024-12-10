function refreshClock(clock) {
    const actualTime = new Date();

    const hours = actualTime.getHours() < 10 ? `0${actualTime.getHours()}` : actualTime.getHours(); 
    const minutes = actualTime.getMinutes() < 10 ? `0${actualTime.getMinutes()}` : actualTime.getMinutes(); 

    clock.innerText = `${hours}:${minutes}`;
    
    
    setTimeout(() => refreshClock(clock), 1000);
}

function takeJustName(fullName) {
    const trimmedFullName = fullName.trim();

    const fullNameSplitted = trimmedFullName.split(" ");

    const name = fullNameSplitted[0];

    return name;
}

function getFormattedDayMonthYear(date) { 
    return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getFullYear()}`;
}

function getFormattedDayMonthYearHoursSeconds(date) { 
    return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${date.getMonth() + 1 < 10 ? `0${date.getMonth()}` : date.getMonth()}/${date.getFullYear()}  a las ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
}

function getFormattedDate(date) {
    // Obtener partes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes (0-indexado)
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Formatear la fecha
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function successInput(input) {
    input.style.borderColor = "rgb(93, 226, 102)";
    input.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
}

function failInput(input) {
    input.style.borderColor = "rgb(226, 93, 93)";
    input.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
}

function defaultInput(input) {
    input.style.border = "1px solid #D6DBDF";
    input.style.boxShadow = "none";
}

function isDate30DaysLater(fecha) {
    const fechaActual = new Date();
    
    const fechaLimite = new Date(fechaActual);
    fechaLimite.setDate(fechaActual.getDate() + 30);

    return fecha >= fechaLimite;
}

function isDate60DaysLater(fecha) {
    const fechaActual = new Date();
    
    const fechaLimite = new Date(fechaActual);
    fechaLimite.setDate(fechaActual.getDate() + 60);

    return fecha >= fechaLimite;
}


function createNoDataRow(message, colSpan) {
    const tableRow = document.createElement('tr');

    const tableCell = document.createElement('td');

    tableCell.innerText = message;

    tableCell.colSpan = colSpan;

    tableRow.appendChild(tableCell);

    tableRow.style.cursor = "default";

    return tableRow;
}

const utils = { refreshClock, takeJustName, getFormattedDate, successInput, failInput, defaultInput, isDate30DaysLater, createNoDataRow, isDate60DaysLater, getFormattedDayMonthYear, getFormattedDayMonthYearHoursSeconds }

export default utils;
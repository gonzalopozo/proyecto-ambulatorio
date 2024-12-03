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

const utils = { refreshClock, takeJustName, getFormattedDate }

export default utils;
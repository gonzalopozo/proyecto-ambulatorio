// Se espera a que el contenido de la página esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Realiza una petición HTTP GET a la API para verificar que la base de datos está funcionando
    fetch(`http://localhost/?resource_type=patients`)
        .then(response => {
            // Si la respuesta no es válida, lanza un error
            if (!response.ok) {
            throw new Error('Error en la petición');
            }

            // Convierte la respuesta a formato JSON
            return response.json();
        })
        .then(data => {
            // Si la petición es exitosa, muestra un mensaje de éxito en la consola
            console.log('Base de datos funcionando');
            
        })
        .catch(error => {
            // Si ocurre un error, lo muestra en la consola
            console.error('Error:', error);
        });
})

// Se importa el módulo de utilidades desde otro archivo
import utils from './helpers/utils.mjs';

// Se seleccionan los elementos del formulario para el inicio de sesión
const formLogin = document.querySelector('#login-form');
const formLoginEmail = document.querySelector('#email');
const formLoginPassword = document.querySelector('#password');
// Se seleccionan los elementos donde se mostrarán los errores de validación
const errorsSpanEmail = document.querySelector('.errors #email');
const errorsSpanPassword = document.querySelector('.errors #password');
const errorsSpanNotFound = document.querySelector('.errors #not-found');

// Variables para el estado de validación de los campos de correo y contraseña
let isEmailValid = false;
let isPasswordValid = false;

// Función para validar los campos del formulario
function changeInput(input) {
    // Limpia los errores anteriores
    errorsSpanPassword.innerText = "";
    const inputValue = input.value;
    
    const inputType = input.type;

    // Validación del campo de correo electrónico
    if (inputType == "email") {
        if (inputValue.match(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i)) {
            // Si es válido, marca el campo como correcto y limpia el mensaje de error
            utils.successInput(input);
            isEmailValid = true;
            errorsSpanEmail.innerText = "";
        } else {
            // Si no es válido, marca el campo como incorrecto y muestra el error
            utils.failInput(input);
            isEmailValid = false;
            errorsSpanEmail.innerText = "Email introducido incorretamente";
        }
    } else if (inputType == "password") {
        // Validación del campo de contraseña (con expresiones regulares)
        if (inputValue.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            // Si es válido, marca el campo como correcto y limpia el mensaje de error
            utils.successInput(input);
            isPasswordValid = true;
            errorsSpanPassword.innerText = "";
        } else {
            // Si no es válido, marca el campo como incorrecto y muestra el error
            utils.failInput(input);
            isPasswordValid = false;
            errorsSpanPassword.innerText = "Contraseña no valida";
        }
    }
    
}

// Función para reiniciar los campos de entrada
function resetInputs() {
    formLoginEmail.value = '';
    formLoginPassword.value = '';

    // Marca ambos campos como incorrectos
    utils.failInput(formLoginEmail);
    utils.failInput(formLoginPassword);
}

// Evento que se dispara cuando el campo de correo pierde el enfoque
formLoginEmail.addEventListener('blur', (e) => {
    changeInput(formLoginEmail);
});

// Evento que se dispara cuando el campo de contraseña pierde el enfoque
formLoginPassword.addEventListener('blur', () => {
    changeInput(formLoginPassword);
});

// Evento de envío del formulario
formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    // Realiza una petición HTTP GET a la API con los datos del formulario
    fetch(`http://localhost/?resource_type=patients&user_email=${formLoginEmail.value}&user_password=${formLoginPassword.value}`)
        .then(response => {
            // Si la respuesta no es válida, lanza un error
            if (!response.ok) {
            throw new Error('Error en la petición');
            }

            // Convierte la respuesta a formato JSON
            return response.json();
        })
        .then(data => {
            // Realiza la validación de los campos
            changeInput(formLoginEmail);
            changeInput(formLoginPassword);
            

            // Si ambos campos son válidos, verifica el rol del usuario
            if (isEmailValid && isPasswordValid) {
                if (data.role) {
                    // Si el rol es "patient", redirige a la página del paciente
                    if (data.role == "patient") {
                        location.assign(`../frontend/html/patient.html?resource_id=${data.id}`);
                    } else {
                        // Si el rol es "doctor", redirige a la página del doctor
                        location.assign(`../frontend/html/doctor.html?resource_id=${data.id}`);
                    }
                } else {
                    // Si el usuario no tiene rol, reinicia los campos y muestra un error
                    resetInputs();
                    errorsSpanNotFound.innerText = "Usuario no encontrado";
                }
            } else {
                // Si los campos no son válidos, reinicia los campos
                resetInputs();
            }
        })
        .catch(error => {
            // Si ocurre un error, lo muestra en la consola
            console.error('Error:', error);
        });
});

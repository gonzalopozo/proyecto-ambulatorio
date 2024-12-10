import utils from './helpers/utils.mjs';

const formLogin = document.querySelector('#login-form');
const formLoginEmail = document.querySelector('#email');
const formLoginPassword = document.querySelector('#password');
const errorsSpanEmail = document.querySelector('.errors #email');
const errorsSpanPassword = document.querySelector('.errors #password');
const errorsSpanNotFound = document.querySelector('.errors #not-found');


let isEmailValid = false;
let isPasswordValid = false;

function changeInput(input) {
    errorsSpanPassword.innerText = "";
    const inputValue = input.value;
    
    const inputType = input.type;

    if (inputType == "email") {
        if (inputValue.match(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i)) {
            utils.successInput(input);
            isEmailValid = true;
            errorsSpanEmail.innerText = "";
        } else {
            utils.failInput(input);
            isEmailValid = false;
            errorsSpanEmail.innerText = "Email introducido incorretamente";
        }
    } else if (inputType == "password") {
        if (inputValue.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            utils.successInput(input);
            isPasswordValid = true;
            errorsSpanPassword.innerText = "";
        } else {
            utils.failInput(input);
            isPasswordValid = false;
            errorsSpanPassword.innerText = "Contraseña no valida";
        }
    }
    
}

function resetInputs() {
    formLoginEmail.value = '';
    formLoginPassword.value = '';

    utils.failInput(formLoginEmail);
    utils.failInput(formLoginPassword);
}

formLoginEmail.addEventListener('blur', (e) => {
    changeInput(formLoginEmail);
});

formLoginPassword.addEventListener('blur', () => {
    changeInput(formLoginPassword);
});


formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch(`http://localhost/?resource_type=patients&user_email=${formLoginEmail.value}&user_password=${formLoginPassword.value}`)
        .then(response => {
            if (!response.ok) {
            throw new Error('Error en la petición');
            }

            return response.json();
        })
        .then(data => {
            changeInput(formLoginEmail);
            changeInput(formLoginPassword);
            

            if (isEmailValid && isPasswordValid) {
                if (data.role) {
                    if (data.role == "patient") {
                        location.assign(`../frontend/html/patient.html?resource_id=${data.id}`);
                    } else {
                        location.assign(`../frontend/html/doctor.html?resource_id=${data.id}`);
                    }
                } else {
                    resetInputs();
                    errorsSpanNotFound.innerText = "Usuario no encontrado";
                }
            } else {
                resetInputs();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
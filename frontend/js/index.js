const formLogin = document.querySelector('#login-form');
const formLoginEmail = document.querySelector('#email');
const formLoginPassword = document.querySelector('#password');

let isEmailValid = false;
let isPasswordValid = false;

function changeInput(input) {
    const inputValue = input.value;
    
    const inputType = input.type;

    if (inputType == "email") {
        if (inputValue.match(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i)) {
            input.style.borderColor = "rgb(93, 226, 102)";
            input.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
            isEmailValid = true;
        } else {
            input.style.borderColor = "rgb(226, 93, 93)";
            input.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
            isEmailValid = false;
        }
    } else if (inputType == "password") {
        if (inputValue.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            input.style.borderColor = "rgb(93, 226, 102)";
            input.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
            isPasswordValid = true;
        } else {
            input.style.borderColor = "rgb(226, 93, 93)";
            input.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
            isPasswordValid = false;
        }
    }
    
}

function resetInputs() {
    formLoginEmail.value = '';
    formLoginPassword.value = '';

    formLoginEmail.style.borderColor = "#AAA";
    formLoginEmail.style.boxShadow = "none";

    formLoginPassword.style.borderColor = "#AAA";
    formLoginPassword.style.boxShadow = "none";
}

formLoginEmail.addEventListener('blur', (e) => {
    console.log(e);
    
    changeInput(formLoginEmail);
});

formLoginPassword.addEventListener('blur', () => {
    changeInput(formLoginPassword);
});


formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    // Realizamos la petición GET
    fetch(`http://localhost/?resource_type=patients&user_email=${formLoginEmail.value}&user_password=${formLoginPassword.value}`)
        .then(response => {
            console.log(response);
            console.log(JSON.stringify(response));
            
            // Verificamos si la respuesta es exitosa (status 200-299)
            if (!response.ok) {
            throw new Error('Error en la petición');
            }
            return response.json(); // Parseamos la respuesta como JSON
        })
        .then(data => {
            console.log('Respuesta de la API:', data);

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
                }
            } else {
                resetInputs();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

});
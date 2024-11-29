const formLogin = document.querySelector('#login-form');
const formLoginEmail = document.querySelector('#email');
const formLoginPassword = document.querySelector('#password');

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();


    // Construimos la URL con los parámetros
    const url = `http://localhost/?resource_type=patients&user_email=${formLoginEmail.value}&user_password=${formLoginPassword.value}`;

    // Realizamos la petición GET
    fetch(url)
        .then(response => {
            // Verificamos si la respuesta es exitosa (status 200-299)
            if (!response.ok) {
            throw new Error('Error en la petición');
            }
            return response.json(); // Parseamos la respuesta como JSON
        })
        .then(data => {
            console.log('Respuesta de la API:', data);
            // Aquí puedes usar la respuesta de la API (por ejemplo, mostrarla en la UI)
            if (data.role == "patient") {
                window.location.assign(`../frontend/html/patient.html?resource_id=${data.id}`);
            } else {
                window.location.assign(`../frontend/html/doctor.html?resource_id=${data.id}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

});
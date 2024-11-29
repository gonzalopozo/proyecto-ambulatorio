document.addEventListener("DOMContentLoaded", (e) => {
    const queryParams = new URLSearchParams(location.search);
    const id = parseInt(queryParams.get('resource_id')); // Extraer resource_id de forma segura

    const pathName = (location.pathname).split('/');

    let idExists = false;
    
    fetch(`http://localhost/?resource_type=doctors`)
        .then(response => {
            // Verificamos si la respuesta es exitosa (status 200-299)
            if (!response.ok) {
            throw new Error('Error en la petición');
            }
            return response.json(); // Parseamos la respuesta como JSON
        })
        .then(data => {
            for (const eachRow of data) {
                if (id == eachRow.id) {
                    idExists = true;
                }
            }

            if ((pathName[pathName.length - 1] === 'doctor.html') && idExists) {
                console.log("id real ->" + idExists);
            } else {
                location.assign(`../html/error404.html`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });


    
});
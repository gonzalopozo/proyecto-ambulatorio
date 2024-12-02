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

    const modal = document.querySelector(".modal");
    const closeModalBtn = document.querySelector(".modal div .close-btn");

    // Cerrar modalPastAppointemetnsDOM
    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hide");
        modal.addEventListener("animationend", () => {
            modal.classList.remove("show");
        }, { once: true });
    });

    // Cerrar modalPastAppointemetnsDOM haciendo clic fuera del contenido
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModalBtn.click(); // Simula el clic en la "X"
        }
    });
});

const doctorName = document.querySelector('.doctor-name');
const doctorEmail = document.querySelector('.doctor-email');
const doctorPhone = document.querySelector('.doctor-phone');
const doctorSpecialty = document.querySelector('.doctor-specialty');
const doctorAppointmentsNextSevenDays = document.querySelector('.doctor-appointments-next-seven-days span');
const doctorTodayAppointmentsTable = document.querySelector('.doctor-today-appointments table tbody');
const modal = document.querySelector(".modal");

const queryParams = new URLSearchParams(location.search);
const id = parseInt(queryParams.get('resource_id'));

function selectDoctorInfo(id) {
    return fetch(`http://localhost/?resource_type=doctors&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            return data[0];
            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

selectDoctorInfo(id).then(doctorInfo => {
    doctorName.innerText = doctorInfo.name;
    doctorEmail.innerText = doctorInfo.email;
    doctorPhone.innerText = doctorInfo.phone;
    doctorSpecialty.innerText = doctorInfo.specialty;
});

function selectAppointmentsNextSevenDays(id) {
    return fetch(`http://localhost/?resource_type=appointments_for_doctors_7_days&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            
            return data;
            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

selectAppointmentsNextSevenDays(id).then(appointments => {
    let counter = 0;

    appointments.forEach(() => counter++);

    doctorAppointmentsNextSevenDays.innerText = counter;
});

function selectAppointmentsToday(id) {
    return fetch(`http://localhost/?resource_type=appointments_for_doctors&resource_id=${id}`)
    
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            
            return data;
            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

selectAppointmentsToday(id).then(appointmentsToday => {
    appointmentsToday.forEach(appointment => {
        const tableRow = document.createElement('tr');
        
        const tableCellAppointmentId = document.createElement('td');
        const tableCellPatient = document.createElement('td');
        const tableCellSymptomatology = document.createElement('td');
        const tableCellBtn = document.createElement('td');

        const btnStartAppointment = document.createElement('button');
        btnStartAppointment.innerText = '¡Iniciar consulta!';
        btnStartAppointment.addEventListener('click', () => {
            openAppointmentModal(appointment.id);
        })

        tableCellBtn.appendChild(btnStartAppointment);

        tableCellAppointmentId.innerText = appointment.id;
        tableCellPatient.innerText = appointment.patient_name;
        tableCellSymptomatology.innerText = appointment.symptomatology;

        tableRow.appendChild(tableCellAppointmentId);
        tableRow.appendChild(tableCellPatient);
        tableRow.appendChild(tableCellSymptomatology);
        tableRow.appendChild(tableCellBtn);

        doctorTodayAppointmentsTable.appendChild(tableRow);

    })
});

function openAppointmentModal(appointmentId) {
    // Mostrar el modal
    modal.classList.add('show');
    modal.classList.remove('hide');
} 
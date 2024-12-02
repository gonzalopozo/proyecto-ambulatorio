document.addEventListener("DOMContentLoaded", () => {
    const queryParams = new URLSearchParams(location.search);
    const id = parseInt(queryParams.get('resource_id')); // Extraer resource_id de forma segura
    const pathName = (location.pathname).split('/');

    function thisPatientExists(id) {
        return fetch(`http://localhost/?resource_type=patients`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la petición');
                }
                return response.json();
            })
            .then(data => {
                for (const eachRow of data) {
                    if (id == eachRow.id) {
                        return true;
                    }
                }
                return false;
            })
            .catch(error => {
                console.error('Error:', error);
                return false;
            });
    }

    thisPatientExists(id).then(idExists => {
        console.log(idExists); // Ahora idExists tendrá un valor booleano

        if (!((pathName[pathName.length - 1] === 'patient.html') && idExists)) {
            location.assign(`../html/error404.html`);
        }        
    });

    const modalNewAppointment = document.querySelector("#modal-new-appointment");
    const openModalNewAppointmentBtn = document.querySelector(".user-make-appointment-btn");
    const closeModalNewAppointmentBtn = document.querySelector("#modal-new-appointment div .close-btn");

    // Abrir modal
    openModalNewAppointmentBtn.addEventListener("click", () => {
        modalNewAppointment.classList.add("show");
        modalNewAppointment.classList.remove("hide");
    });

    // Cerrar modalNewAppointment
    closeModalNewAppointmentBtn.addEventListener("click", () => {
        modalNewAppointment.classList.add("hide");
        modalNewAppointment.addEventListener("animationend", () => {
            modalNewAppointment.classList.remove("show");
        }, { once: true });
    });

    // Cerrar modalNewAppointment haciendo clic fuera del contenido
    modalNewAppointment.addEventListener("click", (event) => {
        if (event.target === modalNewAppointment) {
            closeModalNewAppointmentBtn.click(); // Simula el clic en la "X"
        }
    });

    const modalPastAppointemetnsDOM = document.querySelector(".modal-past-appointments");
    const closeModalPastAppointemetnsDOMtBtn = document.querySelector(".modal-past-appointments div .close-btn");

    console.log(closeModalPastAppointemetnsDOMtBtn);
    

    // Cerrar modalPastAppointemetnsDOM
    closeModalPastAppointemetnsDOMtBtn.addEventListener("click", () => {
        modalPastAppointemetnsDOM.classList.add("hide");
        modalPastAppointemetnsDOM.addEventListener("animationend", () => {
            modalPastAppointemetnsDOM.classList.remove("show");
        }, { once: true });
    });

    // Cerrar modalPastAppointemetnsDOM haciendo clic fuera del contenido
    modalPastAppointemetnsDOM.addEventListener("click", (event) => {
        if (event.target === modalPastAppointemetnsDOM) {
            closeModalPastAppointemetnsDOMtBtn.click(); // Simula el clic en la "X"
        }
    });
    
});


const userName = document.querySelector('.user-name');
const userEmail = document.querySelector('.user-email');
const userDni = document.querySelector('.user-dni');
const userPhone = document.querySelector('.user-phone');
const userAddress = document.querySelector('.user-address');
const userSex = document.querySelector('.user-sex');
const userBornDate = document.querySelector('.user-born-date');
const userCurrentMedicationTable = document.querySelector('.user-current-medication table tbody');
const userUpcomingAppointmentsTable = document.querySelector('.user-upcoming-appointments table tbody');
const userPastAppointmentsTable = document.querySelector('.user-past-appointments table tbody');
const modalDoctorsSelect = document.querySelector('#doctor-select');
const modalAppointmentDate = document.querySelector('#appointment-date');
const modalAppointmentSymptomatology = document.querySelector('#appointment-symptomatology');
const modalSubmitBtn = document.querySelector('.modal-submit-btn');
const userNameHeader = document.querySelector('.user-name-header');
const errorsSpan = document.querySelector('.errors span');

const modalPastAppointments = document.querySelector('.modal-past-appointments');
const modalPastAppointmentsTitle = document.querySelector('.modal-title');
const modalPastAppointmentsDoctorName = document.querySelector('.modal-doctor-name');
const modalPastAppointmentsAppointmentDate = document.querySelector('.modal-appointment-date');
const modalPastAppointmentsSymptomatology = document.querySelector('.modal-symptomatology');
const modalPastAppointmentsDiagnosis = document.querySelector('.modal-diagnosis');
const modalPastAppointmentsPdfAttachment = document.querySelector('.modal-pdf-attachment');
const modalPastAppointmentsMedication = document.querySelector('.modal-medication');
const modalPastAppointmentsPosology = document.querySelector('.modal-posology');
const modalPastAppointmentsChronic = document.querySelector('.modal-chronic');
const modalPastAppointmentsDuration = document.querySelector('.modal-duration');

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

function esFechaMayor30Dias(fecha) {
    const fechaActual = new Date();
    
    // Sumar 30 días a la fecha actual
    const fechaLimite = new Date(fechaActual);
    fechaLimite.setDate(fechaActual.getDate() + 30);

    // Comparar si la fecha es igual o posterior a la fecha límite
    return fecha >= fechaLimite;
}


const queryParams = new URLSearchParams(location.search);
const id = parseInt(queryParams.get('resource_id'));

function selectPatientInfo(id) {
    return fetch(`http://localhost/?resource_type=patients&resource_id=${id}`)
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

selectPatientInfo(id).then(userInfo => {
    userName.innerText = userInfo.name;
    userNameHeader.innerText = userInfo.name;
    userEmail.innerText = userInfo.email;
    userDni.innerText = userInfo.dni;
    userPhone.innerText = userInfo.phone;
    userAddress.innerText = userInfo.address;
    userSex.innerText = userInfo.sex == 'male' ? 'Hombre' : 'Mujer'; 
    let bornDate = new Date(userInfo.born_date);

    userBornDate.innerText = `${bornDate.getDate()}/${bornDate.getMonth() < 10 ? `0${bornDate.getMonth()}` : bornDate.getMonth()}/${bornDate.getFullYear()}`;    
});

function selectCurrentMedication(id) {
    return fetch(`http://localhost/?resource_type=appointment_medicines&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            return data;            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

selectCurrentMedication(id).then (currentMedication => {
    currentMedication.forEach(medication => {
        const tableRow = document.createElement('tr');
        
        const tableCellMedicineName = document.createElement('td');
        const tableCellPosology = document.createElement('td');
        const tableCellChronic = document.createElement('td');
        const tableCellDurationDays = document.createElement('td');

        tableCellMedicineName.innerText = medication.medicine_name;
        tableCellPosology.innerText = `${medication.quantity} ${medication.frequency}`;
        tableCellChronic.innerText = medication.chronic > 0 ? 'Si' : 'No';
        if (tableCellChronic.innerText == 'No') {
            let appointmentDate = new Date(medication.appointment_date);

            console.log(appointmentDate.getDate());
            console.log(medication.duration_days);
            

            appointmentDate.setDate(appointmentDate.getDate() + parseInt(medication.duration_days));

            console.log(appointmentDate);

            tableCellDurationDays.innerText = `${appointmentDate.getDate()}/${appointmentDate.getMonth() < 10 ? `0${appointmentDate.getMonth()}` : appointmentDate.getMonth()}/${appointmentDate.getFullYear()}`;    
        } else {
            tableCellDurationDays.innerText = "";
        }
        
        tableRow.appendChild(tableCellMedicineName);
        tableRow.appendChild(tableCellPosology);
        tableRow.appendChild(tableCellChronic);
        tableRow.appendChild(tableCellDurationDays);

        userCurrentMedicationTable.appendChild(tableRow);
    });
});


function selectStatusAppointments(status, id) {
    return fetch(`http://localhost/?resource_type=appointments&appointments_status=${status}&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(upcomingAppointments => {
            upcomingAppointments.forEach(eachAppointment => {
                const tableRow = document.createElement('tr');
                
                const tableCellId = document.createElement('td');
                const tableCellDoctorName = document.createElement('td');
                const tableCellAppointmentDate = document.createElement('td');
        
                tableCellId.innerText = eachAppointment.id;
                tableCellDoctorName.innerText = eachAppointment.doctor_name;
        
                let appointmentDate = new Date(eachAppointment.appointment_date);
        
                tableCellAppointmentDate.innerText = `${appointmentDate.getDate()}/${appointmentDate.getMonth() < 10 ? `0${appointmentDate.getMonth()}` : appointmentDate.getMonth()}/${appointmentDate.getFullYear()} a las ${appointmentDate.getHours() < 10 ? `0${appointmentDate.getHours()}` : appointmentDate.getHours()}:${appointmentDate.getMinutes() < 10 ? `0${appointmentDate.getMinutes()}` : appointmentDate.getMinutes()}`;    
                
                tableRow.appendChild(tableCellId);
                tableRow.appendChild(tableCellDoctorName);
                tableRow.appendChild(tableCellAppointmentDate);
        
                if (status == 'upcoming') {
                    userUpcomingAppointmentsTable.appendChild(tableRow)
                } else if (status == 'past') {
                    userPastAppointmentsTable.appendChild(tableRow);

                    // Añadir un event listener al hacer clic en la fila para abrir el modal
                    tableRow.addEventListener('click', () => {
                        openPastAppointmentModal(eachAppointment.id);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

function openPastAppointmentModal(appointmentId) {

    fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(pastAppointmentInfo => {
            let info = pastAppointmentInfo[0];

            // Rellenar el modal con la información de la cita pasada
            modalPastAppointmentsTitle.innerText = `Consulta con el ID ${appointmentId}`;
            modalPastAppointmentsDoctorName.innerText = info.doctor_name;
            
            let appointmentDate = new Date(info.appointment_date);
            modalPastAppointmentsAppointmentDate.innerText = `${appointmentDate.getDate()}/${appointmentDate.getMonth() < 10 ? `0${appointmentDate.getMonth()}` : appointmentDate.getMonth()}/${appointmentDate.getFullYear()} a las ${appointmentDate.getHours()}:${appointmentDate.getMinutes() < 10 ? `0${appointmentDate.getMinutes()}` : appointmentDate.getMinutes()}`;

            modalPastAppointmentsSymptomatology.innerText = info.symptomatology;
            modalPastAppointmentsDiagnosis.innerText = info.diagnosis;

            if (info.pdf_file) {
                modalPastAppointmentsPdfAttachment.innerHTML = `<a href="${info.pdf_file}" target="_blank">Ver PDF</a>`;
            } else {
                modalPastAppointmentsPdfAttachment.innerText = 'No hay PDF adjunto';
            }

            if (info.medicine_name) {
                modalPastAppointmentsMedication.innerText = info.medicine_name;
                modalPastAppointmentsPosology.innerText = `${info.posology} ${info.frequency}`;
                modalPastAppointmentsChronic.innerText = info.chronic > 0 ? 'Sí' : 'No';
                if (modalPastAppointmentsChronic.innerText == 'No') {
                    let durationDate = new Date(info.appointment_date);

                    durationDate.setDate(durationDate.getDate() + parseInt(info.duration_days));
                    modalPastAppointmentsDuration.innerText = `hasta ${durationDate.getDate()}/${durationDate.getMonth() < 10 ? `0${durationDate.getMonth()}` : durationDate.getMonth()}/${durationDate.getFullYear()}`;
                } else {
                    modalPastAppointmentsDuration.innerText = '';
                }
            } else {
                modalPastAppointmentsMedication.innerText = 'No se recetó medicamento';
                modalPastAppointmentsPosology.innerText = '';
                modalPastAppointmentsChronic.innerText = '';
                modalPastAppointmentsDuration.innerText = '';
            }

            // Mostrar el modal
            modalPastAppointments.classList.add('show');
            modalPastAppointments.classList.remove('hide');

            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

selectStatusAppointments("upcoming", id);
selectStatusAppointments("past", id);

function selectDoctors(id) {
    return fetch(`http://localhost/?resource_type=doctor_patients&resource_id=${id}`)
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

selectDoctors(id).then(eachDoctor => {
    eachDoctor.forEach(doctor => {
        // console.log(doctor);
        
        const selectOpt = document.createElement('option');

        selectOpt.value = doctor.doctor_id;
        selectOpt.innerText = `${doctor.name} (${doctor.specialty})`;

        modalDoctorsSelect.appendChild(selectOpt);
    })
});


modalSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    var newAppointmentDate = new Date(modalAppointmentDate.value);

    const newAppointment = {
        patient_id: id,
        doctor_id: parseInt(modalDoctorsSelect.selectedOptions[0].value),
        appointment_date: getFormattedDate(newAppointmentDate),
        symptomatology: modalAppointmentSymptomatology.value
    }
    

    console.log(newAppointment);
    
    let isDateValid = false;

    
    if (newAppointmentDate < Date.now()) {
        errorsSpan.innerText = "Fecha no valida";
    } else if (newAppointmentDate.getDay() == 6 || newAppointmentDate.getDay() == 0) {
        errorsSpan.innerText = "Por favor, elija un día laborable";
    } else if (esFechaMayor30Dias(newAppointmentDate)) {
        errorsSpan.innerText = "Tan malo no estarás. Pide una fecha como máximo 30 días en el futuro";
    } else {
        isDateValid = true;
    }
    
    if (isDateValid) {
        fetch(`http://localhost/?resource_type=appointments`, {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Especificar que el cuerpo está en formato JSON
            },
            body: JSON.stringify(newAppointment)
        })
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

    
});


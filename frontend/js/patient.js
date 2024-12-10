// Se obtienen los parámetros de la URL y se parsea el 'resource_id' como entero
const queryParams = new URLSearchParams(location.search);
const id = parseInt(queryParams.get('resource_id')); 

// Se obtienen los elementos del DOM relacionados con los modales y los botones
const modalNewAppointment = document.querySelector("#modal-new-appointment");
const openModalNewAppointmentBtn = document.querySelector(".user-make-appointment-btn");
const closeModalNewAppointmentBtn = document.querySelector("#modal-new-appointment div .close-btn");

// Se ejecuta cuando el contenido de la página está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    const pathName = (location.pathname).split('/');

    // Función que verifica si el paciente existe en la base de datos
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
                        return true; // El paciente existe
                    }
                }
                return false; // El paciente no existe
            })
            .catch(error => {
                console.error('Error:', error);
                return false; // En caso de error en la petición
            });
    }

    // Verifica si el paciente existe y si la URL está correcta
    thisPatientExists(id).then(idExists => {
        if (!((pathName[pathName.length - 1] === 'patient.html') && idExists)) {
            location.assign(`../html/error404.html`); // Redirige a una página de error si no existe
        }        
    });

    // Abre el modal para hacer una nueva cita
    openModalNewAppointmentBtn.addEventListener("click", () => {
        modalNewAppointment.classList.add("show");
        modalNewAppointment.classList.remove("hide");
    });
    
    // Cierra el modal para hacer una nueva cita
    closeModalNewAppointmentBtn.addEventListener("click", () => {
        modalNewAppointment.classList.add("hide");
        modalNewAppointment.addEventListener("animationend", () => {
            modalNewAppointment.classList.remove("show");
        }, { once: true });
    });

    // Cierra el modal si se hace clic fuera del contenido del modal
    modalNewAppointment.addEventListener("click", (event) => {
        if (event.target === modalNewAppointment) {
            closeModalNewAppointmentBtn.click(); // Simula el clic en la "X"
        }
    });

    // Cierra el modal de citas pasadas
    const closeModalPastAppointemetnsDOMtBtn = document.querySelector("#modal-past-appointments div .close-btn");
    const modalPastAppointemetnsDOM = document.querySelector("#modal-past-appointments");

    closeModalPastAppointemetnsDOMtBtn.addEventListener("click", () => {
        modalPastAppointemetnsDOM.classList.add("hide");
        modalPastAppointemetnsDOM.addEventListener("animationend", () => {
            modalPastAppointemetnsDOM.classList.remove("show");
        }, { once: true });
    });

    // Cierra el modal de citas pasadas si se hace clic fuera del contenido del modal
    modalPastAppointemetnsDOM.addEventListener("click", (event) => {
        if (event.target === modalPastAppointemetnsDOM) {
            closeModalPastAppointemetnsDOMtBtn.click(); // Simula el clic en la "X"
        }
    });
});

// Se importa un módulo externo con funciones utilitarias
import utils from './helpers/utils.mjs';

// Se obtienen elementos del DOM relacionados con el usuario y la hora
const userNameHeader = document.querySelector('.user-name-header');
const clock = document.querySelector('.clock');

// Se actualiza el reloj en la página
utils.refreshClock(clock);

// Se obtienen los elementos del DOM relacionados con la información del usuario
const userName = document.querySelector('.user-name');
const userEmail = document.querySelector('.user-email');
const userDni = document.querySelector('.user-dni');
const userPhone = document.querySelector('.user-phone');
const userAddress = document.querySelector('.user-address');
const userSex = document.querySelector('.user-sex');
const userBornDate = document.querySelector('.user-born-date');

// Tablas para mostrar la medicación actual y las citas futuras y pasadas
const userCurrentMedicationTable = document.querySelector('.user-current-medication table tbody');
const userUpcomingAppointmentsTable = document.querySelector('.user-upcoming-appointments table tbody');
const userPastAppointmentsTable = document.querySelector('.user-past-appointments table tbody');

// Se obtienen los elementos del DOM para el modal de la nueva cita
const modalDoctorsSelect = document.querySelector('#doctor-select');
const modalAppointmentDate = document.querySelector('#appointment-date');
const errorsSpan = document.querySelector('.errors span');
const modalAppointmentSymptomatology = document.querySelector('#appointment-symptomatology');
const modalSubmitBtn = document.querySelector('.modal-submit-btn');

// Se obtienen los elementos del DOM para el modal de citas pasadas
const modalPastAppointments = document.querySelector('#modal-past-appointments');
const modalPastAppointmentsTitle = document.querySelector('#modal-past-appointments .modal-content .modal-title');
const modalPastAppointmentsDoctorName = document.querySelector('.modal-doctor-name');
const modalPastAppointmentsAppointmentDate = document.querySelector('.modal-appointment-date');
const modalPastAppointmentsSymptomatology = document.querySelector('.modal-symptomatology');
const modalPastAppointmentsDiagnosis = document.querySelector('.modal-diagnosis');
const modalPastAppointmentsPdfAttachment = document.querySelector('.modal-pdf-attachment');
const modalPastAppointmentsMedicationContainer = document.querySelector('.modal-medication-container');
const modalPastAppointmentsMedication = document.querySelector('.modal-medication');

// Función para validar la fecha de la cita
function appointmentDateValidation(date) {
    let validation = false;

    // Verifica si la fecha es válida
    if (date < Date.now() || !modalAppointmentDate.value) {
        errorsSpan.innerText = "Fecha no valida";
        utils.failInput(modalAppointmentDate);
    } else if (date.getDay() == 6 || date.getDay() == 0) {
        errorsSpan.innerText = "Por favor, elija un día laborable";
        utils.failInput(modalAppointmentDate);
    } else if (utils.isDate30DaysLater(date)) {
        errorsSpan.innerText = "Tan malo no estarás. Pide una fecha como máximo 30 días en el futuro";
        utils.failInput(modalAppointmentDate);
    } else if (date.getHours() < 8 || date.getHours() > 21) {
        errorsSpan.innerText = "Por favor, elija un hora laborable";
        utils.failInput(modalAppointmentDate);
    } else {
        errorsSpan.innerText = "";
        utils.successInput(modalAppointmentDate);
        validation = true; // La fecha es válida
    }

    return validation;
}

// Se valida la fecha de la cita cuando se pierde el foco del campo
modalAppointmentDate.addEventListener('blur', () => {
    const appointmentDateValue = new Date(modalAppointmentDate.value);

    appointmentDateValidation(appointmentDateValue);
});

// Función que obtiene la información del paciente por su ID
function selectPatientInfo(id) {
    return fetch(`http://localhost/?resource_type=patients&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            return data[0]; // Devuelve la información del paciente
        })
        .catch(error => {
            console.error('Error:', error);
            return false; // En caso de error en la petición
        });
}

// Se carga la información del paciente en los elementos del DOM
selectPatientInfo(id).then(userInfo => {
    userName.innerText = userInfo.name;
    userNameHeader.innerText = utils.takeJustName(userInfo.name);
    userEmail.innerText = userInfo.email;
    userDni.innerText = userInfo.dni;
    userPhone.innerText = userInfo.phone;
    userAddress.innerText = userInfo.address;
    userSex.innerText = userInfo.sex == 'male' ? 'Hombre' : 'Mujer'; 

    let bornDate = new Date(userInfo.born_date);
    userBornDate.innerText = utils.getFormattedDayMonthYear(bornDate); 
});

// Función para obtener la medicación actual del paciente por su ID
function selectCurrentMedication(id) {
    return fetch(`http://localhost/?resource_type=appointment_medicines&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }

            return response.json(); // Devuelve los datos de la medicación
        })
        .then(data => {
            return data;            
        })
        .catch(error => {
            console.error('Error:', error);
            return false; // En caso de error en la petición
        });
}

// Se carga la medicación actual del paciente en la tabla correspondiente
selectCurrentMedication(id).then(currentMedication => {
    if (currentMedication.length > 0) {
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
    
                appointmentDate.setDate(appointmentDate.getDate() + parseInt(medication.duration_days));

                if (appointmentDate < Date.now()) {
                    return; // Si la fecha de la medicación ya pasó, no mostrarla
                } 
                
                tableCellDurationDays.innerText = utils.getFormattedDayMonthYear(appointmentDate);    
            } else {
                tableCellDurationDays.innerText = ""; // No mostrar duración si es crónica
            }
            
            tableRow.appendChild(tableCellMedicineName);
            tableRow.appendChild(tableCellPosology);
            tableRow.appendChild(tableCellChronic);
            tableRow.appendChild(tableCellDurationDays);
    
            userCurrentMedicationTable.appendChild(tableRow); // Se añade la fila a la tabla
        });
    } else {
        const tableRow = utils.createNoDataRow('No se han encontrado medicamentos', 4);

        userCurrentMedicationTable.appendChild(tableRow); // Mostrar mensaje si no hay medicación
    }
});

// Función para abrir y llenar el modal de cita pasada con la información obtenida de la API
function openAndFillPastAppointmentModal(appointmentId) {
    // Hacemos una solicitud GET para obtener la información de la cita pasada
    fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentId}`)
        .then(response => {
            // Verificamos si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(pastAppointmentInfo => {
            let info = pastAppointmentInfo[0];

            // Actualizamos el título del modal con el ID de la cita
            modalPastAppointmentsTitle.innerText = `Consulta con el ID ${appointmentId}:`;
            modalPastAppointmentsDoctorName.innerText = info.doctor_name;

            // Convertimos la fecha de la cita y la mostramos en el modal
            let appointmentDate = new Date(info.appointment_date);
            modalPastAppointmentsAppointmentDate.innerText = utils.getFormattedDayMonthYearHoursSeconds(appointmentDate);

            modalPastAppointmentsSymptomatology.innerText = info.symptomatology;
            modalPastAppointmentsDiagnosis.innerText = info.diagnosis;

            // Comprobamos si hay un archivo PDF adjunto
            if (info.pdf_file && (info.pdf_file != "none")) {
                const link = document.createElement('a');

                // Solicitamos el archivo PDF
                fetch(`http://localhost/uploads/${info.pdf_file}`)  // La ruta del archivo PDF en el servidor
                    .then(response => {
                        // Verificamos si la respuesta es exitosa
                        if (!response.ok) {
                            throw new Error('No se pudo descargar el archivo');
                        }
                        return response.blob();  // Convertimos la respuesta en un blob (objeto binario)
                    })
                    .then(blob => {
                        // Creamos un enlace temporal para la descarga
                        link.innerText = "Descargar PDF";
                        link.href = URL.createObjectURL(blob);  // Creamos un URL de objeto del blob
                        link.download = info.pdf_file;  // Nombre del archivo a descargar
                    })
                    .catch(error => {
                        console.error('Error descargando el archivo:', error);  // Manejamos errores
                    });

                modalPastAppointmentsPdfAttachment.innerText = "";

                // Agregamos el enlace de descarga al DOM
                modalPastAppointmentsPdfAttachment.appendChild(link); 

            } else {
                modalPastAppointmentsPdfAttachment.innerText = 'No hay PDF adjunto';
            }

            // Comprobamos si hay medicamentos recetados
            if (info.medicine_name && pastAppointmentInfo.length >= 1) {
                // Si solo hay un medicamento o varios, actualizamos el texto en consecuencia
                if (pastAppointmentInfo.length == 1) {
                    modalPastAppointmentsMedicationContainer.innerText = 'Medicamento recetado: ';
                } else {
                    modalPastAppointmentsMedicationContainer.innerText = 'Medicamentos recetados: ';
                }

                // Recorremos la lista de medicamentos recetados
                pastAppointmentInfo.forEach(medicine => {
                    const medication = document.createElement('li');

                    medication.innerHTML = `<b>- ${medicine.medicine_name}:</b> ${medicine.posology} ${medicine.frequency} `;

                    // Si el medicamento no es crónico, mostramos la fecha de finalización
                    if (medicine.chronic == 0 ) {
                        let durationDate = new Date(medicine.appointment_date);
                        
                        durationDate.setDate(durationDate.getDate() + parseInt(medicine.duration_days));

                        medication.innerHTML += `hasta el ${utils.getFormattedDayMonthYear(durationDate)}`;
                    }

                    medication.innerHTML += ` | <b>¿Crónico?</b> ${medicine.chronic > 0 ? 'Sí' : 'No'}`;

                    // Agregamos el medicamento al DOM
                    modalPastAppointmentsMedication.appendChild(medication);
                });
            } else {
                modalPastAppointmentsMedication.innerText = 'No se recetó medicamento';
            }

            // Mostramos el modal
            modalPastAppointments.classList.add('show');
            modalPastAppointments.classList.remove('hide');
            
        })
        .catch(error => {
            console.error('Error:', error); // Manejamos errores de la solicitud
            return false;
        });
}

// Función para seleccionar el estado de las citas (próximas o pasadas)
function selectStatusAppointments(status, id) {
    return fetch(`http://localhost/?resource_type=appointments&appointments_status=${status}&resource_id=${id}`)
        .then(response => {
            // Verificamos si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(appointments => {
            // Si hay citas, las mostramos en la tabla correspondiente
            if (appointments.length > 0) {
                appointments.forEach(eachAppointment => {
                    const tableRow = document.createElement('tr');
                    
                    const tableCellId = document.createElement('td');
                    const tableCellDoctorName = document.createElement('td');
                    const tableCellAppointmentDate = document.createElement('td');
            
                    tableCellId.innerText = eachAppointment.id;
                    tableCellDoctorName.innerText = eachAppointment.doctor_name;
            
                    let appointmentDate = new Date(eachAppointment.appointment_date);
            
                    tableCellAppointmentDate.innerText = utils.getFormattedDayMonthYearHoursSeconds(appointmentDate);    
                    
                    // Añadimos las celdas a la fila de la tabla
                    tableRow.appendChild(tableCellId);
                    tableRow.appendChild(tableCellDoctorName);
                    tableRow.appendChild(tableCellAppointmentDate);
            
                    // Dependiendo del estado, agregamos la fila a la tabla correspondiente
                    if (status == 'upcoming') {
                        userUpcomingAppointmentsTable.appendChild(tableRow)
                    } else if (status == 'past') {
                        tableRow.style.cursor = "pointer";
                        userPastAppointmentsTable.appendChild(tableRow);

                        // Agregamos un evento de clic para abrir el modal de la cita
                        tableRow.addEventListener('click', () => {
                            openAndFillPastAppointmentModal(eachAppointment.id);
                        });
                    }
                });
            } else if (status == 'upcoming') {
                const tableRow = utils.createNoDataRow('No se han encontrado proximas citas', 4);
        
                userUpcomingAppointmentsTable.appendChild(tableRow);
            } else if (status == 'past') {
                const tableRow = utils.createNoDataRow('No se han encontrado citas pasadas', 4);

                userPastAppointmentsTable.appendChild(tableRow);
            }
        })
        .catch(error => {
            console.error('Error:', error); // Manejamos errores de la solicitud
            return false;
        });
}

// Llamada a la función para obtener las citas próximas y pasadas
selectStatusAppointments("upcoming", id);
selectStatusAppointments("past", id);

// Función para seleccionar los doctores asociados a un paciente
function selectDoctors(id) {
    return fetch(`http://localhost/?resource_type=doctor_patients&resource_id=${id}`)
        .then(response => {
            // Verificamos si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            return data;            
        })
        .catch(error => {
            console.error('Error:', error); // Manejamos errores de la solicitud
            return false;
        });
}

// Obtenemos los doctores y los añadimos al selector del modal
selectDoctors(id).then(eachDoctor => {
    eachDoctor.forEach(doctor => {
        const selectOpt = document.createElement('option');

        selectOpt.value = doctor.doctor_id;
        selectOpt.innerText = `${doctor.name} (${doctor.specialty})`;

        modalDoctorsSelect.appendChild(selectOpt);
    })
});

// Evento para manejar la creación de una nueva cita
modalSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();  // Prevenimos el comportamiento por defecto del formulario

    const appointmentDateValue = new Date(modalAppointmentDate.value);

    // Creamos un objeto con la nueva cita
    const newAppointment = {
        patient_id: id,
        doctor_id: parseInt(modalDoctorsSelect.selectedOptions[0].value),
        appointment_date: utils.getFormattedDate(appointmentDateValue),
        symptomatology: modalAppointmentSymptomatology.value.trim()
    }

    // Validamos que la fecha de la cita sea correcta
    const isDateValid = appointmentDateValidation(appointmentDateValue);
    
    if (isDateValid) {
        // Hacemos una solicitud POST para crear la nueva cita
        fetch(`http://localhost/?resource_type=appointments`, {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Especificar que el cuerpo está en formato JSON
            },
            body: JSON.stringify(newAppointment)
        })
            .then(response => {
                // Verificamos si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error('Error en la petición');
                }
                return response.json();
            })
            .then(data => {
                closeModalNewAppointmentBtn.click();  // Cerramos el modal

                setTimeout(() => {
                    // Limpiamos el formulario y actualizamos la lista de citas próximas
                    modalDoctorsSelect.selectedIndex = 0;
                    modalAppointmentDate.value = "";
                    modalAppointmentSymptomatology.value = "";

                    utils.defaultInput(modalAppointmentDate);

                    userUpcomingAppointmentsTable.innerText = "";
                    selectStatusAppointments("upcoming", id);
                }, 400);
                
                return data;            
            })
            .catch(error => {
                console.error('Error:', error); // Manejamos errores de la solicitud
                return false;
            });
    }
});

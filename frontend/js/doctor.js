// Obtener los parámetros de la URL, en particular el 'resource_id'
const queryParams = new URLSearchParams(location.search);
const id = parseInt(queryParams.get('resource_id')); // Convertir 'resource_id' en un número entero

// Selección de elementos del DOM para modal y botón de cerrar
const modal = document.querySelector("#doctor-modal");
const closeModalBtn = document.querySelector("#doctor-modal div .close-btn");

// Evento que se ejecuta cuando el contenido del DOM se ha cargado completamente
document.addEventListener("DOMContentLoaded", (e) => {
    const pathName = (location.pathname).split('/'); // Dividir el pathname para obtener la última parte

    let idExists = false; // Flag para verificar si el id existe

    // Hacer una petición a la API para obtener la lista de doctores
    fetch(`http://localhost/?resource_type=doctors`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición'); // Manejo de error si la respuesta no es válida
            }

            return response.json(); // Parsear la respuesta como JSON
        })
        .then(data => {
            // Verificar si el id existe en la lista de doctores
            for (const eachRow of data) {
                if (id == eachRow.id) {
                    idExists = true;
                }
            }

            // Si no existe el id y la página no es doctor.html, redirigir a 404
            if (!((pathName[pathName.length - 1] === 'doctor.html') && idExists)) {
                location.assign(`../html/error404.html`);
            }
        })
        .catch(error => {
            console.error('Error:', error); // Manejo de errores de la petición
        });

    // Cerrar el modal al hacer clic en el botón de cierre
    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hide");
        modal.addEventListener("animationend", () => {
            modal.classList.remove("show"); // Quitar la clase de 'show' después de la animación
        }, { once: true });
    });

    // Cerrar el modal si se hace clic fuera de él
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModalBtn.click(); // Simula el clic en la "X"
        }
    });
});

// Importar funciones utilitarias desde otro archivo
import utils from './helpers/utils.mjs';

// Selección de elementos para mostrar información del usuario y la hora
const userNameHeader = document.querySelector('.user-name-header');
const clock = document.querySelector('.clock');

// Función para actualizar el reloj
utils.refreshClock(clock);

// Selección de elementos del DOM para mostrar información del doctor y citas
const doctorName = document.querySelector('.doctor-name');
const doctorEmail = document.querySelector('.doctor-email');
const doctorPhone = document.querySelector('.doctor-phone');
const doctorSpecialty = document.querySelector('.doctor-specialty');

// Elementos para mostrar las citas del doctor en los próximos 7 días
const doctorAppointmentsNextSevenDays = document.querySelector('.doctor-appointments-next-seven-days span');
const doctorNextSevenDaysAppointmentsTable = document.querySelector('.doctor-full-appointments-next-seven-days table tbody');
const doctorTodayAppointmentsTable = document.querySelector('.doctor-today-appointments table tbody');

// Elementos relacionados con el formulario de cita
const mainAppointmentForm = document.querySelector('.main-appointment-form');
const appointmentIdInput = document.querySelector('.appointment-id');
const patientIdInput = document.querySelector('.patient-id');

// Elementos para mostrar detalles de la cita
const appointmentDoctorName = document.querySelector('#doctor-name');
const appointmentPatientName = document.querySelector('#patient-name');
const appointmentDateTime = document.querySelector('#appointment-date-time');
const appointmentSymptomatology = document.querySelector('#symptomatology');
const appointmentDiagnosis = document.querySelector('#diagnosis');
const errorsSpanDiagnosis = document.querySelector('.errors #diagnosis-er');

// Elementos relacionados con la medicación
const selectMedication = document.querySelector('#medication-select');
const medicationQuantity = document.querySelector('#medication-quantity');
const medicationFrequency = document.querySelector('#medication-frequency');
const medicationDuration = document.querySelector('#medication-duration');
const medicationCondition = document.querySelector('#chronic-condition');
const errorsMedicineName = document.querySelector('.errors #medicine-er');
const errorsMedicineQuantity = document.querySelector('.errors #quantity-er');
const errorsMedicineFrequency = document.querySelector('.errors #frequency-er');
const errorsMedicineDays = document.querySelector('.errors #days-er');
const addMedicationBtn = document.querySelector('#add-medication-btn');
const medicationTable = document.querySelector('.main-appointment-form .medicines table tbody');

// Elementos para la carga de un archivo PDF
const appointmentPdf = document.querySelector('#upload-pdf');

// Elementos relacionados con la selección de un doctor para una nueva cita
const modalDoctorsSelect = document.querySelector('#doctor-select');
const newAppointmentDateIn = document.querySelector('#new-appointment-date');
const newAppointmentSymptomatology = document.querySelector('#appointment-symptomatology');
const errorsSpan2 = document.querySelector('.errors #new-appointment-er');
const btnReferAppointment = document.querySelector('#create-Appointment');

// Función para obtener información de un doctor específico por su ID
function selectDoctorInfo(id) {
    return fetch(`http://localhost/?resource_type=doctors&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición'); // Manejo de error si la respuesta no es válida
            }
            return response.json(); // Parsear la respuesta como JSON
        })
        .then(data => {
            return data[0]; // Retornar la primera entrada (solo un doctor por ID)
            
        })
        .catch(error => {
            console.error('Error:', error); // Manejo de errores de la petición
            return false; // Retornar false en caso de error
        });
}

// Obtener la información del doctor y actualizar la interfaz con sus datos
selectDoctorInfo(id).then(doctorInfo => {
    doctorName.innerText = doctorInfo.name;
    doctorEmail.innerText = doctorInfo.email;
    doctorPhone.innerText = doctorInfo.phone;
    doctorSpecialty.innerText = doctorInfo.specialty;
    userNameHeader.innerText = `Dr. ${utils.takeJustName(doctorInfo.name)}`; // Función utilitaria para mostrar solo el nombre
});

// Función para obtener las citas programadas para los próximos 7 días de un doctor
function selectAppointmentsNextSevenDays(id) {
    return fetch(`http://localhost/?resource_type=appointments_for_doctors_7_days&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición'); // Manejo de error si la respuesta no es válida
            }
            return response.json(); // Parsear la respuesta como JSON
        })
        .then(data => {
            return data; // Retornar la lista de citas
        })
        .catch(error => {
            console.error('Error:', error); // Manejo de errores de la petición
            return false; // Retornar false en caso de error
        });
}

// Función para actualizar el contador de citas para los próximos 7 días
function updateAppointmentsNextSevenDaysCounter() {
    selectAppointmentsNextSevenDays(id).then(appointments => {
        if (appointments) {
            let counter = 0;

            appointments.forEach(() => counter++); // Contar las citas

            doctorAppointmentsNextSevenDays.innerText = counter; // Mostrar el contador en el DOM
        }
    });
}

// Llamada para actualizar el contador de citas al cargar la página
updateAppointmentsNextSevenDaysCounter();

// Función para obtener las citas de hoy de un doctor
function selectAppointmentsToday(id) {
    return fetch(`http://localhost/?resource_type=appointments_for_doctors&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición'); // Manejo de error si la respuesta no es válida
            }
            return response.json(); // Parsear la respuesta como JSON
        })
        .then(data => {
            return data; // Retornar las citas de hoy
        })
        .catch(error => {
            console.error('Error:', error); // Manejo de errores de la petición
            return false; // Retornar false en caso de error
        });
}

// Función para llenar los campos del formulario con la información de una cita específica
function fillInputs(appointmentId) {
    return fetch(`http://localhost/?resource_type=appointments_by_id&resource_id=${appointmentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición'); // Manejo de error si la respuesta no es válida
            }
            return response.json(); // Parsear la respuesta como JSON
        })
        .then(data => {
            return data[0]; // Retornar la primera cita
        })
        .then(appointmentInfo => {
            // Rellenar los campos del formulario con los datos de la cita
            appointmentDoctorName.value = appointmentInfo.doctor_name;
            appointmentPatientName.value = appointmentInfo.patient_name;
            let date = new Date(appointmentInfo.appointment_date);

            appointmentDateTime.value = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            appointmentSymptomatology.innerText = appointmentInfo.symptomatology;

            appointmentIdInput.innerText = appointmentId;
            patientIdInput.innerText = appointmentInfo.patient_id;

            selectDoctors(appointmentInfo.patient_id); // Seleccionar los doctores asociados a la cita
        })
        .catch(error => {
            console.error('Error:', error); // Manejo de errores de la petición
            return false; // Retornar false en caso de error
        });
}

// Función para abrir el modal de cita, pasando un ID de cita como argumento
function openAppointmentModal(appointmentId) {
    // Llama a la función 'fillInputs' para rellenar los campos del formulario con los datos de la cita
    fillInputs(appointmentId).then(() => {
        // Realiza una petición para obtener la lista de medicamentos
        fetch(`http://localhost/?resource_type=medicines`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la petición'); // Error si la respuesta no es correcta
                }
                return response.json(); // Convierte la respuesta en formato JSON
            })
            .then(medicines => {
                // Recorre la lista de medicamentos y añade una opción en un select
                medicines.forEach(eachMedicine => {
                    const opt = document.createElement('option');
                    opt.value = eachMedicine.id; // Asigna el ID del medicamento como valor
                    opt.innerText = eachMedicine.name; // Asigna el nombre del medicamento como texto
                    selectMedication.appendChild(opt); // Añade la opción al select
                });
            })
            .catch(error => {
                console.error('Error:', error); // Captura y muestra errores de la petición
                return false;
            });
    });

    // Muestra el modal añadiendo la clase 'show' y eliminando 'hide'
    modal.classList.add('show');
    modal.classList.remove('hide');
} 

// Función para actualizar la tabla con las citas de los próximos 7 días
function updateNextSevenDaysAppointmentsTable() {
    // Llama a la función 'selectAppointmentsNextSevenDays' para obtener las citas
    selectAppointmentsNextSevenDays(id).then(appointments => {
        // Limpia el contenido de la tabla de citas
        doctorNextSevenDaysAppointmentsTable.innerText = "";

        if (appointments.length > 0) { // Si hay citas, se recorren y se añaden a la tabla
            appointments.forEach(appointment => {
                const tableRow = document.createElement('tr'); // Crea una nueva fila en la tabla

                // Crea las celdas para cada campo de la cita
                const tableCellAppointmentId = document.createElement('td');
                const tableCellPatient = document.createElement('td');
                const tableCellSymptomatology = document.createElement('td');
                const tableCellDate = document.createElement('td');

                // Asigna los valores de la cita a las celdas
                tableCellAppointmentId.innerText = appointment.id;
                tableCellPatient.innerText = appointment.patient_name;
                tableCellSymptomatology.innerText = appointment.symptomatology;
                tableCellDate.innerText = utils.getFormattedDayMonthYearHoursSeconds(new Date (appointment.appointment_date));

                // Añade las celdas a la fila
                tableRow.appendChild(tableCellAppointmentId);
                tableRow.appendChild(tableCellPatient);
                tableRow.appendChild(tableCellSymptomatology);
                tableRow.appendChild(tableCellDate);

                // Añade la fila a la tabla
                doctorNextSevenDaysAppointmentsTable.appendChild(tableRow);
            });
        } else {
            // Si no hay citas, muestra un mensaje indicando que no se encontraron citas
            const tableRow = utils.createNoDataRow('No se han encontrado citas para la proxima semana', 4);
            doctorNextSevenDaysAppointmentsTable.appendChild(tableRow);
        }
    });
}

// Llama a la función para actualizar las citas de los próximos 7 días
updateNextSevenDaysAppointmentsTable();

// Función para actualizar la tabla con las citas de hoy
function updateTodayAppointmentsTable() {
    // Llama a la función 'selectAppointmentsToday' para obtener las citas de hoy
    selectAppointmentsToday(id).then(appointments => {
        doctorTodayAppointmentsTable.innerText = ""; // Limpia la tabla de citas

        if (appointments.length > 0) { // Si hay citas, se recorren y se añaden a la tabla
            appointments.forEach(appointment => {
                const tableRow = document.createElement('tr'); // Crea una nueva fila en la tabla

                // Crea las celdas para cada campo de la cita
                const tableCellAppointmentId = document.createElement('td');
                const tableCellPatient = document.createElement('td');
                const tableCellSymptomatology = document.createElement('td');
                const tableCellBtn = document.createElement('td');

                // Crea el botón para iniciar la consulta
                const btnStartAppointment = document.createElement('button');
                btnStartAppointment.innerText = '¡Iniciar consulta!';
                // Añade el evento al botón para abrir el modal con la cita seleccionada
                btnStartAppointment.addEventListener('click', () => {
                    openAppointmentModal(appointment.id);
                });

                tableCellBtn.appendChild(btnStartAppointment); // Añade el botón a la celda

                // Asigna los valores de la cita a las celdas
                tableCellAppointmentId.innerText = appointment.id;
                tableCellPatient.innerText = appointment.patient_name;
                tableCellSymptomatology.innerText = appointment.symptomatology;

                // Añade las celdas a la fila
                tableRow.appendChild(tableCellAppointmentId);
                tableRow.appendChild(tableCellPatient);
                tableRow.appendChild(tableCellSymptomatology);
                tableRow.appendChild(tableCellBtn);

                // Añade la fila a la tabla
                doctorTodayAppointmentsTable.appendChild(tableRow);
            });
        } else {
            // Si no hay citas, muestra un mensaje indicando que no se encontraron citas
            const tableRow = utils.createNoDataRow('No se han encontrado citas para hoy', 4);
            doctorTodayAppointmentsTable.appendChild(tableRow);
        }
    });
}

// Llama a la función para actualizar las citas de hoy
updateTodayAppointmentsTable();

// Añade un evento al checkbox para habilitar o deshabilitar el campo de duración del medicamento
medicationCondition.addEventListener('click', () => {
    if (medicationCondition.checked) {
        medicationDuration.value = ""; // Limpia el valor si se marca el checkbox
        errorsMedicineDays.innerText = ""; // Limpia el mensaje de error
        utils.defaultInput(medicationDuration); // Restaura el estilo por defecto
        medicationDuration.disabled = true; // Deshabilita el campo de duración
    } else {
        medicationDuration.disabled = false; // Habilita el campo de duración si el checkbox no está marcado
    }
});

// Añade un evento al select de medicamentos para verificar que se haya seleccionado un medicamento
selectMedication.addEventListener('blur', () => {
    const medicationId = selectMedication.selectedOptions[0].value;

    if (!medicationId) {
        errorsMedicineName.innerText = "Medicamento no seleccionado"; // Muestra mensaje de error si no se selecciona
        utils.failInput(selectMedication); // Aplica estilo de error
    } else {
        errorsMedicineName.innerText = ""; // Limpia el mensaje de error
        utils.successInput(selectMedication); // Aplica estilo de éxito
    }
})

// Añade un evento al input de cantidad de medicamento para verificar que se haya indicado una cantidad
medicationQuantity.addEventListener('blur', () => {
    if (!medicationQuantity.value) {
        errorsMedicineQuantity.innerText = "Cantidad de medicamento no indicada"; // Muestra mensaje de error
        utils.failInput(medicationQuantity) // Aplica estilo de error
    } else {
        errorsMedicineQuantity.innerText = ""; // Limpia el mensaje de error
        utils.successInput(medicationQuantity); // Aplica estilo de éxito
    }
})

// Añade un evento al input de frecuencia del medicamento para verificar que se haya indicado una frecuencia
medicationFrequency.addEventListener('blur', () => {
    if (!medicationFrequency.value) {
        errorsMedicineFrequency.innerText = "Frecuencia de ingesta del medicamento no indicada"; // Muestra mensaje de error
        utils.failInput(medicationFrequency); // Aplica estilo de error
    } else {
        errorsMedicineFrequency.innerText = ""; // Limpia el mensaje de error
        utils.successInput(medicationFrequency); // Aplica estilo de éxito
    }
})

// Añade un evento al input de duración del medicamento para verificar que se haya indicado una duración si es necesario
medicationDuration.addEventListener('blur', () => {
    if (!(medicationCondition.checked) && !(medicationDuration.value)) {
        errorsMedicineDays.innerText = "Indica una duración de días o marca medicación cronica"; // Muestra mensaje de error
        utils.failInput(medicationDuration); // Aplica estilo de error
    } else {
        errorsMedicineDays.innerText = ""; // Limpia el mensaje de error
        utils.successInput(medicationDuration); // Aplica estilo de éxito
    }
})

// Función para limpiar los inputs de añadir medicamento
function clearAddMedicationInputs() {
    // Restablece los valores de los campos
    selectMedication.selectedIndex = 0;
    medicationQuantity.value = "";
    medicationFrequency.value = "";
    medicationDuration.value = "";
    medicationCondition.checked = false;
    errorsMedicineName.innerText = "";
    errorsMedicineQuantity.innerText = "";
    errorsMedicineFrequency.innerText = "";
    errorsMedicineDays.innerText = "";

    // Restablece los estilos por defecto
    const turnDefault = [selectMedication, medicationQuantity, medicationFrequency, medicationDuration];

    turnDefault.forEach(e => {
        utils.defaultInput(e);
    });
}

// Event listener para el botón de agregar medicamento
addMedicationBtn.addEventListener('click', () => {
    // Obtener el valor y nombre del medicamento seleccionado
    const medicationId = selectMedication.selectedOptions[0].value;
    const medicationName = selectMedication.selectedOptions[0].innerText;
    // Verificar si el medicamento es crónico y establecer el número de días
    const isChronic = medicationCondition.checked ? "Sí" : "No";
    const numberOfDays = medicationCondition.checked ? "365" : medicationDuration.value;

    // Variable para validar si todos los campos son correctos
    let validMedication = true;

    // Validación del medicamento seleccionado
    if (!medicationId) {
        errorsMedicineName.innerText = "Medicamento no seleccionado";
        utils.failInput(selectMedication);
        validMedication = false;
    } else {
        errorsMedicineName.innerText = "";
        utils.successInput(selectMedication);
    }

    // Validación de la cantidad de medicamento
    if (!medicationQuantity.value) {
        errorsMedicineQuantity.innerText = "Cantidad de medicamento no indicada";
        utils.failInput(medicationQuantity);
        validMedication = false;
    } else {
        errorsMedicineQuantity.innerText = "";
        utils.successInput(medicationQuantity);
    }

    // Validación de la frecuencia de ingesta del medicamento
    if (!medicationFrequency.value) {
        errorsMedicineFrequency.innerText = "Frecuencia de ingesta del medicamento no indicada";
        utils.failInput(medicationFrequency);
        validMedication = false;
    } else {
        errorsMedicineFrequency.innerText = "";
        utils.successInput(medicationFrequency);
    }

    // Validación de la duración del medicamento o la condición crónica
    if (!(medicationCondition.checked) && !(medicationDuration.value)) {
        errorsMedicineDays.innerText = "Indica una duración de días o marca medicación cronica";
        utils.failInput(medicationDuration);
        validMedication = false;
    } else {
        errorsMedicineDays.innerText = "";
        utils.successInput(medicationDuration);
    }

    // Si hay errores en los datos del medicamento, detener la ejecución
    if (!validMedication) {
        return;
    }

    // Verificar si ya existe una fila con el medicamento seleccionado en la tabla
    const existingRow = [...medicationTable.querySelectorAll('tr')].find(row => 
        row.cells[0] && row.cells[0].innerText === medicationId
    );

    if (existingRow) {
        // Si la fila ya existe, actualizar los datos
        existingRow.cells[1].innerText = medicationName;
        existingRow.cells[2].innerText = medicationQuantity.value;
        existingRow.cells[3].innerText = medicationFrequency.value;
        existingRow.cells[4].innerText = numberOfDays;
        existingRow.cells[5].innerText = isChronic;
    } else {
        // Si la fila no existe, crear una nueva fila
        const tableRow = document.createElement('tr');

        const tableCellMedicineId = document.createElement('td');
        tableCellMedicineId.id = "hide";
        tableCellMedicineId.innerText = medicationId;

        const tableCellMedicineName = document.createElement('td');
        tableCellMedicineName.innerText = medicationName;

        const tableCellMedicineQuantity = document.createElement('td');
        tableCellMedicineQuantity.innerText = medicationQuantity.value;

        const tableCellMedicineFrequency = document.createElement('td');
        tableCellMedicineFrequency.innerText = medicationFrequency.value;

        const tableCellMedicineNumberDays = document.createElement('td');
        tableCellMedicineNumberDays.innerText = numberOfDays;

        const tableCellMedicineChronic = document.createElement('td');
        tableCellMedicineChronic.innerText = isChronic;

        // Agregar las celdas a la nueva fila
        tableRow.appendChild(tableCellMedicineId);
        tableRow.appendChild(tableCellMedicineName);
        tableRow.appendChild(tableCellMedicineQuantity);
        tableRow.appendChild(tableCellMedicineFrequency);
        tableRow.appendChild(tableCellMedicineNumberDays);
        tableRow.appendChild(tableCellMedicineChronic);

        // Agregar la nueva fila a la tabla
        medicationTable.appendChild(tableRow);

        // Si es la primera fila, eliminar el mensaje "No se han añadido medicamentos"
        const noDataRow = medicationTable.querySelector('tbody tr td[colspan="6"]');
        if (noDataRow) {
            noDataRow.parentElement.remove();
        }
    }

    // Limpiar los campos de entrada para agregar un nuevo medicamento
    clearAddMedicationInputs();
});

// Función para seleccionar los doctores disponibles para un paciente
function selectDoctors(id) {
    fetch(`http://localhost/?resource_type=doctor_patients&resource_id=${id}`)
        .then(response => {
            // Comprobar si la respuesta es correcta
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(eachDoctor => {
            // Limpiar el select de doctores antes de agregar nuevos
            modalDoctorsSelect.innerHTML = "";
            eachDoctor.forEach(doctor => {
                // Evitar que el doctor actual sea seleccionado
                if (doctor.doctor_id != id) {
                    const selectOpt = document.createElement('option');
        
                    selectOpt.value = doctor.doctor_id;
                    selectOpt.innerText = `${doctor.name} (${doctor.specialty})`;
                    
                    // Agregar el doctor al select
                    modalDoctorsSelect.appendChild(selectOpt);
                }
            })
        })
        .catch(error => {
            // Manejo de errores si ocurre algo durante la petición
            console.error('Error:', error);
            return false;
        });
}

// Función para limpiar el modal de cita
function clearAppointmentModal() {
    setTimeout(() => {
        // Limpiar todos los campos del modal de cita
        appointmentDoctorName.value = "";
        appointmentPatientName.value = "";
        appointmentDateTime.value = "";
        appointmentSymptomatology.value = "";
        appointmentDiagnosis.value = "";
        errorsSpanDiagnosis.value = "";

        appointmentIdInput.innerText = "";
        patientIdInput.innerText = "";

        // Limpiar los campos de medicamentos
        clearAddMedicationInputs();

        // Limpiar el archivo PDF y el select de doctores
        appointmentPdf.value = "";
        modalDoctorsSelect.innerText = "";
        newAppointmentDateIn.value = "";
        newAppointmentSymptomatology.value = "";

        // Restablecer los valores predeterminados de ciertos campos
        const turnDefault = [appointmentDiagnosis, newAppointmentDateIn];

        turnDefault.forEach(e => {
            utils.defaultInput(e);
        });

        // Actualizar las tablas de citas
        updateTodayAppointmentsTable();

        // Actualizar el contador de citas en los próximos 7 días
        updateAppointmentsNextSevenDaysCounter();
    }, 400);
}

// Escucha el evento 'submit' en el formulario de la cita
mainAppointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Previene el comportamiento por defecto del formulario (recarga de página)
    e.stopPropagation();  // Detiene la propagación del evento
    e.stopImmediatePropagation();  // Detiene todos los demás manejadores de eventos

    let string = appointmentDiagnosis.value;  // Obtiene el valor del campo diagnóstico

    // Verifica si el diagnóstico está vacío
    if (string.length <= 0) {
        errorsSpanDiagnosis.innerText = "Diagnostico no introducido";  // Muestra mensaje de error
        utils.failInput(appointmentDiagnosis);  // Marca el campo de entrada con error

        return;
    } else {
        errorsSpanDiagnosis.innerText = "";  // Borra el mensaje de error
        utils.successInput(appointmentDiagnosis);  // Marca el campo como válido
    }

    // Crea un objeto con los datos de la cita a actualizar
    const appointmentUpdate = {
        id: appointmentIdInput.innerText,
        patient_id: patientIdInput.innerText,
        doctor_id: id,
        appointment_date: utils.getFormattedDate(new Date(appointmentDateTime.value)),
        symptomatology: appointmentSymptomatology.value.trim(),
        diagnosis: appointmentDiagnosis.value.trim(),
        pdf_file: "none"
    }

    // Realiza una solicitud PUT para actualizar la cita en el servidor
    fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentIdInput.innerText}`, {
        method: 'PUT',  // Método HTTP
        headers: {
            'Content-Type': 'application/json',  // Especifica que el cuerpo es JSON
        },
        body: JSON.stringify(appointmentUpdate)  // Convierte el objeto a JSON y lo envía
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');  // Manejo de error en caso de fallo
            }
            return response.json();  // Parseo de la respuesta como JSON
        })
        .then(() => {
            closeModalBtn.click();  // Cierra el modal de la cita

            clearAppointmentModal();  // Limpia los campos del modal

            const medicationsRows = medicationTable.querySelectorAll('tr');  // Obtiene las filas de la tabla de medicamentos

            // Verifica si la tabla de medicamentos está en formato esperado
            if (medicationsRows[0].children[0].colSpan != 6) {

                medicationsRows.forEach(row => {  // Itera sobre las filas de medicamentos
                    const newAppointmentMedication = {
                        appointment_id:  appointmentIdInput.innerText,
                        medicine_id: row.cells[0].innerText,
                        quantity: row.cells[2].innerText.trim(),
                        frequency: row.cells[3].innerText.trim(),
                        duration_days: row.cells[4].innerText.trim(),
                        chronic: row.cells[5] == 365 ? 1 : 0  // Determina si es crónico
                    }

                    // Realiza una solicitud POST para agregar medicamentos a la cita
                    fetch(`http://localhost/?resource_type=appointment_medicines`, {
                        method: 'POST',  // Método HTTP
                        headers: {
                            'Content-Type': 'application/json',  // Especifica que el cuerpo es JSON
                        },
                        body: JSON.stringify(newAppointmentMedication)  // Convierte el objeto a JSON y lo envía
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error en la petición');  // Manejo de error en caso de fallo
                            }
                            return response.json();  // Parseo de la respuesta como JSON
                        })
                        .then(data => {
                            console.log(data);  // Muestra los datos en consola
                        })
                    
                })
            }
            
        })
        .then(() => {
            // Verifica si se ha cargado un archivo PDF
            if (appointmentPdf.files[0]) {

                const pdfFile = new FormData();
                pdfFile.append('file', appointmentPdf.files[0]);  // Añade el archivo PDF a un FormData

                // Realiza una solicitud POST para subir el PDF
                fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentIdInput.innerText}&pdf=true`, {
                    method: 'POST',  // Método HTTP
                    body: pdfFile  // Cuerpo de la solicitud contiene el archivo PDF
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la petición');  // Manejo de error en caso de fallo
                        }
                        return response.json();  // Parseo de la respuesta como JSON
                    })
                    .then(data => {
                        console.log(data);  // Muestra los datos en consola
                    })
                    .catch(error => {
                        console.error('Error:', error);  // Manejo de errores en la subida del PDF
                        return false;
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);  // Manejo de errores en la solicitud principal
            return false;
        });
});

// Evento blur en el campo de diagnóstico
appointmentDiagnosis.addEventListener('blur', () => {
    let string = appointmentDiagnosis.value;

    // Verifica si el diagnóstico está vacío
    if (string.length <= 0) {
        errorsSpanDiagnosis.innerText = "Diagnostico no introducido";  // Muestra mensaje de error
        utils.failInput(appointmentDiagnosis);  // Marca el campo con error
    } else {
        errorsSpanDiagnosis.innerText = "";  // Borra el mensaje de error
        utils.successInput(appointmentDiagnosis);  // Marca el campo como válido
    }
});

// Función para validar la fecha de la cita
function appointmentDateValidation(date) {
    let validation = false;

    // Verifica si la fecha es válida (no en el pasado, no un fin de semana, no más de 60 días en el futuro)
    if (date < Date.now() || !newAppointmentDateIn.value) {
        errorsSpan2.innerText = "Fecha no valida";  // Muestra mensaje de error
        utils.failInput(newAppointmentDateIn);  // Marca el campo con error
    } else if (date.getDay() == 6 || date.getDay() == 0) {
        errorsSpan2.innerText = "Por favor, elija un día laborable";  // Muestra mensaje de error
        utils.failInput(newAppointmentDateIn);  // Marca el campo con error
    } else if (utils.isDate60DaysLater(date)) {
        errorsSpan2.innerText = "Tan malo no estarás. Pide una fecha como máximo 60 días en el futuro";  // Muestra mensaje de error
        utils.failInput(newAppointmentDateIn);  // Marca el campo con error
    } else if (date.getHours() < 8 || date.getHours() > 21) {
        errorsSpan2.innerText = "Por favor, elija un hora laborable";  // Muestra mensaje de error
        utils.failInput(newAppointmentDateIn);  // Marca el campo con error
    } else {
        errorsSpan2.innerText = "";  // Borra el mensaje de error
        utils.successInput(newAppointmentDateIn);  // Marca el campo como válido
        validation = true;  // Marca la fecha como válida
    }

    return validation;
}

// Evento blur en el campo de fecha de la nueva cita
newAppointmentDateIn.addEventListener('blur', () => {
    const appointmentDateValue = new Date(newAppointmentDateIn.value);  // Obtiene la fecha del campo de entrada

    appointmentDateValidation(appointmentDateValue);  // Valida la fecha
});

// Evento click en el botón para referir cita
btnReferAppointment.addEventListener('click', (e) => {
    e.preventDefault();  // Previene el comportamiento por defecto
    e.stopPropagation();  // Detiene la propagación del evento
    e.stopImmediatePropagation();  // Detiene todos los demás manejadores de eventos

    const appointmentDateValue = new Date(newAppointmentDateIn.value);  // Obtiene la fecha del campo de entrada
    
    // Verifica si la cita es válida
    const isAppointmentValid = appointmentDateValidation(appointmentDateValue);

    if (!isAppointmentValid) {
        return;  // Si no es válida, detiene el proceso
    }

    // Crea un objeto con los datos de la cita para la actualización
    const appointmentUpdate = {
        id: appointmentIdInput.innerText,
        patient_id: patientIdInput.innerText,
        doctor_id: parseInt(modalDoctorsSelect.selectedOptions[0].value),
        appointment_date: utils.getFormattedDate(new Date(newAppointmentDateIn.value)),
        symptomatology: newAppointmentSymptomatology.value.trim() != "" ? newAppointmentSymptomatology.value.trim() : appointmentSymptomatology.value,
        diagnosis: "",
        pdf_file: "none"
    }

    // Realiza una solicitud PUT para actualizar la cita en el servidor
    fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentIdInput.innerText}`, {
        method: 'PUT',  // Método HTTP
        headers: {
            'Content-Type': 'application/json',  // Especifica que el cuerpo es JSON
        },
        body: JSON.stringify(appointmentUpdate)  // Convierte el objeto a JSON y lo envía
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');  // Manejo de error en caso de fallo
            }
            return response.json();  // Parseo de la respuesta como JSON
        })
        .then(() => {
            closeModalBtn.click();  // Cierra el modal de la cita

            clearAppointmentModal();  // Limpia los campos del modal
        })
        .catch(error => {
            console.error('Error:', error);  // Manejo de errores en la solicitud
            return false;
        });
})
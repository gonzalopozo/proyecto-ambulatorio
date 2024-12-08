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

    const modal = document.querySelector("#doctor-modal");
    const closeModalBtn = document.querySelector("#doctor-modal div .close-btn");

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

import utils from './helpers/utils.mjs';

const clock = document.querySelector('.clock');

utils.refreshClock(clock);

const doctorName = document.querySelector('.doctor-name');
const doctorEmail = document.querySelector('.doctor-email');
const doctorPhone = document.querySelector('.doctor-phone');
const doctorSpecialty = document.querySelector('.doctor-specialty');
const doctorAppointmentsNextSevenDays = document.querySelector('.doctor-appointments-next-seven-days span');
const doctorTodayAppointmentsTable = document.querySelector('.doctor-today-appointments table tbody');
const modal = document.querySelector(".modal");
const userNameHeader = document.querySelector('.user-name-header');

const appointmentDoctorName = document.querySelector('#doctor-name');
const appointmentPatientName = document.querySelector('#patient-name');
const appointmentDateTime = document.querySelector('#appointment-date-time');
const appointmentSymptomatology = document.querySelector('#symptomatology');
const appointmentDiagnosis = document.querySelector('#diagnosis');
const appointmentPdf = document.querySelector('#upload-pdf');
const selectMedication = document.querySelector('#medication-select');
const medicationQuantity = document.querySelector('#medication-quantity');
const medicationFrequency = document.querySelector('#medication-frequency');
const medicationDuration = document.querySelector('#medication-duration');
const medicationCondition = document.querySelector('#chronic-condition');
const addMedicationBtn = document.querySelector('#add-medication-btn');
const medicationTable = document.querySelector('.main-appointment-form .medicines table tbody');
const modalDoctorsSelect = document.querySelector('#doctor-select');
// const registerAppointmetnBtn = document.querySelector('#register-appointment-btn');
const mainAppointmentForm = document.querySelector('.main-appointment-form');
const errorsSpanSymptomatology = document.querySelector('.errors #symptomatology-er');
const errorsSpanDiagnosis = document.querySelector('.errors #diagnosis-er');

const errorsSpan2 = document.querySelector('#errors2 span');
const btnReferAppointment = document.querySelector('#create-Appointment');
const newAppointmentDateIn = document.querySelector('#new-appointment-date');
const newAppointmentSymptomatology = document.querySelector('#appointment-symptomatology');

const errorsMedicineName = document.querySelector('.errors #medicine-er');
const errorsMedicineQuantity = document.querySelector('.errors #quantity-er');
const errorsMedicineFrequency = document.querySelector('.errors #frequency-er');
const errorsMedicineDays = document.querySelector('.errors #days-er');

const appointmentIdInput = document.querySelector('.appointment-id');
const patientIdInput = document.querySelector('.patient-id');
const closeModalBtn = document.querySelector("#doctor-modal div .close-btn");

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
    userNameHeader.innerText = `Dr. ${utils.takeJustName(doctorInfo.name)}`;
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
    if (appointmentsToday.length > 0) {
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
    } else {
        const tableRow = document.createElement('tr');

        const tableLongCell = document.createElement('td');

        tableLongCell.innerText = 'No se han encontrado citas para hoy';

        tableLongCell.colSpan = 4;

        tableRow.appendChild(tableLongCell);

        tableRow.style.cursor = "default";

        doctorTodayAppointmentsTable.appendChild(tableRow);
    }
});

function openAppointmentModal(appointmentId) {
    fillInputs(appointmentId).then(() => {
        fetch(`http://localhost/?resource_type=medicines`)
    
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data[0])
            
            
            return data;
        })
        .then(medicines => {
            // selectDoctors(medicines[0].patient_id);
            medicines.forEach(eachMedicine => {
                const opt = document.createElement('option');

                opt.value = eachMedicine.id;
                opt.innerText = eachMedicine.name;

                selectMedication.appendChild(opt);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
    });



    // Mostrar el modal
    modal.classList.add('show');
    modal.classList.remove('hide');
} 

function fillInputs(appointmentId) {
    return fetch(`http://localhost/?resource_type=appointments_by_id&resource_id=${appointmentId}`)
    
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            console.log(data[0]);
            
            return data[0];
        })
        .then(appointmentInfo => {
            appointmentDoctorName.value = appointmentInfo.doctor_name;
            appointmentPatientName.value = appointmentInfo.patient_name;
            let date = new Date(appointmentInfo.appointment_date);

            // console.log(date.toLocaleDateString());
            
            appointmentDateTime.value = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            appointmentSymptomatology.innerText = appointmentInfo.symptomatology;

            appointmentIdInput.innerText = appointmentId;
            patientIdInput.innerText = "";

            patientIdInput.innerText = appointmentInfo.patient_id;

            selectDoctors(appointmentInfo.patient_id);
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

medicationCondition.addEventListener('click', () => {
    if (medicationCondition.checked) {
        medicationDuration.value = "";
        errorsMedicineDays.innerText = "";
        medicationDuration.style.border = "1px solid #D6DBDF";
        medicationDuration.style.boxShadow = "none";
        medicationDuration.disabled = true;
    } else {
        medicationDuration.disabled = false;
    }
});

selectMedication.addEventListener('blur', () => {
    const medicationId = selectMedication.selectedOptions[0].value;

    if (!medicationId) {
        errorsMedicineName.innerText = "Medicamento no seleccionado";
        selectMedication.style.borderColor = "rgb(226, 93, 93)";
        selectMedication.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else {
        errorsMedicineName.innerText = "";
        selectMedication.style.borderColor = "rgb(93, 226, 102)";
        selectMedication.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }
})

medicationQuantity.addEventListener('blur', () => {
    if (!medicationQuantity.value) {
        errorsMedicineQuantity.innerText = "Cantidad de medicamento no indicada";
        medicationQuantity.style.borderColor = "rgb(226, 93, 93)";
        medicationQuantity.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else {
        errorsMedicineQuantity.innerText = "";
        medicationQuantity.style.borderColor = "rgb(93, 226, 102)";
        medicationQuantity.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }
})

medicationFrequency.addEventListener('blur', () => {
    if (!medicationFrequency.value) {
        errorsMedicineFrequency.innerText = "Frecuencia de ingesta del medicamento no indicada";
        medicationFrequency.style.borderColor = "rgb(226, 93, 93)";
        medicationFrequency.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else {
        errorsMedicineFrequency.innerText = "";
        medicationFrequency.style.borderColor = "rgb(93, 226, 102)";
        medicationFrequency.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }
})

medicationDuration.addEventListener('blur', () => {
    if (!(medicationCondition.checked) && !(medicationDuration.value)) {
        errorsMedicineDays.innerText = "Indica una duración de días o marca medicación cronica";
        medicationDuration.style.borderColor = "rgb(226, 93, 93)";
        medicationDuration.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else {
        errorsMedicineDays.innerText = "";
        medicationDuration.style.borderColor = "rgb(93, 226, 102)";
        medicationDuration.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }
})

addMedicationBtn.addEventListener('click', () => {
    const medicationId = selectMedication.selectedOptions[0].value;
    const medicationName = selectMedication.selectedOptions[0].innerText;
    const isChronic = medicationCondition.checked ? "Sí" : "No";
    const numberOfDays = medicationCondition.checked ? "365" : medicationDuration.value;

    let validMedication = true;

    if (!medicationId) {
        errorsMedicineName.innerText = "Medicamento no seleccionado";
        selectMedication.style.borderColor = "rgb(226, 93, 93)";
        selectMedication.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";

        validMedication = false;
    } else {
        errorsMedicineName.innerText = "";
        selectMedication.style.borderColor = "rgb(93, 226, 102)";
        selectMedication.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }

    if (!medicationQuantity.value) {
        errorsMedicineQuantity.innerText = "Cantidad de medicamento no indicada";
        medicationQuantity.style.borderColor = "rgb(226, 93, 93)";
        medicationQuantity.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";

        validMedication = false;
    } else {
        errorsMedicineQuantity.innerText = "";
        medicationQuantity.style.borderColor = "rgb(93, 226, 102)";
        medicationQuantity.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }

    if (!medicationFrequency.value) {
        errorsMedicineFrequency.innerText = "Frecuencia de ingesta del medicamento no indicada";
        medicationFrequency.style.borderColor = "rgb(226, 93, 93)";
        medicationFrequency.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";

        validMedication = false;
    } else {
        errorsMedicineFrequency.innerText = "";
        medicationFrequency.style.borderColor = "rgb(93, 226, 102)";
        medicationFrequency.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }

    if (!(medicationCondition.checked) && !(medicationDuration.value)) {
        errorsMedicineDays.innerText = "Indica una duración de días o marca medicación cronica";
        medicationDuration.style.borderColor = "rgb(226, 93, 93)";
        medicationDuration.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";

        validMedication = false;
    } else {
        errorsMedicineDays.innerText = "";
        medicationDuration.style.borderColor = "rgb(93, 226, 102)";
        medicationDuration.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }

    if (!validMedication) {
        return;
    }

    const existingRow = [...medicationTable.querySelectorAll('tr')].find(row => 
        row.cells[0] && row.cells[0].innerText === medicationId
    );

    if (existingRow) {
        // Actualizar fila existente
        existingRow.cells[1].innerText = medicationName;
        existingRow.cells[2].innerText = medicationQuantity.value;
        existingRow.cells[3].innerText = medicationFrequency.value;
        existingRow.cells[4].innerText = numberOfDays;
        existingRow.cells[5].innerText = isChronic;
    } else {
        // Crear nueva fila
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

        tableRow.appendChild(tableCellMedicineId);
        tableRow.appendChild(tableCellMedicineName);
        tableRow.appendChild(tableCellMedicineQuantity);
        tableRow.appendChild(tableCellMedicineFrequency);
        tableRow.appendChild(tableCellMedicineNumberDays);
        tableRow.appendChild(tableCellMedicineChronic);

        medicationTable.appendChild(tableRow);

        // Si es la primera fila, elimina el mensaje de "No se han añadido medicamentos"
        const noDataRow = medicationTable.querySelector('tbody tr td[colspan="6"]');
        if (noDataRow) {
            noDataRow.parentElement.remove();
        }
    }
});


function selectDoctors(id) {
    fetch(`http://localhost/?resource_type=doctor_patients&resource_id=${id}`)
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
        .then(eachDoctor => {
            modalDoctorsSelect.innerHTML = "";
            eachDoctor.forEach(doctor => {
                // console.log(doctor);
                
                if (doctor.doctor_id != id) {
                    const selectOpt = document.createElement('option');
        
                    selectOpt.value = doctor.doctor_id;
                    selectOpt.innerText = `${doctor.name} (${doctor.specialty})`;
                    
                    modalDoctorsSelect.appendChild(selectOpt);
                }
                
            })
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

mainAppointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log(e);
    

    let isAppointmentValid = true;

    if (appointmentSymptomatology.value == "") {
        errorsSpanSymptomatology.innerText = "Sintomatologia no introducida";
        appointmentSymptomatology.style.borderColor = "rgb(226, 93, 93)";
        appointmentSymptomatology.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
        isAppointmentValid = false;
    } else {
        errorsSpanSymptomatology.innerText = "";
        appointmentSymptomatology.style.borderColor = "rgb(93, 226, 102)";
        appointmentSymptomatology.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }
    
    let string = appointmentDiagnosis.value;

    if (string.length <= 0) {
        errorsSpanDiagnosis.innerText = "Diagnostico no introducido";
        appointmentDiagnosis.style.borderColor = "rgb(226, 93, 93)";
        appointmentDiagnosis.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
        isAppointmentValid = false;
    } else {
        errorsSpanDiagnosis.innerText = "";
        appointmentDiagnosis.style.borderColor = "rgb(93, 226, 102)";
        appointmentDiagnosis.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }

    if (!isAppointmentValid) {
        return;
    }

    const appointmentUpdate = {
        id: appointmentIdInput.innerText,
        patient_id: patientIdInput.innerText,
        doctor_id: id,
        appointment_date: utils.getFormattedDate(new Date(appointmentDateTime.value)),
        symptomatology: appointmentSymptomatology.value,
        diagnosis: appointmentDiagnosis.value,
        is_consultation_done: 1,
        pdf_file: "none"
    }

    console.log(appointmentUpdate);

    fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentIdInput.innerText}`, {
        method: 'PUT', // Método HTTP
        headers: {
            'Content-Type': 'application/json', // Especificar que el cuerpo está en formato JSON
        },
        body: JSON.stringify(appointmentUpdate)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }

            console.log(response);
            
            return response.json();
        })
        .then(data => {
            console.log(data);
            
            closeModalBtn.click();

            setTimeout(() => {

                appointmentDoctorName.value = "";
                appointmentPatientName.value = "";

                appointmentDateTime.value = "";
                appointmentSymptomatology.innerText = "";

                appointmentIdInput.innerText = "";
                patientIdInput.innerText = "";

                modalDoctorsSelect.innerText = "";

                selectAppointmentsToday(id).then(appointmentsToday => {
                    doctorTodayAppointmentsTable.innerText = "";
                    if (appointmentsToday.length > 0) {
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
                    } else {
                        const tableRow = document.createElement('tr');
                
                        const tableLongCell = document.createElement('td');
                
                        tableLongCell.innerText = 'No se han encontrado citas para hoy';
                
                        tableLongCell.colSpan = 4;
                
                        tableRow.appendChild(tableLongCell);
                
                        tableRow.style.cursor = "default";
                
                        doctorTodayAppointmentsTable.appendChild(tableRow);
                    }
                });

                selectAppointmentsNextSevenDays(id).then(appointments => {
                    let counter = 0;
                
                    appointments.forEach(() => counter++);
                
                    doctorAppointmentsNextSevenDays.innerText = counter;
                });

            }, 400);

            const medicationsRows = medicationTable.querySelectorAll('tr');

            if (medicationsRows[0].children[0].colSpan != 6) {
                
                medicationsRows.forEach(row => {
                    const newAppointmentMedication = {
                        appointment_id:  appointmentIdInput.innerText,
                        medicine_id: row.cells[0].innerText,
                        quantity: row.cells[2].innerText,
                        frequency: row.cells[3].innerText,
                        duration_days: row.cells[4].innerText,
                        chronic: row.cells[5] == "Sí" ? 1 : 0
                    }

                    console.log(newAppointmentMedication);
                    

                    fetch(`http://localhost/?resource_type=appointment_medicines`, {
                        method: 'POST', // Método HTTP
                        headers: {
                            'Content-Type': 'application/json', // Especificar que el cuerpo está en formato JSON
                        },
                        body: JSON.stringify(newAppointmentMedication)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error en la petición');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log(data);
                        })
                    
                })

                
            }
            
        })
        .then(() => {

            if (appointmentPdf.files[0]) {

                const pdfFile = new FormData();
                pdfFile.append('file', appointmentPdf.files[0]);

                fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentIdInput.innerText}&pdf=true`, {
                    method: 'POST', // Método HTTP
                    body: pdfFile
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la petición');
                        }
            
                        console.log(response);

                        console.log(response.json());
                        
                        
                        return response.json();
                    })
                    .then(data => {

                        console.log(data);
                        debugger;

                    })
                    .catch(error => {
                        console.error('Error:', error);
                        return false;
                    });
            }

            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });



});

appointmentSymptomatology.addEventListener('blur', () => {
    if (appointmentSymptomatology.value == "") {
        errorsSpanSymptomatology.innerText = "Sintomatologia no introducida";
        appointmentSymptomatology.style.borderColor = "rgb(226, 93, 93)";
        appointmentSymptomatology.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
        // appointmentSymptomatology.border = "1px solid red";
    } else {
        errorsSpanSymptomatology.innerText = "";
        appointmentSymptomatology.style.borderColor = "rgb(93, 226, 102)";
        appointmentSymptomatology.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }
});



appointmentDiagnosis.addEventListener('blur', () => {
    let string = appointmentDiagnosis.value;

    if (string.length <= 0) {
        errorsSpanDiagnosis.innerText = "Diagnostico no introducido";
        appointmentDiagnosis.style.borderColor = "rgb(226, 93, 93)";
        appointmentDiagnosis.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
        // appointmentDiagnosis.border = "1px solid red";
    } else {
        errorsSpanDiagnosis.innerText = "";
        appointmentDiagnosis.style.borderColor = "rgb(93, 226, 102)";
        appointmentDiagnosis.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }
});

function esFechaMayor60Dias(fecha) {
    const fechaActual = new Date();
    
    // Sumar 30 días a la fecha actual
    const fechaLimite = new Date(fechaActual);
    fechaLimite.setDate(fechaActual.getDate() + 60);

    // Comparar si la fecha es igual o posterior a la fecha límite
    return fecha >= fechaLimite;
}


newAppointmentDateIn.addEventListener('blur', () => {
    const appointmentDateValue = new Date(newAppointmentDateIn.value);


    if (appointmentDateValue < Date.now() || !newAppointmentDateIn.value) {
        errorsSpan2.innerText = "Fecha no valida";
        newAppointmentDateIn.style.borderColor = "rgb(226, 93, 93)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else if (appointmentDateValue.getDay() == 6 || appointmentDateValue.getDay() == 0) {
        errorsSpan2.innerText = "Por favor, elija un día laborable";
        newAppointmentDateIn.style.borderColor = "rgb(226, 93, 93)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else if (esFechaMayor60Dias(appointmentDateValue)) {
        errorsSpan2.innerText = "Tan malo no estarás. Pide una fecha como máximo 30 días en el futuro";
        newAppointmentDateIn.style.borderColor = "rgb(226, 93, 93)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else if (appointmentDateValue.getHours() < 8 || appointmentDateValue.getHours() > 21) {
        errorsSpan2.innerText = "Por favor, elija un hora laborable";
        newAppointmentDateIn.style.borderColor = "rgb(226, 93, 93)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else {
        errorsSpan2.innerText = "";
        newAppointmentDateIn.style.borderColor = "rgb(93, 226, 102)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
    }
});







btnReferAppointment.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    let isAppointmentValid = false;

    const appointmentDateValue = new Date(newAppointmentDateIn.value);

    if (appointmentDateValue < Date.now() || !newAppointmentDateIn.value) {
        errorsSpan2.innerText = "Fecha no valida";
        newAppointmentDateIn.style.borderColor = "rgb(226, 93, 93)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else if (appointmentDateValue.getDay() == 6 || appointmentDateValue.getDay() == 0) {
        errorsSpan2.innerText = "Por favor, elija un día laborable";
        newAppointmentDateIn.style.borderColor = "rgb(226, 93, 93)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else if (esFechaMayor60Dias(appointmentDateValue)) {
        errorsSpan2.innerText = "Tan malo no estarás. Pide una fecha como máximo 30 días en el futuro";
        newAppointmentDateIn.style.borderColor = "rgb(226, 93, 93)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else if (appointmentDateValue.getHours() < 8 || appointmentDateValue.getHours() > 21) {
        errorsSpan2.innerText = "Por favor, elija un hora laborable";
        newAppointmentDateIn.style.borderColor = "rgb(226, 93, 93)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(223, 93, 93, 0.5)";
    } else {
        errorsSpan2.innerText = "";
        newAppointmentDateIn.style.borderColor = "rgb(93, 226, 102)";
        newAppointmentDateIn.style.boxShadow = "0 0 8px rgba(93, 226, 102, 0.5)";
        isAppointmentValid = true;
    }

    if (!isAppointmentValid) {
        return;
    }

    const appointmentUpdate = {
        id: appointmentIdInput.innerText,
        patient_id: patientIdInput.innerText,
        doctor_id: parseInt(modalDoctorsSelect.selectedOptions[0].value),
        appointment_date: utils.getFormattedDate(new Date(newAppointmentDateIn.value)),
        symptomatology: newAppointmentSymptomatology.value,
        diagnosis: "",
        is_consultation_done: 0,
        pdf_file: "none"
    }

    console.log(appointmentUpdate);

    fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentIdInput.innerText}`, {
        method: 'PUT', // Método HTTP
        headers: {
            'Content-Type': 'application/json', // Especificar que el cuerpo está en formato JSON
        },
        body: JSON.stringify(appointmentUpdate)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }

            console.log(response);
            
            return response.json();
        })
        .then(data => {
            console.log(data);
            
            closeModalBtn.click();

            setTimeout(() => {

                appointmentDoctorName.value = "";
                appointmentPatientName.value = "";

                appointmentDateTime.value = "";
                appointmentSymptomatology.innerText = "";

                appointmentIdInput.innerText = "";
                patientIdInput.innerText = "";

                modalDoctorsSelect.innerText = "";

                selectAppointmentsToday(id).then(appointmentsToday => {
                    doctorTodayAppointmentsTable.innerText = "";
                    if (appointmentsToday.length > 0) {
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
                    } else {
                        const tableRow = document.createElement('tr');
                
                        const tableLongCell = document.createElement('td');
                
                        tableLongCell.innerText = 'No se han encontrado citas para hoy';
                
                        tableLongCell.colSpan = 4;
                
                        tableRow.appendChild(tableLongCell);
                
                        tableRow.style.cursor = "default";
                
                        doctorTodayAppointmentsTable.appendChild(tableRow);
                    }
                });
                
                selectAppointmentsNextSevenDays(id).then(appointments => {
                    let counter = 0;
                
                    appointments.forEach(() => counter++);
                
                    doctorAppointmentsNextSevenDays.innerText = counter;
                });

            }, 400);
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });

    
})
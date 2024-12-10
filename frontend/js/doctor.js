const queryParams = new URLSearchParams(location.search);
const id = parseInt(queryParams.get('resource_id')); 

const modal = document.querySelector("#doctor-modal");
const closeModalBtn = document.querySelector("#doctor-modal div .close-btn");

document.addEventListener("DOMContentLoaded", (e) => {
    const pathName = (location.pathname).split('/');

    let idExists = false;

    fetch(`http://localhost/?resource_type=doctors`)
        .then(response => {
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

            if (!((pathName[pathName.length - 1] === 'doctor.html') && idExists)) {
                location.assign(`../html/error404.html`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hide");
        modal.addEventListener("animationend", () => {
            modal.classList.remove("show");
        }, { once: true });
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModalBtn.click(); // Simula el clic en la "X"
        }
    });
});

import utils from './helpers/utils.mjs';

const userNameHeader = document.querySelector('.user-name-header');
const clock = document.querySelector('.clock');

utils.refreshClock(clock);

const doctorName = document.querySelector('.doctor-name');
const doctorEmail = document.querySelector('.doctor-email');
const doctorPhone = document.querySelector('.doctor-phone');
const doctorSpecialty = document.querySelector('.doctor-specialty');

const doctorAppointmentsNextSevenDays = document.querySelector('.doctor-appointments-next-seven-days span');

const doctorTodayAppointmentsTable = document.querySelector('.doctor-today-appointments table tbody');

const mainAppointmentForm = document.querySelector('.main-appointment-form');

const appointmentIdInput = document.querySelector('.appointment-id');
const patientIdInput = document.querySelector('.patient-id');

const appointmentDoctorName = document.querySelector('#doctor-name');
const appointmentPatientName = document.querySelector('#patient-name');
const appointmentDateTime = document.querySelector('#appointment-date-time');
const appointmentSymptomatology = document.querySelector('#symptomatology');
const appointmentDiagnosis = document.querySelector('#diagnosis');
const errorsSpanDiagnosis = document.querySelector('.errors #diagnosis-er');

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

const appointmentPdf = document.querySelector('#upload-pdf');

const modalDoctorsSelect = document.querySelector('#doctor-select');
const newAppointmentDateIn = document.querySelector('#new-appointment-date');
const newAppointmentSymptomatology = document.querySelector('#appointment-symptomatology');
const errorsSpan2 = document.querySelector('.errors #new-appointment-er');
const btnReferAppointment = document.querySelector('#create-Appointment');

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
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

function updateAppointmentsNextSevenDaysCounter() {
    selectAppointmentsNextSevenDays(id).then(appointments => {
        if (appointments) {
            let counter = 0;

            appointments.forEach(() => counter++);

            doctorAppointmentsNextSevenDays.innerText = counter;
        }
    });
}

updateAppointmentsNextSevenDaysCounter();

function selectAppointmentsToday(id) {
    return fetch(`http://localhost/?resource_type=appointments_for_doctors&resource_id=${id}`)
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

function openAppointmentModal(appointmentId) {
    fillInputs(appointmentId).then(() => {
        fetch(`http://localhost/?resource_type=medicines`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la petición');
                }
                return response.json();
            })
            .then(medicines => {
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

    modal.classList.add('show');
    modal.classList.remove('hide');
} 

function updateTodayAppointmentsTable() {
    selectAppointmentsToday(id).then(appointments => {
        doctorTodayAppointmentsTable.innerText = "";

        if (appointments.length > 0) {
            appointments.forEach(appointment => {
                const tableRow = document.createElement('tr');

                const tableCellAppointmentId = document.createElement('td');
                const tableCellPatient = document.createElement('td');
                const tableCellSymptomatology = document.createElement('td');
                const tableCellBtn = document.createElement('td');

                const btnStartAppointment = document.createElement('button');
                btnStartAppointment.innerText = '¡Iniciar consulta!';
                btnStartAppointment.addEventListener('click', () => {
                    openAppointmentModal(appointment.id);
                });

                tableCellBtn.appendChild(btnStartAppointment);

                tableCellAppointmentId.innerText = appointment.id;
                tableCellPatient.innerText = appointment.patient_name;
                tableCellSymptomatology.innerText = appointment.symptomatology;

                tableRow.appendChild(tableCellAppointmentId);
                tableRow.appendChild(tableCellPatient);
                tableRow.appendChild(tableCellSymptomatology);
                tableRow.appendChild(tableCellBtn);

                doctorTodayAppointmentsTable.appendChild(tableRow);
            });
        } else {
            const tableRow = utils.createNoDataRow('No se han encontrado citas para hoy', 4);
            doctorTodayAppointmentsTable.appendChild(tableRow);
        }
    });
}

updateTodayAppointmentsTable();

medicationCondition.addEventListener('click', () => {
    if (medicationCondition.checked) {
        medicationDuration.value = "";
        errorsMedicineDays.innerText = "";
        utils.defaultInput(medicationDuration);
        medicationDuration.disabled = true;
    } else {
        medicationDuration.disabled = false;
    }
});

selectMedication.addEventListener('blur', () => {
    const medicationId = selectMedication.selectedOptions[0].value;

    if (!medicationId) {
        errorsMedicineName.innerText = "Medicamento no seleccionado";
        utils.failInput(selectMedication);
    } else {
        errorsMedicineName.innerText = "";
        utils.successInput(selectMedication);
    }
})

medicationQuantity.addEventListener('blur', () => {
    if (!medicationQuantity.value) {
        errorsMedicineQuantity.innerText = "Cantidad de medicamento no indicada";
        utils.failInput(medicationQuantity)
    } else {
        errorsMedicineQuantity.innerText = "";
        utils.successInput(medicationQuantity);
    }
})

medicationFrequency.addEventListener('blur', () => {
    if (!medicationFrequency.value) {
        errorsMedicineFrequency.innerText = "Frecuencia de ingesta del medicamento no indicada";
        utils.failInput(medicationFrequency);
    } else {
        errorsMedicineFrequency.innerText = "";
        utils.successInput(medicationFrequency);
    }
})

medicationDuration.addEventListener('blur', () => {
    if (!(medicationCondition.checked) && !(medicationDuration.value)) {
        errorsMedicineDays.innerText = "Indica una duración de días o marca medicación cronica";
        utils.failInput(medicationDuration);
    } else {
        errorsMedicineDays.innerText = "";
        utils.successInput(medicationDuration);
    }
})

function clearAddMedicationInputs() {
    selectMedication.selectedIndex = 0;
    medicationQuantity.value = "";
    medicationFrequency.value = "";
    medicationDuration.value = "";
    medicationCondition.checked = false;
    errorsMedicineName.innerText = "";
    errorsMedicineQuantity.innerText = "";
    errorsMedicineFrequency.innerText = "";
    errorsMedicineDays.innerText = "";

    const turnDefault = [selectMedication, medicationQuantity, medicationFrequency, medicationDuration];

    turnDefault.forEach(e => {
        utils.defaultInput(e);
    });
}

addMedicationBtn.addEventListener('click', () => {
    const medicationId = selectMedication.selectedOptions[0].value;
    const medicationName = selectMedication.selectedOptions[0].innerText;
    const isChronic = medicationCondition.checked ? "Sí" : "No";
    const numberOfDays = medicationCondition.checked ? "365" : medicationDuration.value;

    let validMedication = true;

    if (!medicationId) {
        errorsMedicineName.innerText = "Medicamento no seleccionado";
        utils.failInput(selectMedication);

        validMedication = false;
    } else {
        errorsMedicineName.innerText = "";
        utils.successInput(selectMedication);
    }

    if (!medicationQuantity.value) {
        errorsMedicineQuantity.innerText = "Cantidad de medicamento no indicada";
        utils.failInput(medicationQuantity);

        validMedication = false;
    } else {
        errorsMedicineQuantity.innerText = "";
        utils.successInput(medicationQuantity);
    }

    if (!medicationFrequency.value) {
        errorsMedicineFrequency.innerText = "Frecuencia de ingesta del medicamento no indicada";
        utils.failInput(medicationFrequency);

        validMedication = false;
    } else {
        errorsMedicineFrequency.innerText = "";
        utils.successInput(medicationFrequency);
    }

    if (!(medicationCondition.checked) && !(medicationDuration.value)) {
        errorsMedicineDays.innerText = "Indica una duración de días o marca medicación cronica";
        utils.failInput(medicationDuration);

        validMedication = false;
    } else {
        errorsMedicineDays.innerText = "";
        utils.successInput(medicationDuration);
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

    clearAddMedicationInputs();
});

function selectDoctors(id) {
    fetch(`http://localhost/?resource_type=doctor_patients&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(eachDoctor => {
            modalDoctorsSelect.innerHTML = "";
            eachDoctor.forEach(doctor => {
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

function clearAppointmentModal() {
    setTimeout(() => {
        appointmentDoctorName.value = "";
        appointmentPatientName.value = "";
        appointmentDateTime.value = "";
        appointmentSymptomatology.value = "";
        appointmentDiagnosis.value = "";
        errorsSpanDiagnosis.value = "";

        appointmentIdInput.innerText = "";
        patientIdInput.innerText = "";

        clearAddMedicationInputs();

        appointmentPdf.value = "";

        modalDoctorsSelect.innerText = "";
        newAppointmentDateIn.value = "";
        newAppointmentSymptomatology.value = "";

        const turnDefault = [appointmentDiagnosis, newAppointmentDateIn];

        turnDefault.forEach(e => {
            utils.defaultInput(e);
        });

        updateTodayAppointmentsTable();

        updateAppointmentsNextSevenDaysCounter();
    }, 400);
}

mainAppointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    let string = appointmentDiagnosis.value;

    if (string.length <= 0) {
        errorsSpanDiagnosis.innerText = "Diagnostico no introducido";
        utils.failInput(appointmentDiagnosis);

        return;
    } else {
        errorsSpanDiagnosis.innerText = "";
        utils.successInput(appointmentDiagnosis);
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
            return response.json();
        })
        .then(() => {
            closeModalBtn.click();

            clearAppointmentModal();

            const medicationsRows = medicationTable.querySelectorAll('tr');

            if (medicationsRows[0].children[0].colSpan != 6) {
                
                medicationsRows.forEach(row => {
                    const newAppointmentMedication = {
                        appointment_id:  appointmentIdInput.innerText,
                        medicine_id: row.cells[0].innerText,
                        quantity: row.cells[2].innerText,
                        frequency: row.cells[3].innerText,
                        duration_days: row.cells[4].innerText,
                        chronic: row.cells[5] == 365 ? 1 : 0
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
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
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

appointmentDiagnosis.addEventListener('blur', () => {
    let string = appointmentDiagnosis.value;

    if (string.length <= 0) {
        errorsSpanDiagnosis.innerText = "Diagnostico no introducido";
        utils.failInput(appointmentDiagnosis);
    } else {
        errorsSpanDiagnosis.innerText = "";
        utils.successInput(appointmentDiagnosis);
    }
});

function appointmentDateValidation(date) {
    let validation = false;

    if (date < Date.now() || !newAppointmentDateIn.value) {
        errorsSpan2.innerText = "Fecha no valida";
        utils.failInput(newAppointmentDateIn);
    } else if (date.getDay() == 6 || date.getDay() == 0) {
        errorsSpan2.innerText = "Por favor, elija un día laborable";
        utils.failInput(newAppointmentDateIn);
    } else if (utils.isDate60DaysLater(date)) {
        errorsSpan2.innerText = "Tan malo no estarás. Pide una fecha como máximo 60 días en el futuro";
        utils.failInput(newAppointmentDateIn);
    } else if (date.getHours() < 8 || date.getHours() > 21) {
        errorsSpan2.innerText = "Por favor, elija un hora laborable";
        utils.failInput(newAppointmentDateIn);
    } else {
        errorsSpan2.innerText = "";
        utils.successInput(newAppointmentDateIn);
        validation = true;
    }

    return validation;
}

newAppointmentDateIn.addEventListener('blur', () => {
    const appointmentDateValue = new Date(newAppointmentDateIn.value);

    appointmentDateValidation(appointmentDateValue);
});

btnReferAppointment.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const appointmentDateValue = new Date(newAppointmentDateIn.value);
    
    const isAppointmentValid = appointmentDateValidation(appointmentDateValue);

    if (!isAppointmentValid) {
        return;
    }

    const appointmentUpdate = {
        id: appointmentIdInput.innerText,
        patient_id: patientIdInput.innerText,
        doctor_id: parseInt(modalDoctorsSelect.selectedOptions[0].value),
        appointment_date: utils.getFormattedDate(new Date(newAppointmentDateIn.value)),
        symptomatology: newAppointmentSymptomatology.value.trim() != "" ? newAppointmentSymptomatology.value.trim() : appointmentSymptomatology.value,
        diagnosis: "",
        is_consultation_done: 0,
        pdf_file: "none"
    }

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
            return response.json();
        })
        .then(() => {
            console.log("limpieza a la espera 1");

            closeModalBtn.click();

            console.log("limpieza a la espera 2");

            clearAppointmentModal();

            console.log("limpieza hecha");
            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
})
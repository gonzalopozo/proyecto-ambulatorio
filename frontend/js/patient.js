const queryParams = new URLSearchParams(location.search);
const id = parseInt(queryParams.get('resource_id')); 

const modalNewAppointment = document.querySelector("#modal-new-appointment");
const openModalNewAppointmentBtn = document.querySelector(".user-make-appointment-btn");
const closeModalNewAppointmentBtn = document.querySelector("#modal-new-appointment div .close-btn");

document.addEventListener("DOMContentLoaded", () => {
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
        if (!((pathName[pathName.length - 1] === 'patient.html') && idExists)) {
            location.assign(`../html/error404.html`);
        }        
    });

    openModalNewAppointmentBtn.addEventListener("click", () => {
        modalNewAppointment.classList.add("show");
        modalNewAppointment.classList.remove("hide");
    });
    
    closeModalNewAppointmentBtn.addEventListener("click", () => {
        modalNewAppointment.classList.add("hide");
        modalNewAppointment.addEventListener("animationend", () => {
            modalNewAppointment.classList.remove("show");
        }, { once: true });
    });

    modalNewAppointment.addEventListener("click", (event) => {
        if (event.target === modalNewAppointment) {
            closeModalNewAppointmentBtn.click(); // Simula el clic en la "X"
        }
    });

    const closeModalPastAppointemetnsDOMtBtn = document.querySelector("#modal-past-appointments div .close-btn");
    const modalPastAppointemetnsDOM = document.querySelector("#modal-past-appointments");

    closeModalPastAppointemetnsDOMtBtn.addEventListener("click", () => {
        modalPastAppointemetnsDOM.classList.add("hide");
        modalPastAppointemetnsDOM.addEventListener("animationend", () => {
            modalPastAppointemetnsDOM.classList.remove("show");
        }, { once: true });
    });

    modalPastAppointemetnsDOM.addEventListener("click", (event) => {
        if (event.target === modalPastAppointemetnsDOM) {
            closeModalPastAppointemetnsDOMtBtn.click(); // Simula el clic en la "X"
        }
    });
    
});

import utils from './helpers/utils.mjs';

const userNameHeader = document.querySelector('.user-name-header');
const clock = document.querySelector('.clock');

utils.refreshClock(clock);

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
const errorsSpan = document.querySelector('.errors span');
const modalAppointmentSymptomatology = document.querySelector('#appointment-symptomatology');
const modalSubmitBtn = document.querySelector('.modal-submit-btn');

const modalPastAppointments = document.querySelector('#modal-past-appointments');
const modalPastAppointmentsTitle = document.querySelector('#modal-past-appointments .modal-content .modal-title');
const modalPastAppointmentsDoctorName = document.querySelector('.modal-doctor-name');
const modalPastAppointmentsAppointmentDate = document.querySelector('.modal-appointment-date');
const modalPastAppointmentsSymptomatology = document.querySelector('.modal-symptomatology');
const modalPastAppointmentsDiagnosis = document.querySelector('.modal-diagnosis');
const modalPastAppointmentsPdfAttachment = document.querySelector('.modal-pdf-attachment');
const modalPastAppointmentsMedicationContainer = document.querySelector('.modal-medication-container');
const modalPastAppointmentsMedication = document.querySelector('.modal-medication');

function appointmentDateValidation(date) {
    let validation = false;

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
        validation = true;
    }

    return validation;
}

modalAppointmentDate.addEventListener('blur', () => {
    const appointmentDateValue = new Date(modalAppointmentDate.value);

    appointmentDateValidation(appointmentDateValue);
});

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
    userNameHeader.innerText = utils.takeJustName(userInfo.name);
    userEmail.innerText = userInfo.email;
    userDni.innerText = userInfo.dni;
    userPhone.innerText = userInfo.phone;
    userAddress.innerText = userInfo.address;
    userSex.innerText = userInfo.sex == 'male' ? 'Hombre' : 'Mujer'; 

    let bornDate = new Date(userInfo.born_date);
    userBornDate.innerText = utils.getFormattedDayMonthYear(bornDate); 
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
                    return;
                } 
                
                tableCellDurationDays.innerText = utils.getFormattedDayMonthYear(appointmentDate);    
            } else {
                tableCellDurationDays.innerText = "";
            }
            
            tableRow.appendChild(tableCellMedicineName);
            tableRow.appendChild(tableCellPosology);
            tableRow.appendChild(tableCellChronic);
            tableRow.appendChild(tableCellDurationDays);
    
            userCurrentMedicationTable.appendChild(tableRow);
        });
    } else {
        const tableRow = utils.createNoDataRow('No se han encontrado medicamentos', 4);

        userCurrentMedicationTable.appendChild(tableRow);
    }
});

function openAndFillPastAppointmentModal(appointmentId) {
    fetch(`http://localhost/?resource_type=appointments&resource_id=${appointmentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(pastAppointmentInfo => {
            let info = pastAppointmentInfo[0];

            modalPastAppointmentsTitle.innerText = `Consulta con el ID ${appointmentId}:`;
            modalPastAppointmentsDoctorName.innerText = info.doctor_name;
            
            let appointmentDate = new Date(info.appointment_date);
            modalPastAppointmentsAppointmentDate.innerText = utils.getFormattedDayMonthYearHoursSeconds(appointmentDate);

            modalPastAppointmentsSymptomatology.innerText = info.symptomatology;
            modalPastAppointmentsDiagnosis.innerText = info.diagnosis;

            if (info.pdf_file && (info.pdf_file != "none")) {
                const link = document.createElement('a');

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

                modalPastAppointmentsPdfAttachment.appendChild(link); // Agregarlo temporalmente al DOM

            } else {
                modalPastAppointmentsPdfAttachment.innerText = 'No hay PDF adjunto';
            }

            if (info.medicine_name && pastAppointmentInfo.length >= 1) {
                if (pastAppointmentInfo.length == 1) {
                    modalPastAppointmentsMedicationContainer.innerText = 'Medicamento recetado: ';
                } else {
                    modalPastAppointmentsMedicationContainer.innerText = 'Medicamentos recetados: ';
                }

                pastAppointmentInfo.forEach(medicine => {
                    const medication = document.createElement('li');

                    medication.innerHTML = `<b>- ${medicine.medicine_name}:</b> ${medicine.posology} ${medicine.frequency} `;

                    if (medicine.chronic == 0 ) {
                        let durationDate = new Date(medicine.appointment_date);
                        
                        durationDate.setDate(durationDate.getDate() + parseInt(medicine.duration_days));

                        medication.innerHTML += `hasta el ${utils.getFormattedDayMonthYear(durationDate)}`;
                    }

                    medication.innerHTML += ` | <b>¿Crónico?</b> ${medicine.chronic > 0 ? 'Sí' : 'No'}`;

                    modalPastAppointmentsMedication.appendChild(medication);
                });
            } else {
                modalPastAppointmentsMedication.innerText = 'No se recetó medicamento';
            }

            modalPastAppointments.classList.add('show');
            modalPastAppointments.classList.remove('hide');

            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

function selectStatusAppointments(status, id) {
    return fetch(`http://localhost/?resource_type=appointments&appointments_status=${status}&resource_id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(appointments => {
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
                    
                    tableRow.appendChild(tableCellId);
                    tableRow.appendChild(tableCellDoctorName);
                    tableRow.appendChild(tableCellAppointmentDate);
            
                    if (status == 'upcoming') {
                        userUpcomingAppointmentsTable.appendChild(tableRow)
                    } else if (status == 'past') {
                        tableRow.style.cursor = "pointer";
                        userPastAppointmentsTable.appendChild(tableRow);
    
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
            return data;            
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

selectDoctors(id).then(eachDoctor => {
    eachDoctor.forEach(doctor => {
        const selectOpt = document.createElement('option');

        selectOpt.value = doctor.doctor_id;
        selectOpt.innerText = `${doctor.name} (${doctor.specialty})`;

        modalDoctorsSelect.appendChild(selectOpt);
    })
});

modalSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault(); 

    const appointmentDateValue = new Date(modalAppointmentDate.value);

    const newAppointment = {
        patient_id: id,
        doctor_id: parseInt(modalDoctorsSelect.selectedOptions[0].value),
        appointment_date: utils.getFormattedDate(appointmentDateValue),
        symptomatology: modalAppointmentSymptomatology.value
    }

    const isDateValid = appointmentDateValidation(appointmentDateValue);
    
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
                closeModalNewAppointmentBtn.click();

                setTimeout(() => {
                    modalDoctorsSelect.selectedIndex = 0;
                    modalAppointmentDate.value = "";
                    modalAppointmentSymptomatology.value = "";

                    userUpcomingAppointmentsTable.innerText = "";
                    selectStatusAppointments("upcoming", id);
                }, 400);
                
                return data;            
            })
            .catch(error => {
                console.error('Error:', error);
                return false;
            });
    }
});
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

const doctorName = document.querySelector('.doctor-name');
const doctorEmail = document.querySelector('.doctor-email');
const doctorPhone = document.querySelector('.doctor-phone');
const doctorSpecialty = document.querySelector('.doctor-specialty');
const doctorAppointmentsNextSevenDays = document.querySelector('.doctor-appointments-next-seven-days span');
const doctorTodayAppointmentsTable = document.querySelector('.doctor-today-appointments table tbody');
const modal = document.querySelector(".modal");

const appointmentDoctorName = document.querySelector('#doctor-name');
const appointmentPatientName = document.querySelector('#patient-name');
const appointmentDateTime = document.querySelector('#appointment-date-time');
const appointmentSymptomatology = document.querySelector('#symptomatology');
const appointmentDiagnosis = document.querySelector('#diagnosis');
const selectMedication = document.querySelector('#medication-select');
const medicationQuantity = document.querySelector('#medication-quantity');
const medicationFrequency = document.querySelector('#medication-frequency');
const medicationDuration = document.querySelector('#medication-duration');
const medicationCondition = document.querySelector('#chronic-condition');
const addMedicationBtn = document.querySelector('#add-medication-btn');
const medicationTable = document.querySelector('.main-appointment-form .medicines table tbody');
const modalDoctorsSelect = document.querySelector('#doctor-select');
const registerAppointmetnBtn = document.querySelector('#register-appointment-btn');
const errorsSpanSymptomatology = document.querySelector('.errors #symptomatology-er');
const errorsSpanDiagnosis = document.querySelector('.errors #diagnosis-er');


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
        medicationDuration.disabled = true;
    } else {
        medicationDuration.disabled = false;
    }
});

addMedicationBtn.addEventListener('click', () => {
    const tableRow = document.createElement('tr');

    const tableCellMedicineName = document.createElement('td');
    const tableCellMedicineQuantity = document.createElement('td');
    const tableCellMedicineFrequency = document.createElement('td');
    const tableCellMedicineNumberDays = document.createElement('td');
    const tableCellMedicineChronic = document.createElement('td');

    if (medicationCondition.checked) {
        tableCellMedicineName.innerText = selectMedication.selectedOptions[0].innerText;
        tableCellMedicineQuantity.innerText = medicationQuantity.value;
        tableCellMedicineFrequency.innerText = medicationFrequency.value;
        tableCellMedicineNumberDays.innerText = "";
        tableCellMedicineChronic.innerText = "Sí";
    } else {
        tableCellMedicineName.innerText = selectMedication.selectedOptions[0].innerText;
        tableCellMedicineQuantity.innerText = medicationQuantity.value;
        tableCellMedicineFrequency.innerText = medicationFrequency.value;
        tableCellMedicineNumberDays.innerText = medicationDuration.value;
        tableCellMedicineChronic.innerText = "No";
    }

    tableRow.appendChild(tableCellMedicineName);
    tableRow.appendChild(tableCellMedicineQuantity);
    tableRow.appendChild(tableCellMedicineFrequency);
    tableRow.appendChild(tableCellMedicineNumberDays);
    tableRow.appendChild(tableCellMedicineChronic);

    medicationTable.appendChild(tableRow);
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
                
                const selectOpt = document.createElement('option');
        
                selectOpt.value = doctor.doctor_id;
                selectOpt.innerText = `${doctor.name} (${doctor.specialty})`;
                
                modalDoctorsSelect.appendChild(selectOpt);
            })
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

registerAppointmetnBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (appointmentSymptomatology.value == "") {
        errorsSpanSymptomatology.innerText = "Sintomatologia no introducida";
        appointmentSymptomatology.borderColor = "1px solid red";
    } else {
        errorsSpanSymptomatology.innerText = "";
    }
    
    // console.log(appointmentDiagnosis.value);

    let string = appointmentDiagnosis.value;


    
    if (string.length <= 0) {
        errorsSpanDiagnosis.innerText = "Diagnostico no introducido";
    } else {
        errorsSpanDiagnosis.innerText = "";
    }
});

appointmentSymptomatology.addEventListener('blur', () => {
    if (appointmentSymptomatology.value == "") {
        errorsSpanSymptomatology.innerText = "Sintomatologia no introducida";
        // appointmentSymptomatology.border = "1px solid red";
    } else {
        errorsSpanSymptomatology.innerText = "";
    }
});



appointmentDiagnosis.addEventListener('blur', () => {
    let string = appointmentDiagnosis.value;

    if (string.length <= 0) {
        errorsSpanDiagnosis.innerText = "Diagnostico no introducido";
        // appointmentDiagnosis.border = "1px solid red";
    } else {
        errorsSpanDiagnosis.innerText = "";
    }
});


appointmentDateTime.addEventListener('blur', () => {
    if (newAppointmentDate < Date.now()) {
        errorsSpan2.innerText = "Fecha no valida";
    } else if (newAppointmentDate.getDay() == 6 || newAppointmentDate.getDay() == 0) {
        errorsSpan2.innerText = "Por favor, elija un día laborable";
    } else if (esFechaMayor30Dias(newAppointmentDate)) {
        errorsSpan2.innerText = "Tan malo no estarás. Pide una fecha como máximo 30 días en el futuro";
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


const errorsSpan2 = document.querySelector('#errors2 span');

const btnNewAppointment = document.querySelector('#create-Appointment');

const newAppointmentDateIn = document.querySelector('#new-appointment-date');

btnNewAppointment.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    let newAppointmentDate = new Date(newAppointmentDateIn.value);

    console.log(newAppointmentDate);
    

    if (newAppointmentDate < Date.now()) {
        errorsSpan2.innerText = "Fecha no valida";
    } else if (newAppointmentDate.getDay() == 6 || newAppointmentDate.getDay() == 0) {
        errorsSpan2.innerText = "Por favor, elija un día laborable";
    } else if (esFechaMayor60Dias(newAppointmentDate)) {
        errorsSpan2.innerText = "Tan malo no estarás. Pide una fecha como máximo 90 días en el futuro";
    } else {
        errorsSpan2.innerText = "";
    }
    
})
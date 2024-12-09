const patientInput = document.querySelector('#patient')
const ownerInput = document.querySelector('#owner')
const emailInput = document.querySelector('#email')
const dateInput = document.querySelector('#date')
const symptomsInput = document.querySelector('#symptoms')

const form = document.querySelector('#appointment_form')
const formSubmit = document.querySelector('#appointment_form input[type="submit"]')
const formContent = document.querySelector('#appointment')

patientInput.addEventListener('change', appointmentData)
ownerInput.addEventListener('change', appointmentData)
emailInput.addEventListener('change', appointmentData)
dateInput.addEventListener('change', appointmentData)
symptomsInput.addEventListener('change', appointmentData)

form.addEventListener('submit', submitAppointment)

let editApmt = false

const appointmentObj = {
    id: generateId(),
    patient: '',
    owner: '',
    email: '',
    date: '',
    symptoms: ''
}

class Notification {

    constructor({text, type}) {
        this.text = text
        this.type = type
        this.show_alert()
    }

    show_alert() {
        const alert = document.createElement('DIV');
        alert.classList.add('alert_style');

        const duplicate_alert = document.querySelector('.alert_style');
        duplicate_alert?.remove();

        alert.textContent = this.text

        this.type === 'error' ? alert.style.backgroundColor = 'red' : alert.style.backgroundColor = 'green';
        formContent
        form.parentElement.insertBefore(alert, form);

        setTimeout(() => {
            alert.remove()
        }, 5000);
    }
}

class AdminAppointment {
    constructor() {
        this.appointments = [];
    }

    addAppointment(appointment) {
        this.appointments = [...this.appointments, appointment]
        this.showAppointment()
    }

    editAppointment(updateAppointment) {
        this.appointments = this.appointments.map( appointment => appointment.id === updateAppointment.id ? updateAppointment : appointment );
        this.showAppointment();
    }

    deleteAppointment(id) {
        this.appointments = this.appointments.filter(appointment => appointment.id !== id);
        this.showAppointment();
    }

    showAppointment() {

        while(formContent.firstChild) {
            formContent.removeChild(formContent.firstChild)
        }

        if (this.appointments.length == 0) {
            formContent.innerHTML = 'No hay registros';
            return
        } 
        
        this.appointments.forEach(appointment => {
            const divappointment = document.createElement('DIV');
            divappointment.classList.add('appointment_content');
        
            const patient = document.createElement('P');
            patient.classList.add('appointment_fields')
            patient.innerHTML = `<span>Paciente: </span> ${appointment.patient}`;
        
            const owner = document.createElement('P');
            owner.classList.add('appointment_fields')
            owner.innerHTML = `<span>Propietario: </span> ${appointment.owner}`;
        
            const email = document.createElement('P');
            email.classList.add('appointment_fields')
            email.innerHTML = `<span>E-mail: </span> ${appointment.email}`;
        
            const date = document.createElement('P');
            date.classList.add('appointment_fields')
            date.innerHTML = `<span>Fecha: </span> ${appointment.date}`;
        
            const symptoms = document.createElement('P');
            symptoms.classList.add('appointment_fields')
            symptoms.innerHTML = `<span>Síntomas: </span> ${appointment.symptoms}`;


            const btnEdit = document.createElement('BUTTON');
            btnEdit.classList.add('edit_form_btn');
            btnEdit.innerHTML = 'Editar <svg fill="none" width="24px" height="24px" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            const cloneForm = structuredClone(appointment)
            btnEdit.onclick = () => editForm(cloneForm);

            const btnDelete = document.createElement('BUTTON');
            btnDelete.classList.add('delete_form_btn');
            btnDelete.innerHTML = 'Eliminar <svg fill="none" width="24px" height="24px" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            btnDelete.onclick = () => this.deleteAppointment(appointment.id)
        
            const btnContent = document.createElement('DIV');
            btnContent.classList.add('btn_content');

            btnContent.appendChild(btnEdit);
            btnContent.appendChild(btnDelete);

            
            divappointment.appendChild(patient);
            divappointment.appendChild(owner);
            divappointment.appendChild(email);
            divappointment.appendChild(date);
            divappointment.appendChild(symptoms);
            divappointment.appendChild(btnContent);
            formContent.appendChild(divappointment);
        });    

    }
}


function appointmentData(e) {
    appointmentObj[e.target.name] = e.target.value

    console.log(appointmentObj)
}

const appointments = new AdminAppointment

function submitAppointment(e) {
    e.preventDefault();

    if ( Object.values(appointmentObj).some(value => value.trim() === '')) {
        new Notification ({
            text: 'Todos los campos son obligatorios',
            type: 'error'
        })
        return
    }

    if (editApmt) { 
        appointments.editAppointment({...appointmentObj});
        new Notification ({
            text: 'Registro actualizado correctamente',
            type: 'exito'
        })
    } else {
        appointments.addAppointment({...appointmentObj})

        new Notification ({
            text: 'Registro agregado correctamente',
            type: 'exito'
        })
    }

    form.reset()
    resetFormInputs()
    formSubmit.value = 'Agregar paciente'
    editApmt = false
}

function resetFormInputs() {
    Object.assign(appointmentObj, {
        id: generateId(),
        patient: '',
        owner: '',
        email: '',
        date: '',
        symptoms: ''
    })
}

function generateId() {
    return Math.random().toString(36).substring(2) + Date.now()
}

function editForm(appointment) {
    Object.assign(appointmentObj, appointment);
    
    patient.value = appointment.patient;
    owner.value = appointment.owner;
    email.value = appointment.email;
    date.value = appointment.date;
    symptoms.value = appointment.symptoms;

    editApmt = true;

    formSubmit.value = 'Actualizar paciente'
}


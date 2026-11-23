import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Doctor from './page/Doctor/Doctor';
import DateCard from './page/Date/Date';
import ContactCard from './page/Contact/Contact';
import WaitingCard from './page/Waiting/Waiting';
import Admin from './page/Admin/Admin';

const defaultDoctors = [
  { id: 'oleksandr', initials: 'OY', name: 'Oleksandr Yuzevych', specialty: 'GP · quiet appointments' },
  { id: 'maria', initials: 'MK', name: 'Mariia Koval', specialty: 'Cardiologist · quiet area' },
  { id: 'ivan', initials: 'IS', name: 'Ivan Savchenko', specialty: 'Neurologist · dim lighting' },
  { id: 'anna', initials: 'AM', name: 'Anna Marchenko', specialty: 'Psychologist · calm setting' },
  { id: 'dmytro', initials: 'DP', name: 'Dmytro Petrenko', specialty: 'Orthopedist · low-stress space' },
];

const timeSlots = ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45'];
const queueNames = [
  'Olena Bondar',
  'Maksym Tkachenko',
  'Sofia Melnyk',
  'Andrii Shevchenko',
  'Iryna Kovalenko',
  'Danylo Petrenko',
  'Yuliia Marchenko',
  'Taras Boyko',
];

function readStoredList(key, fallback) {
  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) return fallback;

  try {
    const parsedValue = JSON.parse(storedValue);
    if (Array.isArray(parsedValue)) return parsedValue;
    console.error(`Saved data for "${key}" is not a list.`);
  } catch (error) {
    console.error(`Could not parse saved data for "${key}".`, error);
  }

  return fallback;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function formatTime(minutes) {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  const hours = String(Math.floor(normalizedMinutes / 60)).padStart(2, '0');
  const mins = String(normalizedMinutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
}

function createQueue(patientName, selectedTime) {
  const [hours, minutes] = selectedTime.split(':').map(Number);
  const appointmentMinutes = hours * 60 + minutes;

  return Array.from({ length: 9 }, (_, index) => {
    const offset = index - 4;
    return {
      number: index + 1,
      name: offset === 0 ? patientName : queueNames[index < 4 ? index : index - 1],
      time: formatTime(appointmentMinutes + offset * 15),
      isCurrent: offset === 0,
    };
  });
}

function getPatientDisplayName(contact) {
  return `${contact.firstName.trim()} ${contact.lastName.trim()}`.trim();
}

function App() {
  const [doctors, setDoctors] = useState(() => readStoredList('care-doctors', defaultDoctors));
  const [appointments, setAppointments] = useState(() => readStoredList('care-appointments', []));
  const routePath = window.location.pathname.replace(/\/+$/, '') || '/';
  const view = routePath === '/admin' ? 'management' : 'booking';
  const [step, setStep] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState('oleksandr');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-12-25');
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const visibleDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return doctors;
    return doctors.filter((doctor) =>
      `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(query)
    );
  }, [doctors, searchTerm]);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) || doctors[0];
  const patientName = getPatientDisplayName(contact);
  const queue = useMemo(
    () => createQueue(patientName, selectedTime),
    [patientName, selectedTime]
  );

  useEffect(() => {
    window.localStorage.setItem('care-doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    window.localStorage.setItem('care-appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addDoctor = (doctor) => {
    setDoctors((current) => [...current, { ...doctor, id: createId() }]);
  };

  const handleContactChange = (field, value) => {
    setContact((current) => ({ ...current, [field]: value }));
  };

  const goNext = () => setStep((current) => Math.min(current + 1, 3));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));
  const createAppointment = () => {
    setAppointments((current) => [
      ...current,
      {
        id: createId(),
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        patientName,
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        date: selectedDate,
        time: selectedTime,
      },
    ]);
    goNext();
  };
  const startOver = () => {
    setStep(0);
    setContact({ firstName: '', lastName: '', email: '', phone: '' });
  };

  if (view === 'management') {
    return (
      <Admin
        doctors={doctors}
        appointments={appointments}
        onAddDoctor={addDoctor}
      />
    );
  }

  const steps = ['Doctor', 'Date & time', 'Your details', 'Confirmation'];
  const isComplete = step === 3;

  return (
    <main className="app-shell">
      <section className="booking-layout" aria-label="Appointment booking">
        <header className="booking-header">
          <a className="brand" href="/" aria-label="UI/UX home">
            <span className="brand__mark" aria-hidden="true">+</span>
            <span>ui<span className="brand__accent">/ux</span></span>
          </a>
        </header>

        {step > 0 && step < 3 && (
          <button type="button" className="back-button" onClick={goBack}>
            <span aria-hidden="true">←</span> Back
          </button>
        )}

        <nav className="booking-steps" aria-label="Booking progress">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`booking-step ${index === step ? 'booking-step--active' : ''} ${index < step ? 'booking-step--complete' : ''}`}
              aria-current={index === step ? 'step' : undefined}
            >
              <span className="booking-step__number">{index < step ? '✓' : index + 1}</span>
              <span className="booking-step__label">{label}</span>
            </div>
          ))}
        </nav>

        <div className="app-grid app-grid--single" aria-live="polite">
          {step === 0 && (
            <Doctor
              doctors={visibleDoctors}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDoctorId={selectedDoctorId}
              setSelectedDoctorId={setSelectedDoctorId}
            />
          )}
          {step === 1 && (
            <DateCard
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              timeSlots={timeSlots}
            />
          )}
          {step === 2 && (
            <ContactCard
              values={contact}
              onChange={handleContactChange}
              onContinue={createAppointment}
            />
          )}
          {step === 3 && (
            <WaitingCard
              patients={queue}
              selectedDoctor={selectedDoctor}
              date={selectedDate}
            />
          )}
        </div>

        <div className="booking-actions">
          <button
            type={step === 2 ? 'submit' : 'button'}
            form={step === 2 ? 'contact-form' : undefined}
            className="booking-actions__button"
            onClick={step === 3 ? startOver : step === 2 ? undefined : goNext}
            disabled={step === 0 && visibleDoctors.length === 0}
          >
            {isComplete ? 'Book another appointment' : 'Continue'}
            {!isComplete && <span aria-hidden="true">→</span>}
          </button>
          {isComplete && <p className="booking-actions__note">Your appointment details are ready.</p>}
        </div>
      </section>
    </main>
  );
}

export default App;

import { useMemo, useState } from 'react';
import './App.css';
import Doctor from './page/Doctor/Doctor';
import DateCard from './page/Date/Date';
import ContactCard from './page/Contact/Contact';
import WaitingCard from './page/Waiting/Waiting';

const doctors = [
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
  }, [searchTerm]);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) || doctors[0];
  const patientName = getPatientDisplayName(contact);
  const queue = useMemo(
    () => createQueue(patientName, selectedTime),
    [patientName, selectedTime]
  );

  const handleContactChange = (field, value) => {
    setContact((current) => ({ ...current, [field]: value }));
  };

  const goNext = () => setStep((current) => Math.min(current + 1, 3));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));
  const startOver = () => {
    setStep(0);
    setContact({ firstName: '', lastName: '', email: '', phone: '' });
  };

  return (
    <main className="app-shell">
      <section className="booking-layout" aria-label="Appointment booking">
        {step > 0 && step < 3 && (
          <button type="button" className="back-button" onClick={goBack}>
            <span aria-hidden="true">←</span> Back
          </button>
        )}

        <div className="app-grid app-grid--single">
          {step === 0 && (
            <Doctor
              doctors={visibleDoctors}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDoctorId={selectedDoctorId}
              setSelectedDoctorId={setSelectedDoctorId}
              onContinue={goNext}
            />
          )}
          {step === 1 && (
            <DateCard
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              timeSlots={timeSlots}
              onContinue={goNext}
            />
          )}
          {step === 2 && (
            <ContactCard
              values={contact}
              onChange={handleContactChange}
              onContinue={goNext}
            />
          )}
          {step === 3 && (
            <WaitingCard
              patients={queue}
              selectedDoctor={selectedDoctor}
              date={selectedDate}
              onContinue={startOver}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;

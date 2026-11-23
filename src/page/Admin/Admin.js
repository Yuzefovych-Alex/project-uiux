import { useMemo, useState } from 'react';
import './Admin.css';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'doctors', label: 'Doctors' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'schedule', label: 'Doctor schedule' },
];

function formatDate(value) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function AppointmentTable({ appointments, showDoctor = true }) {
  if (appointments.length === 0) {
    return <p className="admin-empty">No appointments yet. New bookings will appear here.</p>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date & time</th>
            {showDoctor && <th>Doctor</th>}
            <th>Patient</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                <strong>{formatDate(appointment.date)}</strong>
                <span className="admin-table__sub">{appointment.time}</span>
              </td>
              {showDoctor && <td>{appointment.doctorName}</td>}
              <td>{appointment.patientName}</td>
              <td>
                <span>{appointment.phone || '—'}</span>
                <span className="admin-table__sub">{appointment.email || '—'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Admin({ doctors, appointments, onAddDoctor }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
    [appointments]
  );
  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) || doctors[0];
  const doctorAppointments = sortedAppointments.filter(
    (appointment) => appointment.doctorId === selectedDoctor?.id
  );
  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  const upcomingAppointments = sortedAppointments.filter((appointment) => appointment.date >= todayKey);

  const submitDoctor = (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanSpecialty = specialty.trim();
    const initials = cleanName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    onAddDoctor({
      name: cleanName,
      initials,
      specialty: cleanSpecialty,
    });
    setName('');
    setSpecialty('');
  };

  return (
    <main className="admin-shell">
      <section className="admin-layout" aria-label="Clinic management">
        <header className="admin-header">
          <a className="brand" href="/" aria-label="UI/UX home">
            <span className="brand__mark" aria-hidden="true">+</span>
            <span>ui<span className="brand__accent">/ux</span></span>
          </a>
        </header>

        <div className="admin-heading">
          <div>
            <h1>Clinic management</h1>
          </div>
        </div>

        <nav className="admin-tabs" aria-label="Management sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'overview' && (
          <section className="admin-content" aria-labelledby="overview-title">
            <h2 id="overview-title" className="admin-section-title">Overview</h2>
            <div className="admin-stats">
              <article className="admin-stat">
                <span className="admin-stat__label">Doctors</span>
                <strong>{doctors.length}</strong>
                <span className="admin-stat__detail">in your clinic</span>
              </article>
              <article className="admin-stat">
                <span className="admin-stat__label">Appointments</span>
                <strong>{appointments.length}</strong>
                <span className="admin-stat__detail">all bookings</span>
              </article>
              <article className="admin-stat">
                <span className="admin-stat__label">Upcoming</span>
                <strong>{upcomingAppointments.length}</strong>
                <span className="admin-stat__detail">from today onwards</span>
              </article>
            </div>
            <div className="admin-section-heading">
              <h3>Upcoming appointments</h3>
              <button type="button" className="admin-text-button" onClick={() => setActiveTab('appointments')}>
                View all
              </button>
            </div>
            <AppointmentTable appointments={upcomingAppointments.slice(0, 5)} />
          </section>
        )}

        {activeTab === 'doctors' && (
          <section className="admin-content" aria-labelledby="doctors-title">
            <div className="admin-section-heading">
              <div>
                <h2 id="doctors-title" className="admin-section-title">Doctors</h2>
                <p className="admin-section-description">Add a doctor to make them available for booking.</p>
              </div>
            </div>
            <form className="admin-doctor-form" onSubmit={submitDoctor}>
              <label>
                <span>Doctor's name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Alex Morgan"
                  minLength={2}
                  required
                />
              </label>
              <label>
                <span>Specialty / appointment notes</span>
                <input
                  type="text"
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                  placeholder="e.g. Family doctor"
                  minLength={2}
                  required
                />
              </label>
              <button type="submit" className="admin-primary-button">Add doctor</button>
            </form>

            <div className="admin-doctor-list">
              {doctors.map((doctor) => (
                <article className="admin-doctor-card" key={doctor.id}>
                  <span className="admin-doctor-card__avatar">{doctor.initials}</span>
                  <span className="admin-doctor-card__info">
                    <strong>{doctor.name}</strong>
                    <span>{doctor.specialty}</span>
                  </span>
                  <span className="admin-doctor-card__count">
                    {appointments.filter((appointment) => appointment.doctorId === doctor.id).length} bookings
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'appointments' && (
          <section className="admin-content" aria-labelledby="appointments-title">
            <h2 id="appointments-title" className="admin-section-title">All appointments</h2>
            <p className="admin-section-description">
              Bookings made through this browser are listed below.
            </p>
            <AppointmentTable appointments={sortedAppointments} />
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="admin-content" aria-labelledby="schedule-title">
            <h2 id="schedule-title" className="admin-section-title">Doctor schedule</h2>
            <p className="admin-section-description">
              Select a doctor to view their appointments. This demo does not authenticate doctor accounts.
            </p>
            <label className="admin-doctor-select">
              <span>Choose doctor</span>
              <select
                value={selectedDoctor?.id || ''}
                onChange={(event) => setSelectedDoctorId(event.target.value)}
                disabled={doctors.length === 0}
              >
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
            </label>
            {selectedDoctor && (
              <>
                <div className="admin-schedule-heading">
                  <div>
                    <h3>{selectedDoctor.name}</h3>
                    <p>{selectedDoctor.specialty}</p>
                  </div>
                  <span>{doctorAppointments.length} appointments</span>
                </div>
                <AppointmentTable appointments={doctorAppointments} showDoctor={false} />
              </>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default Admin;

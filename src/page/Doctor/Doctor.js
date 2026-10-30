import './Doctor.css';

function Doctor({ doctors, searchTerm, setSearchTerm, selectedDoctorId, setSelectedDoctorId, onContinue }) {
  return (
    <div className="panel doctor-panel">
      <h2 className="panel__title">Choose a doctor</h2>

      <div className="doctor-search">
        <span className="doctor-search__icon">⌕</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search doctors"
          aria-label="Search doctors"
        />
      </div>

      {doctors.length > 0 ? (
        <ul className="doctor-list">
          {doctors.map((doctor) => {
            const selected = doctor.id === selectedDoctorId;

            return (
              <li key={doctor.id} className={`doctor-item ${selected ? 'selected' : ''}`}>
                <button
                  type="button"
                  className="doctor-item__button"
                  onClick={() => setSelectedDoctorId(doctor.id)}
                  aria-pressed={selected}
                >
                  <div className="doctor-item__avatar">{doctor.initials}</div>

                  <div className="doctor-item__meta">
                    <div className="doctor-item__name">{doctor.name}</div>
                    <div className="doctor-item__specialty">{doctor.specialty}</div>
                  </div>

                  {selected && <span className="doctor-item__check" aria-label="Selected">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="doctor-empty" role="status">No doctors match that search. Try another name or specialty.</p>
      )}

      <button type="button" className="panel__button" onClick={onContinue} disabled={doctors.length === 0}>
        Continue
      </button>
    </div>
  );
}

export default Doctor;

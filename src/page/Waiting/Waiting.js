import './Waiting.css';

function WaitingCard({ patients, selectedDoctor, date, onContinue }) {
  const [year, month, day] = date.split('-');
  const doctorLastName = selectedDoctor.name.split(' ').pop();

  return (
    <div className="panel waiting-panel">
      <h2 className="panel__title">Waiting area</h2>
      <div className="waiting-header">
        <span>{`${day}.${month}.${year} · Dr. ${doctorLastName}`}</span>
      </div>

      <ul className="waiting-list" aria-label="People in the waiting queue">
        {patients.map((patient) => (
          <li
            key={patient.number}
            className={`waiting-item ${patient.isCurrent ? 'waiting-item--current' : ''}`}
            aria-current={patient.isCurrent ? 'true' : undefined}
          >
            <div className="waiting-item__meta">
              <span className="waiting-item__index">{String(patient.number).padStart(2, '0')}</span>
              <span className="waiting-item__name">
                {patient.name}
                {patient.isCurrent && <span className="waiting-item__tag">Your place</span>}
              </span>
            </div>
            <span className="waiting-item__time">{patient.time}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="panel__button" onClick={onContinue}>Done</button>
    </div>
  );
}

export default WaitingCard;

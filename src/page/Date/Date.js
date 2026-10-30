import { useState } from 'react';
import './Date.css';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function DateCard({ selectedDate, setSelectedDate, selectedTime, setSelectedTime, timeSlots, onContinue }) {
  const [viewedMonth, setViewedMonth] = useState(() => {
    const [year, month] = selectedDate.split('-').map(Number);
    return new Date(year, month - 1, 1);
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const firstDay = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const monthLength = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((offset + monthLength) / 7) * 7;
  const monthLabel = viewedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const changeMonth = (amount) => {
    const nextMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + amount, 1);
    setViewedMonth(nextMonth);
    const firstAvailableDate =
      nextMonth.getFullYear() === today.getFullYear() && nextMonth.getMonth() === today.getMonth()
        ? today
        : nextMonth;
    setSelectedDate(dateKey(firstAvailableDate));
  };

  return (
    <div className="panel date-panel">
      <h2 className="panel__title">Date and time</h2>

      <div className="date-header">
        <span>{monthLabel}</span>
        <div className="date-header__controls">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
            disabled={viewedMonth <= firstOfCurrentMonth}
          >
            ‹
          </button>
          <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
        </div>
      </div>

      <div className="calendar-weekdays" aria-hidden="true">
        {weekdays.map((day) => <span key={day}>{day}</span>)}
      </div>

      <div className="calendar-grid" role="group" aria-label={monthLabel}>
        {Array.from({ length: cellCount }, (_, index) => {
          const dayNumber = index - offset + 1;
          const date = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), dayNumber);
          const inMonth = date.getMonth() === viewedMonth.getMonth();
          const key = dateKey(date);
          const isSelected = key === selectedDate;
          const isPast = date < today;

          return (
            <button
              key={key}
              type="button"
              className={`calendar-day ${isSelected ? 'calendar-day--selected' : ''} ${!inMonth ? 'calendar-day--muted' : ''}`}
              onClick={() => setSelectedDate(key)}
              disabled={!inMonth || isPast}
              aria-pressed={isSelected}
              aria-label={date.toLocaleDateString('en-US', { dateStyle: 'full' })}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <label className="time-picker">
        <span className="time-picker__label">Available time</span>
        <select value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)}>
          {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
        </select>
      </label>

      <button type="button" className="panel__button" onClick={onContinue}>Continue</button>
    </div>
  );
}

export default DateCard;

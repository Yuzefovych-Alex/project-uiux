import './Contact.css';

const fields = [
  { key: 'firstName', label: 'First name', type: 'text', icon: '◌', autocomplete: 'given-name' },
  { key: 'lastName', label: 'Last name', type: 'text', icon: '◌', autocomplete: 'family-name' },
  { key: 'email', label: 'Email address', type: 'email', icon: '✉', autocomplete: 'email' },
  { key: 'phone', label: 'Phone number', type: 'tel', icon: '◔', autocomplete: 'tel' },
];

function Contact({ values, onChange, onContinue }) {
  const submitContact = (event) => {
    event.preventDefault();
    onContinue();
  };

  return (
    <div className="panel contact-panel">
      <h2 className="panel__title">Contact details</h2>

      <form className="contact-form" onSubmit={submitContact}>
        <div className="contact-fields">
          {fields.map((field) => (
            <label key={field.key} className="field-row">
              <span className="field-row__icon" aria-hidden="true">{field.icon}</span>
              <input
                autoComplete={field.autocomplete}
                type={field.type}
                placeholder={field.label}
                aria-label={field.label}
                value={values[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                required
                minLength={field.type === 'text' ? 2 : field.type === 'tel' ? 7 : undefined}
              />
            </label>
          ))}
        </div>

        <button type="submit" className="panel__button">Continue</button>
      </form>
    </div>
  );
}

export default Contact;

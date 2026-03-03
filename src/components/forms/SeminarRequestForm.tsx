import { useState } from 'react';
import { GHL } from '../../lib/constants';
import { submitToGHL } from '../../lib/ghl';
import { getRecaptchaToken } from '../shared/RecaptchaProvider';

const inputClass =
  'w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-brand-white placeholder-brand-subtle text-sm focus:outline-none focus:border-brand-red transition-colors';
const labelClass = 'block text-brand-muted text-sm font-medium mb-1';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function SeminarRequestForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [academyName, setAcademyName] = useState('');
  const [preferredDates, setPreferredDates] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !academyName.trim()) {
      setErrorMessage('Please fill out all required fields.');
      setStatus('error');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const captchaToken = await getRecaptchaToken('seminar_submit');
    // TODO: seminarFormId is a placeholder — replace in constants.ts after creating the form in GHL
    const result = await submitToGHL({
      formId: GHL.seminarFormId,
      fields: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        academy_name: academyName.trim(),
        ...(preferredDates.trim() && { preferred_dates: preferredDates.trim() }),
        ...(message.trim() && { message: message.trim() }),
      },
      captchaToken,
    });

    if (result.success) {
      setStatus('success');
    } else {
      setErrorMessage(result.message);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <p className="text-brand-white font-semibold text-lg">
          Request submitted!
        </p>
        <p className="text-brand-muted text-sm mt-2">
          We'll reach out to discuss details and scheduling.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="seminar-first-name" className={labelClass}>
            First Name <span className="text-brand-red">*</span>
          </label>
          <input
            id="seminar-first-name"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="First name"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="seminar-last-name" className={labelClass}>
            Last Name <span className="text-brand-red">*</span>
          </label>
          <input
            id="seminar-last-name"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="Last name"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="seminar-email" className={labelClass}>
          Email <span className="text-brand-red">*</span>
        </label>
        <input
          id="seminar-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="you@example.com"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="seminar-academy" className={labelClass}>
          Academy Name <span className="text-brand-red">*</span>
        </label>
        <input
          id="seminar-academy"
          type="text"
          value={academyName}
          onChange={(e) => {
            setAcademyName(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="Your academy or gym name"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="seminar-dates" className={labelClass}>
          Preferred Dates
        </label>
        <input
          id="seminar-dates"
          type="text"
          value={preferredDates}
          onChange={(e) => setPreferredDates(e.target.value)}
          placeholder="e.g. March 2026, weekends preferred"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="seminar-message" className={labelClass}>
          Additional Details
        </label>
        <textarea
          id="seminar-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Number of attendees, topic requests, etc."
          rows={4}
          className={`${inputClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-brand-red text-brand-white font-semibold px-6 py-3 text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending...' : 'Submit Request'}
      </button>

      {status === 'error' && (
        <p className="text-brand-red text-sm">{errorMessage}</p>
      )}

      <p className="text-brand-faint text-xs">
        This site is protected by reCAPTCHA and the Google{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </form>
  );
}

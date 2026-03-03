import { useState } from 'react';
import { GHL } from '../../lib/constants';
import { submitToGHL } from '../../lib/ghl';
import { getRecaptchaToken } from '../shared/RecaptchaProvider';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const captchaToken = await getRecaptchaToken('newsletter_submit');
    const result = await submitToGHL({
      formId: GHL.newsletterFormId,
      fields: { email: email.trim() },
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
      <div className="text-center">
        <p className="text-brand-white font-semibold">You're on the list!</p>
        <p className="text-brand-muted text-sm mt-1">
          We'll keep you posted on new content, events, and drops.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="Enter your email..."
          required
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded text-brand-white placeholder-brand-subtle text-sm focus:outline-none focus:border-brand-red transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-brand-red text-brand-white font-semibold px-6 py-3 text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending...' : 'Sign Up'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-brand-red text-sm mt-2">{errorMessage}</p>
      )}
      <p className="text-brand-faint text-xs mt-3">
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

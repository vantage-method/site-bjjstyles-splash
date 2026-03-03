import { GHL } from './constants';

interface GHLSubmitOptions {
  formId: string;
  fields: Record<string, string>;
  captchaToken: string;
}

interface GHLSubmissionResult {
  success: boolean;
  message: string;
}

export async function submitToGHL(
  options: GHLSubmitOptions,
): Promise<GHLSubmissionResult> {
  try {
    const formDataObj: Record<string, string> = {
      formId: options.formId,
      location_id: GHL.locationId,
      ...options.fields,
    };

    const payload = new FormData();
    payload.set('formData', JSON.stringify(formDataObj));
    payload.set('captchaV3', options.captchaToken);

    const res = await fetch(GHL.submitUrl, {
      method: 'POST',
      body: payload,
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        success: false,
        message:
          (json as { message?: string }).message || 'Submission failed. Please try again.',
      };
    }

    return { success: true, message: 'Success' };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

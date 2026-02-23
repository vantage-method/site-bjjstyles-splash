(function () {
    var form = document.getElementById('signup-form');
    if (!form) return;

    var RECAPTCHA_SITE_KEY = '6LeDBFwpAAAAAJe8ux9-imrqZ2ueRsEtdiWoDDpX';

    var submitBtn = form.querySelector('button[type="submit"]');
    var btnText = submitBtn.querySelector('.btn-text');
    var btnLoading = submitBtn.querySelector('.btn-loading');
    var successEl = document.getElementById('formSuccess');
    var errorEl = document.getElementById('formError');
    var emailInput = form.querySelector('[name="email"]');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate email
        if (!emailInput.value.trim() || !emailRe.test(emailInput.value.trim())) {
            emailInput.classList.add('error');
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        errorEl.style.display = 'none';

        try {
            // Get reCAPTCHA v3 token
            var captchaToken = '';
            if (window.grecaptcha) {
                captchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
            }

            var raw = new FormData(form);
            var formDataObj = Object.fromEntries(raw.entries());

            var payload = new FormData();
            payload.set('formData', JSON.stringify(formDataObj));
            payload.set('captchaV3', captchaToken);

            var res = await fetch('https://backend.leadconnectorhq.com/forms/submit', {
                method: 'POST',
                body: payload
            });

            var json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || 'Submission failed');
            }

            form.style.display = 'none';
            document.querySelector('.privacy-note').style.display = 'none';
            successEl.style.display = 'block';
        } catch (err) {
            console.error('Form submission error:', err);
            errorEl.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });

    emailInput.addEventListener('input', function () {
        this.classList.remove('error');
    });
})();

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submit = form && form.querySelector('button[type="submit"]');
  const FALLBACK_THANKS = "Thanks for reaching out — I'll be in touch soon.";
  const FALLBACK_ERROR = "Something went wrong sending that. Please email me directly and I'll get right back to you.";

  const setStatus = (text, isError) => {
    status.textContent = text;
    status.classList.toggle('error', Boolean(isError));
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submit.disabled = true;
      setStatus('Sending…', false);

      try {
        // Send FormData as-is — no Content-Type header, the browser sets the
        // multipart boundary itself. FormBackend returns JSON when we ask for it.
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });

        if (!res.ok) throw new Error(`FormBackend responded ${res.status}`);

        const data = await res.json().catch(() => ({}));
        setStatus(data.submission_text || FALLBACK_THANKS, false);
        form.reset();
      } catch (err) {
        setStatus(FALLBACK_ERROR, true);
      } finally {
        submit.disabled = false;
      }
    });
  }
});

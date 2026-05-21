document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const form = document.querySelector(".contact-form");

if (form) {
  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector("button");
  const originalButtonText = submitButton ? submitButton.innerHTML : "";

  if (window.emailjs) {
    emailjs.init({
      publicKey: "M5obhqMfQPx6qKQ9c",
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!window.emailjs) {
      if (status) status.textContent = "EmailJS kon niet laden. Controleer je internetverbinding en probeer opnieuw.";
      return;
    }

    if (submitButton) {
      submitButton.innerHTML = "Aanvraag verzenden...";
      submitButton.disabled = true;
    }

    if (status) {
      status.textContent = "Je aanvraag wordt veilig verzonden.";
    }

    try {
      await emailjs.sendForm("service_8hgaglq", "template_0p71lv2", form);
      form.reset();
      if (submitButton) submitButton.innerHTML = "Aanvraag verzonden";
      if (status) status.textContent = "Gelukt. Je ontvangt zo een bevestiging per e-mail.";
      setTimeout(() => {
        if (submitButton) {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        }
        if (status) status.textContent = "Reactie binnen 24 uur. Geen verplichtingen.";
      }, 3200);
    } catch (error) {
      console.error("EmailJS error:", error);
      if (submitButton) {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
      if (status) status.textContent = "Verzenden is niet gelukt. Controleer de gegevens en probeer opnieuw.";
    }
  });
}

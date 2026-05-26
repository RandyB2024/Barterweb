const DEAL_SERVICE_ID = "service_8hgaglq";
const DEAL_TEMPLATE_ID = "template_jq0uexh";
const EMAILJS_PUBLIC_KEY = "M5obhqMfQPx6qKQ9c";

const form = document.querySelector("#barterDealForm");
const canvas = document.querySelector("#signatureCanvas");
const signatureInput = document.querySelector("#signatureData");
const signaturePreview = document.querySelector("#signaturePreview");
const clearButton = document.querySelector("#clearSignature");
const printButton = document.querySelector("#printAgreement");
const dealIdInput = document.querySelector("#dealIdInput");
const dealIdPreview = document.querySelector("#deal-id-preview");
const agreementDealId = document.querySelector("#agreementDealId");
const agreementDetails = document.querySelector("#agreementDetails");
const statusText = document.querySelector(".deal-form-status");

const dealId = `BW-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
dealIdInput.value = dealId;
dealIdPreview.textContent = dealId;
agreementDealId.textContent = dealId;

if (window.emailjs) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const ctx = canvas.getContext("2d");
let isDrawing = false;
let hasSignature = false;

function resizeCanvas() {
  const image = canvas.toDataURL("image/png");
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(600, Math.floor(rect.width * window.devicePixelRatio));
  canvas.height = Math.floor(220 * window.devicePixelRatio);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#111827";
  if (hasSignature) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, rect.width, 220);
    img.src = image;
  }
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  return {
    x: point.clientX - rect.left,
    y: point.clientY - rect.top,
  };
}

function startDrawing(event) {
  event.preventDefault();
  isDrawing = true;
  hasSignature = true;
  const position = pointerPosition(event);
  ctx.beginPath();
  ctx.moveTo(position.x, position.y);
}

function draw(event) {
  if (!isDrawing) return;
  event.preventDefault();
  const position = pointerPosition(event);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();
  updateSignature();
}

function stopDrawing() {
  isDrawing = false;
  updateSignature();
}

function updateSignature() {
  if (!hasSignature) return;
  const dataUrl = canvas.toDataURL("image/png");
  signatureInput.value = dataUrl;
  signaturePreview.src = dataUrl;
  signaturePreview.style.display = "block";
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSignature = false;
  signatureInput.value = "";
  signaturePreview.removeAttribute("src");
  signaturePreview.style.display = "none";
}

function value(name) {
  return new FormData(form).get(name) || "Nog niet ingevuld";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function refreshAgreement() {
  const company = value("company_name");
  agreementDetails.innerHTML = `
    <dt>Partijen</dt>
    <dd>${escapeHtml(value("customer_name"))} ${company !== "Nog niet ingevuld" ? `(${escapeHtml(company)})` : ""}<br>${escapeHtml(value("customer_email"))} · ${escapeHtml(value("customer_phone"))}</dd>
    <dt>BarterWeb levert</dt>
    <dd><strong>${escapeHtml(value("barterweb_deliverable"))}</strong><br>${escapeHtml(value("barterweb_scope"))}</dd>
    <dt>Klant ruilt</dt>
    <dd><strong>${escapeHtml(value("customer_trade"))}</strong><br>${escapeHtml(value("customer_trade_details"))}</dd>
    <dt>Dealwaarde</dt>
    <dd>BarterWeb: ${escapeHtml(value("barterweb_value"))}<br>Tegenprestatie: ${escapeHtml(value("customer_value"))}</dd>
    <dt>Levertermijn</dt>
    <dd>BarterWeb: ${escapeHtml(value("barterweb_delivery_date"))}<br>Klant: ${escapeHtml(value("customer_delivery_date"))}</dd>
    <dt>Status</dt>
    <dd>Concept</dd>
  `;
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
window.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing);
clearButton.addEventListener("click", clearSignature);
printButton.addEventListener("click", () => window.print());
form.addEventListener("input", refreshAgreement);
window.addEventListener("resize", resizeCanvas);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  refreshAgreement();

  if (!hasSignature) {
    statusText.textContent = "Zet eerst je digitale handtekening.";
    return;
  }

  statusText.textContent = "Dealbevestiging wordt klaargezet...";

  if (window.emailjs) {
    try {
      await emailjs.sendForm(DEAL_SERVICE_ID, DEAL_TEMPLATE_ID, form);
      statusText.textContent = "Dealbevestiging verzonden. Je kunt nu de PDF downloaden.";
    } catch (error) {
      console.error("EmailJS deal error:", error);
      statusText.textContent = "PDF staat klaar. Mail verzenden lukte niet; controleer je EmailJS dealtemplate.";
    }
  } else {
    statusText.textContent = "PDF staat klaar. EmailJS kon niet laden.";
  }

  document.querySelector("#agreement").scrollIntoView({ behavior: "smooth", block: "start" });
});

resizeCanvas();
refreshAgreement();

const DEAL_SERVICE_ID = "service_8hgaglq";
const DEAL_TEMPLATE_ID = "template_jq0uexh";
const EMAILJS_PUBLIC_KEY = "M5obhqMfQPx6qKQ9c";

const form = document.querySelector("#barterDealForm");
const canvas = document.querySelector("#signatureCanvas");
const signatureInput = document.querySelector("#signatureData");
const signatureStatus = document.querySelector("#signatureStatus");
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
  if (signatureStatus) signatureStatus.value = "Ondertekend";
  signaturePreview.src = dataUrl;
  signaturePreview.style.display = "block";
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSignature = false;
  signatureInput.value = "";
  if (signatureStatus) signatureStatus.value = "Niet ondertekend";
  signaturePreview.removeAttribute("src");
  signaturePreview.style.display = "none";
}

function value(name) {
  return new FormData(form).get(name) || "Nog niet ingevuld";
}

function rawValue(name) {
  return String(new FormData(form).get(name) || "").trim();
}

function syncEmailAliases() {
  const email = rawValue("customer_email");
  const name = rawValue("customer_name");
  const emailAlias = document.querySelector("#dealEmailAlias");
  const toEmail = document.querySelector("#dealToEmail");
  const nameAlias = document.querySelector("#dealNameAlias");

  if (emailAlias) emailAlias.value = email;
  if (toEmail) toEmail.value = email;
  if (nameAlias) nameAlias.value = name;
}

function buildDealEmailParams() {
  const customerName = rawValue("customer_name");
  const companyName = rawValue("company_name");
  const customerEmail = rawValue("customer_email");
  const customerPhone = rawValue("customer_phone");
  const deliverable = rawValue("barterweb_deliverable");
  const scope = rawValue("barterweb_scope");
  const trade = rawValue("customer_trade");
  const tradeDetails = rawValue("customer_trade_details");
  const barterwebValue = rawValue("barterweb_value");
  const customerValue = rawValue("customer_value");
  const barterwebDeliveryDate = rawValue("barterweb_delivery_date");
  const customerDeliveryDate = rawValue("customer_delivery_date");

  return {
    deal_id: dealId,
    status: "concept",
    customer_name: customerName,
    company_name: companyName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    barterweb_deliverable: deliverable,
    barterweb_scope: scope,
    customer_trade: trade,
    customer_trade_details: tradeDetails,
    barterweb_value: barterwebValue,
    customer_value: customerValue,
    barterweb_delivery_date: barterwebDeliveryDate,
    customer_delivery_date: customerDeliveryDate,
    signature_status: hasSignature ? "Ondertekend" : "Niet ondertekend",
    email: customerEmail,
    to_email: customerEmail,
    reply_to: customerEmail,
    from_name: customerName || "BarterWeb klant",
    name: customerName || "BarterWeb klant",
    project_type: "BarterWeb dealbevestiging",
    website_url: "https://barterweb.nl",
    logo_url: "https://barterweb.nl/barterweb-logo.svg",
    message: [
      `Deal-ID: ${dealId}`,
      `Klant: ${customerName}${companyName ? ` (${companyName})` : ""}`,
      `BarterWeb levert: ${deliverable}`,
      `Klant ruilt: ${trade}`,
      `Waarde BarterWeb: ${barterwebValue}`,
      `Waarde tegenprestatie: ${customerValue}`,
      `Levertermijn BarterWeb: ${barterwebDeliveryDate}`,
      `Levertermijn klant: ${customerDeliveryDate}`,
      "Status: concept",
      "Handtekening: digitaal gezet",
    ].join("\n"),
  };
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
  syncEmailAliases();
  const company = value("company_name");
  agreementDetails.innerHTML = `
    <dt>Partijen</dt>
    <dd>${escapeHtml(value("customer_name"))} ${company !== "Nog niet ingevuld" ? `(${escapeHtml(company)})` : ""}<br>${escapeHtml(value("customer_email"))} - ${escapeHtml(value("customer_phone"))}</dd>
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
  const submitButton = form.querySelector(".deal-submit");
  if (submitButton) submitButton.disabled = true;

  if (window.emailjs) {
    try {
      await emailjs.send(DEAL_SERVICE_ID, DEAL_TEMPLATE_ID, buildDealEmailParams());
      statusText.textContent = "Dealbevestiging verzonden. Je kunt nu de PDF downloaden.";
    } catch (error) {
      console.error("EmailJS deal error:", error);
      const details = error?.text || error?.message || "onbekende fout";
      statusText.textContent = `PDF staat klaar, maar de mail is niet verzonden: ${details}`;
    }
  } else {
    statusText.textContent = "PDF staat klaar, maar EmailJS kon niet laden. Controleer Cookiebot of je internetverbinding.";
  }

  if (submitButton) submitButton.disabled = false;
  document.querySelector("#agreement").scrollIntoView({ behavior: "smooth", block: "start" });
});

resizeCanvas();
refreshAgreement();

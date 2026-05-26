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

const serviceProfiles = [
  { keys: ["webshop", "ecommerce", "e-commerce", "shop"], value: [1200, 1800], hours: [18, 25], label: "Webshop" },
  { keys: ["reservering", "booking", "afspraak"], value: [950, 1500], hours: [14, 22], label: "Reserveringssysteem" },
  { keys: ["website", "one-page", "landingspagina", "landing"], value: [650, 1100], hours: [8, 16], label: "Website" },
  { keys: ["branding", "logo", "huisstijl"], value: [500, 900], hours: [7, 12], label: "Branding" },
  { keys: ["seo", "vindbaarheid"], value: [450, 850], hours: [6, 10], label: "SEO optimalisatie" },
  { keys: ["dashboard", "webapp", "platform", "app"], value: [1500, 2800], hours: [24, 42], label: "Webapp / platform" },
];

const tradeProfiles = [
  { keys: ["detailing", "auto detail", "lakcorrectie"], value: [800, 1400], hours: [12, 16], label: "Detailing" },
  { keys: ["fotografie", "foto", "shoot"], value: [600, 1200], hours: [6, 12], label: "Fotografie" },
  { keys: ["video", "videografie", "drone"], value: [1200, 1700], hours: [10, 18], label: "Videografie" },
  { keys: ["scooter", "vespa", "brommer"], value: [700, 1600], hours: null, label: "Scooter / voertuig" },
  { keys: ["tattoo", "tattooage"], value: [500, 1000], hours: [4, 8], label: "Tattoo sessie" },
  { keys: ["product", "pakket", "voorraad"], value: [400, 1100], hours: null, label: "Productpakket" },
  { keys: ["marketing", "social", "advertentie", "ads"], value: [650, 1300], hours: [8, 18], label: "Marketingdienst" },
  { keys: ["coach", "advies", "consulting", "training"], value: [500, 1200], hours: [5, 12], label: "Advies / coaching" },
];

function findProfile(text, profiles, fallback) {
  const normalized = text.toLowerCase();
  return profiles.find((profile) => profile.keys.some((key) => normalized.includes(key))) || fallback;
}

const toolTabs = document.querySelectorAll(".tool-tabs button");
const toolPanels = document.querySelectorAll(".tool-panel");

toolTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const tool = tab.dataset.tool;
    toolTabs.forEach((item) => item.classList.toggle("active", item === tab));
    toolPanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === tool));
  });
});

function setList(selector, items) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

const websiteScanButton = document.querySelector("#runWebsiteScan");

if (websiteScanButton) {
  websiteScanButton.addEventListener("click", () => {
    const url = document.querySelector("#scanUrl").value.trim();
    const checks = [
      ["#scanMobile", 18, "Maak de website beter bruikbaar op mobiel."],
      ["#scanHttps", 14, "Zorg dat HTTPS correct actief is."],
      ["#scanCta", 18, "Plaats een duidelijke actie bovenaan de pagina."],
      ["#scanSeo", 16, "Verbeter titels, meta description en kopstructuur."],
      ["#scanFast", 18, "Optimaliseer afbeeldingen en laadsnelheid."],
    ];
    let score = url ? 18 : 8;
    const tips = [];

    checks.forEach(([selector, points, tip]) => {
      if (document.querySelector(selector).checked) score += points;
      else tips.push(tip);
    });

    score = Math.min(100, score);
    document.querySelector("#scanScore").textContent = `${score}/100`;
    document.querySelector("#scanFeedback").textContent =
      score >= 82
        ? "Sterke basis. De grootste winst zit waarschijnlijk in conversie, content en vertrouwen."
        : score >= 62
          ? "Redelijke basis, maar er liggen duidelijke kansen om moderner, sneller en overtuigender te worden."
          : "Deze website loopt waarschijnlijk omzet mis door techniek, uitstraling of onduidelijke acties.";
    setList("#scanTips", tips.length ? tips.slice(0, 3) : ["Voeg social proof toe.", "Test je belangrijkste CTA.", "Houd de snelheid scherp."]);
  });
}

const toolDealButton = document.querySelector("#runToolDeal");

if (toolDealButton) {
  toolDealButton.addEventListener("click", () => {
    const wanted = document.querySelector("#toolWanted").value.trim();
    const offered = document.querySelector("#toolOffered").value.trim();

    if (!wanted || !offered) {
      document.querySelector("#toolDealFeedback").textContent = "Vul eerst in wat je wilt ontvangen en wat je aanbiedt.";
      return;
    }

    const result = localDealAnalysis(wanted, offered, "");
    document.querySelector("#toolDealScore").textContent = `${result.score}/100`;
    document.querySelector("#toolDealFeedback").textContent = result.feedback;
    setList("#toolDealTips", [...result.suggestions, ...result.risks].slice(0, 4));
  });
}

const costButton = document.querySelector("#runCostCalc");

if (costButton) {
  costButton.addEventListener("click", () => {
    const selected = [...document.querySelectorAll(".cost-option:checked")].map((item) => Number(item.value));
    const base = selected.reduce((sum, value) => sum + value, 0) || 650;
    const low = Math.round(base * 0.82 / 50) * 50;
    const high = Math.round(base * 1.24 / 50) * 50;
    document.querySelector("#costValue").textContent = `EUR ${low.toLocaleString("nl-NL")} - EUR ${high.toLocaleString("nl-NL")}`;
    document.querySelector("#costFeedback").textContent =
      base > 2200
        ? "Dit is een groter project. Een barterdeal kan nog steeds, maar duidelijke fases zijn verstandig."
        : "Dit project is geschikt om als slimme barterdeal of compacte samenwerking te bespreken.";
  });
}

const bioButton = document.querySelector("#runBioGen");

if (bioButton) {
  bioButton.addEventListener("click", () => {
    const name = document.querySelector("#bioName").value.trim() || "Jouw bedrijf";
    const offer = document.querySelector("#bioOffer").value.trim() || "helpt klanten met betere resultaten";
    const tone = document.querySelector("#bioTone").value;
    const openings = {
      professioneel: `${name} | ${offer}`,
      lokaal: `${name} helpt klanten in de regio met ${offer.toLowerCase()}`,
      premium: `${name} - premium service voor ondernemers die kwaliteit willen`,
    };
    const variants = {
      professioneel: ["Sterke service. Heldere afspraken. Resultaatgericht.", "Stuur een bericht voor beschikbaarheid of samenwerking."],
      lokaal: ["Persoonlijk, dichtbij en zonder gedoe.", "Plan vandaag nog je kennismaking."],
      premium: ["Voor klanten die geen standaard oplossing zoeken.", "Vraag een intake aan en ontdek wat mogelijk is."],
    };
    document.querySelector("#bioHeadline").textContent = openings[tone];
    document.querySelector("#bioText").textContent = `${offer}. Betrouwbaar, helder en gebouwd rond resultaat.`;
    setList("#bioVariants", variants[tone]);
  });
}

function formatRange(range) {
  return `EUR ${range[0].toLocaleString("nl-NL")} - EUR ${range[1].toLocaleString("nl-NL")}`;
}

function formatHours(range) {
  if (!range) return "waarde afhankelijk van staat en bewijs";
  return `${range[0]} - ${range[1]} uur inzet`;
}

function midpoint(range) {
  return (range[0] + range[1]) / 2;
}

function localDealAnalysis(wantedText, offeredText, contextText) {
  const wanted = findProfile(wantedText, serviceProfiles, {
    value: [700, 1400],
    hours: [10, 20],
    label: "Digitale dienst",
  });
  const offered = findProfile(offeredText, tradeProfiles, {
    value: [450, 1000],
    hours: [5, 14],
    label: "Tegenprestatie",
  });

  const ratio = midpoint(offered.value) / midpoint(wanted.value);
  const score = Math.max(42, Math.min(94, Math.round(100 - Math.abs(1 - ratio) * 72)));
  const context = contextText.toLowerCase();
  const hasProof = ["factuur", "portfolio", "reviews", "bewijs", "foto", "bon", "ervaring"].some((word) =>
    context.includes(word)
  );
  const adjustedScore = hasProof ? Math.min(98, score + 4) : score;

  let label = "Goede deal";
  let feedback = "Deze barter deal lijkt redelijk goed in balans. Maak scope, kwaliteit en levermomenten concreet voordat beide partijen akkoord geven.";
  const suggestions = ["Leg precies vast wat BarterWeb oplevert.", "Spreek leverdatum en acceptatiemoment af."];
  const risks = ["Waarde blijft een inschatting zonder bewijs of referenties."];

  if (adjustedScore >= 88) {
    label = "Zeer eerlijke deal";
    feedback = "Deze deal lijkt sterk in balans. De marktwaarde en verwachte inzet liggen dicht bij elkaar.";
    suggestions.push("Gebruik de dealbevestiging om deze afspraken direct vast te leggen.");
  } else if (adjustedScore < 62) {
    label = "Onevenwichtig";
    feedback = "Deze deal lijkt mogelijk scheef. Overweeg een kleinere scope, extra tegenprestatie of gedeeltelijke bijbetaling.";
    suggestions.push("Maak een light-versie van de gevraagde dienst.");
    risks.push("Een van de prestaties lijkt duidelijk lager gewaardeerd dan de andere.");
  } else if (adjustedScore < 78) {
    label = "Redelijk gebalanceerd";
    feedback = "Deze deal kan werken, maar vraagt om scherpe afspraken. Zorg dat extra werk buiten de deal apart wordt bevestigd.";
    suggestions.push("Beperk onderhoud of extra revisies als de tegenprestatie lager uitvalt.");
  }

  if (!hasProof) {
    suggestions.push("Vraag om foto's, portfolio, reviews of aankoopbewijs als onderbouwing.");
  }

  if (offered.hours === null) {
    risks.push("Bij productdeals hangt waarde sterk af van staat, leeftijd en overdraagbaarheid.");
  }

  return {
    score: adjustedScore,
    label,
    wantedValue: formatRange(wanted.value),
    offeredValue: formatRange(offered.value),
    wantedHours: formatHours(wanted.hours),
    offeredHours: formatHours(offered.hours),
    feedback,
    suggestions: suggestions.slice(0, 3),
    risks: risks.slice(0, 3),
  };
}

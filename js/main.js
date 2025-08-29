document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("emotionalHistoryForm");
  const resultSection = document.getElementById("results");
  const analysisText = document.getElementById("analysis");
  const downloadBtn = document.getElementById("downloadPDF");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {};
    new FormData(form).forEach((value, key) => {
      if (!data[key]) data[key] = [];
      data[key].push(value);
    });

    const score = calculateScore(data);
    const profile = determineProfile(score, data);
    analysisText.innerHTML = profile;
    resultSection.style.display = "block";
  });

  downloadBtn.addEventListener("click", () => {
    const opt = {
      margin: 0.5,
      filename: "historia_emocional_resultado.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(document.getElementById("results")).save();
  });
});

// 🔎 Análisis clínico basado en patrones reales
function calculateScore(data) {
  const score = {
    infancia: 0,
    adolescencia: 0,
    adultez: 0,
    autoestima: 0,
    relaciones: 0,
    trauma: 0,
  };

  // Etapas de vida
  if (data["etapaVida[]"]?.includes("Infancia")) score.infancia++;
  if (data["etapaVida[]"]?.includes("Adolescencia")) score.adolescencia++;
  if (data["etapaVida[]"]?.includes("Adultez")) score.adultez++;

  // Indicadores emocionales y conductuales
  if (data["emociones[]"]?.some(v => ["Culpa", "Vergüenza", "Inseguridad"].includes(v))) score.autoestima++;
  if (data["emociones[]"]?.some(v => ["Tristeza", "Abandono", "Soledad"].includes(v))) score.trauma++;

  if (data["areas[]"]?.includes("Relaciones interpersonales")) score.relaciones++;
  if (data["areas[]"]?.includes("Autoimagen o autoestima")) score.autoestima++;

  return score;
}

function determineProfile(score, data) {
  const resumen = [];

  resumen.push(`<h3>🧠 Perfil Emocional Inicial</h3>`);
  resumen.push(`<ul>`);
  if (score.infancia > 0) resumen.push(`<li>📌 Heridas asociadas a la infancia están presentes.</li>`);
  if (score.adolescencia > 0) resumen.push(`<li>🌀 Etapa adolescente significativa en el origen del dolor.</li>`);
  if (score.adultez > 0 && score.infancia === 0 && score.adolescencia === 0) resumen.push(`<li>🔍 Situaciones actuales parecen ser el foco principal.</li>`);

  if (score.autoestima > 0) resumen.push(`<li>💔 Indicadores de afectación en autoestima o autoimagen.</li>`);
  if (score.trauma > 0) resumen.push(`<li>🚨 Posibles secuelas emocionales no resueltas: tristeza profunda, abandono o soledad.</li>`);
  if (score.relaciones > 0) resumen.push(`<li>🤝 Dificultades o heridas en vínculos con otros.</li>`);
  resumen.push(`</ul>`);

  // Reflexión libre
  const reflexion = data["reflexion"]?.[0] || "";
  if (reflexion.trim().length > 20) {
    resumen.push(`<h4>✍️ Tu reflexión:</h4>`);
    resumen.push(`<p class="reflexion">${reflexion}</p>`);
    resumen.push(`<h4>🔎 Lectura terapéutica:</h4>`);
    resumen.push(`<p>Puedes haber señalado sin darte cuenta algo que es núcleo emocional. Esta frase no es solo una opinión: es la voz de tu parte más vulnerable. El terapeuta puede ayudarte a escucharla sin miedo.</p>`);
  }

  resumen.push(`<hr><p class="nota">Este resultado no reemplaza una evaluación clínica profesional. Es una brújula inicial para tu proceso terapéutico.</p>`);
  return resumen.join("");
}

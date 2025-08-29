document.getElementById('submitBtn').addEventListener('click', () => {
  const form = document.forms['testForm'];
  const sintomas = ['q1','q2','q3','q4','q5'].map(q => parseInt(form[q].value));
  const etapa = [...form['etapa']].filter(cb => cb.checked).map(cb => cb.value);
  const causa = [...form['causa']].filter(cb => cb.checked).map(cb => cb.value);
  const area = [...form['area']].filter(cb => cb.checked).map(cb => cb.value);
  const reflexion = form['reflexion'].value.trim();

  const resultDiv = document.getElementById('result');
  const chartsDiv = document.getElementById('charts');
  const summaryDiv = document.getElementById('summary');
  resultDiv.style.display = 'block';
  chartsDiv.innerHTML = '';
  summaryDiv.innerHTML = '';

  const totalScore = sintomas.reduce((a, b) => a + b, 0);
  let interpretacion = '';

  if (totalScore <= 10) {
    interpretacion += '<p><strong>Tu nivel de carga emocional actual parece bajo</strong>, aunque eso no significa que no existan heridas. A veces, lo que no se siente intensamente se ha convertido en costumbre. Puede ser útil explorar si algo quedó congelado en el pasado.</p>';
  } else if (totalScore <= 17) {
    interpretacion += '<p><strong>Hay signos de malestar emocional moderado</strong>. Algunas experiencias pasadas pueden estar influyendo hoy más de lo que imaginas, especialmente si sientes que tu historia no fue atendida o validada.</p>';
  } else {
    interpretacion += '<p><strong>Tu puntuación sugiere una carga emocional significativa</strong>. Es posible que lleves tiempo sintiendo que tu dolor no ha sido visto, reconocido o acompañado. Esta es una oportunidad para que tu historia empiece a ser escuchada con respeto, sin minimizar lo que viviste.</p>';
  }

  if (etapa.includes("Infancia") && causa.includes("Rechazo")) {
    interpretacion += '<p>Detecto una combinación que puede apuntar a <strong>una herida de rechazo no resuelta en la infancia</strong>. Esta herida puede generar hoy una sensación de no ser valorado, ignorado o desplazado, aún sin que otros lo noten.</p>';
  }

  if (area.includes("Autoestima") && causa.includes("Humillación")) {
    interpretacion += '<p>Cuando la autoestima se ve afectada y hay experiencias ligadas a la humillación, es común que aparezca una voz interna muy crítica. Explorar esta voz, su origen y reemplazarla por compasión será clave en tu proceso.</p>';
  }

  if (reflexion.length > 0) {
    interpretacion += `<p><strong>Tu reflexión personal:</strong><br><em>${reflexion}</em></p>`;
  }

  summaryDiv.innerHTML = interpretacion;

  const canvas = document.createElement('canvas');
  chartsDiv.appendChild(canvas);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Confianza','Reacción','Evitación','Culpa','Recuerdos'],
      datasets: [{
        label: 'Intensidad (1-5)',
        data: sintomas,
        backgroundColor: '#4a90e2'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const element = document.getElementById('result');
  const opt = {
    filename: 'resultado_historia_emocional.pdf',
    margin: 0.5,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
});

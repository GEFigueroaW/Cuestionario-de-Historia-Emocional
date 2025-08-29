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
  summaryDiv.innerHTML = `
    <p><strong>Etapas señaladas:</strong> ${etapa.join(', ')}</p>
    <p><strong>Posibles causas:</strong> ${causa.join(', ')}</p>
    <p><strong>Áreas afectadas:</strong> ${area.join(', ')}</p>
    ${reflexion ? `<p><strong>Reflexión personal:</strong> ${reflexion}</p>` : ''}
  `;

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
  html2pdf().from(element).save('resultado_historia_emocional.pdf');
});

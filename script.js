// Inicialização de tema
(function() {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) {
    const systemPref = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    localStorage.setItem('theme', systemPref);
  }
  document.getElementById('theme-select').value = localStorage.getItem('theme');
  applyTheme();
})();

// Controle de abas
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
    if (button.dataset.tab === 'dashboard') {
      calculateOverallProgress();
      plotMoodChart();
      plotWaterChart();
      listPendingTasks();
    }
  });
});

// Botão exportar relatório
document.getElementById('export-btn').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const progress = document.getElementById('overall-progress').textContent;
  const points = document.getElementById('points').textContent;
  pdf.text(progress, 10, 20);
  pdf.text(points, 10, 30);
  pdf.text('Tarefas Pendentes:', 10, 40);
  document.querySelectorAll('#pending-tasks-list li').forEach((li, idx) => {
    pdf.text(li.textContent, 10, 50 + idx * 10);
  });
  pdf.save('relatorio.pdf');
});

// Hidratação
let waterAmount = parseInt(localStorage.getItem('water-today')) || 0;
document.getElementById('water-progress').textContent = `Hidratação: ${waterAmount}ml`;
window.addWater = function(amount) {
  waterAmount += amount;
  localStorage.setItem('water-today', waterAmount);
  localStorage.setItem('lastDrinkTime', new Date().toISOString());
  document.getElementById('water-progress').textContent = `Hidratação: ${waterAmount}ml`;
};

// Dashboard
function calculateOverallProgress() {
  const checks = document.querySelectorAll('.checklist input');
  let total = checks.length, done = 0;
  checks.forEach(c => { if (c.checked) done++; });
  const pct = total>0 ? Math.round(done/total*100) : 0;
  document.getElementById('overall-progress').textContent = `Progresso Geral: ${pct}%`;
}
function listPendingTasks() {
  const ul = document.getElementById('pending-tasks-list');
  ul.innerHTML = '';
  document.querySelectorAll('.checklist input').forEach(c => {
    if (!c.checked) {
      ul.innerHTML += `<li>${c.parentElement.textContent.trim()}</li>`;
    }
  });
}

// Charts
function plotMoodChart() {
  import('https://cdn.jsdelivr.net/npm/chart.js').then(({ default: Chart }) => {
    const data=[5,3,2,1,4,5,3], labels=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
    new Chart(document.getElementById('mood-chart'), {
      type:'line', data:{ labels, datasets:[{ label:'Humor', data, borderColor:'#1e88e5', backgroundColor:'rgba(30,136,229,0.2)' }]},
      options:{ scales:{ y:{ beginAtZero:true, max:5 } } }
    });
  });
}
function plotWaterChart() {
  import('https://cdn.jsdelivr.net/npm/chart.js').then(({ default: Chart }) => {
    const data=[500,750,250,1000,300,600,800], labels=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
    new Chart(document.getElementById('water-chart'), {
      type:'bar', data:{ labels, datasets:[{ label:'Hidratação (ml)', data, backgroundColor:'#1e88e5' }]},
      options:{ scales:{ y:{ beginAtZero:true } } }
    });
  });
}

// Configurações de tema
function applyTheme() {
  const theme = document.getElementById('theme-select').value;
  const root = document.documentElement;
  if (theme === 'light') {
    root.style.setProperty('--bg', '#f0f0f0');
    root.style.setProperty('--text', '#000');
  } else {
    root.style.setProperty('--bg', '#121212');
    root.style.setProperty('--text', '#fff');
  }
  localStorage.setItem('theme', theme);
}

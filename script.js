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

// Hidratação
let waterAmount = parseInt(localStorage.getItem('water-today')) || 0;
document.getElementById('water-progress').textContent = `Hidratação: ${waterAmount}ml`;

window.addWater = function(amount) {
  waterAmount += amount;
  localStorage.setItem('water-today', waterAmount);
  localStorage.setItem(`water-${new Date().toISOString().split('T')[0]}`, waterAmount);
  localStorage.setItem('lastDrinkTime', new Date().toISOString());
  document.getElementById('water-progress').textContent = `Hidratação: ${waterAmount}ml`;
};

// Dashboard
function calculateOverallProgress() {
  const checklists = document.querySelectorAll('.checklist input[type="checkbox"]');
  let total = checklists.length;
  let completed = 0;
  checklists.forEach(check => { if (check.checked) completed++; });
  const progress = total > 0 ? (completed / total * 100).toFixed(0) : 0;
  document.getElementById('overall-progress').textContent = `Progresso Geral: ${progress}%`;
}

function plotMoodChart() {
  const moodData = [5, 3, 2, 1, 4, 5, 3]; // Exemplo, substitua por dados reais
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const ctx = document.getElementById('mood-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Humor',
        data: moodData,
        borderColor: '#1e88e5',
        backgroundColor: 'rgba(30, 136, 229, 0.2)',
      }]
    },
    options: { scales: { y: { beginAtZero: true, max: 5 } } }
  });
}

function plotWaterChart() {
  const waterData = [500, 750, 250, 1000, 300, 600, 800]; // Exemplo
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const ctx = document.getElementById('water-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Hidratação (ml)',
        data: waterData,
        backgroundColor: '#1e88e5',
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

function listPendingTasks() {
  const pendingTasksList = document.getElementById('pending-tasks-list');
  pendingTasksList.innerHTML = '';
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach(check => {
    if (!check.checked) {
      const li = document.createElement('li');
      li.textContent = check.nextSibling.textContent.trim();
      pendingTasksList.appendChild(li);
    }
  });
}

// Notificações
function requestNotificationPermission() {
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') console.log('Notificações permitidas');
    });
  }
}

setInterval(() => {
  const lastDrinkTime = localStorage.getItem('lastDrinkTime');
  if (lastDrinkTime && (new Date().getTime() - new Date(lastDrinkTime).getTime() > 2 * 60 * 60 * 1000)) {
    if (Notification.permission === 'granted') new Notification('Lembrete: Beba água!');
  }
}, 60 * 60 * 1000);

requestNotificationPermission();

// Personalização
function applyTheme() {
  const theme = document.getElementById('theme-select').value;
  if (theme === 'light') {
    document.body.style.background = 'linear-gradient(180deg, #f0f0f0, #e0e0e0)';
    document.body.style.color = '#000000';
    document.querySelectorAll('.section').forEach(section => {
      section.style.background = 'linear-gradient(180deg, #ffffff, #f0f0f0)';
    });
  } else {
    document.body.style.background = 'linear-gradient(180deg, #1a1a1a, #121212)';
    document.body.style.color = '#ffffff';
    document.querySelectorAll('.section').forEach(section => {
      section.style.background = 'linear-gradient(180deg, #3a3a3a, #333333)';
    });
  }
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.getElementById('theme-select').value = savedTheme;
  applyTheme();
}

// Gamificação
let points = parseInt(localStorage.getItem('points')) || 0;
document.getElementById('points').textContent = `Pontos: ${points}`;

document.querySelectorAll('.checklist input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      points += 10;
      localStorage.setItem('points', points);
      document.getElementById('points').textContent = `Pontos: ${points}`;
      calculateOverallProgress();
    }
  });
});
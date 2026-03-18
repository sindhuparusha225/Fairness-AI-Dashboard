/* ============================================================
   FAIRNESS AI RESEARCH PLATFORM — CLIENT JS
   ============================================================ */

'use strict';

// ── Auto-dismiss flash messages ──
document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.4s, transform 0.4s';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-6px)';
      setTimeout(() => alert.remove(), 400);
    }, 4500);
  });

  // ── Tabs ──
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const group = btn.closest('.tabs-container');
      if (!group) return;

      group.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      group.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const content = group.querySelector('[data-tab-content="' + target + '"]');
      if (content) content.classList.add('active');
    });
  });

  // ── Delete confirmations ──
  document.querySelectorAll('[data-confirm]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const msg = el.dataset.confirm || 'Are you sure? This action cannot be undone.';
      if (!confirm(msg)) e.preventDefault();
    });
  });

  // ── Form submit button loading state ──
  document.querySelectorAll('form[data-loading]').forEach((form) => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="spinner"></span> Saving...';
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = original;
        }, 8000);
      }
    });
  });

  // ── Number inputs: clamp between 0-100 ──
  document.querySelectorAll('input[data-percent]').forEach((input) => {
    input.addEventListener('blur', () => {
      let val = parseFloat(input.value) || 0;
      val = Math.max(0, Math.min(100, val));
      input.value = val;
    });
  });

  // ── Sidebar active state (set dynamically via server, but enhance here) ──
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item[href]').forEach((link) => {
    if (currentPath.startsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
});

// ── Dashboard charts ──
function initDashboardCharts(data) {
  if (!window.Chart) return;

  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#8299ae';

  const COLORS = {
    teal:   '#00c9a7',
    tealDim:'#00a38a',
    amber:  '#f4a261',
    rose:   '#e76f51',
    ink:    '#2e4a63',
    inkMid: '#1e3448',
    light1: '#f6ede4',
    light2: '#e8c9a5',
    mid3:   '#c8924a',
    mid4:   '#a0622a',
    dark5:  '#6b3c1a',
    dark6:  '#2d1506',
  };

  // Bar Chart – Age distribution
  const ageCtx = document.getElementById('ageChart');
  if (ageCtx) {
    new Chart(ageCtx, {
      type: 'bar',
      data: {
        labels: ['18–30', '31–45', '46–85'],
        datasets: [{
          label: 'Age Group %',
          data: [data.age.age18_30, data.age.age31_45, data.age.age46_85],
          backgroundColor: [COLORS.teal, COLORS.tealDim, COLORS.ink],
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true, max: 100,
            grid: { color: 'rgba(46,74,99,0.06)' },
            ticks: { callback: (v) => v + '%' },
          },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // Pie Chart – Gender
  const genderCtx = document.getElementById('genderChart');
  if (genderCtx) {
    new Chart(genderCtx, {
      type: 'pie',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: [{
          data: [data.gender.male, data.gender.female, data.gender.other],
          backgroundColor: [COLORS.ink, COLORS.teal, COLORS.amber],
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyleWidth: 8 } },
          tooltip: { callbacks: { label: (c) => ' ' + c.label + ': ' + c.parsed.toFixed(1) + '%' } },
        },
      },
    });
  }

  // Doughnut – Skin tone (Fitzpatrick)
  const skinCtx = document.getElementById('skinChart');
  if (skinCtx) {
    new Chart(skinCtx, {
      type: 'doughnut',
      data: {
        labels: ['Type I', 'Type II', 'Type III', 'Type IV', 'Type V', 'Type VI'],
        datasets: [{
          data: [
            data.skinTone.typeI, data.skinTone.typeII, data.skinTone.typeIII,
            data.skinTone.typeIV, data.skinTone.typeV, data.skinTone.typeVI,
          ],
          backgroundColor: [COLORS.light1, COLORS.light2, COLORS.mid3, COLORS.mid4, COLORS.dark5, COLORS.dark6],
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true, pointStyleWidth: 8 } },
          tooltip: { callbacks: { label: (c) => ' ' + c.label + ': ' + c.parsed.toFixed(1) + '%' } },
        },
      },
    });
  }

  // Stacked Bar – Lighting
  const lightCtx = document.getElementById('lightingChart');
  if (lightCtx) {
    new Chart(lightCtx, {
      type: 'bar',
      data: {
        labels: ['Lighting'],
        datasets: [
          {
            label: 'Bright',
            data: [data.lighting.bright],
            backgroundColor: COLORS.amber,
            borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
          },
          {
            label: 'Dark',
            data: [data.lighting.dark],
            backgroundColor: COLORS.ink,
            borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyleWidth: 8 } },
          tooltip: { callbacks: { label: (c) => ' ' + c.dataset.label + ': ' + c.parsed.x.toFixed(1) + '%' } },
        },
        scales: {
          x: {
            stacked: true, max: 100,
            grid: { color: 'rgba(46,74,99,0.06)' },
            ticks: { callback: (v) => v + '%' },
          },
          y: { stacked: true, grid: { display: false } },
        },
      },
    });
  }
}

// ── Evaluation charts ──
function initEvaluationCharts(evalData) {
  if (!window.Chart || !evalData) return;

  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.color = '#8299ae';

  // Skin tone accuracy chart
  const skinAccCtx = document.getElementById('skinAccuracyChart');
  if (skinAccCtx) {
    const skinColors = ['#f6ede4', '#e8c9a5', '#c8924a', '#a0622a', '#6b3c1a', '#2d1506'];
    new Chart(skinAccCtx, {
      type: 'bar',
      data: {
        labels: ['Type I', 'Type II', 'Type III', 'Type IV', 'Type V', 'Type VI'],
        datasets: [{
          label: 'Accuracy %',
          data: [
            evalData.skinToneMetrics.typeI.accuracy,
            evalData.skinToneMetrics.typeII.accuracy,
            evalData.skinToneMetrics.typeIII.accuracy,
            evalData.skinToneMetrics.typeIV.accuracy,
            evalData.skinToneMetrics.typeV.accuracy,
            evalData.skinToneMetrics.typeVI.accuracy,
          ],
          backgroundColor: skinColors,
          borderRadius: 5,
          borderSkipped: false,
          borderWidth: 1.5,
          borderColor: skinColors.map(c => c),
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(46,74,99,0.06)' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // FPR by gender
  const genderFprCtx = document.getElementById('genderFprChart');
  if (genderFprCtx) {
    new Chart(genderFprCtx, {
      type: 'bar',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: [{
          label: 'False Positive Rate %',
          data: [
            evalData.genderMetrics.male.falsePositiveRate,
            evalData.genderMetrics.female.falsePositiveRate,
            evalData.genderMetrics.other.falsePositiveRate,
          ],
          backgroundColor: ['#2e4a63', '#00c9a7', '#f4a261'],
          borderRadius: 5,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(46,74,99,0.06)' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // Age accuracy
  const ageAccCtx = document.getElementById('ageAccuracyChart');
  if (ageAccCtx) {
    new Chart(ageAccCtx, {
      type: 'bar',
      data: {
        labels: ['18–30', '31–45', '46–85'],
        datasets: [{
          label: 'Accuracy %',
          data: [
            evalData.ageMetrics.age18_30.accuracy,
            evalData.ageMetrics.age31_45.accuracy,
            evalData.ageMetrics.age46_85.accuracy,
          ],
          backgroundColor: ['#00c9a7', '#00a38a', '#1e3448'],
          borderRadius: 5,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(46,74,99,0.06)' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
      },
    });
  }
}
function initDashboardCharts(data) {
  // AGE
  new Chart(document.getElementById('ageChart'), {
    type: 'bar',
    data: {
      labels: ['18–30', '31–45', '46–85'],
      datasets: [{
        label: 'Accuracy',
        data: [
          data.age.age18_30 || 0,
          data.age.age31_45 || 0,
          data.age.age46_85 || 0
        ]
      }]
    }
  });

  // GENDER
  new Chart(document.getElementById('genderChart'), {
    type: 'pie',
    data: {
      labels: ['Male', 'Female', 'Other'],
      datasets: [{
        data: [
          data.gender.male || 0,
          data.gender.female || 0,
          data.gender.other || 0
        ]
      }]
    }
  });

  // SKIN
  new Chart(document.getElementById('skinChart'), {
    type: 'bar',
    data: {
      labels: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      datasets: [{
        data: [
          data.skinTone.typeI || 0,
          data.skinTone.typeII || 0,
          data.skinTone.typeIII || 0,
          data.skinTone.typeIV || 0,
          data.skinTone.typeV || 0,
          data.skinTone.typeVI || 0
        ]
      }]
    }
  });

  // LIGHTING
  new Chart(document.getElementById('lightingChart'), {
    type: 'bar',
    data: {
      labels: ['Bright', 'Dark'],
      datasets: [{
        data: [
          data.lighting.bright || 0,
          data.lighting.dark || 0
        ]
      }]
    }
  });
}
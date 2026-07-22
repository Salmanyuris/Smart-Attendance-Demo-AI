/**
 * SMART ATTENDANCE - DASHBOARD CHARTS MODULE (BLUE, WHITE, YELLOW THEME)
 */
const ChartModule = {
  studentChartInstance: null,
  adminBarChartInstance: null,
  adminLineChartInstance: null,

  renderStudentAttendanceChart(canvasId, stats) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.studentChartInstance) {
      this.studentChartInstance.destroy();
    }

    this.studentChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Hadir', 'Terlambat', 'Alpha', 'Izin / Sakit'],
        datasets: [{
          data: [stats.hadir, stats.terlambat, stats.alpha, stats.izin],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#0284c7'],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#0f172a', font: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' } }
          }
        },
        cutout: '75%'
      }
    });
  },

  renderAdminCourseBarChart(canvasId, coursesData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.adminBarChartInstance) {
      this.adminBarChartInstance.destroy();
    }

    const labels = coursesData.map(c => c.nama);
    const hadirData = coursesData.map(c => c.totalHadir);
    const alphaData = coursesData.map(c => c.totalAlpha);

    this.adminBarChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Hadir', data: hadirData, backgroundColor: '#2563eb', borderRadius: 8 },
          { label: 'Alpha', data: alphaData, backgroundColor: '#ef4444', borderRadius: 8 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#0f172a', font: { family: 'Plus Jakarta Sans', weight: 'bold' } } }
        },
        scales: {
          x: { ticks: { color: '#475569' }, grid: { display: false } },
          y: { ticks: { color: '#475569' }, grid: { color: '#e2e8f0' } }
        }
      }
    });
  },

  renderAdminTrendLineChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.adminLineChartInstance) {
      this.adminLineChartInstance.destroy();
    }

    this.adminLineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        datasets: [{
          label: 'Tingkat Kehadiran Kampus (%)',
          data: [92, 88, 96, 90, 85, 94],
          borderColor: '#2563eb',
          borderWidth: 3,
          backgroundColor: 'rgba(37, 99, 235, 0.12)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#facc15',
          pointBorderColor: '#1e3a8a',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#0f172a', font: { family: 'Plus Jakarta Sans', weight: 'bold' } } }
        },
        scales: {
          x: { ticks: { color: '#475569' }, grid: { display: false } },
          y: { min: 60, max: 100, ticks: { color: '#475569' }, grid: { color: '#e2e8f0' } }
        }
      }
    });
  }
};

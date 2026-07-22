/**
 * SMART ATTENDANCE - MAIN SPA APPLICATION CONTROLLER
 * Ultra-Responsive & Pixel-Perfect Mobile Layout (Biru, Putih, Kuning Blend)
 */
const app = {
  currentRole: 'mahasiswa',
  currentView: 'dashboard',
  selectedCourseForAttendance: null,

  init() {
    let user = Store.getCurrentUser();
    if (!user) {
      const mhsList = Store.getMahasiswa();
      user = { ...mhsList[0], role: 'mahasiswa' };
      Store.setCurrentUser(user);
    }

    this.currentRole = user.role || 'mahasiswa';
    this.currentView = this.currentRole === 'admin' ? 'admin-dashboard' : 'dashboard';
    
    this.updateNavigationUI();
    this.showMainLayout();
    this.renderCurrentView();
  },

  switchRole(role) {
    this.currentRole = role;
    const btnMhs = document.getElementById('demo-btn-mhs');
    const btnAdmin = document.getElementById('demo-btn-admin');

    if (role === 'admin') {
      if (btnMhs) btnMhs.classList.remove('active');
      if (btnAdmin) btnAdmin.classList.add('active');
      const adminUser = { id: 'admin_1', nama: 'Administrator / Dosen', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' };
      Store.setCurrentUser(adminUser);
      this.currentView = 'admin-dashboard';
    } else {
      if (btnAdmin) btnAdmin.classList.remove('active');
      if (btnMhs) btnMhs.classList.add('active');
      const mhsList = Store.getMahasiswa();
      const mhsUser = { ...mhsList[0], role: 'mahasiswa' };
      Store.setCurrentUser(mhsUser);
      this.currentView = 'dashboard';
    }

    this.updateNavigationUI();
    this.renderCurrentView();
    this.toast(`Mode: ${role.toUpperCase()}`, 'info');
  },

  fillQuickLogin(role) {
    const loginId = document.getElementById('login-id');
    const loginPass = document.getElementById('login-password');
    if (role === 'admin') {
      loginId.value = 'admin';
      loginPass.value = 'admin';
    } else {
      loginId.value = '230101001';
      loginPass.value = '123456';
    }
  },

  logout() {
    Store.clearCurrentUser();
    document.getElementById('app').classList.remove('logged-in');
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('main-wrapper').style.display = 'none';
    document.getElementById('login-view').style.display = 'flex';
    this.toast('Berhasil keluar dari akun', 'info');
  },

  showMainLayout() {
    document.getElementById('app').classList.add('logged-in');
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('app-header').style.display = 'flex';
    document.getElementById('main-wrapper').style.display = 'flex';
  },

  updateNavigationUI() {
    const user = Store.getCurrentUser() || {};
    const roleBadge = document.getElementById('header-role-badge');
    const userName = document.getElementById('header-user-name');
    const userSub = document.getElementById('header-user-sub');
    const userAvatar = document.getElementById('header-avatar');
    const sidebarNav = document.getElementById('sidebar-nav');
    const mobileNavItems = document.getElementById('mobile-nav-items');
    const btnMhs = document.getElementById('demo-btn-mhs');
    const btnAdmin = document.getElementById('demo-btn-admin');
    const campus = Store.getLokasiKampus();

    userName.textContent = user.nama || 'User';
    userAvatar.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

    document.getElementById('sidebar-campus-name').textContent = campus.nama || 'Kampus Utama';
    document.getElementById('sidebar-radius-info').textContent = `Radius: ${campus.radius}m`;

    if (this.currentRole === 'admin') {
      if (btnMhs) btnMhs.classList.remove('active');
      if (btnAdmin) btnAdmin.classList.add('active');
      roleBadge.textContent = 'Admin / Dosen';
      roleBadge.className = 'role-badge admin d-none-mobile';
      userSub.textContent = 'Hak Akses Penuh';

      sidebarNav.innerHTML = `
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'admin-dashboard' ? 'active' : ''}" onclick="app.navigateTo('admin-dashboard')"><i class="fa-solid fa-chart-pie"></i> Dashboard Admin</a></li>
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'admin-absensi' ? 'active' : ''}" onclick="app.navigateTo('admin-absensi')"><i class="fa-solid fa-clipboard-user"></i> Data Absensi</a></li>
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'admin-mahasiswa' ? 'active' : ''}" onclick="app.navigateTo('admin-mahasiswa')"><i class="fa-solid fa-users"></i> Mahasiswa</a></li>
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'admin-matakuliah' ? 'active' : ''}" onclick="app.navigateTo('admin-matakuliah')"><i class="fa-solid fa-book-open"></i> Mata Kuliah</a></li>
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'admin-lokasi' ? 'active' : ''}" onclick="app.navigateTo('admin-lokasi')"><i class="fa-solid fa-map-location-dot"></i> Lokasi Kampus</a></li>
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'admin-laporan' ? 'active' : ''}" onclick="app.navigateTo('admin-laporan')"><i class="fa-solid fa-file-export"></i> Laporan & QR</a></li>
        <li class="d-none-desktop-switcher"><hr style="border: 0; border-top: 1px solid var(--border-color); margin: 0.5rem 0;"><a href="javascript:void(0)" class="nav-link" onclick="app.switchRole('mahasiswa')"><i class="fa-solid fa-user-graduate"></i> Mode Mahasiswa</a></li>
      `;

      if (mobileNavItems) {
        mobileNavItems.innerHTML = `
          <li><a href="javascript:void(0)" class="${this.currentView === 'admin-dashboard' ? 'active' : ''}" onclick="app.navigateTo('admin-dashboard')"><i class="fa-solid fa-chart-pie"></i><span>Dashboard</span></a></li>
          <li><a href="javascript:void(0)" class="${this.currentView === 'admin-absensi' ? 'active' : ''}" onclick="app.navigateTo('admin-absensi')"><i class="fa-solid fa-clipboard-user"></i><span>Absensi</span></a></li>
          <li><a href="javascript:void(0)" class="${this.currentView === 'admin-lokasi' ? 'active' : ''}" onclick="app.navigateTo('admin-lokasi')"><i class="fa-solid fa-map-location-dot"></i><span>Lokasi</span></a></li>
          <li><a href="javascript:void(0)" class="${this.currentView === 'admin-laporan' ? 'active' : ''}" onclick="app.navigateTo('admin-laporan')"><i class="fa-solid fa-file-export"></i><span>Laporan</span></a></li>
        `;
      }
    } else {
      if (btnAdmin) btnAdmin.classList.remove('active');
      if (btnMhs) btnMhs.classList.add('active');
      roleBadge.textContent = 'Mahasiswa';
      roleBadge.className = 'role-badge mahasiswa d-none-mobile';
      userSub.textContent = `NIM: ${user.nim || '230101001'}`;

      sidebarNav.innerHTML = `
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'dashboard' ? 'active' : ''}" onclick="app.navigateTo('dashboard')"><i class="fa-solid fa-house"></i> Dashboard</a></li>
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'absen' ? 'active' : ''}" onclick="app.navigateTo('absen')"><i class="fa-solid fa-street-view"></i> Absen Sekarang</a></li>
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'riwayat' ? 'active' : ''}" onclick="app.navigateTo('riwayat')"><i class="fa-solid fa-clock-rotate-left"></i> Riwayat Absensi</a></li>
        <li><a href="javascript:void(0)" class="nav-link ${this.currentView === 'jadwal' ? 'active' : ''}" onclick="app.navigateTo('jadwal')"><i class="fa-solid fa-calendar-days"></i> Jadwal Kuliah</a></li>
        <li class="d-none-desktop-switcher"><hr style="border: 0; border-top: 1px solid var(--border-color); margin: 0.5rem 0;"><a href="javascript:void(0)" class="nav-link" onclick="app.switchRole('admin')"><i class="fa-solid fa-user-shield"></i> Mode Admin</a></li>
      `;

      if (mobileNavItems) {
        mobileNavItems.innerHTML = `
          <li><a href="javascript:void(0)" class="${this.currentView === 'dashboard' ? 'active' : ''}" onclick="app.navigateTo('dashboard')"><i class="fa-solid fa-house"></i><span>Dashboard</span></a></li>
          <li><a href="javascript:void(0)" class="${this.currentView === 'absen' ? 'active' : ''}" onclick="app.navigateTo('absen')"><i class="fa-solid fa-street-view"></i><span>Absen</span></a></li>
          <li><a href="javascript:void(0)" class="${this.currentView === 'riwayat' ? 'active' : ''}" onclick="app.navigateTo('riwayat')"><i class="fa-solid fa-clock-rotate-left"></i><span>Riwayat</span></a></li>
          <li><a href="javascript:void(0)" class="${this.currentView === 'jadwal' ? 'active' : ''}" onclick="app.navigateTo('jadwal')"><i class="fa-solid fa-calendar-days"></i><span>Jadwal</span></a></li>
        `;
      }
    }
  },

  navigateTo(viewName, params = null) {
    this.currentView = viewName;
    if (params && params.courseId) {
      this.selectedCourseForAttendance = params.courseId;
    }
    
    // Defer DOM updates slightly to allow click event to settle cleanly
    setTimeout(() => {
      this.updateNavigationUI();
      this.renderCurrentView();
      this.toggleMobileSidebar(false); // Close mobile sidebar drawer on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  },

  renderCurrentView() {
    const root = document.getElementById('view-root');
    CameraModule.stopCamera();

    switch (this.currentView) {
      case 'dashboard':
        this.renderStudentDashboard(root);
        break;
      case 'absen':
        this.renderAttendanceView(root);
        break;
      case 'riwayat':
        this.renderHistoryView(root);
        break;
      case 'jadwal':
        this.renderScheduleView(root);
        break;
      case 'admin-dashboard':
        this.renderAdminDashboard(root);
        break;
      case 'admin-absensi':
        this.renderAdminAbsensiView(root);
        break;
      case 'admin-mahasiswa':
        this.renderAdminMahasiswaView(root);
        break;
      case 'admin-matakuliah':
        this.renderAdminMatakuliahView(root);
        break;
      case 'admin-lokasi':
        this.renderAdminLokasiView(root);
        break;
      case 'admin-laporan':
        this.renderAdminLaporanView(root);
        break;
      default:
        this.renderStudentDashboard(root);
    }
  },

  /* Student Dashboard */
  renderStudentDashboard(container) {
    const user = Store.getCurrentUser() || {};
    const allAbsensi = Store.getAbsensi().filter(a => a.mahasiswa_id === user.id);
    const courses = Store.getMataKuliah();

    const hadirCount = allAbsensi.filter(a => a.status === 'Hadir').length;
    const terlambatCount = allAbsensi.filter(a => a.status === 'Terlambat').length;
    const alphaCount = allAbsensi.filter(a => a.status === 'Alpha').length;
    const izinCount = allAbsensi.filter(a => a.status === 'Izin' || a.status === 'Sakit').length;
    const totalSem = allAbsensi.length || 1;
    const percent = Math.round(((hadirCount + terlambatCount) / totalSem) * 100) || 100;

    container.innerHTML = `
      <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap" style="gap: 0.75rem;">
        <div>
          <h2 class="fw-bold text-navy" style="font-size: 1.25rem;">Selamat Datang, ${user.nama || 'Mahasiswa'} 👋</h2>
          <p class="text-muted" style="font-size: 0.825rem;">Prodi: <strong>${user.prodi || 'Teknik Informatika'}</strong> | NIM: <strong>${user.nim || '230101001'}</strong></p>
        </div>
        <button class="btn btn-primary btn-lg" onclick="app.navigateTo('absen')">
          <i class="fa-solid fa-street-view"></i> Absen Now
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="glass-panel stat-card">
          <div class="stat-icon primary"><i class="fa-solid fa-chart-line"></i></div>
          <div>
            <div class="stat-val text-primary">${percent}%</div>
            <div class="stat-label">Kehadiran</div>
          </div>
        </div>
        <div class="glass-panel stat-card success-border">
          <div class="stat-icon success"><i class="fa-solid fa-user-check"></i></div>
          <div>
            <div class="stat-val text-success">${hadirCount}</div>
            <div class="stat-label">Total Hadir</div>
          </div>
        </div>
        <div class="glass-panel stat-card danger-border">
          <div class="stat-icon danger"><i class="fa-solid fa-user-xmark"></i></div>
          <div>
            <div class="stat-val text-danger">${alphaCount}</div>
            <div class="stat-label">Total Alpha</div>
          </div>
        </div>
        <div class="glass-panel stat-card yellow-border">
          <div class="stat-icon yellow"><i class="fa-solid fa-clock"></i></div>
          <div>
            <div class="stat-val text-yellow">${terlambatCount}</div>
            <div class="stat-label">Terlambat</div>
          </div>
        </div>
      </div>

      <div class="row" style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.15rem;">
        <!-- Today's Courses -->
        <div>
          <h3 class="fw-bold mb-3 text-navy" style="font-size: 1.1rem;"><i class="fa-solid fa-calendar-day text-primary"></i> Mata Kuliah Hari Ini</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${courses.map(course => {
              const todayAbsen = allAbsensi.find(a => a.mata_kuliah_id === course.id && a.tanggal === new Date().toISOString().split('T')[0]);
              let statusBadge = `<span class="badge badge-terlambat">Belum Absen</span>`;
              if (todayAbsen) {
                const bClass = todayAbsen.status.toLowerCase();
                statusBadge = `<span class="badge badge-${bClass}"><i class="fa-solid fa-check-circle"></i> ${todayAbsen.status} (${todayAbsen.jam})</span>`;
              }

              return `
                <div class="glass-panel course-card">
                  <div class="course-card-header">
                    <div>
                      <h4 class="fw-bold text-navy" style="font-size: 0.95rem;">${course.nama}</h4>
                      <div class="text-subtle" style="font-size: 0.775rem;"><i class="fa-solid fa-user-tie"></i> ${course.dosen}</div>
                    </div>
                    ${statusBadge}
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-auto flex-wrap" style="gap: 0.5rem;">
                    <div class="time-pill"><i class="fa-regular fa-clock"></i> ${course.hari}, ${course.jam_mulai} - ${course.jam_selesai} | ${course.ruangan}</div>
                    <button class="btn btn-secondary btn-sm" onclick="app.navigateTo('absen', {courseId: '${course.id}'})">
                      <i class="fa-solid fa-location-dot"></i> Absen Matkul Ini
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Attendance Breakdown Doughnut Chart -->
        <div class="glass-panel p-3">
          <h4 class="fw-bold mb-2 text-center text-navy" style="font-size: 0.95rem;">Ringkasan Kehadiran</h4>
          <div style="height: 200px; position: relative;">
            <canvas id="student-doughnut-chart"></canvas>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      ChartModule.renderStudentAttendanceChart('student-doughnut-chart', {
        hadir: hadirCount,
        terlambat: terlambatCount,
        alpha: alphaCount,
        izin: izinCount
      });
    }, 100);
  },

  async renderAttendanceView(container) {
    const user = Store.getCurrentUser() || {};
    const courses = Store.getMataKuliah();
    const campus = Store.getLokasiKampus();
    const selectedCourseId = this.selectedCourseForAttendance || courses[0].id;

    container.innerHTML = `
      <div class="mb-3">
        <h2 class="fw-bold text-navy" style="font-size: 1.25rem;"><i class="fa-solid fa-street-view text-primary"></i> Halaman Absensi GeoFence</h2>
        <p class="text-muted" style="font-size: 0.825rem;">Verifikasi presisi radius lokasi GPS Anda ke area kampus.</p>
      </div>

      <!-- Geofence Live Banner -->
      <div id="geofence-banner" class="geofence-status-banner inside">
        <div class="d-flex align-items-center gap-2">
          <i class="fa-solid fa-satellite-dish fa-spin" style="font-size: 1.2rem;"></i>
          <div>
            <div class="fw-bold" id="geofence-title" style="font-size: 0.9rem;">Mendapatkan Lokasi GPS...</div>
            <div style="font-size: 0.775rem;" id="geofence-sub">Menghitung jarak ke ${campus.nama}...</div>
          </div>
        </div>
        <span class="badge" id="geofence-distance-pill" style="font-size: 0.825rem;">-- Meter</span>
      </div>

      <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.15rem;">
        <!-- Left: Leaflet Geofence Map & GPS Simulator -->
        <div>
          <div class="glass-panel p-3 mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h4 class="fw-bold text-navy" style="font-size: 0.9rem;"><i class="fa-solid fa-map-location-dot text-primary"></i> Peta Radius Kampus</h4>
              <button class="btn btn-secondary btn-sm" onclick="app.refreshLocationMap()"><i class="fa-solid fa-rotate"></i> Refresh GPS</button>
            </div>
            <div id="attendance-map" class="map-box"></div>
          </div>

          <!-- GPS Simulator Control Panel -->
          <div class="simulator-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold text-yellow" style="font-size: 0.825rem;"><i class="fa-solid fa-sliders"></i> GPS Simulator (Pengujian)</span>
              <label style="font-size: 0.75rem;" class="d-flex align-items-center gap-1">
                <input type="checkbox" id="sim-toggle" ${Geofence.simulator.active ? 'checked' : ''} onchange="app.toggleSimulator(this.checked)"> Aktif
              </label>
            </div>
            <div style="font-size: 0.75rem;" class="text-muted mb-2">Geser slider untuk menguji kondisi di dalam/luar area:</div>
            
            <div class="d-flex align-items-center gap-2 mb-2">
              <span style="font-size: 0.775rem;" class="fw-bold">Jarak: <span id="sim-dist-val" class="text-primary">${Geofence.simulator.presetDistance}m</span></span>
              <input type="range" min="10" max="500" value="${Geofence.simulator.presetDistance}" style="flex: 1;" oninput="app.updateSimDistance(this.value)">
            </div>

            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-secondary btn-sm flex-1" onclick="app.setSimPreset(40)"><i class="fa-solid fa-check text-success"></i> Dalam (40m)</button>
              <button class="btn btn-secondary btn-sm flex-1" onclick="app.setSimPreset(300)"><i class="fa-solid fa-xmark text-danger"></i> Luar (300m)</button>
              <button class="btn btn-secondary btn-sm flex-1" onclick="app.toggleMockGpsFlag()"><i class="fa-solid fa-shield-cat"></i> Mock GPS</button>
            </div>
          </div>
        </div>

        <!-- Right: Verification & Absen Action -->
        <div>
          <div class="glass-panel p-3">
            <div class="form-group mb-3">
              <label class="form-label">Pilih Mata Kuliah Hari Ini</label>
              <select class="form-control" id="absen-course-select" onchange="app.selectedCourseForAttendance = this.value">
                ${courses.map(c => `<option value="${c.id}" ${c.id === selectedCourseId ? 'selected' : ''}>${c.nama} (${c.jam_mulai} - ${c.jam_selesai})</option>`).join('')}
              </select>
            </div>

            <!-- WebCam Selfie Frame -->
            <div class="text-center mb-3">
              <label class="form-label mb-2"><i class="fa-solid fa-camera text-primary"></i> Verifikasi Selfie Mahasiswa</label>
              <div class="camera-container">
                <video id="webcam-video" autoplay playsinline></video>
                <canvas id="selfie-canvas" style="display: none;"></canvas>
                <div class="camera-overlay-frame"></div>
              </div>
              <div style="font-size: 0.725rem;" class="text-subtle mt-1">Posisikan wajah Anda pada lingkaran panduan</div>
            </div>

            <!-- QR Code Scanner Option -->
            <div class="form-group mb-3">
              <label class="form-label"><i class="fa-solid fa-qrcode text-primary"></i> Validasi QR Code Dosen (Opsional)</label>
              <div class="d-flex gap-2">
                <input type="text" id="qr-input" class="form-control flex-1" placeholder="Scan / Paste QR Code Sesi Dosen...">
                <button class="btn btn-secondary" onclick="app.validateQRInput()"><i class="fa-solid fa-check"></i> Validate</button>
              </div>
            </div>

            <!-- Big Absen Button -->
            <button class="btn btn-primary btn-lg w-100 py-3 fw-bold" id="btn-submit-absen" onclick="app.submitAttendance()" style="font-size: 0.95rem;">
              <i class="fa-solid fa-fingerprint fa-lg"></i> ABSEN SEKARANG
            </button>
          </div>
        </div>
      </div>
    `;

    await this.updateAttendanceLocationState();
    CameraModule.startCamera('webcam-video');
  },

  async updateAttendanceLocationState() {
    const loc = await Geofence.getCurrentLocation();
    const campus = Store.getLokasiKampus();
    const banner = document.getElementById('geofence-banner');
    const title = document.getElementById('geofence-title');
    const sub = document.getElementById('geofence-sub');
    const pill = document.getElementById('geofence-distance-pill');

    if (banner && loc) {
      if (loc.isInside) {
        banner.className = 'geofence-status-banner inside';
        title.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Lokasi Valid - Dalam Area Kampus`;
        sub.textContent = `Jarak Anda: ${loc.distance}m dari pusat kampus (Maks: ${campus.radius}m)`;
        pill.className = 'badge badge-hadir';
        pill.textContent = `${loc.distance} Meter`;
      } else {
        banner.className = 'geofence-status-banner outside';
        title.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> Di Luar Area Kampus - Rejected / Alpha`;
        sub.textContent = `Jarak Anda: ${loc.distance}m melebihi radius area kampus (${campus.radius}m)`;
        pill.className = 'badge badge-alpha';
        pill.textContent = `${loc.distance} Meter`;
      }
    }

    MapModule.renderAttendanceMap('attendance-map', campus, loc);
  },

  async refreshLocationMap() {
    await this.updateAttendanceLocationState();
    this.toast('Lokasi GPS berhasil diperbarui', 'info');
  },

  toggleSimulator(active) {
    Geofence.simulator.active = active;
    this.updateAttendanceLocationState();
  },

  updateSimDistance(val) {
    Geofence.simulator.presetDistance = parseInt(val);
    document.getElementById('sim-dist-val').textContent = `${val}m`;
    this.updateAttendanceLocationState();
  },

  setSimPreset(meters) {
    Geofence.simulator.presetDistance = meters;
    const slider = document.querySelector('input[type="range"]');
    if (slider) slider.value = meters;
    document.getElementById('sim-dist-val').textContent = `${meters}m`;
    this.updateAttendanceLocationState();
  },

  toggleMockGpsFlag() {
    Geofence.simulator.isMockGps = !Geofence.simulator.isMockGps;
    this.toast(`Simulasi Mock GPS: ${Geofence.simulator.isMockGps ? 'TERDETEKSI (MOCK)' : 'NORMAL'}`, Geofence.simulator.isMockGps ? 'warning' : 'info');
  },

  validateQRInput() {
    const val = document.getElementById('qr-input').value;
    const res = QRCodeModule.validateQRScan(val);
    this.toast(res.message, res.valid ? 'success' : 'danger');
  },

  async submitAttendance() {
    const user = Store.getCurrentUser();
    const courseSelect = document.getElementById('absen-course-select');
    const courseId = courseSelect ? courseSelect.value : (this.selectedCourseForAttendance || 'mk_1');
    const course = Store.getMataKuliah().find(c => c.id === courseId);

    const loc = await Geofence.getCurrentLocation();
    const selfieUrl = CameraModule.captureSnapshot('webcam-video', 'selfie-canvas');

    let status = 'Alpha';
    if (loc.isInside) {
      const now = new Date();
      const currentHour = now.getHours() + now.getMinutes() / 60;
      const [startH, startM] = course.jam_mulai.split(':').map(Number);
      const startHour = startH + startM / 60;

      if (currentHour > startHour + 0.25) {
        status = 'Terlambat';
      } else {
        status = 'Hadir';
      }
    } else {
      status = 'Alpha';
    }

    const newRecord = {
      id: 'abs_' + Date.now(),
      mahasiswa_id: user.id,
      mata_kuliah_id: courseId,
      tanggal: new Date().toISOString().split('T')[0],
      jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      latitude: loc.latitude,
      longitude: loc.longitude,
      jarak: loc.distance,
      status: status,
      selfie_url: selfieUrl,
      is_mock_gps: loc.isMockGps
    };

    Store.addAbsensi(newRecord);

    if (status === 'Hadir') {
      this.toast(`Absensi Berhasil! HADIR (${loc.distance}m)`, 'success');
    } else if (status === 'Terlambat') {
      this.toast(`Absensi Berhasil! TERLAMBAT`, 'warning');
    } else {
      this.toast(`Absensi Ditolak! Di luar radius kampus (${loc.distance}m). Status: ALPHA`, 'danger');
    }

    setTimeout(() => {
      this.navigateTo('riwayat');
    }, 1200);
  },

  renderHistoryView(container) {
    const user = Store.getCurrentUser() || {};
    const records = Store.getAbsensi().filter(a => a.mahasiswa_id === user.id);
    const courses = Store.getMataKuliah();

    container.innerHTML = `
      <div class="mb-3">
        <h2 class="fw-bold text-navy" style="font-size: 1.25rem;"><i class="fa-solid fa-clock-rotate-left text-primary"></i> Riwayat Absensi Saya</h2>
        <p class="text-muted" style="font-size: 0.825rem;">Catatan histori absensi dan lokasi GPS Anda.</p>
      </div>

      <div class="glass-panel p-3">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Tanggal & Jam</th>
                <th>Mata Kuliah</th>
                <th>Lokasi / Jarak</th>
                <th>Mock GPS</th>
                <th>Status</th>
                <th>Bukti</th>
              </tr>
            </thead>
            <tbody>
              ${records.length === 0 ? `<tr><td colspan="6" class="text-center text-muted py-3">Belum ada catatan absensi.</td></tr>` : ''}
              ${records.map(r => {
                const course = courses.find(c => c.id === r.mata_kuliah_id) || {};
                const bClass = r.status.toLowerCase();
                return `
                  <tr>
                    <td>
                      <div class="fw-bold">${r.tanggal}</div>
                      <div class="text-subtle" style="font-size: 0.75rem;">${r.jam} WIB</div>
                    </td>
                    <td>
                      <div class="fw-bold text-navy">${course.nama || 'Mata Kuliah'}</div>
                      <div class="text-subtle" style="font-size: 0.75rem;">${course.dosen || ''}</div>
                    </td>
                    <td>
                      <div>${r.jarak <= 150 ? '<span class="text-success fw-bold"><i class="fa-solid fa-location-dot"></i> Dalam Area</span>' : '<span class="text-danger fw-bold"><i class="fa-solid fa-location-pin-lock"></i> Luar Area</span>'}</div>
                      <div class="text-subtle" style="font-size: 0.75rem;">Jarak: ${r.jarak} meter</div>
                    </td>
                    <td>
                      ${r.is_mock_gps ? '<span class="badge badge-alpha">Mock Detected</span>' : '<span class="badge badge-hadir">Clean</span>'}
                    </td>
                    <td>
                      <span class="badge badge-${bClass}">${r.status}</span>
                    </td>
                    <td>
                      ${r.selfie_url ? `<button class="btn btn-secondary btn-sm" onclick="app.viewAuditModal('${r.id}')"><i class="fa-solid fa-image"></i> Bukti</button>` : '<span class="text-subtle" style="font-size: 0.75rem;">Tanpa Foto</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderScheduleView(container) {
    const courses = Store.getMataKuliah();
    container.innerHTML = `
      <div class="mb-3">
        <h2 class="fw-bold text-navy" style="font-size: 1.25rem;"><i class="fa-solid fa-calendar-days text-primary"></i> Jadwal Perkuliahan</h2>
        <p class="text-muted" style="font-size: 0.825rem;">Daftar jadwal mata kuliah semester aktif.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        ${courses.map(c => `
          <div class="glass-panel p-3 course-card">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge badge-hadir"><i class="fa-solid fa-calendar"></i> ${c.hari}</span>
              <span class="time-pill">${c.jam_mulai} - ${c.jam_selesai}</span>
            </div>
            <h3 class="fw-bold text-navy mb-1" style="font-size: 0.95rem;">${c.nama}</h3>
            <div class="text-muted mb-2" style="font-size: 0.775rem;"><i class="fa-solid fa-user-tie"></i> ${c.dosen}</div>
            <div class="d-flex justify-content-between align-items-center text-subtle mt-auto" style="font-size: 0.775rem;">
              <span><i class="fa-solid fa-door-open"></i> ${c.ruangan}</span>
              <button class="btn btn-primary btn-sm" onclick="app.navigateTo('absen', {courseId: '${c.id}'})">Absen Now</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* Admin Views */
  renderAdminDashboard(container) {
    const mhsList = Store.getMahasiswa();
    const courses = Store.getMataKuliah();
    const absensi = Store.getAbsensi();

    const totalHadir = absensi.filter(a => a.status === 'Hadir').length;
    const totalAlpha = absensi.filter(a => a.status === 'Alpha').length;

    container.innerHTML = `
      <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap" style="gap: 0.75rem;">
        <div>
          <h2 class="fw-bold text-navy" style="font-size: 1.25rem;">Executive Admin Dashboard 🛡️</h2>
          <p class="text-muted" style="font-size: 0.825rem;">Pusat kontrol audit absensi geofence, mata kuliah, dan lokasi kampus.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-secondary btn-sm" onclick="app.navigateTo('admin-laporan')"><i class="fa-solid fa-file-export"></i> Laporan</button>
          <button class="btn btn-primary btn-sm" onclick="app.navigateTo('admin-lokasi')"><i class="fa-solid fa-map-location-dot"></i> Setup Kampus</button>
        </div>
      </div>

      <!-- Admin Metrics -->
      <div class="stats-grid">
        <div class="glass-panel stat-card">
          <div class="stat-icon primary"><i class="fa-solid fa-users"></i></div>
          <div>
            <div class="stat-val text-primary">${mhsList.length}</div>
            <div class="stat-label">Total Mhs</div>
          </div>
        </div>
        <div class="glass-panel stat-card yellow-border">
          <div class="stat-icon yellow"><i class="fa-solid fa-book-open"></i></div>
          <div>
            <div class="stat-val text-yellow">${courses.length}</div>
            <div class="stat-label">Mata Kuliah</div>
          </div>
        </div>
        <div class="glass-panel stat-card success-border">
          <div class="stat-icon success"><i class="fa-solid fa-clipboard-check"></i></div>
          <div>
            <div class="stat-val text-success">${totalHadir}</div>
            <div class="stat-label">Total Hadir</div>
          </div>
        </div>
        <div class="glass-panel stat-card danger-border">
          <div class="stat-icon danger"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <div>
            <div class="stat-val text-danger">${totalAlpha}</div>
            <div class="stat-label">Total Alpha</div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.15rem;">
        <div class="glass-panel p-3">
          <h4 class="fw-bold mb-2 text-navy" style="font-size: 0.9rem;"><i class="fa-solid fa-chart-column text-primary"></i> Kehadiran Per Mata Kuliah</h4>
          <div style="height: 220px;">
            <canvas id="admin-bar-chart"></canvas>
          </div>
        </div>
        <div class="glass-panel p-3">
          <h4 class="fw-bold mb-2 text-navy" style="font-size: 0.9rem;"><i class="fa-solid fa-chart-line text-primary"></i> Tren Kehadiran Mingguan (%)</h4>
          <div style="height: 220px;">
            <canvas id="admin-line-chart"></canvas>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const coursesData = courses.map(c => ({
        nama: c.nama.substring(0, 15) + '...',
        totalHadir: absensi.filter(a => a.mata_kuliah_id === c.id && a.status === 'Hadir').length + 5,
        totalAlpha: absensi.filter(a => a.mata_kuliah_id === c.id && a.status === 'Alpha').length + 1
      }));
      ChartModule.renderAdminCourseBarChart('admin-bar-chart', coursesData);
      ChartModule.renderAdminTrendLineChart('admin-line-chart');
    }, 100);
  },

  renderAdminAbsensiView(container) {
    const absensi = Store.getAbsensi();
    const mhsList = Store.getMahasiswa();
    const courses = Store.getMataKuliah();

    container.innerHTML = `
      <div class="mb-3">
        <h2 class="fw-bold text-navy" style="font-size: 1.25rem;"><i class="fa-solid fa-clipboard-user text-primary"></i> Data Absensi & Log Audit</h2>
        <p class="text-muted" style="font-size: 0.825rem;">Rekapitulasi lokasi GPS, jarak, dan foto selfie seluruh mahasiswa.</p>
      </div>

      <div class="glass-panel p-3">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Mahasiswa</th>
                <th>Mata Kuliah</th>
                <th>Tanggal & Jam</th>
                <th>Jarak</th>
                <th>Mock GPS</th>
                <th>Status</th>
                <th>Audit</th>
              </tr>
            </thead>
            <tbody>
              ${absensi.map(a => {
                const mhs = mhsList.find(m => m.id === a.mahasiswa_id) || { nama: 'Unknown', nim: '-' };
                const course = courses.find(c => c.id === a.mata_kuliah_id) || { nama: 'Matkul' };
                const bClass = a.status.toLowerCase();

                return `
                  <tr>
                    <td>
                      <div class="fw-bold text-navy">${mhs.nama}</div>
                      <div class="text-subtle" style="font-size: 0.75rem;">NIM: ${mhs.nim}</div>
                    </td>
                    <td>${course.nama}</td>
                    <td>${a.tanggal} <span class="text-subtle">(${a.jam})</span></td>
                    <td>
                      <span class="${a.jarak <= 150 ? 'text-success' : 'text-danger'} fw-bold">${a.jarak}m</span>
                    </td>
                    <td>
                      ${a.is_mock_gps ? '<span class="badge badge-alpha">DETECTED</span>' : '<span class="badge badge-hadir">OK</span>'}
                    </td>
                    <td><span class="badge badge-${bClass}">${a.status}</span></td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="app.viewAuditModal('${a.id}')"><i class="fa-solid fa-magnifying-glass"></i> Audit</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminMahasiswaView(container) {
    const list = Store.getMahasiswa();
    container.innerHTML = `
      <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap" style="gap: 0.75rem;">
        <div>
          <h2 class="fw-bold text-navy" style="font-size: 1.25rem;"><i class="fa-solid fa-users text-primary"></i> Kelola Data Mahasiswa</h2>
          <p class="text-muted" style="font-size: 0.825rem;">Manajemen master data akun mahasiswa.</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="app.openAddMahasiswaModal()"><i class="fa-solid fa-user-plus"></i> Tambah Mhs</button>
      </div>

      <div class="glass-panel p-3">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>NIM</th>
                <th>Nama Lengkap</th>
                <th>Program Studi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(m => `
                <tr>
                  <td><img src="${m.avatar}" class="avatar" style="width: 32px; height: 32px;"></td>
                  <td class="fw-bold text-navy">${m.nim}</td>
                  <td>${m.nama}</td>
                  <td>${m.prodi}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteMahasiswa('${m.id}')"><i class="fa-solid fa-trash"></i> Hapus</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminMatakuliahView(container) {
    const list = Store.getMataKuliah();
    container.innerHTML = `
      <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap" style="gap: 0.75rem;">
        <div>
          <h2 class="fw-bold text-navy" style="font-size: 1.25rem;"><i class="fa-solid fa-book-open text-primary"></i> Kelola Mata Kuliah & Jadwal</h2>
          <p class="text-muted" style="font-size: 0.825rem;">Daftar sesi perkuliahan dan pengampu dosen.</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="app.openAddMatakuliahModal()"><i class="fa-solid fa-plus"></i> Tambah Matkul</button>
      </div>

      <div class="glass-panel p-3">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Nama Mata Kuliah</th>
                <th>Hari</th>
                <th>Jam Perkuliahan</th>
                <th>Dosen Pengampu</th>
                <th>Ruangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => `
                <tr>
                  <td class="fw-bold text-navy">${c.nama}</td>
                  <td><span class="badge badge-hadir">${c.hari}</span></td>
                  <td>${c.jam_mulai} - ${c.jam_selesai} WIB</td>
                  <td>${c.dosen}</td>
                  <td>${c.ruangan}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteMatakuliah('${c.id}')"><i class="fa-solid fa-trash"></i> Hapus</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminLokasiView(container) {
    const campus = Store.getLokasiKampus();
    container.innerHTML = `
      <div class="mb-3">
        <h2 class="fw-bold text-navy" style="font-size: 1.25rem;"><i class="fa-solid fa-map-location-dot text-primary"></i> Pengaturan Lokasi Kampus</h2>
        <p class="text-muted" style="font-size: 0.825rem;">Tentukan koordinat Latitude, Longitude, dan Radius area kampus.</p>
      </div>

      <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.15rem;">
        <!-- Form Controls -->
        <div class="glass-panel p-3">
          <form id="lokasi-form" onsubmit="app.saveLokasiForm(event)">
            <div class="form-group">
              <label class="form-label">Nama Kampus / Gedung</label>
              <input type="text" id="lokasi-nama" class="form-control" value="${campus.nama}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Latitude</label>
              <input type="number" step="any" id="lokasi-lat" class="form-control" value="${campus.latitude}" required onchange="app.updateAdminMapFromInputs()">
            </div>
            <div class="form-group">
              <label class="form-label">Longitude</label>
              <input type="number" step="any" id="lokasi-lng" class="form-control" value="${campus.longitude}" required onchange="app.updateAdminMapFromInputs()">
            </div>
            <div class="form-group">
              <label class="form-label">Radius Absensi (Meter)</label>
              <input type="number" id="lokasi-radius" class="form-control" value="${campus.radius}" required oninput="MapModule.updateRadiusCircle(this.value)">
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100 mt-2">
              <i class="fa-solid fa-floppy-disk"></i> Simpan Lokasi Kampus
            </button>
          </form>
        </div>

        <!-- Interactive Map -->
        <div class="glass-panel p-3">
          <div class="text-subtle mb-2" style="font-size: 0.775rem;"><i class="fa-solid fa-hand-pointer"></i> Klik/geser marker untuk menyesuaikan koordinat:</div>
          <div id="admin-setup-map" class="map-box"></div>
        </div>
      </div>
    `;

    setTimeout(() => {
      MapModule.renderAdminSetupMap('admin-setup-map', campus, (lat, lng) => {
        document.getElementById('lokasi-lat').value = lat.toFixed(6);
        document.getElementById('lokasi-lng').value = lng.toFixed(6);
      });
    }, 100);
  },

  updateAdminMapFromInputs() {
    const lat = parseFloat(document.getElementById('lokasi-lat').value);
    const lng = parseFloat(document.getElementById('lokasi-lng').value);
    const rad = parseFloat(document.getElementById('lokasi-radius').value);
    if (!isNaN(lat) && !isNaN(lng)) {
      MapModule.renderAdminSetupMap('admin-setup-map', { latitude: lat, longitude: lng, radius: rad }, (newLat, newLng) => {
        document.getElementById('lokasi-lat').value = newLat.toFixed(6);
        document.getElementById('lokasi-lng').value = newLng.toFixed(6);
      });
    }
  },

  saveLokasiForm(e) {
    e.preventDefault();
    const updated = {
      id: 'lokasi_1',
      nama: document.getElementById('lokasi-nama').value,
      latitude: parseFloat(document.getElementById('lokasi-lat').value),
      longitude: parseFloat(document.getElementById('lokasi-lng').value),
      radius: parseInt(document.getElementById('lokasi-radius').value)
    };
    Store.saveLokasiKampus(updated);
    this.toast('Lokasi Kampus Berhasil Diperbarui!', 'success');
    this.updateNavigationUI();
  },

  renderAdminLaporanView(container) {
    const courses = Store.getMataKuliah();
    const selectedCourse = courses[0];
    const qrData = QRCodeModule.generateCourseQR(selectedCourse.id, selectedCourse.nama);

    container.innerHTML = `
      <div class="mb-3">
        <h2 class="fw-bold text-navy" style="font-size: 1.25rem;"><i class="fa-solid fa-file-export text-primary"></i> Laporan & Generator QR Code</h2>
        <p class="text-muted" style="font-size: 0.825rem;">Cetak rekapitulasi absensi atau tampilkan QR Code sesi perkuliahan aktif.</p>
      </div>

      <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.15rem;">
        <!-- QR Code Generator -->
        <div class="glass-panel p-3 text-center">
          <h4 class="fw-bold mb-2 text-navy" style="font-size: 0.95rem;"><i class="fa-solid fa-qrcode text-primary"></i> Generator QR Code Sesi</h4>
          <p class="text-subtle mb-3" style="font-size: 0.775rem;">Tampilkan QR Code ini di layar proyektor kelas.</p>
          
          <div class="form-group mb-3 text-start">
            <label class="form-label">Pilih Sesi Mata Kuliah</label>
            <select class="form-control" onchange="app.updateQRDisplay(this.value)">
              ${courses.map(c => `<option value="${c.id}">${c.nama} (${c.hari})</option>`).join('')}
            </select>
          </div>

          <div id="qr-display-container" class="my-3 d-flex justify-content-center">
            ${qrData.svgHtml}
          </div>
          <div class="badge badge-hadir" id="qr-token-label">Token: ${qrData.token.substring(0, 24)}...</div>
        </div>

        <!-- Export & Print -->
        <div class="glass-panel p-3">
          <h4 class="fw-bold mb-3 text-navy" style="font-size: 0.95rem;"><i class="fa-solid fa-file-csv text-success"></i> Unduh Rekapitulasi CSV / Print</h4>
          <p class="text-muted mb-4" style="font-size: 0.825rem;">Unduh berkas absensi format CSV (Excel) atau cetak PDF laporan resmi.</p>
          
          <div class="d-flex flex-column gap-3">
            <button class="btn btn-success btn-lg" onclick="app.exportAttendanceCSV()">
              <i class="fa-solid fa-file-excel fa-lg"></i> Download Rekap CSV (Excel)
            </button>
            <button class="btn btn-secondary btn-lg" onclick="window.print()">
              <i class="fa-solid fa-print fa-lg"></i> Cetak Laporan PDF
            </button>
          </div>
        </div>
      </div>
    `;
  },

  updateQRDisplay(courseId) {
    const course = Store.getMataKuliah().find(c => c.id === courseId);
    const qrData = QRCodeModule.generateCourseQR(course.id, course.nama);
    document.getElementById('qr-display-container').innerHTML = qrData.svgHtml;
    document.getElementById('qr-token-label').textContent = `Token: ${qrData.token.substring(0, 24)}...`;
  },

  exportAttendanceCSV() {
    const absensi = Store.getAbsensi();
    const mhsList = Store.getMahasiswa();
    const courses = Store.getMataKuliah();

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "NIM,Nama Mahasiswa,Mata Kuliah,Tanggal,Jam,Jarak (m),Status,Mock GPS\n";

    absensi.forEach(a => {
      const mhs = mhsList.find(m => m.id === a.mahasiswa_id) || {};
      const c = courses.find(cr => cr.id === a.mata_kuliah_id) || {};
      csvContent += `"${mhs.nim || ''}","${mhs.nama || ''}","${c.nama || ''}","${a.tanggal}","${a.jam}","${a.jarak}","${a.status}","${a.is_mock_gps ? 'Yes' : 'No'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Absensi_SmartAttendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast('Berhasil mengunduh laporan CSV', 'success');
  },

  /* Modals */
  viewAuditModal(recordId) {
    const record = Store.getAbsensi().find(a => a.id === recordId);
    if (!record) return;

    const mhs = Store.getMahasiswa().find(m => m.id === record.mahasiswa_id) || {};
    const course = Store.getMataKuliah().find(c => c.id === record.mata_kuliah_id) || {};

    const contentHtml = `
      <div class="modal-header">
        <h3 class="fw-bold text-navy" style="font-size: 1.1rem;"><i class="fa-solid fa-shield-halved text-primary"></i> Audit Detail Absensi</h3>
        <button class="modal-close" onclick="app.closeModal()">&times;</button>
      </div>

      <div class="text-center mb-3">
        ${record.selfie_url ? `<img src="${record.selfie_url}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 10px; border: 2px solid var(--blue-primary);">` : '<div class="p-3 glass-panel text-muted">Foto Selfie Tidak Tersedia</div>'}
      </div>

      <div class="glass-panel p-3 mb-3" style="font-size: 0.8rem; background: var(--bg-surface-alt);">
        <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
          <div><strong>Nama:</strong> ${mhs.nama}</div>
          <div><strong>NIM:</strong> ${mhs.nim}</div>
          <div><strong>Matkul:</strong> ${course.nama}</div>
          <div><strong>Waktu:</strong> ${record.tanggal} (${record.jam})</div>
          <div><strong>Koordinat:</strong> ${record.latitude.toFixed(5)}, ${record.longitude.toFixed(5)}</div>
          <div><strong>Jarak:</strong> ${record.jarak} Meter</div>
          <div><strong>Mock GPS:</strong> ${record.is_mock_gps ? 'Terdeteksi' : 'Clean'}</div>
          <div><strong>Status:</strong> <span class="badge badge-${record.status.toLowerCase()}">${record.status}</span></div>
        </div>
      </div>

      ${this.currentRole === 'admin' ? `
        <div class="form-group mb-3">
          <label class="form-label">Override Status (Admin Approval)</label>
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-success btn-sm flex-1" onclick="app.overrideStatus('${record.id}', 'Hadir')">Set Hadir</button>
            <button class="btn btn-secondary btn-sm flex-1" onclick="app.overrideStatus('${record.id}', 'Izin')">Set Izin</button>
            <button class="btn btn-secondary btn-sm flex-1" onclick="app.overrideStatus('${record.id}', 'Sakit')">Set Sakit</button>
            <button class="btn btn-danger btn-sm flex-1" onclick="app.overrideStatus('${record.id}', 'Alpha')">Set Alpha</button>
          </div>
        </div>
      ` : ''}

      <button class="btn btn-secondary w-100" onclick="app.closeModal()">Tutup Audit</button>
    `;

    document.getElementById('modal-body-content').innerHTML = contentHtml;
    document.getElementById('app-modal').classList.add('active');
  },

  overrideStatus(id, newStatus) {
    Store.updateAbsensi(id, { status: newStatus });
    this.toast(`Status absensi diubah menjadi ${newStatus}`, 'success');
    this.closeModal();
    this.renderCurrentView();
  },

  openAddMahasiswaModal() {
    const html = `
      <div class="modal-header">
        <h3 class="fw-bold text-navy" style="font-size: 1.1rem;">Tambah Data Mahasiswa</h3>
        <button class="modal-close" onclick="app.closeModal()">&times;</button>
      </div>
      <form onsubmit="app.saveMahasiswaForm(event)">
        <div class="form-group">
          <label class="form-label">NIM</label>
          <input type="text" id="mhs-nim" class="form-control" required>
        </div>
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" id="mhs-nama" class="form-control" required>
        </div>
        <div class="form-group">
          <label class="form-label">Program Studi</label>
          <input type="text" id="mhs-prodi" class="form-control" value="Teknik Informatika" required>
        </div>
        <button type="submit" class="btn btn-primary w-100 mt-2">Simpan Mahasiswa</button>
      </form>
    `;
    document.getElementById('modal-body-content').innerHTML = html;
    document.getElementById('app-modal').classList.add('active');
  },

  saveMahasiswaForm(e) {
    e.preventDefault();
    const list = Store.getMahasiswa();
    list.push({
      id: 'mhs_' + Date.now(),
      nim: document.getElementById('mhs-nim').value,
      nama: document.getElementById('mhs-nama').value,
      prodi: document.getElementById('mhs-prodi').value,
      password: '123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    });
    Store.saveMahasiswa(list);
    this.toast('Mahasiswa berhasil ditambahkan!', 'success');
    this.closeModal();
    this.renderCurrentView();
  },

  deleteMahasiswa(id) {
    let list = Store.getMahasiswa().filter(m => m.id !== id);
    Store.saveMahasiswa(list);
    this.toast('Mahasiswa berhasil dihapus', 'info');
    this.renderCurrentView();
  },

  openAddMatakuliahModal() {
    const html = `
      <div class="modal-header">
        <h3 class="fw-bold text-navy" style="font-size: 1.1rem;">Tambah Mata Kuliah</h3>
        <button class="modal-close" onclick="app.closeModal()">&times;</button>
      </div>
      <form onsubmit="app.saveMatakuliahForm(event)">
        <div class="form-group">
          <label class="form-label">Nama Mata Kuliah</label>
          <input type="text" id="mk-nama" class="form-control" required>
        </div>
        <div class="form-group">
          <label class="form-label">Hari</label>
          <select id="mk-hari" class="form-control">
            <option>Senin</option><option>Selasa</option><option>Rabu</option><option>Kamis</option><option>Jumat</option><option>Sabtu</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Jam Mulai - Jam Selesai</label>
          <div class="d-flex gap-2">
            <input type="text" id="mk-start" class="form-control" placeholder="08:00" required>
            <input type="text" id="mk-end" class="form-control" placeholder="10:30" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Dosen Pengampu</label>
          <input type="text" id="mk-dosen" class="form-control" required>
        </div>
        <div class="form-group">
          <label class="form-label">Ruangan</label>
          <input type="text" id="mk-ruangan" class="form-control" placeholder="Lab Komputer 1" required>
        </div>
        <button type="submit" class="btn btn-primary w-100 mt-2">Simpan Mata Kuliah</button>
      </form>
    `;
    document.getElementById('modal-body-content').innerHTML = html;
    document.getElementById('app-modal').classList.add('active');
  },

  saveMatakuliahForm(e) {
    e.preventDefault();
    const list = Store.getMataKuliah();
    list.push({
      id: 'mk_' + Date.now(),
      nama: document.getElementById('mk-nama').value,
      hari: document.getElementById('mk-hari').value,
      jam_mulai: document.getElementById('mk-start').value,
      jam_selesai: document.getElementById('mk-end').value,
      dosen: document.getElementById('mk-dosen').value,
      ruangan: document.getElementById('mk-ruangan').value
    });
    Store.saveMataKuliah(list);
    this.toast('Mata Kuliah berhasil ditambahkan!', 'success');
    this.closeModal();
    this.renderCurrentView();
  },

  deleteMatakuliah(id) {
    let list = Store.getMataKuliah().filter(c => c.id !== id);
    Store.saveMataKuliah(list);
    this.toast('Mata Kuliah berhasil dihapus', 'info');
    this.renderCurrentView();
  },

  toggleMobileSidebar(open = null) {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const menuBtnIcon = document.querySelector('#mobile-menu-btn i');
    
    if (sidebar) {
      const isOpen = open !== null ? open : !sidebar.classList.contains('open');
      if (isOpen) {
        sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
        if (menuBtnIcon) {
          menuBtnIcon.classList.remove('fa-bars');
          menuBtnIcon.classList.add('fa-xmark');
        }
      } else {
        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        if (menuBtnIcon) {
          menuBtnIcon.classList.remove('fa-xmark');
          menuBtnIcon.classList.add('fa-bars');
        }
      }
    }
  },

  closeModal() {
    document.getElementById('app-modal').classList.remove('active');
  },

  toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `glass-panel p-3 shadow-lg`;
    el.style.position = 'fixed';
    el.style.bottom = '70px';
    el.style.right = '16px';
    el.style.zIndex = '99999';
    el.style.borderRadius = '10px';
    el.style.fontSize = '0.85rem';
    el.style.fontWeight = '600';
    el.style.background = '#ffffff';

    let borderCol = '#2563eb';
    if (type === 'success') borderCol = '#059669';
    if (type === 'danger') borderCol = '#dc2626';
    if (type === 'warning') borderCol = '#d97706';
    el.style.borderLeft = `4px solid ${borderCol}`;

    el.innerHTML = `<div>${message}</div>`;
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.25s ease';
      setTimeout(() => el.remove(), 250);
    }, 2800);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const loginId = document.getElementById('login-id').value.trim();
      if (loginId.toLowerCase() === 'admin') {
        app.switchRole('admin');
      } else {
        const mhs = Store.getMahasiswa().find(m => m.nim === loginId) || Store.getMahasiswa()[0];
        Store.setCurrentUser({ ...mhs, role: 'mahasiswa' });
        app.currentRole = 'mahasiswa';
        app.currentView = 'dashboard';
        app.showMainLayout();
        app.updateNavigationUI();
        app.renderCurrentView();
        app.toast(`Selamat Datang, ${mhs.nama}!`, 'success');
      }
    });
  }

  app.init();
});

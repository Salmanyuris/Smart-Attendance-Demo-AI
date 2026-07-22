/**
 * SMART ATTENDANCE - DATA STORE & PERSISTENCE (LOCAL STORAGE ENGINE)
 */
const Store = {
  KEYS: {
    MAHASISWA: 'smart_att_mahasiswa',
    MATAKULIAH: 'smart_att_matakuliah',
    LOKASI: 'smart_att_lokasi',
    ABSENSI: 'smart_att_absensi',
    CURRENT_USER: 'smart_att_user'
  },

  init() {
    if (!localStorage.getItem(this.KEYS.LOKASI)) {
      this.seedData();
    }
  },

  seedData() {
    // 1. Lokasi Kampus Default (Contoh: Semarang Campus -6.981233, 110.409821, radius 150m)
    const defaultLokasi = {
      id: 'lokasi_1',
      nama: 'Kampus Utama USM (Gedung Menara)',
      latitude: -6.981233,
      longitude: 110.409821,
      radius: 150
    };

    // 2. Data Mahasiswa Default
    const defaultMahasiswa = [
      { id: 'mhs_1', nim: '230101001', nama: 'Budi Santoso', prodi: 'Teknik Informatika', password: '123', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
      { id: 'mhs_2', nim: '230101002', nama: 'Siti Nurhaliza', prodi: 'Teknik Informatika', password: '123', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
      { id: 'mhs_3', nim: '230101003', nama: 'Ahmad Rizky Pratama', prodi: 'Sistem Informasi', password: '123', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
      { id: 'mhs_4', nim: '230101004', nama: 'Dewi Anggraini', prodi: 'Sistem Informasi', password: '123', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' }
    ];

    // 3. Data Mata Kuliah & Jadwal
    const defaultMataKuliah = [
      { id: 'mk_1', nama: 'Pemrograman Web Lanjut', hari: 'Rabu', jam_mulai: '08:00', jam_selesai: '10:30', dosen: 'Dr. Hendra Wijaya, M.T.', ruangan: 'Lab Komputer 3' },
      { id: 'mk_2', nama: 'Kecerdasan Buatan & ML', hari: 'Rabu', jam_mulai: '11:00', jam_selesai: '13:30', dosen: 'Prof. Diana Putri, Ph.D.', ruangan: 'R. Teori 402' },
      { id: 'mk_3', nama: 'Basis Data Terdistribusi', hari: 'Kamis', jam_mulai: '09:00', jam_selesai: '11:30', dosen: 'Ir. Irfan Setiawan, M.Sc.', ruangan: 'Lab Database' },
      { id: 'mk_4', nama: 'Keamanan Cyber & Network', hari: 'Jumat', jam_mulai: '13:30', jam_selesai: '16:00', dosen: 'Bambang Kusuma, M.Kom.', ruangan: 'Lab Jaringan' }
    ];

    // 4. Data Dummy Absensi
    const defaultAbsensi = [
      {
        id: 'abs_1',
        mahasiswa_id: 'mhs_1',
        mata_kuliah_id: 'mk_1',
        tanggal: '2026-07-15',
        jam: '07:58',
        latitude: -6.981240,
        longitude: 110.409815,
        jarak: 12,
        status: 'Hadir',
        selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        is_mock_gps: false
      },
      {
        id: 'abs_2',
        mahasiswa_id: 'mhs_1',
        mata_kuliah_id: 'mk_2',
        tanggal: '2026-07-16',
        jam: '08:10',
        latitude: -6.983500,
        longitude: 110.412000,
        jarak: 320,
        status: 'Alpha',
        selfie_url: null,
        is_mock_gps: false
      },
      {
        id: 'abs_3',
        mahasiswa_id: 'mhs_1',
        mata_kuliah_id: 'mk_3',
        tanggal: '2026-07-17',
        jam: '09:05',
        latitude: -6.981230,
        longitude: 110.409820,
        jarak: 8,
        status: 'Terlambat',
        selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        is_mock_gps: false
      },
      {
        id: 'abs_4',
        mahasiswa_id: 'mhs_2',
        mata_kuliah_id: 'mk_1',
        tanggal: '2026-07-15',
        jam: '07:55',
        latitude: -6.981210,
        longitude: 110.409810,
        jarak: 25,
        status: 'Hadir',
        selfie_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        is_mock_gps: false
      }
    ];

    localStorage.setItem(this.KEYS.LOKASI, JSON.stringify(defaultLokasi));
    localStorage.setItem(this.KEYS.MAHASISWA, JSON.stringify(defaultMahasiswa));
    localStorage.setItem(this.KEYS.MATAKULIAH, JSON.stringify(defaultMataKuliah));
    localStorage.setItem(this.KEYS.ABSENSI, JSON.stringify(defaultAbsensi));
  },

  // Getters
  getLokasiKampus() {
    return JSON.parse(localStorage.getItem(this.KEYS.LOKASI)) || {};
  },
  saveLokasiKampus(lokasi) {
    localStorage.setItem(this.KEYS.LOKASI, JSON.stringify(lokasi));
  },

  getMahasiswa() {
    return JSON.parse(localStorage.getItem(this.KEYS.MAHASISWA)) || [];
  },
  saveMahasiswa(data) {
    localStorage.setItem(this.KEYS.MAHASISWA, JSON.stringify(data));
  },

  getMataKuliah() {
    return JSON.parse(localStorage.getItem(this.KEYS.MATAKULIAH)) || [];
  },
  saveMataKuliah(data) {
    localStorage.setItem(this.KEYS.MATAKULIAH, JSON.stringify(data));
  },

  getAbsensi() {
    return JSON.parse(localStorage.getItem(this.KEYS.ABSENSI)) || [];
  },
  addAbsensi(record) {
    const list = this.getAbsensi();
    list.unshift(record);
    localStorage.setItem(this.KEYS.ABSENSI, JSON.stringify(list));
  },
  updateAbsensi(id, updatedFields) {
    let list = this.getAbsensi();
    list = list.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    localStorage.setItem(this.KEYS.ABSENSI, JSON.stringify(list));
  },

  // Auth & Session
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER));
  },
  setCurrentUser(user) {
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
  },
  clearCurrentUser() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  }
};

// Initialize Store
Store.init();

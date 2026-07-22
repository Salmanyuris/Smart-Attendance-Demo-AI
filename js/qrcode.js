/**
 * SMART ATTENDANCE - QR CODE VALIDATOR & GENERATOR ENGINE
 */
const QRCodeModule = {
  activeSessionToken: null,

  generateCourseQR(courseId, courseName) {
    const timestamp = Date.now();
    const payload = `SMART_ATTENDANCE_${courseId}_${timestamp}`;
    this.activeSessionToken = payload;

    // Generate SVG QR Code Representation visually
    const svgHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="180" height="180" style="background: white; padding: 10px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
        <!-- Outer Frame Position Squares -->
        <rect x="15" y="15" width="45" height="45" fill="#0f172a"/>
        <rect x="23" y="23" width="29" height="29" fill="white"/>
        <rect x="29" y="29" width="17" height="17" fill="#6366f1"/>

        <rect x="140" y="15" width="45" height="45" fill="#0f172a"/>
        <rect x="148" y="23" width="29" height="29" fill="white"/>
        <rect x="154" y="29" width="17" height="17" fill="#6366f1"/>

        <rect x="15" y="140" width="45" height="45" fill="#0f172a"/>
        <rect x="23" y="148" width="29" height="29" fill="white"/>
        <rect x="29" y="154" width="17" height="17" fill="#6366f1"/>

        <!-- Matrix Random Data Simulation -->
        <rect x="70" y="20" width="12" height="12" fill="#0f172a"/>
        <rect x="90" y="20" width="12" height="12" fill="#6366f1"/>
        <rect x="110" y="20" width="12" height="12" fill="#0f172a"/>

        <rect x="20" y="70" width="12" height="12" fill="#0f172a"/>
        <rect x="40" y="85" width="12" height="12" fill="#6366f1"/>
        <rect x="70" y="70" width="25" height="25" fill="#0f172a"/>
        <rect x="100" y="70" width="12" height="25" fill="#6366f1"/>
        <rect x="120" y="85" width="20" height="12" fill="#0f172a"/>
        <rect x="150" y="70" width="12" height="12" fill="#6366f1"/>
        <rect x="170" y="85" width="12" height="12" fill="#0f172a"/>

        <rect x="20" y="110" width="12" height="12" fill="#6366f1"/>
        <rect x="50" y="110" width="12" height="12" fill="#0f172a"/>
        <rect x="70" y="105" width="12" height="12" fill="#6366f1"/>
        <rect x="95" y="110" width="15" height="15" fill="#0f172a"/>
        <rect x="125" y="105" width="12" height="12" fill="#6366f1"/>
        <rect x="150" y="110" width="25" height="12" fill="#0f172a"/>

        <rect x="70" y="145" width="20" height="20" fill="#0f172a"/>
        <rect x="100" y="150" width="12" height="12" fill="#6366f1"/>
        <rect x="125" y="145" width="25" height="25" fill="#0f172a"/>
        <rect x="160" y="160" width="15" height="15" fill="#6366f1"/>

        <!-- Center Icon -->
        <circle cx="100" cy="100" r="18" fill="#6366f1"/>
        <text x="100" y="105" font-size="12" font-weight="bold" fill="white" text-anchor="middle">GPS</text>
      </svg>
    `;

    return {
      token: payload,
      svgHtml: svgHtml,
      expiresInMinutes: 30
    };
  },

  validateQRScan(scannedCode) {
    if (!scannedCode || !scannedCode.startsWith('SMART_ATTENDANCE_')) {
      return { valid: false, message: 'Format QR Code tidak valid atau bukan QR Resmi Kampus.' };
    }
    return { valid: true, message: 'Validasi QR Code Berhasil!' };
  }
};

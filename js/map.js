/**
 * SMART ATTENDANCE - LEAFLET MAP MODULE (BLUE, WHITE, YELLOW THEME)
 */
const MapModule = {
  mapInstance: null,
  campusMarker: null,
  userMarker: null,
  radiusCircle: null,
  distanceLine: null,

  init(containerId, centerLat, centerLng, zoom = 16) {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    this.mapInstance = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView([centerLat, centerLng], zoom);

    // OpenStreetMap Voyager Crisp Light Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.mapInstance);
  },

  /**
   * Render Attendance View Map
   */
  renderAttendanceMap(containerId, campus, userLocation) {
    this.init(containerId, campus.latitude, campus.longitude, 16);
    if (!this.mapInstance) return;

    // 1. Campus Marker Icon (Royal Blue + Yellow Pin Accent)
    const campusIcon = L.divIcon({
      className: 'custom-map-icon campus-icon',
      html: `<div style="background:#1e3a8a; color:#facc15; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 15px rgba(30,58,138,0.5); border:3px solid white;"><i class="fa-solid fa-building-columns fa-lg"></i></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    this.campusMarker = L.marker([campus.latitude, campus.longitude], { icon: campusIcon })
      .addTo(this.mapInstance)
      .bindPopup(`<b>${campus.nama}</b><br>Radius: ${campus.radius} meter`);

    // 2. Geofence Radius Circle
    const circleColor = userLocation.isInside ? '#10b981' : '#ef4444';
    this.radiusCircle = L.circle([campus.latitude, campus.longitude], {
      color: circleColor,
      fillColor: circleColor,
      fillOpacity: 0.12,
      radius: campus.radius,
      weight: 3
    }).addTo(this.mapInstance);

    // 3. User Location Marker Icon
    const userIconColor = userLocation.isInside ? '#10b981' : '#ef4444';
    const userIcon = L.divIcon({
      className: 'custom-map-icon user-icon',
      html: `<div style="background:${userIconColor}; color:white; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 15px ${userIconColor}; border:3px solid white;"><i class="fa-solid fa-user-graduate"></i></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    this.userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
      .addTo(this.mapInstance)
      .bindPopup(`<b>Posisi Anda</b><br>Jarak: ${userLocation.distance} meter (${userLocation.isInside ? 'Dalam Radius' : 'Luar Radius'})`);

    // 4. Polyline connecting user to campus
    this.distanceLine = L.polyline([
      [campus.latitude, campus.longitude],
      [userLocation.latitude, userLocation.longitude]
    ], {
      color: userIconColor,
      weight: 3,
      dashArray: '6, 8'
    }).addTo(this.mapInstance);

    // Fit bounds to show both campus and user
    const bounds = L.latLngBounds([
      [campus.latitude, campus.longitude],
      [userLocation.latitude, userLocation.longitude]
    ]);
    this.mapInstance.fitBounds(bounds, { padding: [45, 45] });
  },

  /**
   * Render Interactive Admin Campus Location Setup Map
   */
  renderAdminSetupMap(containerId, campus, onPositionChanged) {
    this.init(containerId, campus.latitude, campus.longitude, 16);
    if (!this.mapInstance) return;

    const campusIcon = L.divIcon({
      className: 'custom-map-icon campus-icon',
      html: `<div style="background:#2563eb; color:#facc15; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(37,99,235,0.6); border:3px solid white; cursor:grab;"><i class="fa-solid fa-location-crosshairs fa-xl"></i></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    this.campusMarker = L.marker([campus.latitude, campus.longitude], {
      icon: campusIcon,
      draggable: true
    }).addTo(this.mapInstance);

    this.radiusCircle = L.circle([campus.latitude, campus.longitude], {
      color: '#2563eb',
      fillColor: '#2563eb',
      fillOpacity: 0.15,
      radius: campus.radius,
      weight: 3
    }).addTo(this.mapInstance);

    const updatePosition = (lat, lng) => {
      this.radiusCircle.setLatLng([lat, lng]);
      if (onPositionChanged) onPositionChanged(lat, lng);
    };

    this.campusMarker.on('drag', (e) => {
      const pos = e.target.getLatLng();
      this.radiusCircle.setLatLng(pos);
    });

    this.campusMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      updatePosition(pos.lat, pos.lng);
    });

    this.mapInstance.on('click', (e) => {
      this.campusMarker.setLatLng(e.latlng);
      updatePosition(e.latlng.lat, e.latlng.lng);
    });
  },

  updateRadiusCircle(radius) {
    if (this.radiusCircle) {
      this.radiusCircle.setRadius(parseFloat(radius));
    }
  }
};

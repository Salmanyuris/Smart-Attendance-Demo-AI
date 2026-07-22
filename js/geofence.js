/**
 * SMART ATTENDANCE - GEOFENCE & LOCATION ENGINE
 * Implements Haversine distance algorithm & GPS Simulation Engine
 */
const Geofence = {
  // Simulator State
  simulator: {
    active: true, // Default to simulator enabled for instant browser testing
    presetDistance: 45, // Meters away from campus default
    bearing: 45, // Degrees angle
    manualLat: null,
    manualLng: null,
    isMockGps: false
  },

  /**
   * Calculate distance between two GPS coordinates in meters using Haversine formula
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance);
  },

  /**
   * Helper to project a destination coordinate from start point given distance in meters and bearing
   */
  projectCoordinate(lat, lon, distanceMeters, bearingDegrees = 45) {
    const R = 6371000;
    const brng = bearingDegrees * Math.PI / 180;
    const d = distanceMeters;
    const lat1 = lat * Math.PI / 180;
    const lon1 = lon * Math.PI / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d / R) +
      Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng)
    );
    const lon2 = lon1 + Math.atan2(
      Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
      Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
    );

    return {
      latitude: lat2 * 180 / Math.PI,
      longitude: lon2 * 180 / Math.PI
    };
  },

  /**
   * Obtain student location (Real browser GPS or Simulator position)
   */
  async getCurrentLocation() {
    const kampus = Store.getLokasiKampus();

    if (this.simulator.active) {
      let userCoords;
      if (this.simulator.manualLat && this.simulator.manualLng) {
        userCoords = {
          latitude: parseFloat(this.simulator.manualLat),
          longitude: parseFloat(this.simulator.manualLng)
        };
      } else {
        userCoords = this.projectCoordinate(
          kampus.latitude,
          kampus.longitude,
          this.simulator.presetDistance,
          this.simulator.bearing
        );
      }

      const distance = this.calculateDistance(
        kampus.latitude,
        kampus.longitude,
        userCoords.latitude,
        userCoords.longitude
      );

      const isInside = distance <= kampus.radius;

      return {
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        distance: distance,
        isInside: isInside,
        radius: kampus.radius,
        isMockGps: this.simulator.isMockGps,
        source: 'Simulator GPS'
      };
    }

    // Real Browser Geolocation API
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Browser tidak mendukung Geolocation API'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const distance = this.calculateDistance(kampus.latitude, kampus.longitude, lat, lng);
          const isInside = distance <= kampus.radius;

          resolve({
            latitude: lat,
            longitude: lng,
            distance: distance,
            isInside: isInside,
            radius: kampus.radius,
            isMockGps: false,
            source: 'Hardware GPS'
          });
        },
        (error) => {
          console.warn('Geolocation error, falling back to simulator:', error.message);
          // Fallback to simulator if permission denied or unavailable
          this.simulator.active = true;
          resolve(this.getCurrentLocation());
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }
};

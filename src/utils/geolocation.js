/**
 * geolocation.js — Novaride Geolocation Utility
 *
 * A Promise-based wrapper around navigator.geolocation.getCurrentPosition
 * that:
 *   1. Requests a fresh, high-accuracy position (maximumAge: 0).
 *   2. Logs every field of position.coords for diagnostics.
 *   3. Validates position.coords.accuracy against a configurable threshold.
 *   4. Rejects with a typed GeoError so callers can display appropriate
 *      user-facing messages without guessing what went wrong.
 *
 * IMPORTANT: This utility does NOT fall back to any hardcoded coordinate,
 * cached location, or default region. If a reliable position cannot be
 * obtained, it rejects so the caller can notify the user and let them retry.
 *
 * Usage:
 *   import { requestCurrentPosition } from '../utils/geolocation';
 *   try {
 *     const { latitude, longitude, accuracy } = await requestCurrentPosition();
 *   } catch (err) {
 *     // err.code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'LOW_ACCURACY'
 *     // err.message: human-readable string
 *   }
 */

// ─── Accuracy Threshold ────────────────────────────────────────────────────
//
// For ride-hailing, the marker needs to land on the correct street.
// Accuracy tolerance breakdown for Novaride (Ibadan):
//
//   ≤ 50 m   → GPS lock          → accept
//   ≤ 500 m  → Wi-Fi positioning → accept
//   ≤ 2000 m → Cell positioning  → accept (user can drag marker)
//   ≤ 5000 m → Degraded cell     → accept with caution
//   > 5000 m → IP-based fallback → REJECT (e.g. 100,000 m Lagos centroid)
//
// A 5 km radius error circle means the pickup marker could land anywhere
// in a 10 km diameter — completely unusable for a ride pickup.
// The Lagos ISP IP centroid arrives at accuracy = 100,000 m, which is
// 20× this threshold.
//
export const GEO_ACCURACY_THRESHOLD_METERS = 5000;

// ─── Geolocation Options ───────────────────────────────────────────────────
//
// enableHighAccuracy: true  — requests GPS / Wi-Fi scan rather than IP lookup.
//                             Not guaranteed; the browser may still fall back
//                             if GPS hardware is absent, but this maximises
//                             the chance of a precise result.
// maximumAge: 0             — always request a fresh fix; never return a
//                             browser-cached position from a previous call.
// timeout: 15000            — 15 s is enough for a GPS cold start indoors
//                             without being excessively long for the user.
//
const GEO_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 15000,
};

// ─── Typed error codes ────────────────────────────────────────────────────
export const GEO_ERROR_CODES = {
  PERMISSION_DENIED:    'PERMISSION_DENIED',
  POSITION_UNAVAILABLE: 'POSITION_UNAVAILABLE',
  TIMEOUT:              'TIMEOUT',
  LOW_ACCURACY:         'LOW_ACCURACY',
  NOT_SUPPORTED:        'NOT_SUPPORTED',
};

/**
 * Creates a GeoError — a plain Error object with an extra `code` property
 * for discriminated error handling.
 */
const geoError = (code, message) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

// ─── Human-readable messages for each GeolocationPositionError code ───────
const browserErrorMessage = (positionError) => {
  switch (positionError.code) {
    case positionError.PERMISSION_DENIED:
      return {
        code: GEO_ERROR_CODES.PERMISSION_DENIED,
        message:
          '📍 Location permission denied. Please allow location access in your browser settings and try again.',
      };
    case positionError.POSITION_UNAVAILABLE:
      return {
        code: GEO_ERROR_CODES.POSITION_UNAVAILABLE,
        message:
          '📡 Location unavailable. Please ensure location services are enabled on your device.',
      };
    case positionError.TIMEOUT:
      return {
        code: GEO_ERROR_CODES.TIMEOUT,
        message:
          '⏱️ Location request timed out. Please check your internet connection and try again.',
      };
    default:
      return {
        code: GEO_ERROR_CODES.POSITION_UNAVAILABLE,
        message: '📡 Unable to determine your location. Please try again.',
      };
  }
};

/**
 * requestCurrentPosition()
 *
 * Requests the device's current position and validates its accuracy.
 *
 * @param {object} [options]
 * @param {number} [options.accuracyThreshold] Override the default 5000 m threshold.
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number, timestamp: number}>}
 * @throws {Error} with .code from GEO_ERROR_CODES
 */
export const requestCurrentPosition = (options = {}) => {
  const threshold = options.accuracyThreshold ?? GEO_ACCURACY_THRESHOLD_METERS;

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        geoError(
          GEO_ERROR_CODES.NOT_SUPPORTED,
          '🌐 Geolocation is not supported by your browser.',
        ),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, heading, speed } =
          position.coords;
        const { timestamp } = position;

        // ── Diagnostic log — always print everything ────────────────────
        console.group('[Geolocation] Position acquired');
        console.info(`  Latitude  : ${latitude}`);
        console.info(`  Longitude : ${longitude}`);
        console.info(`  Accuracy  : ±${accuracy} m`);
        console.info(`  Altitude  : ${altitude ?? 'N/A'} m`);
        console.info(`  Heading   : ${heading ?? 'N/A'}°`);
        console.info(`  Speed     : ${speed ?? 'N/A'} m/s`);
        console.info(`  Timestamp : ${new Date(timestamp).toISOString()}`);
        console.info(`  Threshold : ±${threshold} m`);
        console.info(`  Accepted  : ${accuracy <= threshold ? '✅ YES' : '❌ NO (accuracy too poor)'}`);
        console.groupEnd();

        // ── Accuracy gate ───────────────────────────────────────────────
        if (accuracy > threshold) {
          reject(
            geoError(
              GEO_ERROR_CODES.LOW_ACCURACY,
              `📡 Location accuracy is too low (±${Math.round(accuracy / 1000)} km). ` +
                `Please enable GPS or Wi-Fi on your device and try again.`,
            ),
          );
          return;
        }

        resolve({ latitude, longitude, accuracy, timestamp });
      },

      (positionError) => {
        const { code, message } = browserErrorMessage(positionError);
        console.error(
          `[Geolocation] Error — code: ${code}`,
          positionError.message,
        );
        reject(geoError(code, message));
      },

      GEO_OPTIONS,
    );
  });
};

import { useState, useCallback } from 'react';

interface GeoState {
  coords: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeoState>({ coords: null, error: null, loading: false });

  const locate = useCallback((retries = 2) => {
    setState(s => ({ ...s, loading: true, error: null }));

    const attempt = (attemptsLeft: number) => {
      if (!navigator.geolocation) {
        setState({ coords: null, error: "Geolocation not supported", loading: false });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setState({
            coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            error: null,
            loading: false
          });
        },
        (err) => {
          if (attemptsLeft > 0) {
            setTimeout(() => attempt(attemptsLeft - 1), 1000);
          } else {
            let errorMsg = "Failed to get location.";
            if (err.code === 1) errorMsg = "Permission denied. Please enable location services.";
            if (err.code === 2) errorMsg = "Network error. Cannot determine location.";
            if (err.code === 3) errorMsg = "Location request timed out.";
            setState({ coords: null, error: errorMsg, loading: false });
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    attempt(retries);
  }, []);

  return { ...state, locate, setState };
};

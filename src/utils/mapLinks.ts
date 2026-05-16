export const generateDirectionsLink = (
  destLat: number, 
  destLng: number, 
  mode: 'driving' | 'walking' = 'driving'
) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    // Apple Maps deep link
    return `http://maps.apple.com/?daddr=${destLat},${destLng}&dirflg=${mode === 'driving' ? 'd' : 'w'}`;
  } else {
    // Google Maps universal link with routing
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=${mode}`;
  }
};

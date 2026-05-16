import { Facility, OverpassResponseSchema } from "../types/facility";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export function buildRobustQuery(lat: number, lng: number, radius = 5000) {
  return `
    [out:json][timeout:25];
    (
      nwr["amenity"~"hospital|clinic|doctors|dentist|pharmacy"](around:${radius},${lat},${lng});
      nwr["healthcare"](around:${radius},${lat},${lng});
      nwr["emergency"~"yes|hospital"](around:${radius},${lat},${lng});
    );
    out center;
  `;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return (R * c).toFixed(1);
}

const AMENITY_LABEL: Record<string, string> = { 
  hospital: "Hospital", 
  clinic: "Clinic", 
  doctors: "General Practice", 
  dentist: "Dentist", 
  pharmacy: "Pharmacy" 
};

export async function fetchNearbyFacilities(lat: number, lng: number): Promise<Facility[]> {
  const query = buildRobustQuery(lat, lng);
  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch facilities from Overpass API");
  }

  const data = await response.json();
  const parsedData = OverpassResponseSchema.parse(data);

  // Normalize and merge duplicates (basic normalization by name and coords distance could be added here)
  const facilities = parsedData.elements
    .filter(el => el.tags && el.tags.name)
    .map(el => {
      const eLat = el.lat ?? el.center?.lat ?? 0;
      const eLng = el.lon ?? el.center?.lon ?? 0;
      const amenity = el.tags?.amenity || "clinic";
      
      const addrComponents = [
        el.tags?.["addr:housenumber"],
        el.tags?.["addr:street"],
        el.tags?.["addr:suburb"],
        el.tags?.["addr:city"]
      ].filter(Boolean);
      
      const addr = addrComponents.length > 0 ? addrComponents.join(", ") : undefined;

      return {
        id: String(el.id),
        name: el.tags!.name,
        amenity,
        specialization: AMENITY_LABEL[amenity] || "Healthcare",
        address: addr || el.tags?.["addr:full"] || "Address unavailable",
        phone: el.tags?.phone || el.tags?.["contact:phone"] || "",
        website: el.tags?.website || el.tags?.["contact:website"] || "",
        distance: calculateDistance(lat, lng, eLat, eLng),
        lat: eLat,
        lng: eLng,
      };
    })
    .filter(f => f.name.length > 3 && !f.name.toLowerCase().includes("subcentre") && !f.name.toLowerCase().includes("sub centre") && !f.name.toLowerCase().includes("sub-centre"))
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    .slice(0, 50); // increased limit to 50

  return facilities;
}

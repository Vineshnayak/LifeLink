import { Facility } from "../types/facility";

const mockHospitals = [
  { name: "Apollo Spectra Hospitals", amenity: "hospital", specialization: "Multi-specialty Hospital" },
  { name: "KIMS Hospitals", amenity: "hospital", specialization: "General Hospital" },
  { name: "Care Hospitals", amenity: "hospital", specialization: "Cardiology & Orthopedics" },
  { name: "Yashoda Hospitals", amenity: "hospital", specialization: "Multi-specialty" },
  { name: "Sunshine Hospitals", amenity: "hospital", specialization: "Orthopedics & Trauma" },
];

const mockClinics = [
  { name: "HealthSpring Family Clinic", amenity: "clinic", specialization: "Primary Care Clinic" },
  { name: "PrimeCare Medical Center", amenity: "clinic", specialization: "General Practice" },
  { name: "Astra Healthcare", amenity: "clinic", specialization: "Diagnostics & Clinic" },
  { name: "City Health Clinic", amenity: "clinic", specialization: "Family Medicine" },
  { name: "Lifeline Poly Clinic", amenity: "clinic", specialization: "Multi-specialty Clinic" },
];

const mockPharmacies = [
  { name: "Apollo Pharmacy", amenity: "pharmacy", specialization: "24/7 Pharmacy" },
  { name: "MedPlus Pharmacy", amenity: "pharmacy", specialization: "Pharmacy & Wellness" },
  { name: "Wellness Forever", amenity: "pharmacy", specialization: "Day/Night Pharmacy" },
  { name: "Guardian Pharmacy", amenity: "pharmacy", specialization: "Prescription & OTC" },
];

const mockDentists = [
  { name: "Clove Dental", amenity: "dentist", specialization: "Advanced Dentistry" },
  { name: "Smile Care Clinic", amenity: "dentist", specialization: "Orthodontics & Dental" },
  { name: "Partha Dental", amenity: "dentist", specialization: "Dental & Maxillofacial" },
];

const mockDoctors = [
  { name: "Dr. Reddy's Family Practice", amenity: "doctors", specialization: "General Practice" },
  { name: "Apex Physicians", amenity: "doctors", specialization: "General Medicine" },
];

const allMockNames = [...mockHospitals, ...mockClinics, ...mockPharmacies, ...mockDentists, ...mockDoctors];

// Generate deterministic random numbers based on seed (coordinates)
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export async function fetchNearbyFacilitiesMock(lat: number, lng: number): Promise<Facility[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const results: Facility[] = [];
  
  // We'll generate exactly 15 highly realistic results around the user's coordinates
  for (let i = 0; i < 15; i++) {
    // Generate a pseudo-random seed based on lat, lng and index
    const seed = Math.floor((lat + lng) * 10000) + i;
    
    const facilityTemplate = allMockNames[Math.floor(seededRandom(seed) * allMockNames.length)];
    
    // Slight offset from original lat lng (roughly within 5km)
    // 0.01 deg is approx 1km
    const latOffset = (seededRandom(seed + 1) - 0.5) * 0.08;
    const lngOffset = (seededRandom(seed + 2) - 0.5) * 0.08;
    
    const eLat = lat + latOffset;
    const eLng = lng + lngOffset;
    
    // Calculate distance
    const distanceKm = calculateDistance(lat, lng, eLat, eLng);
    
    const phone = `+91 ${Math.floor(8000000000 + seededRandom(seed + 3) * 1999999999)}`;
    
    results.push({
      id: `mock-${seed}-${i}`,
      name: facilityTemplate.name,
      amenity: facilityTemplate.amenity,
      specialization: facilityTemplate.specialization,
      address: `${Math.floor(seededRandom(seed + 4) * 100) + 1}, Main Road, Near Metro Pillar ${Math.floor(seededRandom(seed + 5) * 1000)}, City Center`,
      phone: phone,
      website: `https://www.${facilityTemplate.name.replace(/\s+/g, '').toLowerCase()}.com`,
      distance: distanceKm,
      lat: eLat,
      lng: eLng,
    });
  }

  // Sort by distance
  return results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
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

// 두 지점 간의 거리 계산 (Haversine 공식)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // 거리 (km)
  return distance;
};

// 가장 가까운 쉼터 필터링
export const filterNearbyShelters = (shelterList, userLocation) => {
  return shelterList.filter(shelter => {
    if (!shelter.lat || !shelter.lon) return false;
    return true;
  }).map(shelter => ({
    ...shelter,
    distance: calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      parseFloat(shelter.lat), 
      parseFloat(shelter.lon)
    )
  })).sort((a, b) => a.distance - b.distance)
  .slice(0, 10);
};

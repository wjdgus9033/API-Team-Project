import { useCallback } from 'react';

export default function useDistanceUtils() {
  // 두 지점 간의 거리 계산 (Haversine formula)
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // 거리 정보를 포함한 쉼터 데이터 생성 및 정렬
  const addDistanceAndSort = useCallback((shelters, currentLocation) => {
    if (!currentLocation) {
      // 현재 위치가 없으면 원본 순서 유지 (거리 정보 없음)
      return shelters;
    }

    return shelters.map(shelter => ({
      ...shelter,
      distance: shelter.lat && shelter.lon && shelter.lat !== 0 && shelter.lon !== 0
        ? calculateDistance(currentLocation.lat, currentLocation.lng, shelter.lat, shelter.lon)
        : null
    })).sort((a, b) => {
      // 거리 정보가 있는 쉼터를 우선적으로, 그 다음은 거리 순으로 정렬
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }, [calculateDistance]);

  return {
    calculateDistance,
    addDistanceAndSort
  };
}

import { useState, useEffect } from 'react';

export const useCurrentLocation = (geocoder, defaultLocation) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('위치 정보를 가져오는 중...');

  // 좌표를 주소로 변환하는 함수
  const getAddressFromCoords = (lat, lng) => {
    if (!geocoder) return;
    
    const coord = new window.kakao.maps.LatLng(lat, lng);
    
    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0];
        if (address.road_address) {
          setCurrentAddress(address.road_address.address_name);
        } else if (address.address) {
          setCurrentAddress(address.address.address_name);
        }
      } else {
        setCurrentAddress('주소를 찾을 수 없습니다');
      }
    });
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          getAddressFromCoords(location.lat, location.lng);
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          setCurrentLocation(defaultLocation);
        }
      );
    } else {
      setCurrentLocation(defaultLocation);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, [geocoder]);

  return {
    currentLocation,
    currentAddress,
    getCurrentLocation,
    getAddressFromCoords
  };
};

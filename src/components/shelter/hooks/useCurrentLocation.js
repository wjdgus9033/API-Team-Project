import { useState, useCallback } from 'react';

export default function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            setCurrentLocation({ lat, lng });
            console.log('현재 위치 가져오기 성공:', { lat, lng });
            
            // 좌표를 주소로 변환
            if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
              const geocoder = new window.kakao.maps.services.Geocoder();
              const coord = new window.kakao.maps.LatLng(lat, lng);
              
              geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const address = result[0].address.address_name;
                  setCurrentAddress(address);
                  console.log('현재 주소:', address);
                }
              });
            }
            
            resolve({ lat, lng });
          },
          (error) => {
            console.error('위치 가져오기 실패:', error);
            const errorMessage = '위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.';
            reject(new Error(errorMessage));
          }
        );
      } else {
        const errorMessage = '이 브라우저는 위치 서비스를 지원하지 않습니다.';
        reject(new Error(errorMessage));
      }
    });
  }, []);

  return {
    currentLocation,
    currentAddress,
    getCurrentLocation,
    setCurrentLocation,
    setCurrentAddress
  };
}

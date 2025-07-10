import { useEffect, useState } from 'react';

export const useKakaoMap = (mapContainer, defaultLocation) => {
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [infowindow, setInfowindow] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(defaultLocation.lat, defaultLocation.lng),
          level: 5
        };

        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(kakaoMap);

        const info = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        setInfowindow(info);

        const ps = new window.kakao.maps.services.Places();
        setPlacesService(ps);
        
        const geo = new window.kakao.maps.services.Geocoder();
        setGeocoder(geo);
      });
    };

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return { map, geocoder, placesService, infowindow };
};

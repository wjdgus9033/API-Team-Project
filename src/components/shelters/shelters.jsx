import { useEffect, useState, useRef } from "react";
import { useKakaoMap, useCurrentLocation, useSheltersData, filterNearbyShelters } from './hooks';
import { MapComponent } from './map';
import { SearchComponent } from './search';
import { LocationInfo } from './locate';
import { SheltersList } from './list';
import './Shelters.css'; 

export default function Shelters() {
  const [nearbyShelters, setNearbyShelters] = useState([]);
  const [searchCategory, setSearchCategory] = useState('shelter');
  
  const mapContainer = useRef(null);
  const defaultLocation = {
    lat: 37.3007,
    lng: 127.0107
  };

  // 커스텀 훅
  const { map, geocoder, placesService, infowindow } = useKakaoMap(mapContainer, defaultLocation);
  const { currentLocation, currentAddress, getCurrentLocation } = useCurrentLocation(geocoder, defaultLocation);
  const { shelters, error } = useSheltersData();

  // 무더위쉼터, 현재 위치 - 카테고리에 따라 다르게
  useEffect(() => {
    if (shelters.length > 0 && currentLocation && searchCategory === 'shelter') {
      const nearby = filterNearbyShelters(shelters, currentLocation);
      setNearbyShelters(nearby);
    }
  }, [shelters, currentLocation, searchCategory]);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* 지도 영역 */}
      <div style={{ flex: 1 }}>
        <MapComponent 
          mapContainer={mapContainer}
          map={map}
          currentLocation={currentLocation}
          currentAddress={currentAddress} // 추가
          nearbyShelters={nearbyShelters}
          infowindow={infowindow}
        />
        
        <LocationInfo
          currentAddress={currentAddress}
          getCurrentLocation={getCurrentLocation}
          nearbyShelters={nearbyShelters}
          searchCategory={searchCategory}
        />

        <SearchComponent
          placesService={placesService}
          infowindow={infowindow}
          map={map}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          currentLocation={currentLocation}
          shelters={shelters}
          setNearbyShelters={setNearbyShelters}
        />
      </div>

      {/* 가까운 쉼터 목록 영역 */}
      <SheltersList
        nearbyShelters={nearbyShelters}
        searchCategory={searchCategory}
        error={error}
      />
    </div>
  );
}
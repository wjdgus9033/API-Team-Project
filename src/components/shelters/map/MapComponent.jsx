import { useState, useEffect } from 'react';

export default function MapComponent({ 
  mapContainer, 
  map, 
  currentLocation, 
  currentAddress, // 추가
  nearbyShelters, 
  infowindow 
}) {
  const [markers, setMarkers] = useState([]);

  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const addShelterMarker = (position, shelter) => {
    const marker = new window.kakao.maps.Marker({
      position: position
    });
    
    marker.setMap(map);
    setMarkers(prev => [...prev, marker]);
    
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      const content = `
        <div style="padding:10px;z-index:1;min-width:200px;
          max-width:200px;
          word-wrap:break-word;">
          <strong>${shelter.name}</strong><br/>
          <small>${shelter.address}</small><br/>
          <span style="color:blue;">거리: ${shelter.distance?.toFixed(2)}km</span>
        </div> 
      `;
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });

    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindow.close();
    });
    
    return marker;
  };

  const displayLocationAndShelters = () => {
    removeMarkers();
    
    // 현재 위치 마커 추가
    if (currentLocation) {
      const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      
      const currentMarker = new window.kakao.maps.Marker({
        position: currentPos,
        image: new window.kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new window.kakao.maps.Size(24, 35)
        )
      });
      currentMarker.setMap(map);
      setMarkers(prev => [...prev, currentMarker]);
      
      window.kakao.maps.event.addListener(currentMarker, 'mouseover', () => {
        const content = `
          <div style="padding:8px;z-index:1;color:red;font-weight:bold;max-width:200px;word-wrap:break-word;">
            <div style="margin-bottom:3px;">📍 현재 위치</div>
            ${currentAddress ? `<div style="font-size:11px;font-weight:normal;color:#666;">${currentAddress}</div>` : ''}
          </div>
        `;
        infowindow.setContent(content);
        infowindow.open(map, currentMarker);
      });

      window.kakao.maps.event.addListener(currentMarker, 'mouseout', () => {
        infowindow.close();
      });
    }
    
    // 근처 쉼터 마커들 추가
    const bounds = new window.kakao.maps.LatLngBounds();
    if (currentLocation) {
      bounds.extend(new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng));
    }
    
    nearbyShelters.forEach((shelter, idx) => {
      if (shelter.lat && shelter.lon) {
        const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lon);
        const marker = addShelterMarker(position, shelter);
        bounds.extend(position);
      }
    });
    
    if (nearbyShelters.length > 0 || currentLocation) {
      map.setBounds(bounds);
    }
  };

  useEffect(() => {
    if (map && currentLocation && nearbyShelters.length > 0) {
      displayLocationAndShelters();
    }
  }, [map, currentLocation, nearbyShelters]);

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
    />
  );
}

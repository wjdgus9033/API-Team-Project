import { useState } from 'react';
import { SEARCH_KEYWORDS, CATEGORY_NAMES } from './searchConstants';
import CategoryButtons from './CategoryButtons';
import SearchResults from './SearchResults';

export default function SearchComponent({ 
  placesService, 
  infowindow, 
  map, 
  searchCategory, 
  setSearchCategory, 
  currentLocation, 
  shelters,
  setNearbyShelters
}) {
  const [keyword, setKeyword] = useState('무더위쉼터');
  const [places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [markers, setMarkers] = useState([]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const filterNearbyShelters = (shelterList, userLocation) => {
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

  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const addMarker = (position, idx, title) => {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = new window.kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao.maps.Size(36, 691),
      spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10),
      offset: new window.kakao.maps.Point(13, 37)
    };
    
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage
    });
    
    marker.setMap(map);
    setMarkers(prev => [...prev, marker]);
    
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      displayInfowindow(marker, title);
    });
    
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindow.close();
    });
    
    return marker;
  };

  const displayInfowindow = (marker, title) => {
    const content = `<div style="padding:5px;z-index:1;">${title}</div>`;
    infowindow.setContent(content);
    infowindow.open(map, marker);
  };

  const displayPlaces = (places, map, infowindow) => {
    removeMarkers();
    const bounds = new window.kakao.maps.LatLngBounds();
    
    places.forEach((place, idx) => {
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(placePosition, idx, place.place_name);
      bounds.extend(placePosition);
    });
    
    map.setBounds(bounds);
  };

  const searchPlaces = (ps, infowindow, map, keyword) => {
    if (!ps) return;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      alert('키워드를 입력해주세요!');
      return;
    }

    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
        setPagination(pagination);
        displayPlaces(data, map, infowindow);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchKeyword = SEARCH_KEYWORDS[searchCategory] || keyword;
    searchPlaces(placesService, infowindow, map, searchKeyword);
  };

  const handleCategoryChange = (category) => {
    setSearchCategory(category);
    const searchKeyword = SEARCH_KEYWORDS[category];
    if (searchKeyword) {
      setKeyword(searchKeyword);
      if (placesService && map && infowindow) {
        searchPlaces(placesService, infowindow, map, searchKeyword);
      }
      
      if (currentLocation) {
        updateNearbyPlacesByCategory(category, searchKeyword);
      }
    }
  };

  const updateNearbyPlacesByCategory = (category, searchKeyword) => {
    if (!placesService || !currentLocation) return;
    
    if (category === 'shelter') {
      if (shelters.length > 0) {
        const nearby = filterNearbyShelters(shelters, currentLocation);
        setNearbyShelters(nearby);
      }
    } else {
      placesService.keywordSearch(searchKeyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
          const placesWithDistance = data.map(place => ({
            name: place.place_name,
            address: place.road_address_name || place.address_name,
            weekday: "운영시간 확인 필요",
            weekend: "운영시간 확인 필요", 
            lat: parseFloat(place.y),
            lon: parseFloat(place.x),
            distance: calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              parseFloat(place.y),
              parseFloat(place.x)
            )
          }));

          const nearbyPlaces = placesWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10);
          
          setNearbyShelters(nearbyPlaces);
        } else {
          setNearbyShelters([]);
        }
      });
    }
  };

  const handlePagination = (page) => {
    if (pagination) {
      pagination.gotoPage(page);
    }
  };

  return (
    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>🔍 더위 피할 곳 찾기</h4>
        
        <CategoryButtons
          searchCategory={searchCategory}
          onCategoryChange={handleCategoryChange}
          categoryNames={CATEGORY_NAMES}
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <label>
          키워드 검색: 
          <input 
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '10px', padding: '5px' }}
          />
        </label>
        <button type="submit">검색하기</button>
      </form>
      
      <SearchResults
        places={places}
        pagination={pagination}
        onPagination={handlePagination}
      />
    </div>
  );
}

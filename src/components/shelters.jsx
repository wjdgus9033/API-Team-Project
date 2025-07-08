import { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Badge,
  Heading,
  Alert,
  AlertIcon,
  AlertDescription,
  List,
  ListItem,
  Divider,
  IconButton,
  useColorModeValue,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { SearchIcon, RepeatIcon } from "@chakra-ui/icons";

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [nearbyShelters, setNearbyShelters] = useState([]);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // 카카오맵 관련 상태
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [keyword, setKeyword] = useState('무더위쉼터');
  const [pagination, setPagination] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  // 수원시 장안구 영화동 좌표
  const defaultLocation = {
    lat: 37.3007,
    lng: 127.0107
  };

  // 두 지점 간의 거리 계산 (Haversine 공식)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
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

  // 1km 이내 쉼터 필터링
  const filterNearbyShelters = (shelterList, userLocation) => {
    return shelterList.filter(shelter => {
      if (!shelter.lat || !shelter.lon) return false;
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        parseFloat(shelter.lat), 
        parseFloat(shelter.lon)
      );
      return distance <= 1; // 1km 이내
    }).map(shelter => ({
      ...shelter,
      distance: calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        parseFloat(shelter.lat), 
        parseFloat(shelter.lon)
      )
    })).sort((a, b) => a.distance - b.distance); // 거리순 정렬
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
          
          // 지도 중심을 현재 위치로 이동
          if (map) {
            const center = new window.kakao.maps.LatLng(location.lat, location.lng);
            map.setCenter(center);
          }
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          // 기본 위치(수원시 장안구 영화동) 사용
          setCurrentLocation(defaultLocation);
        }
      );
    } else {
      // 기본 위치 사용
      setCurrentLocation(defaultLocation);
    }
  };

  // 카카오맵 초기화
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(defaultLocation.lat, defaultLocation.lng),
          level: 5 // 1km 반경을 보기 좋게 조정
        };

        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(kakaoMap);

        const info = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        setInfowindow(info);

        const ps = new window.kakao.maps.services.Places();
        setPlacesService(ps);
      });
    };

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 현재 위치 및 근처 쉼터를 지도에 표시
  useEffect(() => {
    if (map && currentLocation && nearbyShelters.length > 0) {
      displayLocationAndShelters();
    }
  }, [map, currentLocation, nearbyShelters]);

  // 무더위쉼터 및 현재 위치 처리
  useEffect(() => {
    if (shelters.length > 0 && currentLocation) {
      const nearby = filterNearbyShelters(shelters, currentLocation);
      setNearbyShelters(nearby);
    }
  }, [shelters, currentLocation]);

  const fetchShelters = async () => {
    try {
      const key = import.meta.env.VITE_SHELTER_API_KEY;
      const res = await fetch(`/shelter?serviceKey=${key}&pageNo=1&numOfRows=1000&returnType=JSON`);
      const data = await res.json();

      const items = data.body || [];
      if (!Array.isArray(items)) throw new Error("목록이 없습니다.");

      const parsed = items.map(item => ({
        name: item.RSTR_NM,
        address: item.RN_DTL_ADRES || item.DTL_ADRES,
        weekday: `${item.WKDAY_OPER_BEGIN_TIME || "-"} ~ ${item.WKDAY_OPER_END_TIME || "-"}`,
        weekend:
          item.CHCK_MATTER_WKEND_HDAY_OPN_AT === "N" ||
            !item.WKEND_HDAY_OPER_BEGIN_TIME ||
            !item.WKEND_HDAY_OPER_END_TIME
            ? "주말 휴일"
            : `${item.WKEND_HDAY_OPER_BEGIN_TIME} ~ ${item.WKEND_HDAY_OPER_END_TIME}`,
        lat: item.LA ?? 0,
        lon: item.LO ?? 0,
      }));

      setShelters(parsed);
    } catch (err) {
      console.error("에러 발생:", err);
      setError("무더위쉼터 정보를 불러오지 못했습니다.");
    }
  };

  const displayLocationAndShelters = () => {
    removeMarkers();
    
    // 현재 위치 마커 추가
    if (currentLocation) {
      const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      
      // 현재 위치 마커 (빨간색)
      const currentMarker = new window.kakao.maps.Marker({
        position: currentPos,
        image: new window.kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new window.kakao.maps.Size(24, 35)
        )
      });
      currentMarker.setMap(map);
      setMarkers(prev => [...prev, currentMarker]);
      
      // 현재 위치 정보창
      window.kakao.maps.event.addListener(currentMarker, 'click', () => {
        const content = '<div style="padding:5px;z-index:1;color:red;font-weight:bold;">현재 위치</div>';
        infowindow.setContent(content);
        infowindow.open(map, currentMarker);
      });

      // 1km 반경 원 그리기
      const circle = new window.kakao.maps.Circle({
        center: currentPos,
        radius: 1000, // 1km
        strokeWeight: 2,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        fillColor: '#FF0000',
        fillOpacity: 0.1
      });
      circle.setMap(map);
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

  const addShelterMarker = (position, shelter) => {
    // 쉼터 마커 (파란색)
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
        new window.kakao.maps.Size(36, 37),
        {
          spriteSize: new window.kakao.maps.Size(36, 691),
          spriteOrigin: new window.kakao.maps.Point(0, 10),
          offset: new window.kakao.maps.Point(13, 37)
        }
      )
    });
    
    marker.setMap(map);
    setMarkers(prev => [...prev, marker]);
    
    window.kakao.maps.event.addListener(marker, 'click', () => {
      const content = `
        <div style="padding:10px;z-index:1;min-width:200px;">
          <strong>${shelter.name}</strong><br/>
          <small>${shelter.address}</small><br/>
          <span style="color:blue;">거리: ${shelter.distance?.toFixed(2)}km</span>
        </div>
      `;
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });
    
    return marker;
  };

  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  // 컴포넌트 초기화
  useEffect(() => {
    fetchShelters();
    getCurrentLocation();
  }, []);

  // 카카오맵 관련 함수들 (기존 검색 기능 유지)
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
    searchPlaces(placesService, infowindow, map, keyword);
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

  const handlePagination = (page) => {
    if (pagination) {
      pagination.gotoPage(page);
    }
  };

  // 색상 테마
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Container maxW="container.xl" py={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* 헤더 */}
        <Box textAlign="center" mb={4}>
          <Heading as="h1" size="xl" color="blue.600" mb={2}>
            🏠 무더위쉼터 찾기
          </Heading>
          <Text color="gray.600" fontSize="lg">
            현재 위치 기반 1km 이내 무더위쉼터를 찾아드립니다
          </Text>
        </Box>

        {/* 통계 정보 */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
            <StatLabel>📍 현재 위치</StatLabel>
            <StatNumber fontSize="md">
              {currentLocation ? 
                `위도 ${currentLocation.lat.toFixed(4)}` : 
                '위치 정보 가져오는 중...'
              }
            </StatNumber>
            <StatHelpText>
              {currentLocation ? `경도 ${currentLocation.lng.toFixed(4)}` : ''}
            </StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
            <StatLabel>🏠 근처 쉼터</StatLabel>
            <StatNumber color="green.500">{nearbyShelters.length}개</StatNumber>
            <StatHelpText>1km 이내 발견</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
            <StatLabel>🔍 검색 결과</StatLabel>
            <StatNumber color="blue.500">{places.length}개</StatNumber>
            <StatHelpText>키워드 검색</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          {/* 지도 영역 */}
          <VStack flex={1} spacing={4}>
            <Card w="100%" bg={cardBg}>
              <CardBody p={4}>
                <Box 
                  ref={mapContainer} 
                  w="100%" 
                  h="500px" 
                  borderRadius="md"
                  border="2px solid"
                  borderColor={borderColor}
                />
              </CardBody>
            </Card>
            
            {/* 현재 위치 컨트롤 */}
            <Card w="100%" bg="green.50" borderColor="green.200" border="1px">
              <CardBody>
                <VStack spacing={3}>
                  <HStack justify="space-between" w="100%">
                    <Text fontWeight="bold" color="green.700">
                      📍 현재 위치 정보
                    </Text>
                    <Button 
                      size="sm"
                      colorScheme="green"
                      leftIcon={<RepeatIcon />}
                      onClick={getCurrentLocation}
                    >
                      위치 새로고침
                    </Button>
                  </HStack>
                  <Text fontSize="sm" color="green.600">
                    {currentLocation ? 
                      `위도 ${currentLocation.lat.toFixed(4)}, 경도 ${currentLocation.lng.toFixed(4)}` : 
                      '위치 정보를 가져오는 중...'
                    }
                  </Text>
                  <Badge colorScheme="green" fontSize="sm">
                    🏠 1km 이내 무더위쉼터: {nearbyShelters.length}개 발견
                  </Badge>
                </VStack>
              </CardBody>
            </Card>

            {/* 검색 폼 */}
            <Card w="100%" bg={cardBg}>
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md" color="blue.600">🔍 키워드 검색</Heading>
                  <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <VStack spacing={3}>
                      <FormControl>
                        <FormLabel>검색 키워드</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.300" />
                          </InputLeftElement>
                          <Input 
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="예: 무더위쉼터, 도서관, 카페"
                          />
                        </InputGroup>
                      </FormControl>
                      <Button type="submit" colorScheme="blue" w="100%">
                        검색하기
                      </Button>
                    </VStack>
                  </form>
                  
                  {/* 검색 결과 목록 */}
                  {places.length > 0 && (
                    <Box w="100%">
                      <Heading size="sm" mb={3} color="blue.600">검색 결과</Heading>
                      <Box maxH="200px" overflowY="auto" border="1px" borderColor={borderColor} borderRadius="md" p={2}>
                        <List spacing={2}>
                          {places.map((place, i) => (
                            <ListItem key={i} p={2} bg="blue.50" borderRadius="md">
                              <Text fontWeight="bold" color="blue.800">{place.place_name}</Text>
                              <Text fontSize="sm" color="gray.600">
                                {place.road_address_name || place.address_name}
                              </Text>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      
                      {/* 페이지네이션 */}
                      {pagination && (
                        <HStack spacing={2} justify="center" mt={3}>
                          {[...Array(pagination.last)].map((_, i) => (
                            <Button
                              key={i}
                              size="sm"
                              onClick={() => handlePagination(i + 1)}
                              colorScheme={pagination.current === (i + 1) ? 'blue' : 'gray'}
                              variant={pagination.current === (i + 1) ? 'solid' : 'outline'}
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </HStack>
                      )}
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* 근처 무더위쉼터 목록 영역 */}
          <VStack flex={1} spacing={4} align="stretch">
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="lg" color="blue.600">
                      🏠 근처 무더위쉼터
                    </Heading>
                    <Badge colorScheme="blue" fontSize="lg" p={2}>
                      {nearbyShelters.length}개
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    * 현재 위치에서 1km 이내의 쉼터만 표시됩니다
                  </Text>
                  <Divider />
                </VStack>
              </CardBody>
            </Card>
            
            {error && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {nearbyShelters.length === 0 && !error && (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <AlertDescription>
                  1km 이내에 무더위쉼터가 없습니다.
                </AlertDescription>
              </Alert>
            )}
            
            <VStack spacing={4} maxH="500px" overflowY="auto" pr={2}>
              {nearbyShelters.map((s, idx) => (
                <Card 
                  key={idx} 
                  w="100%"
                  bg={cardBg}
                  borderColor="blue.200"
                  border="2px solid"
                  _hover={{ 
                    borderColor: "blue.400", 
                    shadow: "lg",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s"
                  }}
                >
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between" align="flex-start">
                        <Heading size="md" color="blue.700" flex={1}>
                          {s.name}
                        </Heading>
                        <Badge 
                          colorScheme="green" 
                          fontSize="sm"
                          p={2}
                          borderRadius="full"
                        >
                          {s.distance?.toFixed(2)}km
                        </Badge>
                      </HStack>
                      
                      <VStack align="stretch" spacing={2}>
                        <HStack>
                          <Text fontSize="lg">📍</Text>
                          <Text fontSize="sm" color="gray.600">{s.address}</Text>
                        </HStack>
                        
                        <HStack>
                          <Text fontSize="lg">🕒</Text>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm">
                              <Text as="span" fontWeight="bold">평일:</Text> {s.weekday}
                            </Text>
                            <Text fontSize="sm">
                              <Text as="span" fontWeight="bold">주말:</Text> 
                              <Badge 
                                ml={2} 
                                colorScheme={s.weekend === "주말 휴일" ? "red" : "green"}
                                size="sm"
                              >
                                {s.weekend}
                              </Badge>
                            </Text>
                          </VStack>
                        </HStack>
                        
                        <HStack>
                          <Text fontSize="lg">📌</Text>
                          <Text fontSize="xs" color="gray.400">
                            좌표: {s.lat}, {s.lon}
                          </Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </VStack>
        </Flex>
      </VStack>
    </Container>
  );
}
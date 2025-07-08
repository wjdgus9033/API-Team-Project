// src/components/KakaoMapSearch.jsx
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './maps.css'


const Kakaomap = () => {
  const mapRef = useRef(null)
  const [keyword, setKeyword] = useState('이태원 맛집')
  const [places, setPlaces] = useState([])

  const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_MAP_KEY
  const KAKAO_REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY

  useEffect(() => {
    // Kakao Maps script 추가
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        }
        const map = new window.kakao.maps.Map(container, options)
        drawMarkers(map)
      })
    }
    document.head.appendChild(script)
  }, [places])

  const drawMarkers = (map) => {
    const bounds = new window.kakao.maps.LatLngBounds()
    places.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x)
      bounds.extend(position)

      const marker = new window.kakao.maps.Marker({
        position,
      })

      marker.setMap(map)

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${place.place_name}</div>`,
      })

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.open(map, marker)
      })
      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close()
      })
    })

    map.setBounds(bounds)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_KEY}`,
        },
        params: {
          query: keyword,
        },
      })
      setPlaces(response.data.documents)
    } catch (error) {
      console.error('검색 실패:', error)
      alert('검색에 실패했습니다.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <label>키워드: </label>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <button type="submit">검색하기</button>
      </form>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <ul style={{ flex: 1 }}>
          {places.map((place, index) => (
            <li key={index}>
              <strong>{place.place_name}</strong>
              <br />
              {place.road_address_name || place.address_name}
              <br />
              {place.phone}
            </li>
          ))}
        </ul>

        <div ref={mapRef} style={{ width: '500px', height: '400px', flexShrink: 0 }} />
      </div>
    </div>
  )
}

export default Kakaomap
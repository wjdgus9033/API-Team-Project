import { useState, useEffect, useCallback } from 'react';
import { useDistanceUtils } from '../hooks';

export default function useFilteredData(shelterData, selectedRegion, searchKeyword, currentLocation) {
  const [filteredData, setFilteredData] = useState([]);
  const { addDistanceAndSort } = useDistanceUtils();

  // 지역 및 검색 필터링
  const filterData = useCallback(() => {
    let filtered = [...shelterData];

    // 지역 필터링
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(item => item.region === selectedRegion);
    }

    // 검색어 필터링
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword) ||
        item.roadAddress.toLowerCase().includes(keyword) ||
        item.detailAddress.toLowerCase().includes(keyword)
      );
    }

    // 현재 위치가 있으면 거리 계산 및 정렬
    filtered = addDistanceAndSort(filtered, currentLocation);

    setFilteredData(filtered);
  }, [shelterData, selectedRegion, searchKeyword, currentLocation, addDistanceAndSort]);

  // 지역이나 검색어, 현재 위치 변경 시 필터링
  useEffect(() => {
    if (shelterData.length > 0) {
      filterData();
    }
  }, [filterData]);

  return filteredData;
}

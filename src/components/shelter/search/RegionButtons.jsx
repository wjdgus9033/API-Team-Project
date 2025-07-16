import React from 'react';

const REGIONS = [
  // 첫 번째 줄
  [
    { key: 'all', label: '🏠 전체' },
    { key: 'seoul', label: '🏛️ 서울' },
    { key: 'gyeonggi', label: '🌆 경기' },
    { key: 'incheon', label: '🌊 인천' },
    { key: 'busan', label: '🌊 부산' },
    { key: 'daegu', label: '🌸 대구' },
    { key: 'daejeon', label: '🏢 대전' },
    { key: 'gwangju', label: '🌿 광주' },
    { key: 'ulsan', label: '🏭 울산' }
  ],
  // 두 번째 줄
  [
    { key: 'sejong', label: '🏛️ 세종' },
    { key: 'gangwon', label: '⛰️ 강원' },
    { key: 'chungbuk', label: '🏔️ 충북' },
    { key: 'chungnam', label: '🌾 충남' },
    { key: 'jeonbuk', label: '🌾 전북' },
    { key: 'jeonnam', label: '🌊 전남' },
    { key: 'gyeongbuk', label: '🏔️ 경북' },
    { key: 'gyeongnam', label: '🌊 경남' },
    { key: 'jeju', label: '🏝️ 제주' }
  ]
];

export default function RegionButtons({ selectedRegion, setSelectedRegion, regionStats = {} }) {
  return (
    <div className="region-section">
      {REGIONS.map((regionRow, rowIndex) => (
        <div key={rowIndex} className="region-row">
          {regionRow.map(region => (
            <button
              key={region.key}
              onClick={() => setSelectedRegion(region.key)}
              className={`region-button ${selectedRegion === region.key ? 'selected' : 'unselected'}`}
            >
              {region.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

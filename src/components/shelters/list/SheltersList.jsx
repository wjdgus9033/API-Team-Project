import ShelterCard from './ShelterCard';
import { CATEGORY_NAMES } from '../search/searchConstants';

export default function SheltersList({ 
  nearbyShelters, 
  searchCategory, 
  error 
}) {

  return (
    <div style={{ flex: 1, maxHeight: '1100px', overflowY: 'auto' }}>
      <h2>🏠 가장 가까운 {CATEGORY_NAMES[searchCategory] || '쉼터'} 목록 ({nearbyShelters.length}개)</h2>
      <p style={{ fontSize: '14px', color: '#666' }}>
        * 현재 위치에서 가장 가까운 {CATEGORY_NAMES[searchCategory] || '무더위 쉼터'} 10개를 거리순으로 표시합니다
      </p>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {nearbyShelters.length === 0 && !error && (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          근처에 이용 가능한 {CATEGORY_NAMES[searchCategory]?.replace(/🏠|👴|🏢|🏥|📚|🛍️|☕|🔍/, '').trim() || '시설'}이 없습니다.
        </p>
      )}
      
      {nearbyShelters.map((shelter, idx) => (
        <ShelterCard key={idx} shelter={shelter} index={idx} />
      ))}
    </div>
  );
}

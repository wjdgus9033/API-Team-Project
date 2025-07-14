import { CATEGORY_NAMES } from '../search/searchConstants';

export default function LocationInfo({ 
  currentAddress, 
  getCurrentLocation,  
  searchCategory 
}) {

  return (
    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8' }}>
      <div style={{ marginBottom: '10px' }}>
        <strong>📍 현재 위치:</strong> 
        {currentAddress}
        <button 
          onClick={getCurrentLocation}
          style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
        >
          📍 현재 위치 새로고침
        </button>
      </div>
      <div>
        <strong>
          {CATEGORY_NAMES[searchCategory]?.split(' ')[0] || '🏠'} 
          {CATEGORY_NAMES[searchCategory]?.replace(/🏠|👴|🏢|🏥|📚|🛍️|☕|🔍/, '').trim() || '시설'} 
          </strong>
      </div>
    </div>
  );
}

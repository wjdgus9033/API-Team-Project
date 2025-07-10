export default function ShelterCard({ shelter, index }) {
  return (
    <div 
      style={{ 
        marginBottom: "1rem", 
        padding: "15px", 
        border: "2px solid #e3f2fd",
        borderRadius: "8px",
        backgroundColor: "#f8f9ff"
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <strong style={{ color: '#1976d2', fontSize: '16px' }}>{shelter.name}</strong>
        <span style={{ 
          backgroundColor: '#4caf50', 
          color: 'white', 
          padding: '2px 8px', 
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {shelter.distance?.toFixed(2)}km
        </span>
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: '1.4' }}>
        📍 {shelter.address}<br />
        🕒 평일: {shelter.weekday}<br />
        🕒 주말: {shelter.weekend}<br />
        📞 전화번호: {shelter.tel || '정보 없음'}
      </div>
    </div>
  );
}

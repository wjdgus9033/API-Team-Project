import poster from '../image/poster.jpg';

export default function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src={poster}
        alt="폭염 안내 포스터"
        style={{ width: '600px', height: 'auto' }}
      />
      <div style={{ width: '600px', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>
        출처: 행정안전부 기후재난관리과
      </div>
    </div>

  )
}

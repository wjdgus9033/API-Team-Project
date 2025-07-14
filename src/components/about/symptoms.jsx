import "./symptoms.css"

export default function Symptoms() {
  return (
    <div className="symptomscard">
      <div className="symptomscard-header">
        <h2>🌡️ 폭염 관련(온열 질환) 주요 질환</h2>
        <table border="1" className="symptomscard-table">
          <thead>
            <tr>
              <th>질환명</th>
              <th>주요 증상</th>
              <th>설명</th>
              <th>응급 대처법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>열사병 (Heat Stroke)</td>
              <td>의식 저하, 혼수, 체온 40℃ 이상, 발한 없음</td>
              <td>체온 조절 기능이 마비되어 급격한 고체온이 발생하는 가장 위험한 온열질환</td>
              <td>즉시 119 신고, 서늘한 곳으로 이동, 옷 벗기고 얼음팩 등으로 체온 낮추기</td>
            </tr>
            <tr>
              <td>열탈진 (Heat Exhaustion)</td>
              <td>어지러움, 식은땀, 구토, 전신 무기력</td>
              <td>수분과 염분 손실로 인한 순환계 이상</td>
              <td>그늘에서 안정, 이온음료 섭취, 눕혀서 휴식</td>
            </tr>
            <tr>
              <td>열경련 (Heat Cramps)</td>
              <td>근육 경련 (종아리, 복부 등)</td>
              <td>심한 땀 배출로 인한 체내 염분 결핍</td>
              <td>이온음료 섭취, 스트레칭, 마사지</td>
            </tr>
            <tr>
              <td>열실신 (Heat Syncope)</td>
              <td>실신, 순간적 의식 소실</td>
              <td>체온 증가로 말초 혈관 확장 → 뇌로 가는 혈류 감소</td>
              <td>눕히고 다리 올리기, 시원한 곳에서 휴식</td>
            </tr>
            <tr>
              <td>햇볕화상 (Sunburn)</td>
              <td>붉은 피부, 물집, 통증</td>
              <td>자외선에 과도하게 노출된 피부의 손상</td>
              <td>찬물로 식히고 보습제, 심하면 병원 진료</td>
            </tr>
            <tr>
              <td>열발진 (Heat Rash)</td>
              <td>땀띠, 피부 가려움</td>
              <td>땀이 배출되지 않아 땀샘이 막히는 증상</td>
              <td>시원한 옷 착용, 샤워, 통풍 유지</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ textAlign: "right", fontSize: "12px", marginTop: "8px" }}>
        ※ 출처: 질병관리청, 기상청 자료 요약
      </p>
    </div>
  );
}

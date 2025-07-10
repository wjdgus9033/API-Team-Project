export default function Symptoms() {
  const cellStyle = {
    padding: "12px",
    wordBreak: "break-word",
    whiteSpace: "normal",
    lineHeight: "1.4",
  };

  const headerStyle = {
    ...cellStyle,
    fontWeight: "bold",
    textAlign: "center",
  };

  return (
    <>
      <h2 style={{ marginBottom: "15px" }}>🌡️ 폭염 관련 주요 질환</h2>
      <table
        border="1"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          tableLayout: "fixed",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={{ ...headerStyle, backgroundColor: "#fdd9d7" }}>질환명</th>
            <th style={{ ...headerStyle, backgroundColor: "#fde2db" }}>주요 증상</th>
            <th style={{ ...headerStyle, backgroundColor: "#fff1e6" }}>설명</th>
            <th style={{ ...headerStyle, backgroundColor: "#f0f4c3" }}>응급 대처법</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>열사병 (Heat Stroke)</td>
            <td style={cellStyle}>
              의식 저하, 혼수, 체온 40℃ 이상, 발한 없음
            </td>
            <td style={cellStyle}>
              체온 조절 기능이 마비되어 급격한 고체온이 발생하는 가장 위험한 온열질환
            </td>
            <td style={cellStyle}>
              즉시 119 신고, 서늘한 곳으로 이동, 옷 벗기고 얼음팩 등으로 체온 낮추기
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>열탈진 (Heat Exhaustion)</td>
            <td style={cellStyle}>어지러움, 식은땀, 구토, 전신 무기력</td>
            <td style={cellStyle}>
              수분과 염분 손실로 인한 순환계 이상
            </td>
            <td style={cellStyle}>
              그늘에서 안정, 이온음료 섭취, 눕혀서 휴식
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>열경련 (Heat Cramps)</td>
            <td style={cellStyle}>근육 경련 (종아리, 복부 등)</td>
            <td style={cellStyle}>
              심한 땀 배출로 인한 체내 염분 결핍
            </td>
            <td style={cellStyle}>
              이온음료 섭취, 스트레칭, 마사지
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>열실신 (Heat Syncope)</td>
            <td style={cellStyle}>실신, 순간적 의식 소실</td>
            <td style={cellStyle}>
              체온 증가로 말초 혈관 확장 → 뇌로 가는 혈류 감소
            </td>
            <td style={cellStyle}>
              눕히고 다리 올리기, 시원한 곳에서 휴식
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>햇볕화상 (Sunburn)</td>
            <td style={cellStyle}>붉은 피부, 물집, 통증</td>
            <td style={cellStyle}>
              자외선에 과도하게 노출된 피부의 손상
            </td>
            <td style={cellStyle}>
              찬물로 식히고 보습제, 심하면 병원 진료
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>열발진 (Heat Rash)</td>
            <td style={cellStyle}>땀띠, 피부 가려움</td>
            <td style={cellStyle}>
              땀이 배출되지 않아 땀샘이 막히는 증상
            </td>
            <td style={cellStyle}>
              시원한 옷 착용, 샤워, 통풍 유지
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ textAlign: "right", fontSize: "12px", marginTop: "8px" }}>
        ※ 출처: 질병관리청, 기상청 자료 요약
      </p>
    </>
  );
}

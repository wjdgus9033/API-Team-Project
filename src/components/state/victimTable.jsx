// VictimTable.jsx
export default function VictimTable({ rows }) {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        연도별 폭염으로 인한 피해자 수 (표)
      </h1>
      <div style={{ display: "flex", justifyContent: "space-around", padding: 20, gap: 20 }}>
        <table border="1" cellPadding="8" style={{ width: "90%" }}>
          <thead>
            <tr>
              <th>항목</th>
              {rows.map((r, i) => (
                <th key={i}>{r.year}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ textAlign: "center", verticalAlign: "middle" }}>
            <tr>
              <td>총 피해자</td>
              {rows.map((r, i) => (
                <td key={i}>{Number(r.total).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>외부 피해자</td>
              {rows.map((r, i) => (
                <td key={i}>{Number(r.outdoor).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>내부 피해자</td>
              {rows.map((r, i) => (
                <td key={i}>{Number(r.indoor).toLocaleString()}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

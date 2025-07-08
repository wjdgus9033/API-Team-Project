export default function HeatWave() {
    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "15px" }}>🌡️ 폭염이란?</h2>
            <p>
                폭염은 기온이 매우 높고, 습도까지 높은 상태가 일정 시간 이상 지속되는 현상입니다.
                특히 온열 질환이나 농작물 피해, 전력 수요 급증 등을 유발하여 일상생활에 큰 영향을 미칩니다.
            </p>
            <br />

            <h3 style={{ marginBottom: "15px" }}>📢 폭염 특보 기준</h3>
            <table
                border="1"
                style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", textAlign: "left" }} >
                <thead>
                    <tr>
                        <th style={{ backgroundColor: "#f8d7da", padding: "10px", width: "50%", wordBreak: "break-word", whiteSpace: "normal",lineHeight: "1.8" }}>
                            🔶 폭염 주의보
                        </th>
                        <th style={{ backgroundColor: "#f5c6cb", padding: "10px", width: "50%" }}>
                            🔴 폭염 경보
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: "10px", wordBreak: "break-word", whiteSpace: "normal", lineHeight: "1.5" }}>
                            폭염으로 인하여 다음 각 호의 어느 하나에 해당하는 경우 <br />
                            ① 일 최고 체감온도 33℃ 이상이 2일 이상 지속될 것으로 예상될 때 <br />
                            ② 급격한 체감온도 상승 또는 폭염 장기화 등으로 중대한 피해가 예상될 때
                        </td>
                        <td style={{ padding: "10px",  wordBreak: "break-word", whiteSpace: "normal", lineHeight: "1.5" }}>
                            폭염으로 인하여 다음 각 호의 어느 하나에 해당하는 경우 <br />
                            ① 일 최고 체감온도 35℃ 이상이 2일 이상 지속될 것으로 예상될 때 <br />
                            ② 급격한 체감온도 상승 또는 폭염 장기화 등으로 광범위한 지역에서 중대한 피해가 예상될 때
                        </td>
                    </tr>
                </tbody>
            </table>

            <p style={{ textAlign: "right", marginTop: "5px", fontSize: "12px" }}>
                ※ 출처 : 기상청 날씨누리
            </p>
        </div>
    );
}

import "./HeatWave.css";

export default function HeatWave() {
    return (
        <div className="dashboard">
            <div className="card">
                <h2>🌡️ 폭염이란?</h2>
                <p>
                    폭염은 기온이 매우 높고, 습도까지 높은 상태가 일정 시간 이상 지속되는 현상입니다.
                    특히 온열 질환이나 농작물 피해, 전력 수요 급증 등을 유발하여 일상생활에 큰 영향을 미칩니다.
                </p>
            </div>

            <div className="card">
                <h3>🌞 폭염의 영향</h3>
                <p>
                    폭염은 심혈관계, 호흡기계 등 건강에 심각한 영향을 줄 수 있으며, 특히 어린이, 노인, 만성질환자에게 위험합니다.
                    또한 도로 변형, 전력 사용 증가, 농작물 피해 등 사회·경제적 피해도 발생할 수 있습니다.
                </p>
            </div>

            <div className="card">
                <h3>📢 폭염 특보 기준</h3>
                <table className="heatwave-table">
                    <thead>
                        <tr>
                            <th className="warning">🔶 폭염 주의보</th>
                            <th className="alert">🔴 폭염 경보</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                폭염으로 인하여 다음 각 호의 어느 하나에 해당하는 경우 <br />
                                ① 일 최고 체감온도 33℃ 이상이 2일 이상 지속될 것으로 예상될 때 <br />
                                ② 급격한 체감온도 상승 또는 폭염 장기화 등으로 중대한 피해가 예상될 때
                            </td>
                            <td>
                                폭염으로 인하여 다음 각 호의 어느 하나에 해당하는 경우 <br />
                                ① 일 최고 체감온도 35℃ 이상이 2일 이상 지속될 것으로 예상될 때 <br />
                                ② 급격한 체감온도 상승 또는 폭염 장기화 등으로 광범위한 지역에서 중대한 피해가 예상될 때
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="source">※ 출처 : 기상청 날씨누리</p>
            </div>
        </div>
    );
}

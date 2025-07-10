import "./relatedsite.css"

export default function RelatedSite() {
    return (
        <div>
            <h2>관련 사이트 정보 안내</h2>
            <table className="related-table">
                <thead>
                    <tr>
                        <th>사이트명</th>
                        <th>운영기관</th>
                        <th>주요내용</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <a href="https://www.safekorea.go.kr" target="_blank" rel="noopener noreferrer">
                                국민재난안전포털
                            </a><br />
                            <a href="https://www.safekorea.go.kr/idsiSFK/neo/main/main.html" target="_blank">자연재난행동요령</a><br />
                            <a href="https://www.safekorea.go.kr/idsiSFK/neo/main/main.html" target="_blank">무더위쉼터</a>
                        </td>
                        <td>행정안전부</td>
                        <td>재난유형 및 국민행동요령, 안전시설 및 민방위 정보, 풍수해 보험, 재난복구 등 <br />다양한 재난안전정보를 종합적으로 제공
                            <br />* 자연,사회재난 및 생활안전 행동요령, 민방위 대피소, 무더위쉼터, 피해 및 복구 현황 등</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://www.weather.go.kr" target="_blank">날씨누리</a><br />
                            <a href="https://www.weather.go.kr/w/obs-climate/land/past-obs/obs-by-day.do" target="_blank">기상특보/예보</a><br />
                            <a href="https://www.weather.go.kr/w/obs-climate/land/past-obs/obs-by-day.do" target="_blank">무더위쉼터 요청</a>
                        </td>
                        <td>기상청</td>
                        <td>기상특보·예보, 장기전망, 날씨영상, 태풍·지진·화산·황사 정보,<br /> 관측 및 기후자료 등 종합기상정보 제공</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://data.kma.go.kr" target="_blank">기상자료개방포털</a>
                        </td>
                        <td>기상청</td>
                        <td>지상, 해양, 고층, 항공관측, 위성, 레이더 등 총 30종류의 날씨데이터 제공<br />
                            * 기온분석, 강수량분석, 기후평년값, 장마, 황사일수, 폭염일수, 열대야일수 등</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://www.climate.go.kr" target="_blank">기후정보포털</a>
                        </td>
                        <td>기상청</td>
                        <td>기후 관련 정책 및 국제협력<br />
                            장기예보 및 기후변화 시나리오에 따른 기후 요소 분석<br />
                            * 범정부 이상기후보고서, IPCC 보고서, 지구대기감시보고서</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://www.kei.re.kr" target="_blank">국가기후위기적응정보포털</a>
                        </td>
                        <td>한국환경연구원(KEI)</td>
                        <td>기후변화적응과 관련된 정보를 제공하는 종합 플랫폼<br />
                            기후변화 정의 등 기초정보(요인, 영향, 현상, 전망)<br />
                            지자체 및 공공기관을 위한 교육자료<br />
                            * 범정부 기후변화대응적응대책, 지자체 및 공공기관 기후변화대응적응대책</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://www.climate.go.kr/home/ccia/contents/observeInfo.do" target="_blank">종합기후변화감시정보</a>
                        </td>
                        <td>기상청</td>
                        <td>한반도 및 지구 규모의 온실가스(이산화탄소, 메탄), 자외선지수, 성층권 오존량<br />, 기온, 강수, 풍속, 해수면 등의 연월 평균 제공</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://www.airkorea.or.kr" target="_blank">에어코리아</a>
                        </td>
                        <td>한국환경공단</td>
                        <td>대기환경물질(미세먼지, 오존, 이산화질소, 일산화탄소, 아황산가스)의 실시간 등 측정 자료 제공 <br />
                            * 실시간 대기정보, 대기정보 예·경보, 대기환경 월간·연간보고서</td>
                    </tr>
                </tbody>
            </table>
            <p style={{ textAlign: "right", fontSize: "12px", marginTop: "8px" }}>
                ※ 출처: 질병관리청
            </p>
        </div>
    );
}

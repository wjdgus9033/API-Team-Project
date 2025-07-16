import { useState, useEffect } from "react";
import $ from "jquery";

export default function useApiData() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = import.meta.env.VITE_STATE_API_KEY;
    const apiURL = `https://apis.data.go.kr/1741000/CasualtiesFromHeatwaveByYear/getCasualtiesFromHeatwaveByYear?serviceKey=${key}&pageNo=1&numOfRows=14&type=xml`;
    const url = `/proxy.php?getUrl=${(apiURL)}`;

    $.ajax({
      url: url,
      type: "GET",
      dataType: "xml",
      success: function (xml) {
        try {
          const parsed = [];
          $(xml).find("row").each(function () {
            parsed.push({
              year: $(this).find("wrttimeid").text() || "0",
              total: Number($(this).find("tot").text()) || 0,
              outdoor: Number($(this).find("otdoor_subtot").text()) || 0,
              indoor: Number($(this).find("indoor_subtot").text()) || 0,
            });
          });
          setRows(parsed);
          console.log(parsed); 
          setLoading(false);
        } catch (err) {
          console.error("파싱 에러:", err);
          setError("데이터 파싱 중 문제 발생");
          setLoading(false);
        }
      },
      error: function (xhr, status, errorThrown) {
        console.error("데이터 요청 실패:", status, errorThrown);
        setError("데이터 요청 중 문제 발생");
        setLoading(false);
      },
    });
  }, []);

  return { rows, loading, error };
}
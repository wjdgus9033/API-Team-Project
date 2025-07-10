import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";

// 연도별 총 피해자 수
export default function Total({ data }) {
    return (
        <>
            <div style={{ width: "30%", minWidth: 300, textAlign: "center" }}>
                <h3>총 피해자 수</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" padding={{ left: 20, right: 20 }} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="red" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}
// InOutChart.jsx
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";

export default function InOutChart({ data }) {
  return (
    <>
      <div style={{ width: "100%", minWidth: 300, textAlign: "center" }}>
        <h3>외부 피해자 수</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" padding={{ left: 20, right: 20 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="outdoor" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", minWidth: 300, textAlign: "center" }}>
        <h3>내부 피해자 수</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" padding={{ left: 20, right: 20 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="indoor" stroke="blue" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

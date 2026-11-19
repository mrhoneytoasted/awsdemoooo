import { dailyVolumes, hourlyVolumes } from "@/lib/data";

export function TrendChart({ compact = false }: { compact?: boolean }) {
  const values = dailyVolumes;
  const width = 560, height = 140, padX = 12, padY = 12;
  const min = Math.min(...values), max = Math.max(...values);
  const points = values.map((value, i) => [padX + i * (width - 2 * padX) / (values.length - 1), height - padY - (value - min) / (max - min) * (height - 2 * padY)] as const);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const area = `${line} L ${points.at(-1)?.[0]} ${height} L ${points[0][0]} ${height} Z`;
  return <><svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Water usage trend chart">
    <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4b8be3" stopOpacity=".2"/><stop offset="100%" stopColor="#4b8be3" stopOpacity="0"/></linearGradient></defs>
    {[20, 52, 84, 116].map(y => <line key={y} className="chart-gridline" x1="0" x2={width} y1={y} y2={y}/>)}
    <path className="chart-area" d={area}/><path className="chart-line" d={line}/>
    {[0, 5, 11, 17, 23].map((n, i) => <text key={n} className="chart-label" x={points[n][0]} y={height - 1} textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}>{`${n.toString().padStart(2, "0")}:00`}</text>)}
  </svg><div className="chart-legend"><span className="mini-line"/>Water dispensed</div></>;
}

export function HourlyBars() {
  return <div className="bar-chart" role="img" aria-label="Hourly water volume">
    {hourlyVolumes.map((v, i) => <div key={i} className="bar-col"><div className="bar" style={{ height: `${18 + v / 91 * 74}%` }}/><span className="bar-label">{`${(i * 2).toString().padStart(2, "0")}:00`}</span></div>)}
  </div>;
}

export function UsageDonut() {
  const items = [{ name: "AWS-01", value: "32.1 L", color: "#173e71", sub: "14 stations used" }, { name: "AWS-02", value: "27.4 L", color: "#3478dc", sub: "12 stations used" }, { name: "AWS-03", value: "19.8 L", color: "#819fc5", sub: "9 stations used" }, { name: "Other stations", value: "20.8 L", color: "#d5e1f0", sub: "32 stations used" }];
  return <div className="usage-content"><div className="donut-wrap"><div className="donut"/><div className="donut-center"><div className="donut-value">67,670</div><div className="donut-label">litres dispensed</div></div></div><div className="legend-list">{items.map(i => <div key={i.name}><div className="legend-item"><span className="legend-dot" style={{ background: i.color }}/><span className="legend-name">{i.name}</span><span className="legend-value">{i.value}</span></div><div className="legend-sub">{i.sub}</div></div>)}</div></div>;
}

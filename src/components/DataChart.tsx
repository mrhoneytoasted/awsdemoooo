import type { JsonObject } from "@/lib/data";

const NUMBER_KEYS = ["recorded_volume_ml", "volume_ml", "usage_ml", "water_usage_ml", "volume", "usage", "value", "count"];
const DATE_KEYS = ["date", "day", "measured_at", "ended_at", "timestamp", "period"];

export function DataChart({ rows = [], label = "Water usage" }: { rows?: JsonObject[]; label?: string }) {
  const points = rows.flatMap((row, index) => {
    const key = NUMBER_KEYS.find(candidate => row[candidate] !== null && row[candidate] !== undefined && row[candidate] !== "" && Number.isFinite(Number(row[candidate])));
    if (!key) return [];
    const value = Number(row[key]);
    const dateKey = DATE_KEYS.find(candidate => row[candidate] !== null && row[candidate] !== undefined);
    return [{ value, label: dateKey ? String(row[dateKey]) : String(index + 1) }];
  });

  const width = 600, height = 170, left = 42, right = 12, top = 12, bottom = 24;
  const values = points.map(point => point.value);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const range = max - min || 1;
  const coordinates = points.map((point, index) => ({
    x: points.length === 1 ? width / 2 : left + index * (width - left - right) / (points.length - 1),
    y: height - bottom - (max === min ? 0.5 : (point.value - min) / range) * (height - top - bottom),
    label: point.label,
  }));
  const line = coordinates.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return <div className="data-chart" role="img" aria-label={`${label}${coordinates.length ? " chart from API data" : " chart with no data"}`}>
    <svg className="chart data-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {[20, 60, 100, 140].map(y => <line key={y} className="chart-gridline" x1={left} x2={width - right} y1={y} y2={y}/>)}
      <line className="chart-gridline" x1={left} x2={left} y1={top} y2={height - bottom}/>
      {coordinates.length > 0 && <><path className="chart-line" d={line}/>{coordinates.map((point,index)=><circle key={index} className="chart-point" cx={point.x} cy={point.y} r="3.5"/>)}
        {coordinates.filter((_,index)=>index===0||index===coordinates.length-1||index===Math.floor(coordinates.length/2)).map((point,index)=><text key={`${point.label}-${index}`} className="chart-label" x={point.x} y={height-5} textAnchor={index===0?"start":index===2?"end":"middle"}>{point.label}</text>)}
      </>}
    </svg>
    {!coordinates.length && <div className="data-chart-empty">No chart data available for this period</div>}
    {!!coordinates.length && <div className="chart-legend"><span className="mini-line"/>{label} · {coordinates.length} API points</div>}
  </div>;
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Activity, ChevronRight, CircleAlert, Droplet, MapPin, RotateCcw } from "lucide-react";
import { AppShell, PageHeading } from "@/components/AppShell";
import { asObject, formatNumber, pick, type JsonObject } from "@/lib/data";
import { LatestTelemetryCard } from "@/components/LatestTelemetryCard";

type StationResult = { stations?: JsonObject[] };
export default function DashboardPage() {
  const [stations, setStations] = useState<JsonObject[]>([]);
  const [dashboard, setDashboard] = useState<JsonObject>({});
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [stationResponse, dashboardResponse] = await Promise.all([
        fetch("/api/backend/api/stations", { cache: "no-store" }),
        fetch("/api/backend/api/dashboard", { cache: "no-store" }),
      ]);
      if (!stationResponse.ok) throw new Error(`Stations API returned ${stationResponse.status}`);
      if (!dashboardResponse.ok) throw new Error(`Dashboard API returned ${dashboardResponse.status}`);
      const stationData = await stationResponse.json() as StationResult;
      setDashboard(asObject(await dashboardResponse.json()));
      setStations(Array.isArray(stationData.stations) ? stationData.stations.map(asObject) : []);
      setError("");
      setUpdatedAt(new Date().toISOString());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load API data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  const usage = asObject(dashboard.usage);
  const daily = Array.isArray(dashboard.daily) ? dashboard.daily.map(asObject) : [];
  const metrics = [
    { label: "Stations in API", value: loading ? "…" : String(stations.length), foot: "From GET /api/stations", icon: MapPin },
    { label: "Water recorded", value: usage.recorded_volume_ml === undefined ? "—" : `${formatNumber(usage.recorded_volume_ml, 2)} mL`, foot: "Volume known to the API", icon: Droplet },
    { label: "Completed cycles", value: usage.completed_cycle_count === undefined ? "—" : formatNumber(usage.completed_cycle_count), foot: "Completed dispensing cycles", icon: Activity },
    { label: "Alerts", value: "Not available", foot: "API endpoint not provided", icon: CircleAlert },
  ];

  return <AppShell title="Dashboard"><main className="content">
    <PageHeading eyebrow="LIVE DATA · API CONNECTED" title="System overview" subtitle="Dashboard data is loaded from the station API. No local demo records are used." actions={<button className="btn" onClick={() => { setLoading(true); void refresh(); }}><RotateCcw size={12}/> Refresh</button>}/>
    {error && <div className="panel" role="status" style={{ marginBottom: 16, color: "#a23b38" }}>API request failed: {error}. Showing the last successfully received data, if available.</div>}
    <div className="metrics-grid">{metrics.map(({label,value,foot,icon:Icon})=><div className="metric-card" key={label}><div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={13}/></span></div><div className="metric-value">{value}</div><div className="metric-foot">{foot}</div></div>)}</div>
    <LatestTelemetryCard />
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-title-row"><div><div className="panel-title">Water usage</div><div className="panel-caption">GET /api/dashboard · API units are mL</div></div></div>{Object.keys(usage).length ? <div className="device-info-grid" style={{marginTop:22}}>{Object.entries(usage).filter(([,v])=>v===null||["string","number","boolean"].includes(typeof v)).map(([key,value])=><div key={key}><span>{key.replaceAll("_"," ")}</span><strong>{value===null?"Unknown":formatNumber(value,2)}</strong></div>)}</div> : <div className="empty-state"><Droplet size={20}/><div>No usage values returned by the dashboard API.</div></div>}{daily.length>0&&<div className="table-wrap"><table><thead><tr>{Object.keys(daily[0]).map(key=><th key={key}>{key.replaceAll("_"," ")}</th>)}</tr></thead><tbody>{daily.slice(0,7).map((item,index)=><tr key={index}>{Object.entries(daily[0]).map(([key])=><td key={key}>{item[key]===null?"Unknown":String(item[key]??"—")}</td>)}</tr>)}</tbody></table></div>}</section>
      <section className="panel"><div className="panel-title-row"><div><div className="panel-title">Water usage</div><div className="panel-caption">GET /api/dashboard · API units are mL</div></div></div>{Object.keys(usage).length ? <div className="device-info-grid" style={{marginTop:22}}>{Object.entries(usage).filter(([,v])=>v===null||["string","number","boolean"].includes(typeof v)).map(([key,value])=><div key={key}><span>{key.replaceAll("_"," ")}</span><strong>{value===null?"Unknown":formatNumber(value,2)}</strong></div>)}</div> : <div className="empty-state"><Droplet size={20}/><div>No usage values returned by the dashboard API.</div></div>}{daily.length>0&&<div className="table-wrap"><table><thead><tr>{Object.keys(daily[0]).map(key=><th key={key}>{key.replaceAll("_"," ")}</th>)}</tr></thead><tbody>{daily.slice(0,7).map((item,index)=><tr key={index}>{Object.entries(daily[0]).map(([key])=><td key={key}>{item[key]===null?"Unknown":String(item[key]??"—")}</td>)}</tr>)}</tbody></table></div>}</section>
      <section className="panel"><div className="panel-title-row"><div><div className="panel-title">Data coverage</div><div className="panel-caption">Unknown volumes stay separate from recorded water.</div></div><Activity size={16}/></div><div className="device-info-grid" style={{marginTop:22}}><div><span>Unknown volume cycles</span><strong>{usage.unknown_volume_cycle_count === undefined ? "—" : formatNumber(usage.unknown_volume_cycle_count)}</strong></div><div><span>API refreshed</span><strong>{updatedAt ? new Intl.DateTimeFormat("en-GB", { timeZone:"Asia/Bangkok", dateStyle:"medium", timeStyle:"short" }).format(new Date(updatedAt)) : "Not yet received"}</strong></div></div></section>
    </div>
    <section className="panel" style={{marginTop:20}}><div className="panel-title-row"><div><div className="panel-title">Stations</div><div className="panel-caption">Live response from GET /api/stations</div></div><Link className="view-link" href="/station">Manage stations <ChevronRight size={12}/></Link></div>
      {stations.length ? <div className="table-wrap"><table><thead><tr><th>Station</th><th>ID</th><th/></tr></thead><tbody>{stations.map((station,index)=>{const id=String(pick(station,"id","station_id","dispenser_id") ?? ""); const name=String(pick(station,"name","station_name") ?? (id || "Unnamed station")); return <tr key={id || index}><td><div className="station-cell"><span className="station-thumb"><Droplet size={13}/></span>{name}</div></td><td>{id || "Not provided"}</td><td>{id && <Link className="view-link" href={`/station/${encodeURIComponent(id)}`}>View details <ChevronRight size={12}/></Link>}</td></tr>;})}</tbody></table></div> : <div className="empty-state"><Activity size={20}/><div>{loading ? "Loading stations…" : "The API returned no stations."}</div></div>}
    </section>
    <div className="table-bottom"><span>Alerts, sensor health, and tank controls are not exposed by the current API.</span></div>
  </main></AppShell>;
}

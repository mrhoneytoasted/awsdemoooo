"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, ChevronRight, CircleAlert, Droplet, Gauge, MapPin, Radio, RotateCcw, Waves } from "lucide-react";
import { AppShell, PageHeading } from "@/components/AppShell";
import { AlertManager } from "@/components/AlertManager";
import { HourlyBars, TrendChart, UsageDonut } from "@/components/Charts";
import { stations } from "@/lib/data";

export default function DashboardPage() {
  const [range, setRange] = useState("Today");
  const online = stations.filter(s => s.status === "Online").length;
  const metrics = [
    { label: "Total stations", value: "67", foot: "+3 this month", trend: true, icon: MapPin },
    { label: "Online stations", value: "62", foot: "92.5% uptime", trend: true, icon: Radio },
    { label: "Offline stations", value: "05", foot: "2 need attention", trend: false, icon: Activity },
    { label: "Water dispensed", value: range === "Today" ? "67,670" : range === "Last 7 days" ? "426,890" : "1.82M", unit: "L", foot: "+12.8% vs previous period", trend: true, icon: Droplet },
    { label: "Total beneficiaries", value: "29,741", foot: "+8.4% vs previous period", trend: true, icon: Gauge },
    { label: "Active alerts", value: "04", foot: "2 open · 2 acknowledged", trend: false, icon: CircleAlert },
  ];
  return <AppShell title="Dashboard"><main className="content"><PageHeading eyebrow="FLEET OVERVIEW · LIVE" title="System overview" subtitle="Here’s what’s happening across your water stations." actions={<><select className="date-pill" aria-label="Filter by date" value={range} onChange={e => setRange(e.target.value)}><option>Today</option><option>Last 7 days</option><option>Last 30 days</option></select><button className="btn" onClick={() => setRange("Today")}><RotateCcw size={12}/> Refresh</button></>}/>
    <div className="metrics-grid">{metrics.map(({label,value,unit,foot,trend,icon:Icon})=><div className="metric-card" key={label}><div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={13}/></span></div><div className="metric-value">{value}<span className="metric-unit">{unit ? ` ${unit}` : ""}</span></div><div className="metric-foot">{trend ? <ArrowUpRight size={11} className="trend-up"/> : <ArrowDownRight size={11} className="trend-warn"/>}<span className={trend ? "trend-up" : "trend-warn"}>{foot}</span></div></div>)}</div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-title-row"><div><div className="panel-title">Water usage</div><div className="panel-caption">Fleet water dispensed by station</div></div><select className="select-small" aria-label="Water usage period" value={range} onChange={e=>setRange(e.target.value)}><option>Today</option><option>Last 7 days</option><option>Last 30 days</option></select></div><UsageDonut/></section>
      <section className="panel"><div className="panel-title-row"><div><div className="panel-title">24-hour flow</div><div className="panel-caption">Total water dispensed over time</div></div><span className="tiny-live"><span/>Live</span></div><TrendChart/></section>
    </div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-title-row"><div><div className="panel-title">Station management</div><div className="panel-caption">Latest status across your fleet</div></div><Link className="view-link" href="/station">All stations <ChevronRight size={12}/></Link></div><div className="table-wrap"><table><thead><tr><th>Station</th><th>Location</th><th>Status</th><th>Water level</th><th>Dispensed</th><th/></tr></thead><tbody>{stations.slice(0,4).map(s=><tr key={s.id}><td><div className="station-cell"><span className="station-thumb"><Droplet size={13}/></span>{s.name}</div></td><td>{s.location.split(" · ")[0]}</td><td><span className={`status-pill ${s.status === "Online" ? "status-online" : s.status === "Offline" ? "status-offline" : "status-warning"}`}>{s.status}</span></td><td><div className="level-cell"><div className="level-track"><div className="level-fill" style={{width:`${s.level}%`,background:s.level<25?"#d95a55":undefined}}/></div><strong>{s.level}%</strong></div></td><td>{s.dispensed.toLocaleString()} L</td><td><Link className="view-link" href={`/station/${s.id}`}>View <ChevronRight size={12}/></Link></td></tr>)}</tbody></table></div><div className="table-bottom"><span>Showing 4 of 67 stations</span><Link className="view-link" href="/station">View all stations <ChevronRight size={12}/></Link></div></section>
      <section className="panel"><div className="panel-title-row"><div><div className="panel-title">Hourly usage</div><div className="panel-caption">Water dispensed (litres)</div></div><span className="unit-tag">L / hour</span></div><HourlyBars/></section>
    </div>
    <div className="last-grid"><section className="panel"><AlertManager compact/></section><div className="fleet-note"><div className="fleet-note-icon"><Waves size={16}/></div><div><strong>Fleet health is looking good</strong><p>{online} stations are online and reporting normally. One station may need a quick check.</p><Link href="/station/aws-04?view=tank" className="view-link">Review station <ChevronRight size={12}/></Link></div></div></div>
  </main></AppShell>;
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight, Droplet, MapPin, Plus, Search, SlidersHorizontal } from "lucide-react";
import { AppShell, PageHeading } from "@/components/AppShell";
import { stations } from "@/lib/data";

export default function StationManagementPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All stations");
  const filtered = useMemo(() => stations.filter(s => `${s.name} ${s.location}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All stations" || s.status === filter)), [query, filter]);
  return <AppShell title="Station management"><main className="content"><PageHeading eyebrow="FLEET · 67 STATIONS" title="Station management" subtitle="Manage your network and see the status of every water station." actions={<button className="btn btn-primary" onClick={()=>window.alert("Add station is available when a station backend is connected.")}><Plus size={13}/> Add station</button>}/>
    <div className="station-toolbar"><label className="search-wrap"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search stations or locations..." aria-label="Search stations"/></label><button className={`filter-chip ${filter === "All stations" ? "selected" : ""}`} onClick={()=>setFilter("All stations")}><SlidersHorizontal size={13}/> All <span>67</span></button><button className={`filter-chip ${filter === "Online" ? "selected" : ""}`} onClick={()=>setFilter(filter === "Online" ? "All stations" : "Online")}>Online <span>62</span></button><button className={`filter-chip ${filter === "Warning" ? "selected" : ""}`} onClick={()=>setFilter(filter === "Warning" ? "All stations" : "Warning")}>Warning <span>2</span></button><button className={`filter-chip ${filter === "Offline" ? "selected" : ""}`} onClick={()=>setFilter(filter === "Offline" ? "All stations" : "Offline")}>Offline <span>3</span></button><button className="icon-button sort-button" aria-label="Sort stations"><ArrowUpDown size={14}/></button></div>
    <div className="station-list">{filtered.map(s=><article className="panel station-card" key={s.id}><div className="station-card-head"><div><div className="station-card-icon"><Droplet size={17}/></div><div className="station-name-line"><h3>{s.name}</h3><span className={`status-pill ${s.status === "Online" ? "status-online" : s.status === "Offline" ? "status-offline" : "status-warning"}`}>{s.status}</span></div><div className="location"><MapPin size={11}/>{s.location}</div></div><button className="icon-button" aria-label={`More actions for ${s.name}`}>···</button></div><div className="station-card-metrics"><div className="station-card-metric"><span>Water level</span><strong>{s.level}%</strong><div className="level-track"><div className="level-fill" style={{width:`${s.level}%`,background:s.level<25?"#d95a55":undefined}}/></div></div><div className="station-card-metric"><span>Dispensed today</span><strong>{s.dispensed.toLocaleString()} L</strong></div></div><div className="station-card-footer"><span className="station-last-seen">Last seen {s.lastSeen}</span><Link className="view-link" href={`/station/${s.id}`}>View details <ChevronRight size={13}/></Link></div></article>)}</div>
    {!filtered.length&&<div className="panel empty-state">No stations match your search.</div>}
    <div className="list-footer">Showing {filtered.length} of 67 stations <span>Page 1 of 12　 <button disabled>‹</button><button>1</button><button>2</button><button>3</button><button>›</button></span></div>
  </main></AppShell>;
}

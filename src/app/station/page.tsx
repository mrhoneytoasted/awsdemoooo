"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Droplet, MapPin, Search } from "lucide-react";
import { AppShell, PageHeading } from "@/components/AppShell";
import { asObject, type JsonObject } from "@/lib/data";

export default function StationManagementPage() {
  const [stations, setStations] = useState<JsonObject[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/backend/api/stations", { cache: "no-store" }).then(async response => { if (!response.ok) throw new Error(`Stations API returned ${response.status}`); const data = await response.json(); setStations(Array.isArray(data.stations) ? data.stations.map(asObject) : []); }).catch(cause => setError(cause instanceof Error ? cause.message : "Could not load stations.")).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => stations.filter(station => JSON.stringify(station).toLowerCase().includes(query.toLowerCase())), [stations, query]);
  return <AppShell title="Station management"><main className="content"><PageHeading eyebrow="FLEET · API DATA" title="Station management" subtitle="Stations returned by the connected API."/>
    <div className="station-toolbar"><label className="search-wrap"><Search size={14}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search station data..." aria-label="Search stations"/></label><span className="filter-chip">{stations.length} stations</span></div>
    {error && <div className="panel" role="alert">Could not load stations: {error}</div>}
    <div className="station-list">{filtered.map((station,index) => {const id=String(station.id ?? station.station_id ?? station.dispenser_id ?? "");const name=String(station.name ?? station.station_name ?? (id || "Unnamed station"));const location=String(station.location ?? "Location not provided");return <article className="panel station-card" key={id || index}><div className="station-card-head"><div><div className="station-card-icon"><Droplet size={17}/></div><div className="station-name-line"><h3>{name}</h3></div><div className="location"><MapPin size={11}/>{location}</div></div></div><div className="station-card-footer"><span className="station-last-seen">{id ? `Station ID · ${id}` : "Station ID not provided by API"}</span>{id && <Link className="view-link" href={`/station/${encodeURIComponent(id)}`}>View details <ChevronRight size={13}/></Link>}</div></article>;})}</div>
    {!loading && !error && !filtered.length && <div className="panel empty-state">No stations were returned by the API.</div>}{loading && <div className="panel empty-state">Loading stations…</div>}
  </main></AppShell>;
}

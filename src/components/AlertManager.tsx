"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, Bell, Check, ChevronRight, CircleAlert, Clock3, Droplet, Info, X } from "lucide-react";
import { seedAlerts, type Alert, type AlertStatus } from "@/lib/data";

const statusClass: Record<AlertStatus, string> = { Open: "status-offline", Acknowledged: "status-warning", Resolved: "status-online" };
const severityClass = (severity: Alert["severity"]) => severity === "Critical" ? "red" : severity === "Info" ? "blue" : "";
const severityIcon = (severity: Alert["severity"]) => severity === "Critical" ? CircleAlert : severity === "Info" ? Info : Droplet;

export function AlertManager({ stationId, compact = false }: { stationId?: string; compact?: boolean }) {
  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts);
  const [selected, setSelected] = useState<Alert | null>(null);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  useEffect(() => {
    try { const saved = localStorage.getItem("aws-alerts"); if (saved) setAlerts(JSON.parse(saved) as Alert[]); } catch { /* local demo data remains available */ }
  }, []);
  const shown = useMemo(() => alerts.filter(a => (!stationId || a.stationId === stationId) && (statusFilter === "All statuses" || a.status === statusFilter) && `${a.title} ${a.stationName} ${a.id}`.toLowerCase().includes(search.toLowerCase())), [alerts, stationId, statusFilter, search]);
  function saveAlert(next: Alert) {
    const now = new Date().toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" });
    const updated = { ...next, time: now, history: [...next.history, { status: next.status, note: next.description || "Alert details updated.", time: `Today, ${now}` }] };
    const list = alerts.map(a => a.id === updated.id ? updated : a);
    setAlerts(list); localStorage.setItem("aws-alerts", JSON.stringify(list)); setSelected(null); setToast("Alert updated successfully");
    window.setTimeout(() => setToast(""), 2600);
  }
  return <>
    <section className={`panel ${compact ? "" : ""}`}>
      <div className="panel-title-row"><div><div className="panel-title">{stationId ? "Station alerts" : compact ? "Recent alerts" : "Alert & notification management"}</div><div className="panel-caption">{stationId ? `Open issues for ${stationId.toUpperCase()}` : "Monitor and manage station notifications"}</div></div>{compact && <a href="/alert" className="view-link">View all <ChevronRight size={12}/></a>}</div>
      {!compact && <div className="alert-controls"><input aria-label="Search alerts" className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alert or station..."/><select className="select-small" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All statuses</option><option>Open</option><option>Acknowledged</option><option>Resolved</option></select><button className="btn" onClick={() => setStatusFilter("All statuses")}><ArrowDownUp size={13}/> Reset</button></div>}
      <div className={compact ? "alert-list" : "table-wrap"}>
        {compact ? <>{shown.slice(0, 3).map(alert => <AlertRow key={alert.id} alert={alert} open={() => setSelected(alert)}/>)}</> : <table><thead><tr><th>Alert</th><th>Station</th><th>Severity</th><th>Time</th><th>Status</th><th/></tr></thead><tbody>{shown.map(alert => { const Icon = severityIcon(alert.severity); return <tr key={alert.id}><td><div className="alert-table-title"><span className={`alert-symbol ${severityClass(alert.severity)}`}><Icon size={13}/></span><span><strong>{alert.title}</strong><small>{alert.id}</small></span></div></td><td><span className="station-id-text">{alert.stationName}</span></td><td><span className={`severity-text ${severityClass(alert.severity)}`}>{alert.severity}</span></td><td>{alert.time}</td><td><span className={`status-pill ${statusClass[alert.status]}`}>{alert.status}</span></td><td><button className="view-link" onClick={() => setSelected(alert)}>View details <ChevronRight size={12}/></button></td></tr>; })}</tbody></table>}
        {!shown.length && <div className="empty-state"><Bell size={20}/><div>No alerts match your filters.</div></div>}
      </div>
      {!compact && <div className="table-summary">Showing <strong>{shown.length}</strong> of {stationId ? "2 station alerts" : "5 alerts"}<span className="table-pagination"><button disabled>‹</button><button className="current">1</button><button>›</button></span></div>}
    </section>
    {selected && <AlertModal alert={selected} close={() => setSelected(null)} save={saveAlert}/>}
    {toast && <div role="status" className="toast toast-enter"><Check size={14} style={{verticalAlign:"-3px",marginRight:7}}/>{toast}</div>}
  </>;
}

function AlertRow({ alert, open }: { alert: Alert; open: () => void }) {
  const Icon = severityIcon(alert.severity);
  return <div className="alert-row"><span className={`alert-symbol ${severityClass(alert.severity)}`}><Icon size={13}/></span><div className="alert-row-copy"><div className="alert-name">{alert.title}</div><div className="alert-meta">{alert.stationName} · {alert.time}</div></div><span className={`alert-tag ${severityClass(alert.severity)}`}>{alert.status === "Resolved" ? "Resolved" : alert.severity}</span><button className="alert-detail" onClick={open} aria-label={`View ${alert.title}`}><ChevronRight size={14}/></button></div>;
}

function AlertModal({ alert, close, save }: { alert: Alert; close: () => void; save: (alert: Alert) => void }) {
  const [draft, setDraft] = useState(alert);
  useEffect(() => { const handle = (e: KeyboardEvent) => e.key === "Escape" && close(); window.addEventListener("keydown", handle); return () => window.removeEventListener("keydown", handle); }, [close]);
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="alert-modal-title">
    <div className="modal-header"><div><h2 id="alert-modal-title">Alert details</h2><p>{alert.id} · {alert.stationName} · {alert.time}</p></div><button className="icon-button" onClick={close} aria-label="Close dialog"><X size={15}/></button></div>
    <div className="modal-body"><div className="alert-summary-modal"><span className={`alert-symbol ${severityClass(alert.severity)}`}><CircleAlert size={16}/></span><div><strong>{alert.title}</strong><div className="alert-meta">{alert.severity} severity</div></div></div>
      <div className="field"><label htmlFor="alert-description">Description</label><textarea id="alert-description" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })}/></div>
      <div className="field"><label htmlFor="alert-status">Status</label><select id="alert-status" value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as AlertStatus })}><option>Open</option><option>Acknowledged</option><option>Resolved</option></select></div>
      <div><div className="history-heading"><Clock3 size={13}/> Activity history</div><div className="history-list">{[...alert.history].reverse().map((h, i) => <div className="history-item" key={`${h.time}-${i}`}><span className="history-dot"/><div><div className="history-title">Status changed to {h.status}</div><div className="history-note">{h.note}</div></div><div className="history-date">{h.time}</div></div>)}</div></div>
    </div><div className="modal-footer"><button className="btn" onClick={close}>Cancel</button><button className="btn btn-primary" onClick={() => save(draft)}>Save changes</button></div>
  </div></div>;
}

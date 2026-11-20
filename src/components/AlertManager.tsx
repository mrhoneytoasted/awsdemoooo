import { Bell } from "lucide-react";

export function AlertManager({ stationId, compact = false }: { stationId?: string; compact?: boolean }) {
  return <section className="panel"><div className="panel-title-row"><div><div className="panel-title">{stationId ? "Station alerts" : compact ? "Recent alerts" : "Alert management"}</div><div className="panel-caption">Alerts are not available from the current API.</div></div></div><div className="empty-state"><Bell size={20}/><div>No alert records are being shown. The API spec does not include an alerts endpoint.</div></div></section>;
}

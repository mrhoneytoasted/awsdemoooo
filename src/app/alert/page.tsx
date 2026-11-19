import { AppShell, PageHeading } from "@/components/AppShell";
import { AlertManager } from "@/components/AlertManager";
import { Bell, Clock3, ShieldCheck } from "lucide-react";

export default function AlertPage() {
  return <AppShell title="Alerts"><main className="content"><PageHeading eyebrow="FLEET · NOTIFICATIONS" title="Alert management" subtitle="Review, assign, and resolve alerts across your station network."/><div className="alert-summary-grid"><div className="summary-tile"><span className="summary-tile-icon red"><span>!</span></span><div><small>Open alerts</small><strong>02</strong><span className="summary-note">Needs attention</span></div></div><div className="summary-tile"><span className="summary-tile-icon amber"><Clock3 size={15}/></span><div><small>Acknowledged</small><strong>02</strong><span className="summary-note">In progress</span></div></div><div className="summary-tile"><span className="summary-tile-icon green"><ShieldCheck size={15}/></span><div><small>Resolved</small><strong>02</strong><span className="summary-note">All clear</span></div></div><div className="summary-tile"><span className="summary-tile-icon blue"><Bell size={15}/></span><div><small>Total this week</small><strong>06</strong><span className="summary-note">Across 67 stations</span></div></div></div><AlertManager/></main></AppShell>;
}

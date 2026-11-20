"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, CircleHelp, Droplet, LayoutDashboard, MapPin, Settings2, Waves, Activity, FlaskConical, Gauge } from "lucide-react";
import type { ReactNode } from "react";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/station", label: "Station management", icon: MapPin },
  { href: "/alert", label: "Alerts & notifications", icon: Bell },
];
const detailNav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "sensors", label: "Sensor status", icon: Activity },
  { key: "tank", label: "Tank management", icon: Droplet },
  { key: "analysis", label: "Water analysis", icon: FlaskConical },
  { key: "settings", label: "Station settings", icon: Settings2 },
  { key: "alerts", label: "Station alerts", icon: Bell },
];

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = usePathname();
  const stationMatch = pathname.match(/^\/station\/([^/]+)/);
  const stationId = stationMatch?.[1];
  const baseStation = stationId ? `/station/${stationId}` : "";
  return <div className="app-shell min-h-screen flex">
    <aside className="sidebar">
      <Link className="brand" href="/">
        <span className="brand-mark"><Droplet size={18} strokeWidth={2.5} /></span>
        <span className="brand-word"><div className="brand-title">AWS WATER SYSTEM</div><div className="brand-subtitle">Station operations</div></span>
      </Link>
      <div className="side-label">Workspace</div>
      <nav className="nav-list" aria-label="Main navigation">
        {primaryNav.map(({ href, label, icon: Icon }) => {
          const active = href === "/station" ? pathname.startsWith("/station") : pathname === href || (href === "/dashboard" && pathname === "/");
          return <Link key={href} href={href} className={`nav-link ${active && !stationId ? "active" : ""}`} title={label}>
            <span className="nav-icon"><Icon size={16} /></span><span className="nav-text">{label}</span>
          </Link>;
        })}
      </nav>
      {stationId && <>
        <div className="side-label">Station · {stationId.toUpperCase()}</div>
        <nav className="nav-list" aria-label="Station navigation">
          {detailNav.map(({ key, label, icon: Icon }) => {
            const active = pathname === baseStation && key === "dashboard";
            return <Link key={key} href={`${baseStation}${key === "dashboard" ? "" : `?view=${key}`}`} className={`nav-link ${active ? "active" : ""}`} title={label}>
              <span className="nav-icon"><Icon size={15} /></span><span className="nav-text">{label}</span>
            </Link>;
          })}
        </nav>
      </>}
      <div className="sidebar-bottom">
        <div className="connection-card"><div><div className="connection-title">API data source</div><div className="connection-meta">Status shown on dashboard</div></div></div>
      </div>
    </aside>
    <div className="main-area">
      <header className="topbar">
        <div className="crumb"><Link href="/dashboard">Workspace</Link><ChevronRight size={12}/><strong>{title ?? (stationId ? "Station overview" : pathname.includes("alert") ? "Alerts" : pathname.includes("station") ? "Station management" : "Dashboard")}</strong></div>
        <div className="top-actions"><button className="date-pill" type="button"><Waves size={13}/><span>Bangkok, Thailand</span></button><Link className="icon-button" href="/alert" aria-label="View alerts"><Bell size={15}/></Link><button className="icon-button" aria-label="Help"><CircleHelp size={15}/></button><div className="avatar">KS</div></div>
      </header>
      {children}
    </div>
  </div>;
}

export function PageHeading({ eyebrow, title, subtitle, actions }: { eyebrow?: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow"><span className="pulse"/>{eyebrow}</div>}<h1>{title}</h1>{subtitle && <div className="page-subtitle">{subtitle}</div>}</div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

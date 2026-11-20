import Link from "next/link";
import { ArrowRight, Droplet } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export default function HomePage() {
  return <AppShell title="Welcome"><main className="welcome"><section className="welcome-card"><div><div className="welcome-kicker"><span className="welcome-live"/>AUTOMATIC WATER STATION</div><h1>Water operations,<br/>made clearer.</h1><p className="welcome-copy">View station and telemetry data provided by the connected API.</p><div className="welcome-actions"><Link className="btn btn-primary" href="/dashboard">Open dashboard <ArrowRight size={14}/></Link><Link className="welcome-secondary" href="/station">Manage stations</Link></div></div><div className="welcome-art"><div className="welcome-water"/><div className="welcome-bubble two"><Droplet size={12}/> Connected API data</div></div></section></main></AppShell>;
}

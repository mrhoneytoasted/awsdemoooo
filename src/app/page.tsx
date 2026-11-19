import Link from "next/link";
import { ArrowRight, Check, Droplet, Waves } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export default function HomePage() {
  return <AppShell title="Welcome"><main className="welcome"><section className="welcome-card"><div><div className="welcome-kicker"><span className="welcome-live"/>Adaptive WATER STATION</div><h1>Water operations,<br/>made clearer.</h1><p className="welcome-copy">A single place to monitor your station network, understand water usage, and respond to issues as they happen.</p><div className="welcome-actions"><Link className="btn btn-primary" href="/dashboard">Open fleet dashboard <ArrowRight size={14}/></Link><Link className="welcome-secondary" href="/station">Manage stations</Link></div><div className="welcome-proof"><span><Check size={12}/> Live fleet monitoring</span><span><Check size={12}/> 67 connected stations</span></div></div><div className="welcome-art"><div className="welcome-bubble one"><Waves size={12}/> Water quality · Good</div><div className="welcome-water"/><div className="welcome-bubble two"><Droplet size={12}/> Tank level · 82%</div></div></section></main></AppShell>;
}

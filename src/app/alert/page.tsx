import { AppShell, PageHeading } from "@/components/AppShell";
import { AlertManager } from "@/components/AlertManager";

export default function AlertPage() {
  return <AppShell title="Alerts"><main className="content"><PageHeading eyebrow="FLEET · NOTIFICATIONS" title="Alert management" subtitle="Alert data and status updates will appear here when the API supports them."/><AlertManager/></main></AppShell>;
}

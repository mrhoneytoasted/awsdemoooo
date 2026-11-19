import { AppShell } from "@/components/AppShell";
import { StationDetail } from "@/components/StationDetail";

export default async function StationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ view?: string }> }) {
  const { id } = await params;
  const { view } = await searchParams;
  return <AppShell key={`${id}-${view ?? "dashboard"}`} title="Station overview"><StationDetail id={id} initialView={view ?? "dashboard"}/></AppShell>;
}

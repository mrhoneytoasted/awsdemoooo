"use client";

import { useEffect, useState } from "react";
import { Activity, AlertCircle, Clock3, Radio } from "lucide-react";

type TelemetrySample = {
  sample_id: string | number;
  device_id: string;
  measured_at: string | null;
  received_at: string;
  raw_payload: {
    demo_value?: number | string | null;
    readings?: { demo_value?: number | string | null };
    test_data?: boolean;
    simulator_index?: number | string;
  };
};

type LoadState = "loading" | "live" | "empty" | "error";

function formatBangkokTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export function LatestTelemetryCard() {
  const [sample, setSample] = useState<TelemetrySample | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let inFlight = false;

    async function refresh() {
      if (inFlight) return;
      inFlight = true;
      try {
        const response = await fetch(
          "/api/telemetry/latest?device_id=" + encodeURIComponent("test-node-01") + "&limit=1",
          { cache: "no-store" },
        );
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "API error: " + response.status);
        }
        if (!payload || !Array.isArray(payload.samples)) {
          throw new Error("Unexpected telemetry response.");
        }

        const latest = (payload.samples[0] ?? null) as TelemetrySample | null;
        if (!active) return;
        setSample(latest);
        setError("");
        setState(latest ? "live" : "empty");
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not refresh telemetry.");
        setState("error");
      } finally {
        inFlight = false;
      }
    }

    void refresh();
    const timer = window.setInterval(() => void refresh(), 4000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const demoValue = sample?.raw_payload.readings?.demo_value ?? sample?.raw_payload.demo_value;
  const hasValue = demoValue !== undefined && demoValue !== null;
  const statusText =
    state === "loading" ? "Connecting" :
    state === "live" ? "Receiving telemetry" :
    state === "empty" ? "No telemetry yet" :
    sample ? "Refresh failed · showing previous sample" : "Could not load telemetry";

  return (
    <section className="panel telemetry-panel" aria-live="polite">
      <div className="telemetry-header">
        <div className="telemetry-title-group">
          <span className="telemetry-icon"><Radio size={16} /></span>
          <div>
            <div className="panel-title">Cloud telemetry</div>
            <div className="panel-caption">Latest sample from test-node-01 · refreshes every 4 seconds</div>
          </div>
        </div>
        <span className={"telemetry-state " + state}>
          <span className="telemetry-state-dot" />
          {statusText}
        </span>
      </div>
      <div className="telemetry-content">
        <div className="telemetry-reading-block">
          <div className="telemetry-reading">{hasValue ? String(demoValue) : "—"}</div>
          <div className="telemetry-reading-label">demo_value · no unit assigned</div>
        </div>
        <div className="telemetry-details">
          <div className="telemetry-detail">
            <span><Clock3 size={12} /> Cloud received</span>
            <strong>{sample ? formatBangkokTime(sample.received_at) : "—"}</strong>
          </div>
          <div className="telemetry-detail">
            <span><Activity size={12} /> Sample ID</span>
            <strong>{sample ? String(sample.sample_id) : "—"}</strong>
          </div>
          <div className="telemetry-detail">
            <span><Radio size={12} /> Device</span>
            <strong>{sample?.device_id ?? "test-node-01"}</strong>
          </div>
          {sample?.raw_payload.simulator_index !== undefined && (
            <div className="telemetry-detail">
              <span><Activity size={12} /> Simulator index</span>
              <strong>{String(sample.raw_payload.simulator_index)}</strong>
            </div>
          )}
        </div>
      </div>
      <div className="telemetry-footer">
        {sample?.raw_payload.test_data === true && <span className="telemetry-demo-badge">Simulated data</span>}
        {sample && <span>Measured at: {sample.measured_at ? formatBangkokTime(sample.measured_at) : "Not provided"}</span>}
        {state === "error" && <span className="telemetry-error"><AlertCircle size={12} /> {error}</span>}
        {state === "empty" && <span className="telemetry-empty">The API returned an empty samples list.</span>}
      </div>
    </section>
  );
}

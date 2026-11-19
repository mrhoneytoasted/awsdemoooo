export type Station = {
  id: string; name: string; location: string; status: "Online" | "Offline" | "Warning";
  level: number; dispensed: number; lastSeen: string; serial: string;
};

export type AlertStatus = "Open" | "Acknowledged" | "Resolved";
export type Alert = {
  id: string; stationId: string; stationName: string; title: string; description: string;
  severity: "Critical" | "Warning" | "Info"; status: AlertStatus; time: string; history: { status: AlertStatus; note: string; time: string }[];
};

export const stations: Station[] = [
  { id: "aws-01", name: "AWS-01", location: "Siam Square · Bangkok", status: "Online", level: 82, dispensed: 1280, lastSeen: "Just now", serial: "AWS-2024-001" },
  { id: "aws-02", name: "AWS-02", location: "CentralWorld · Bangkok", status: "Offline", level: 48, dispensed: 946, lastSeen: "2 hours ago", serial: "AWS-2024-002" },
  { id: "aws-03", name: "AWS-03", location: "Ari · Bangkok", status: "Online", level: 67, dispensed: 1124, lastSeen: "Just now", serial: "AWS-2024-003" },
  { id: "aws-04", name: "AWS-04", location: "Bang Na · Bangkok", status: "Warning", level: 19, dispensed: 1390, lastSeen: "4 min ago", serial: "AWS-2024-004" },
  { id: "aws-05", name: "AWS-05", location: "Sathorn · Bangkok", status: "Online", level: 73, dispensed: 1087, lastSeen: "1 min ago", serial: "AWS-2024-005" },
  { id: "aws-06", name: "AWS-06", location: "Ratchada · Bangkok", status: "Online", level: 91, dispensed: 842, lastSeen: "Just now", serial: "AWS-2024-006" },
];

export const seedAlerts: Alert[] = [
  { id: "ALT-2408", stationId: "aws-02", stationName: "AWS-02", title: "Connection lost", description: "The station has not sent telemetry for 2 hours. Check the network connection and power supply.", severity: "Critical", status: "Open", time: "10:42 AM", history: [{ status: "Open", note: "Alert automatically created after connection timeout.", time: "Today, 10:42 AM" }] },
  { id: "ALT-2407", stationId: "aws-04", stationName: "AWS-04", title: "Low water level", description: "The water tank is below 20% capacity. Refill soon to keep the station available.", severity: "Warning", status: "Acknowledged", time: "09:18 AM", history: [{ status: "Open", note: "Water level dropped below 20%.", time: "Today, 09:18 AM" }, { status: "Acknowledged", note: "Technician assigned to refill the tank.", time: "Today, 09:31 AM" }] },
  { id: "ALT-2406", stationId: "aws-01", stationName: "AWS-01", title: "Flow sensor needs calibration", description: "Flow readings vary from the expected range. Schedule a sensor calibration.", severity: "Warning", status: "Open", time: "08:56 AM", history: [{ status: "Open", note: "Readings outside calibration range.", time: "Today, 08:56 AM" }] },
  { id: "ALT-2403", stationId: "aws-01", stationName: "AWS-01", title: "Humidity sensor needs attention", description: "The humidity sensor is reporting occasional gaps. Check the connector at the next station visit.", severity: "Info", status: "Acknowledged", time: "08:24 AM", history: [{ status: "Open", note: "A short gap was detected in humidity readings.", time: "Today, 08:24 AM" }, { status: "Acknowledged", note: "Added to the next station inspection.", time: "Today, 08:41 AM" }] },
  { id: "ALT-2405", stationId: "aws-03", stationName: "AWS-03", title: "Filter replacement due", description: "The filter has reached its recommended service interval.", severity: "Info", status: "Resolved", time: "Yesterday", history: [{ status: "Open", note: "Maintenance reminder generated.", time: "Yesterday, 02:15 PM" }, { status: "Resolved", note: "Filter replaced during routine maintenance.", time: "Yesterday, 03:02 PM" }] },
  { id: "ALT-2404", stationId: "aws-05", stationName: "AWS-05", title: "Humidity sensor restored", description: "The sensor connection is back to normal.", severity: "Info", status: "Resolved", time: "Yesterday", history: [{ status: "Open", note: "Sensor stopped reporting.", time: "Yesterday, 11:40 AM" }, { status: "Resolved", note: "Connection restored.", time: "Yesterday, 12:04 PM" }] },
];

export const dailyVolumes = [312, 428, 376, 510, 461, 584, 493, 642, 571, 703, 612, 758, 681, 732, 642, 816, 704, 856, 746, 901, 773, 840, 690, 810];
export const hourlyVolumes = [34, 27, 22, 17, 20, 36, 54, 71, 83, 91, 76, 68];

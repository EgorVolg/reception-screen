import { plans, type Client, type Plan } from "../data";

export type MembershipStatus = "active" | "expired" | "no-visits" | "none";

export function getMembershipStatus(client: Client, today: string): MembershipStatus {
  const m = client.membership;
  if (!m) return "none";
  if (m.endDate < today) return "expired";
  if (m.visitsLeft !== null && m.visitsLeft <= 0) return "no-visits";
  return "active";
}

export const STATUS_LABELS: Record<MembershipStatus, string> = {
  active: "Активен",
  expired: "Истёк",
  "no-visits": "Занятия закончились",
  none: "Нет абонемента",
};

export function findPlan(planId: number): Plan | undefined {
  return plans.find((p) => p.id === planId);
}

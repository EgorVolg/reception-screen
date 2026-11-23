import type { Client } from "../data";

export function filterClients(clients: Client[], query: string): Client[] {
  const q = query.trim().toLowerCase();
  if (!q) return clients;
  const digits = q.replace(/\D/g, "");
  return clients.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (digits.length > 0 &&
        c.phone.replace(/\D/g, "").includes(digits)),
  );
}

import { useCallback, useEffect, useState } from "react";
import { clients as initialClients, plans, type Client } from "../data";
import { addDays, todayStr } from "../helpers";

const STORAGE_KEY = "reception-screen:clients:v1";

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialClients;
    const parsed = JSON.parse(raw) as Client[];
    return Array.isArray(parsed) ? parsed : initialClients;
  } catch {
    return initialClients;
  }
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>(loadClients);
  const today = todayStr();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch {
      // ignore storage errors (e.g. quota exceeded)
    }
  }, [clients]);

  const checkIn = useCallback(
    (clientId: number) => {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id !== clientId) return c;
          const m = c.membership;
          const today = todayStr();
          return {
            ...c,
            membership: m
              ? {
                  ...m,
                  visitsLeft:
                    m.visitsLeft === null ? null : Math.max(0, m.visitsLeft - 1),
                }
              : m,
            visits: [today, ...c.visits],
          };
        }),
      );
    },
    [],
  );

  const sellMembership = useCallback((clientId: number, planId: number) => {
    const p = plans.find((pl) => pl.id === planId);
    if (!p) return;
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              membership: {
                planId: p.id,
                endDate: addDays(todayStr(), p.days),
                visitsLeft: p.visits,
              },
            }
          : c,
      ),
    );
  }, []);

  return { clients, today, checkIn, sellMembership };
}

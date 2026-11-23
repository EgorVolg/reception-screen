import { useCallback, useState } from "react";
import { clients as initialClients, plans, type Client } from "../data";
import { addDays, todayStr } from "../helpers";

export function useClients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const today = todayStr();

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

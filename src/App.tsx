import { useMemo, useState } from "react";
import "./App.css";
import { filterClients, findPlan, getMembershipStatus } from "./helpers";
import { useClients } from "./hooks";
import { AppHeader, ClientCard, ClientList } from "./components";

function App() {
  const { clients, today, checkIn, sellMembership } = useClients();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = useMemo(
    () => filterClients(clients, query),
    [clients, query],
  );

  const selected = clients.find((c) => c.id === selectedId) ?? null;
  const status = selected ? getMembershipStatus(selected, today) : "none";
  const plan = selected?.membership
    ? findPlan(selected.membership.planId)
    : undefined;

  return (
    <div className="app">
      <AppHeader query={query} onQueryChange={setQuery} />

      <main className="layout">
        <ClientList
          clients={filtered}
          selectedId={selectedId}
          today={today}
          onSelect={setSelectedId}
        />

        <section className="client-card">
          {!selected && <p className="empty">Выберите клиента</p>}
          {selected && (
            <ClientCard
              client={selected}
              status={status}
              plan={plan}
              onCheckIn={() => checkIn(selected.id)}
              onSell={(planId) => sellMembership(selected.id, planId)}
              onClose={() => setSelectedId(null)}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

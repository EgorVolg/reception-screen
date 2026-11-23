import { useMemo, useState } from "react";
import "./App.css";
import {
  clients as initialClients,
  plans,
  type Client,
  type Plan,
} from "./data";
import { Logo } from "./shared";

function todayStr(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}

type MembershipStatus = "active" | "expired" | "no-visits" | "none";

function getMembershipStatus(client: Client, today: string): MembershipStatus {
  const m = client.membership;
  if (!m) return "none";
  if (m.endDate < today) return "expired";
  if (m.visitsLeft !== null && m.visitsLeft <= 0) return "no-visits";
  return "active";
}

const STATUS_LABELS: Record<MembershipStatus, string> = {
  active: "Активен",
  expired: "Истёк",
  "no-visits": "Занятия закончились",
  none: "Нет абонемента",
};

function findPlan(planId: number): Plan | undefined {
  return plans.find((p) => p.id === planId);
}

function App() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [chosenPlanId, setChosenPlanId] = useState<number>(plans[0].id);

  const today = todayStr();

  const filtered = useMemo(() => {
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
  }, [clients, query]);

  const selected = clients.find((c) => c.id === selectedId) ?? null;
  const status = selected ? getMembershipStatus(selected, today) : "none";
  const hasActive = status === "active";
  const plan = selected?.membership
    ? findPlan(selected.membership.planId)
    : undefined;

  function checkIn(clientId: number) {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const m = c.membership;
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
  }

  function sellMembership(clientId: number) {
    const p = plans.find((pl) => pl.id === chosenPlanId);
    if (!p) return;
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              membership: {
                planId: p.id,
                endDate: addDays(today, p.days),
                visitsLeft: p.visits,
              },
            }
          : c,
      ),
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">
          <Logo className="logo-svg" />
          <h1 className="logo-text">pulsea</h1>
        </span>
        <input
          type="search"
          className="search"
          placeholder="Поиск по имени или телефону"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <main className="layout">
        <section className="client-list">
          {filtered.length === 0 && <p className="empty">Никого не найдено</p>}
          <ul>
            {filtered.map((c) => {
              const st = getMembershipStatus(c, today);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`client-item ${c.id === selectedId ? "selected" : ""}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <span className="client-name">{c.name}</span>
                    <span className="client-phone">{c.phone}</span>
                    <span className={`badge status-${st}`}>
                      {STATUS_LABELS[st]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="client-card">
          {!selected && <p className="empty">Выберите клиента слева</p>}
          {selected && (
            <>
              <div className="card-head">
                <h2>{selected.name}</h2>
                <p className="phone">{selected.phone}</p>
                <span className={`badge status-${status}`}>
                  {STATUS_LABELS[status]}
                </span>
              </div>

              <div className="membership-info">
                {selected.membership && plan ? (
                  <>
                    <div className="info-row">
                      <span>Тариф</span>
                      <strong>{plan.title}</strong>
                    </div>
                    <div className="info-row">
                      <span>Действует до</span>
                      <strong>{formatDate(selected.membership.endDate)}</strong>
                    </div>
                    <div className="info-row">
                      <span>Осталось занятий</span>
                      <strong>
                        {selected.membership.visitsLeft === null
                          ? "Безлимит"
                          : selected.membership.visitsLeft}
                      </strong>
                    </div>
                  </>
                ) : (
                  <p className="muted">У клиента нет абонемента</p>
                )}
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn primary"
                  disabled={!hasActive}
                  onClick={() => checkIn(selected.id)}
                >
                  Отметить посещение
                </button>
                {!hasActive && <p className="hint">Нет активного абонемента</p>}
              </div>

              {!hasActive && (
                <div className="sell">
                  <h3>Продать абонемент</h3>
                  <div className="plans">
                    {plans.map((p) => (
                      <label
                        key={p.id}
                        className={`plan-card ${chosenPlanId === p.id ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          checked={chosenPlanId === p.id}
                          onChange={() => setChosenPlanId(p.id)}
                        />
                        <span className="plan-title">{p.title}</span>
                        <span className="plan-meta">
                          {p.visits === null
                            ? "без ограничений"
                            : `${p.visits} занятий`}{" "}
                          · {p.days} дней
                        </span>
                        <span className="plan-price">
                          {formatPrice(p.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn sell-btn"
                    onClick={() => sellMembership(selected.id)}
                  >
                    Продать
                  </button>
                </div>
              )}

              <div className="visits">
                <h3>История посещений</h3>
                {selected.visits.length === 0 ? (
                  <p className="muted">Посещений пока нет</p>
                ) : (
                  <ul className="visits-list">
                    {[...selected.visits]
                      .sort((a, b) => b.localeCompare(a))
                      .map((d, i) => (
                        <li key={`${d}-${i}`}>{formatDate(d)}</li>
                      ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

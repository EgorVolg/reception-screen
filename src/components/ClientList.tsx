import type { Client } from "../data";
import { getMembershipStatus, STATUS_LABELS } from "../helpers";

interface ClientListProps {
  clients: Client[];
  selectedId: number | null;
  today: string;
  onSelect: (id: number) => void;
}

export function ClientList({ clients, selectedId, today, onSelect }: ClientListProps) {
  return (
    <section className="client-list">
      {clients.length === 0 && <p className="empty">Никого не найдено</p>}
      <ul>
        {clients.map((c) => {
          const st = getMembershipStatus(c, today);
          return (
            <li key={c.id}>
              <button
                type="button"
                className={`client-item ${c.id === selectedId ? "selected" : ""}`}
                onClick={() => onSelect(c.id)}
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
  );
}

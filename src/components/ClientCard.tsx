import type { Client, Plan } from "../data";
import type { MembershipStatus } from "../helpers";
import { STATUS_LABELS } from "../helpers";
import { MembershipInfo } from "./MembershipInfo";
import { SellMembership } from "./SellMembership";
import { VisitHistory } from "./VisitHistory";

interface ClientCardProps {
  client: Client;
  status: MembershipStatus;
  plan: Plan | undefined;
  onCheckIn: () => void;
  onSell: (planId: number) => void;
}

export function ClientCard({ client, status, plan, onCheckIn, onSell }: ClientCardProps) {
  const hasActive = status === "active";

  return (
    <>
      <div className="card-head">
        <h2>{client.name}</h2>
        <p className="phone">{client.phone}</p>
        <span className={`badge status-${status}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="membership-info">
        <MembershipInfo client={client} plan={plan} />
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn primary"
          disabled={!hasActive}
          onClick={onCheckIn}
        >
          Отметить посещение
        </button>
        {!hasActive && <p className="hint">Нет активного абонемента</p>}
      </div>

      {!hasActive && <SellMembership onSell={onSell} />}

      <VisitHistory visits={client.visits} />
    </>
  );
}

import type { Client, Plan } from "../data";
import { formatDate } from "../helpers";

interface MembershipInfoProps {
  client: Client;
  plan: Plan | undefined;
}

export function MembershipInfo({ client, plan }: MembershipInfoProps) {
  if (!client.membership || !plan) {
    return <p className="muted">У клиента нет абонемента</p>;
  }
  return (
    <>
      <div className="info-row">
        <span>Тариф</span>
        <strong>{plan.title}</strong>
      </div>
      <div className="info-row">
        <span>Действует до</span>
        <strong>{formatDate(client.membership.endDate)}</strong>
      </div>
      <div className="info-row">
        <span>Осталось занятий</span>
        <strong>
          {client.membership.visitsLeft === null
            ? "Безлимит"
            : client.membership.visitsLeft}
        </strong>
      </div>
    </>
  );
}

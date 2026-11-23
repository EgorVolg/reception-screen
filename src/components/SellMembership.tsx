import { useState } from "react";
import { plans } from "../data";
import { formatPrice } from "../helpers";

interface SellMembershipProps {
  onSell: (planId: number) => void;
}

export function SellMembership({ onSell }: SellMembershipProps) {
  const [chosenPlanId, setChosenPlanId] = useState<number>(plans[0].id);

  return (
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
            <span className="plan-price">{formatPrice(p.price)}</span>
          </label>
        ))}
      </div>
      <button
        type="button"
        className="btn sell-btn"
        onClick={() => onSell(chosenPlanId)}
      >
        Продать
      </button>
    </div>
  );
}

import { formatDate } from "../helpers";

interface VisitHistoryProps {
  visits: string[];
}

export function VisitHistory({ visits }: VisitHistoryProps) {
  return (
    <div className="visits">
      <h3>История посещений</h3>
      {visits.length === 0 ? (
        <p className="muted">Посещений пока нет</p>
      ) : (
        <ul className="visits-list">
          {[...visits]
            .sort((a, b) => b.localeCompare(a))
            .map((d, i) => (
              <li key={`${d}-${i}`}>{formatDate(d)}</li>
            ))}
        </ul>
      )}
    </div>
  );
}

// Сигнатурный UI-элемент SportFinder: вместо процентного прогресс-бара — ряд
// квадратиков-слотов, как в листе состава команды.
export default function RosterTally({ filled, total }) {
  const squares = Array.from({ length: total }, (_, i) => i < filled);
  return (
    <div className="roster-row">
      <div className="roster-tally">
        {squares.map((isFilled, i) => (
          <div key={i} className={`sq ${isFilled ? 'filled' : ''}`} />
        ))}
      </div>
      <span className="roster-label mono">
        {filled}/{total} {filled >= total ? '· состав собран' : 'набрано'}
      </span>
    </div>
  );
}

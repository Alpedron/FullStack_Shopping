// Reusable message shown when a store or item list has no data yet.
function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <p>{title}</p>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;

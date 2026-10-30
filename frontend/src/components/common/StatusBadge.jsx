export default function StatusBadge({ status }) {
  if (!status) return null;
  const s = status.toLowerCase();
  return <span className={`badge badge-${s}`}>{status.replace(/_/g, " ")}</span>;
}
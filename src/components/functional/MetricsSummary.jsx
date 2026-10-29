function MetricsSummary({ total, completed, pending }) {
  return (
    <div className="metrics">
      <div className="metric"><strong>{total}</strong><span>Total</span></div>
      <div className="metric"><strong>{pending}</strong><span>Pending</span></div>
      <div className="metric"><strong>{completed}</strong><span>Done</span></div>
    </div>
  );
}

export default MetricsSummary;
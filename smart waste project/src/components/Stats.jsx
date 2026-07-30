const statistics = [
  { value: "10K+", label: "Items scanned" },
  { value: "95%", label: "Recognition accuracy" },
  { value: "500+", label: "Recycling centers" },
  { value: "12 tons", label: "Waste saved" }
];

export default function Stats() {
  return (
    <section className="stats" id="stats">
      <div className="section-heading">
        <p className="eyebrow">Impact in numbers</p>
        <h2>Track progress with simple, meaningful metrics.</h2>
      </div>

      <div className="stats-grid">
        {statistics.map((item) => (
          <article key={item.label} className="stat-card">
            <span className="stat-chip">{item.label}</span>
            <h3>{item.value}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

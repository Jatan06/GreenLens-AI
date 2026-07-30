const steps = [
  {
    number: "01",
    title: "Scan the item",
    icon: "📷",
    description: "Use the app to capture waste with your camera and get instant material classification."
  },
  {
    number: "02",
    title: "Sort automatically",
    icon: "🔁",
    description: "Smart sorting recommendations send items to the right disposal or recycling stream."
  },
  {
    number: "03",
    title: "Track your impact",
    icon: "📈",
    description: "Monitor savings, pickup efficiency, and carbon reductions in one dashboard."
  }
];

export default function HowItWorks() {
  return (
    <section className="workflow" id="workflow">
      <div className="section-heading">
        <p className="eyebrow">How it works</p>
        <h2>Three simple steps to smarter waste management.</h2>
        <p>
          From item scanning to routing and impact tracking, our platform makes every
          recycle step effortless and intelligent.
        </p>
      </div>

      <div className="workflow-grid">
        {steps.map((step) => (
          <article key={step.title} className="workflow-card">
            <div className="workflow-avatar">{step.icon}</div>
            <div className="workflow-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

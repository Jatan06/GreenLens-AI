import { useState } from "react";

const featureItems = [
  {
    title: "Waste Detection",
    icon: "♻",
    description: "Classifies waste instantly using camera input and smart models."
  },
  {
    title: "Recycling Centers",
    icon: "📍",
    description: "Find nearby drops and route pickups with optimized location data."
  },
  {
    title: "Reward Points",
    icon: "🎁",
    description: "Earn incentives for responsible recycling and reuse behaviors."
  },
  {
    title: "Analytics",
    icon: "📊",
    description: "Track waste trends and community impact over time."
  },
  {
    title: "Smart Collection",
    icon: "🚛",
    description: "Automate pickup scheduling using fill-level predictions."
  },
  {
    title: "Sustainability Score",
    icon: "🌍",
    description: "Measure environmental savings from smarter disposal."
  }
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(null);

  const handleClick = (title) => {
    setActiveFeature(title);
    window.setTimeout(() => {
      setActiveFeature(null);
    }, 220);
  };

  return (
    <section className="features" id="features">
      <div className="section-heading">
        <p className="eyebrow">What we offer</p>
        <h2>Features built for smarter waste management.</h2>
      </div>

      <div className="features-grid">
        {featureItems.map((feature) => (
          <article
            key={feature.title}
            className={`feature-card ${activeFeature === feature.title ? "feature-active" : ""}`}
            onClick={() => handleClick(feature.title)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                handleClick(feature.title);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

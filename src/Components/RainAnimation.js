import React from "react";
import "./rain.css";

function RainAnimation() {

  const drops = Array.from({ length: 80 });

  return (
    <div className="rain-container">

      {drops.map((_, index) => (
        <span
          key={index}
          className="raindrop"
          style={{
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 2 + "s"
          }}
        />
      ))}

    </div>
  );
}

export default RainAnimation;
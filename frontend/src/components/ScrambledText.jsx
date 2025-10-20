import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ScrambledText.css";

export default function ScrambledText({ children, className = "" }) {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const chars = el.textContent.split("");
    el.textContent = "";

    chars.forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("char");
      el.appendChild(span);
    });

    const spans = el.querySelectorAll(".char");

    const handleMove = (e) => {
      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
          gsap.to(span, {
            duration: 0.2,
            textContent: randomChar,
            onComplete: () => {
              gsap.to(span, { duration: 0.3, textContent: span.dataset.orig || span.textContent });
            },
          });
        }
      });
    };

    spans.forEach((span) => (span.dataset.orig = span.textContent));
    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  return (
    <div ref={textRef} className={`text-block ${className}`}>
      {children}
    </div>
  );
}

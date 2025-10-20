import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ScrambledText.css";

export default function ScrambledText({ children, className = "" }) {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Guardar nodos originales con colores
    const childNodes = Array.from(el.childNodes);

    el.textContent = ""; // limpiar contenido

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // texto simple
        Array.from(node.textContent).forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.classList.add("char");
          if (char === " ") span.style.display = "inline"; // espacios normales
          el.appendChild(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // elemento con clase (verde, amarillo, rojo)
        Array.from(node.textContent).forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.classList.add("char");
          // copiar clase de color
          if (node.classList.contains("verde")) span.classList.add("verde");
          if (node.classList.contains("amarillo")) span.classList.add("amarillo");
          if (node.classList.contains("rojo")) span.classList.add("rojo");
          if (char === " ") span.innerHTML = "&nbsp;"; // para mantener espacios
          el.appendChild(span);
        });
      }
    });

    const spans = el.querySelectorAll(".char");

    spans.forEach((span) => (span.dataset.orig = span.textContent));

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
              gsap.to(span, {
                duration: 0.3,
                textContent: span.dataset.orig,
              });
            },
          });
        }
      });
    };

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

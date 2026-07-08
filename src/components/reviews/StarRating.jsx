import { useState } from "react";

function IconStar({ filled, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.6l-6.1 3.1 1.5-6.7L2.3 9.4l6.8-.7L12 2.5z" />
    </svg>
  );
}

/**
 * Star rating component.
 *
 * Interactive mode (default): pass `value` + `onChange` to let the user pick 1-5.
 * Read-only mode: pass `readOnly` to just display a rating (e.g. an average).
 */
function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "h-8 w-8",
}) {
  const [hovered, setHovered] = useState(0);

  const displayValue = readOnly ? value : hovered || value;

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const filled = star <= Math.round(displayValue);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={`${
              readOnly ? "cursor-default" : "cursor-pointer transition hover:scale-110"
            } ${filled ? "text-amber-400" : "text-slate-300"}`}
          >
            <IconStar filled={filled} className={size} />
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;

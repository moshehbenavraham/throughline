import type { HabitFrequency } from "@/lib/habits";
import { DAY_LABELS } from "@/lib/habits";

interface FrequencyPickerProps {
  value: HabitFrequency;
  onChange: (freq: HabitFrequency) => void;
}

const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function FrequencyPicker({ value, onChange }: FrequencyPickerProps) {
  const mode = value.type;

  return (
    <div>
      <label id="frequency-label" className="text-sm font-medium text-foreground mb-2 block">Frequency</label>

      {/* Segmented control — radiogroup pattern: one selection at a time */}
      <div
        role="radiogroup"
        aria-labelledby="frequency-label"
        className="flex gap-1 rounded-xl bg-muted p-1 mb-3"
      >
        {([
          { type: "daily" as const, label: "Daily" },
          { type: "weekdays" as const, label: "Specific days" },
          { type: "weekly" as const, label: "Per week" },
        ]).map(({ type, label }) => {
          const isActive = mode === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => {
                if (type === "daily") onChange({ type: "daily" });
                else if (type === "weekdays") onChange({ type: "weekdays", days: [1, 3, 5] });
                else onChange({ type: "weekly", times: 3 });
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted ${
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Weekday toggles — multi-select checkboxes (one or more days) */}
      {mode === "weekdays" && value.type === "weekdays" && (
        <div
          role="group"
          aria-label="Days of week"
          className="flex gap-1.5"
        >
          {DAY_LABELS.map((label, i) => {
            const selected = value.days.includes(i);
            return (
              <button
                key={i}
                type="button"
                aria-pressed={selected}
                aria-label={FULL_DAY_NAMES[i]}
                onClick={() => {
                  const days = selected
                    ? value.days.filter((d) => d !== i)
                    : [...value.days, i].sort();
                  if (days.length > 0) onChange({ type: "weekdays", days });
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">{label.charAt(0)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Times per week stepper */}
      {mode === "weekly" && value.type === "weekly" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ type: "weekly", times: Math.max(1, value.times - 1) })}
            disabled={value.times <= 1}
            aria-label="Decrease times per week"
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground font-medium hover:bg-muted/80 transition-colors active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <span aria-hidden="true">−</span>
          </button>
          <span
            role="status"
            aria-live="polite"
            aria-label={`${value.times} times per week`}
            className="font-mono text-lg font-semibold text-foreground tabular-nums w-12 text-center"
          >
            {value.times}×
          </span>
          <button
            type="button"
            onClick={() => onChange({ type: "weekly", times: Math.min(7, value.times + 1) })}
            disabled={value.times >= 7}
            aria-label="Increase times per week"
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground font-medium hover:bg-muted/80 transition-colors active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <span aria-hidden="true">+</span>
          </button>
          <span className="text-sm text-muted-foreground">per week</span>
        </div>
      )}
    </div>
  );
}

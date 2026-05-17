import { useState, useEffect, useId, useRef } from "react";
import { X, Bell } from "lucide-react";
import { HABIT_COLORS, createHabit } from "@/lib/habits";
import type { Habit, HabitFrequency } from "@/lib/habits";
import { FrequencyPicker } from "@/components/FrequencyPicker";

const COLOR_NAMES: Record<string, string> = {
  "oklch(0.38 0.08 160)": "Forest",
  "oklch(0.55 0.15 200)": "Ocean",
  "oklch(0.60 0.15 50)": "Amber",
  "oklch(0.50 0.15 320)": "Berry",
  "oklch(0.55 0.12 270)": "Lavender",
  "oklch(0.50 0.10 100)": "Olive",
};

interface AddHabitSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (habit: Habit) => void;
}

const MAX_NAME = 40;

export function AddHabitSheet({ open, onClose, onAdd }: AddHabitSheetProps) {
  const titleId = useId();
  const nameId = useId();
  const descId = useId();
  const colorLabelId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';

    // Esc closes the sheet — matches the standard modal-dialog contract.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Focus the name field once mounted so keyboard users can start typing.
    const t = window.setTimeout(() => nameInputRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [frequency, setFrequency] = useState<HabitFrequency>({ type: "daily" });
  const [reminderTime, setReminderTime] = useState("");
  const [showReminder, setShowReminder] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(createHabit(name.trim(), description.trim(), selectedColor, frequency, reminderTime || null));
    setName("");
    setDescription("");
    setSelectedColor(HABIT_COLORS[0]);
    setFrequency({ type: "daily" });
    setReminderTime("");
    setShowReminder(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border p-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] animate-spring-up max-h-[85vh] overflow-y-auto"
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-5" aria-hidden="true">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 id={titleId} className="text-lg font-semibold text-foreground">New habit</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={nameId} className="text-sm font-medium text-foreground">Name</label>
              <span
                aria-live="polite"
                className={`text-[11px] tabular-nums ${name.length >= MAX_NAME ? "text-destructive" : "text-muted-foreground"}`}
              >
                {name.length}/{MAX_NAME}
              </span>
            </div>
            <input
              id={nameId}
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
              placeholder="e.g. Morning walk"
              maxLength={MAX_NAME}
              autoComplete="off"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor={descId} className="text-sm font-medium text-foreground mb-1.5 block">
              Description (optional)
            </label>
            <input
              id={descId}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short note about this habit"
              autoComplete="off"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
            />
          </div>

          <FrequencyPicker value={frequency} onChange={setFrequency} />

          <div>
            <span id={colorLabelId} className="text-sm font-medium text-foreground mb-2 block">Color</span>
            <div
              role="radiogroup"
              aria-labelledby={colorLabelId}
              className="flex gap-3 items-center"
            >
              {HABIT_COLORS.map((c) => {
                const isActive = selectedColor === c;
                const colorName = COLOR_NAMES[c] || c;
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    aria-label={colorName}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-full transition-all duration-200 active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:ring-ring ${
                      isActive
                        ? "ring-2 ring-offset-2 ring-offset-card ring-ring scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">{COLOR_NAMES[selectedColor] || "Custom"}</p>
          </div>

          {/* Reminder */}
          <div>
            <button
              type="button"
              onClick={() => setShowReminder(!showReminder)}
              aria-expanded={showReminder}
              className="flex items-center gap-2 text-sm font-medium text-foreground rounded outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <Bell className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              Reminder
              <span className="text-[11px] text-muted-foreground">(optional)</span>
            </button>
            {showReminder && (
              <div className="mt-2">
                <label htmlFor="add-reminder-time" className="sr-only">Reminder time</label>
                <input
                  id="add-reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
                {reminderTime && (
                  <button
                    type="button"
                    onClick={() => { setReminderTime(""); setShowReminder(false); }}
                    className="ml-2 text-xs text-muted-foreground hover:text-foreground rounded outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Add habit
          </button>
        </form>
      </div>
    </div>
  );
}

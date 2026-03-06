export function ProgressStepper({
  steps = ["Remitter", "Amount", "Verification", "Recipient", "Documents", "Confirm"],
  activeStep = 0,
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      {steps.map((step, i) => {
        const isCompleted = i < activeStep;
        const isActive = i === activeStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${isActive ? "text-accent" : "text-primary/50"}`}>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border
                ${isCompleted || isActive ? "bg-accent  border-[var(--border-clr)]/50 text-white" : " border-[var(--border-clr)] text-primary"}`}
              >
                {i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block">{step}</span>
            </div>

            {i < steps.length - 1 && <div className={`w-6 h-px ${i < activeStep ? "bg-primary" : "bg-accent/50"}`} />}
          </div>
        );
      })}
    </div>
  );
}

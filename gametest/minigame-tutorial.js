class MinigameTutorialOverlay {
  constructor(steps = []) {
    this.steps = steps;
    this.index = 0;
    this.completed = steps.length === 0;
  }

  static fromOptions(options = {}) {
    const tutorial = options.tutorial;
    if (!tutorial) return new MinigameTutorialOverlay();

    const speaker = tutorial.speaker || "파미니";
    const rawSteps = Array.isArray(tutorial) ? tutorial : tutorial.steps;
    const steps = Array.isArray(rawSteps)
      ? rawSteps
          .map((step) => (typeof step === "string" ? { speaker, text: step } : step))
          .filter((step) => step && step.text)
          .map((step) => ({
            speaker: step.speaker || speaker,
            text: step.text
          }))
      : [];

    return new MinigameTutorialOverlay(steps);
  }

  isActive() {
    return !this.completed;
  }

  getCurrentStep() {
    return this.steps[this.index] || null;
  }

  advance() {
    if (this.completed) return true;

    this.index += 1;
    if (this.index >= this.steps.length) {
      this.completed = true;
      return true;
    }

    return false;
  }
}

if (typeof module !== "undefined") {
  module.exports = { MinigameTutorialOverlay };
}

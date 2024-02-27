export class Reporter {
  // state
  //   currentStep = undefined;
  //   timers = {}; // object of type [key: string]: {message: string, timer: Date}

  addTimer(key, message) {
    this.timers[key] = { message, timer: new Date() };
  }
  removeTimer(key) {
    delete this.timers[key];
  }

  setStep(step) {
    this.currentStep = step;
  }

  constructor(startStep = undefined) {
    this.currentStep = startStep;
    this.timers = {};
  }

  /**
   * Log message with current step.
   */
  log(message) {
    if (this.currentStep) {
      console.log(`${this.currentStep}: ${message}`);
    } else {
      console.log(message);
    }
  }

  /**
   * Log message with current step and any active timers.
   */
  report(message) {
    this.log(message);
    for (let key of Object.keys(this.timers)) {
      this.log(
        `TIMER: ${this.timers[key].message}: ${checkTimer(
          this.timers[key].timer
        )}`
      );
    }
  }
}

export function checkTimer(startDate) {
  let millisecondsElapsed = Math.abs(startDate - new Date());
  let secondsElapsed = millisecondsElapsed / 1000;
  let minutes = Math.floor(secondsElapsed / 60);
  let seconds = Math.round(secondsElapsed - minutes * 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

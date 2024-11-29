
const startEaseFactor = 2.5;
const startInterval = 0.4;
const easeFactorDecrement = 0.15;
const minimumEaseFactor = 1.3;
const easeFactorIncrement = 0.1;

export enum REVIEW_OUTCOME {
  CORRECT = "correct",
  WRONG = "wrong"
}

export const reviewCard = (
  reviewOutcome: REVIEW_OUTCOME,
  interval = startInterval,
  easeFactor = startEaseFactor,
) => {
  if (reviewOutcome === REVIEW_OUTCOME.CORRECT) {
    interval = interval * easeFactor;
    easeFactor = Math.min(easeFactor + easeFactorIncrement, startEaseFactor);
  } else if (reviewOutcome === REVIEW_OUTCOME.WRONG) {
    easeFactor = Math.max(easeFactor - easeFactorDecrement, minimumEaseFactor);
    interval = startInterval;
  }

  return {
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    interval: parseFloat(interval.toFixed(2)),
  };
}
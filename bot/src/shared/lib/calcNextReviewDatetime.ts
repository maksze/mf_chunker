import { addDays } from "date-fns";

export const calcNextReviewDatetime = (days = 1, startDate = new Date()) => {
  const resultDate = addDays(new Date(), days);

  return resultDate < startDate ? startDate : resultDate;
}
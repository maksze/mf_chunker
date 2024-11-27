export function convertSecondsToHHMMSS(seconds: number): string {
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const remainingSeconds: number = seconds % 60;

  const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}
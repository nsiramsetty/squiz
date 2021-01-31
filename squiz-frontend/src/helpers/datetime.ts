/**
 * convert seconds into hour, min and seconds
 */
export const secondsToHms = (seconds: number) => {
  const digit = Number(seconds);
  const h = Math.floor(digit / 3600);
  const m = Math.floor((digit % 3600) / 60);
  const s = Math.floor((digit % 3600) % 60);

  const hDisplay = h > 0 ? `${h}h` : '';
  const mDisplay = m > 0 ? `${m}m` : '';
  const sDisplay = s > 0 ? `${s}s` : '';

  if (hDisplay.trim()) {
    return hDisplay;
  }
  if (mDisplay.trim()) {
    return mDisplay;
  }
  if (sDisplay.trim()) {
    return sDisplay;
  }
};

/**
 * to format seconds to mm:ss format
 */
export const formatTime = (seconds: number) => {
  let minutes;
  let sec;
  minutes = Math.floor(seconds / 60);
  minutes = minutes >= 10 ? minutes : `0${minutes}`;
  sec = Math.floor(seconds % 60);
  sec = sec >= 10 ? sec : `0${sec}`;
  return `${minutes}:${sec}`;
};

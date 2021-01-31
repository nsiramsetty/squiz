/**
 * to get device info
 */
export const getMobileOperatingSystem = () => {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'unknown';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
};

export const debounce = (func: any, delay: number) => {
  let debounceTimer: any;
  return function() {
    // @ts-ignore
    const context = this;
    // @ts-ignore
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

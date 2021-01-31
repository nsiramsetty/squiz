/**
 * To combine multiple JSS objects
 * @param  {...any} styles - jss style object
 */
export const combineStyles = (...styles: any) => {
  return (theme: any) => {
    const outStyles = styles.map((arg: any) => {
      // Apply the "theme" object for style functions.
      if (typeof arg === 'function') {
        return arg(theme);
      }
      // Objects need no change.
      return arg;
    });

    return outStyles.reduce((acc: any, val: any) => Object.assign(acc, val));
  };
};

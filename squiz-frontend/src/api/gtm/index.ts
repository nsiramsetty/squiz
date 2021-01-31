/**
 * for ga -14 profile
 */

function getDatalayer() {
  if (!(window as any).dataLayer) {
    (window as any).dataLayer = [];
  }
  return (window as any).dataLayer;
}

/**
 * push datalayer
 */
export const pushDataLayer = (data: object) => {
  try {
    getDatalayer().push(data);
  } catch (err) {
    console.log('caught error pushing datalayer', err);
  }
};

export const reset = () => {
  try {
    const gtm = (window as any).google_tag_manager['GTM-5S2LT22'];
    gtm.dataLayer.reset();
  } catch (err) {
    console.log('caught error resetting gtm', err);
  }
};

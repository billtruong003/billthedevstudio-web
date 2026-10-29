/** Runs in <head> before the first paint: a weak device (2 cores or fewer, 2 GB of memory or less, or data saver on)
 *  gets `lite` on <html>, which turns the site's motion off. The OS "reduce motion" switch is not used: on Windows it
 *  follows "Animation effects", which plenty of people turn off for speed, and the site would lose all its motion.
 *  `js` goes on first, so content that waits to be revealed is never hidden from a browser without scripts. */
export const LITE_SCRIPT = `document.documentElement.classList.add("js");try{var n=navigator;if((n.hardwareConcurrency||8)<=2||(n.deviceMemory||8)<=2||(n.connection&&n.connection.saveData))document.documentElement.classList.add("lite")}catch(e){}`;

export const isLite = () => typeof document !== "undefined" && document.documentElement.classList.contains("lite");


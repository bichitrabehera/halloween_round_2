export function getScaleFactor(
  baseWidth = 1920,
  baseHeight = 1265,
  min = 0.4,
  max = 2.0
) {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth || baseWidth;
  const h = window.innerHeight || baseHeight;
  const widthFactor = w / baseWidth;
  const heightFactor = h / baseHeight;
  // Use the smaller factor so we fit within both dimensions
  const factor = Math.min(widthFactor, heightFactor);
  return Math.max(min, Math.min(max, factor));
}

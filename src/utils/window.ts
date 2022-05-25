/**
 * Get the features with width/height/top/left for vertically and 
 * horizontally positioning a pop-ups window.
 * @param customWidth 
 * @param customHeight 
 * @returns For example: "width=600,height=600,top=100,left=100"
 */
export function getPopUpsWindowFeatures(
  customWidth?: number,
  customHeight?: number
): string {
  const features = {
    width: Number(process.env.NEXT_PUBLIC_POPS_UP_WINDOW_WIDTH),
    height: Number(process.env.NEXT_PUBLIC_POPS_UP_WINDOW_HEIGHT),
    top: 0,
    left: 0,
  };
  if (customWidth !== undefined && customWidth > 0)
    features.width = customWidth;
  if (customHeight !== undefined && customHeight > 0)
    features.height = customHeight;

  const topWindow = window.top;
  if (topWindow) {
    features.top =
      (topWindow.outerHeight >> 1) + topWindow.screenY - (features.height >> 1);
    features.left =
      (topWindow.outerWidth >> 1) + topWindow.screenX - (features.width >> 1);
  }

  return Object.entries(features)
    .map((entry) => {
      const key = String(entry[0]);
      const val = String(entry[1]);
      return "".concat(key, "=").concat(val);
    })
    .join(",");
}

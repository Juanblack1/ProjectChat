export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";
  if (/^(data:|blob:|https?:\/\/|\/)/.test(assetPath)) return assetPath;
  return assetPath;
};

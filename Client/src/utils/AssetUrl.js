export const getAssetUrl = (assetPath, host) => {
  if (!assetPath) return "";
  if (/^(data:|blob:|https?:\/\/|\/)/.test(assetPath)) return assetPath;
  return `${host}/${assetPath}`;
};

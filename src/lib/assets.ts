const BASE_PATH = "/nikkei-z";

export const assetPath = (path: string) =>
  `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;

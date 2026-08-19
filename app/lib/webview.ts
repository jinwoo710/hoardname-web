export function isKakaoWebView(): boolean {
  if (typeof window === 'undefined') return false;
  return /kakaotalk/i.test(window.navigator.userAgent);
}

export function openInExternalBrowser(url: string = window.location.href) {
  window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
}

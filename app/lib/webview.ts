export function isKakaoWebView(): boolean {
  if (typeof window === 'undefined') return false;
  return /kakaotalk/i.test(window.navigator.userAgent);
}

export function openInExternalBrowser(url: string = window.location.href) {
  window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
}

// 외부 브라우저로 넘어간 뒤 자동으로 구글 로그인이 이어지도록,
// 현재 페이지 URL에 autoLogin 파라미터를 붙여준다.
// (AutoGoogleLogin 컴포넌트가 이 파라미터를 감지해서 signIn을 호출함)
export function buildGoogleAutoLoginUrl(
  path: string = window.location.pathname + window.location.search
): string {
  const url = new URL(path, window.location.origin);
  url.searchParams.set('autoLogin', 'google');
  return url.toString();
}

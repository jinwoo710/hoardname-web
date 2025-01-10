export const closeKakaoWebView = () => {
  if (typeof window === 'undefined') return;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const currentUrl = window.location.href;
  
  // Android
  if (userAgent.indexOf("android") > -1) {
    window.location.href = "kakaotalk://inappbrowser/close";
    // 약간의 지연 후 현재 URL을 Chrome으로 열기
    setTimeout(() => {
      window.location.href = 'googlechrome://navigate?url=' + encodeURIComponent(currentUrl);
    }, 100);
  } 
  // iOS
  else if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1) {
    window.location.href = "kakaoweb://closeBrowser";
    // 약간의 지연 후 현재 URL을 Safari로 열기
    setTimeout(() => {
      window.location.href = currentUrl;
    }, 100);
  }
  // 기타 (PC 등)
  else {
    window.location.href = currentUrl;
  }
};

export const isKakaoWebView = () => {
  if (typeof window === 'undefined') return false;
  return window.navigator.userAgent.toLowerCase().indexOf("kakaotalk") > -1;
};

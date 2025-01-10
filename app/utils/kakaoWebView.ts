export const closeKakaoWebView = () => {
  if (typeof window === "undefined") return;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const currentUrl = window.location.href;

  if (userAgent.indexOf("android") > -1) {
    window.location.href = "kakaotalk://inappbrowser/close";
    setTimeout(() => {
      window.location.href =
        "googlechrome://navigate?url=" + encodeURIComponent(currentUrl);
    }, 100);
  } else if (
    userAgent.indexOf("iphone") > -1 ||
    userAgent.indexOf("ipad") > -1
  ) {
    window.location.href = "kakaoweb://closeBrowser";
    setTimeout(() => {
      window.location.href = currentUrl;
    }, 100);
  } else {
    window.location.href = currentUrl;
  }
};

export const isKakaoWebView = () => {
  if (typeof window === "undefined") return false;
  return window.navigator.userAgent.toLowerCase().indexOf("kakaotalk") > -1;
};

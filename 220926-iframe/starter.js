


(() => {
  const target = document.getElementById("app");
  const iframe = document.createElement("iframe");
  iframe.width = 360;
  iframe.height = 360;
  iframe.frameBorder = "0";
  iframe.scrolling = "no";
  iframe.marginWidth = 0;
  iframe.marginHeight = 0;
  iframe.sandbox="allow-top-navigation allow-scripts allow-same-origin";

  const src = "https://geerpm.github.io/220926-iframe/";
  iframe.src = src;

  target.appendChild(iframe);
  
  console.log(document.referrer);
  console.log(`--------`);
})();
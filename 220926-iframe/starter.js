const BASE_URL = `https://geerpm.github.io/220926-iframe/`;

(() => {
  // 即時
  embedIfTargetExists();
})();

window.addEventListener("DOMContentLoaded", (event) => {
  // loaded
  setTimeout(() => embedIfTargetExists(), 1000);
});

async function embedIfTargetExists() {
  console.log(`-------    start 10s`);
  const searchTargetAttr = "data-sample";
  const embedParamsAttrPrefix = "data-";
  const promises = Array.from(
    document.querySelectorAll(`[${searchTargetAttr}]`)
  ).map(async (targetEl) => {
    const targetEmbedType = targetEl.getAttribute(searchTargetAttr);
    if (!targetEmbedType || targetEmbedType.startsWith("done-")) {
      return;
    }
    const data = Object.fromEntries(
      Array.from(targetEl.attributes)
        .filter((attr) => attr.nodeName.startsWith(embedParamsAttrPrefix))
        .map((attr) => [
          "x-" + attr.nodeName.substring(embedParamsAttrPrefix.length),
          attr.value
        ])
    );
    targetEl.setAttribute(searchTargetAttr, `done-${targetEmbedType}`);

    // iframe構築
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `
    position: relative;
    height: 100%;
    width: 100%;
    border: 0;
    overflow: hidden;
    `;
    iframe.sandbox.add(
      "allow-top-navigation",
      "allow-scripts",
      "allow-same-origin"
    );

    const src = `${BASE_URL}?${targetEmbedType}`;
    iframe.src = src;
    targetEl.appendChild(iframe);
    // try {
    //   const res = await fetch(src, {
    //     method: "GET",
    //     mode: "cors",
    //     credentials: "include",
    //     headers: {
    //       ...data
    //     }
    //   });
    //   const resData = await res.text();
    //   console.log(resData);
    //   const blob = new Blob([resData], { type: "text/html" });
    //   console.log(`-------    444`);
    //   iframe.src = URL.createObjectURL(blob);
    //   // iframe.src = src;
    //   targetEl.appendChild(iframe);
    // } catch (e) {
    //   // TODO error
    //   console.log(`-------    566`);
    //   return;
    // }
  });
  await Promise.all(promises);
}

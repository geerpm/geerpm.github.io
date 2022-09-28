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

    iframe.src = "about:blank";
    targetEl.appendChild(iframe);

    const src = `${BASE_URL}?${targetEmbedType}`;
    try {
      const res = await fetch(src, {
        method: "GET",
        headers: {
          ...data
        }
      });
      iframe.src = URL.createObjectURL(await res.blob());
    } catch (e) {
      // TODO error
      return;
    }
  });
  await Promise.all(promises);
}

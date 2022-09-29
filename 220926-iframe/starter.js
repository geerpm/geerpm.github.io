const BASE_URL = `https://geerpm.github.io/220926-iframe/`;
const searchTargetAttr = "data-sample";
const embedParamsAttrPrefix = "data-";

(() => {
  // 即時
  embedIfTargetExists(document);
  // 一度だけ実行
  insertSizingCss(document);
})();

window.addEventListener("DOMContentLoaded", (event) => {
  // loaded
  setTimeout(() => embedIfTargetExists(document), 1000);
});
window.addEventListener("message", (event) => {
  // TODO
  // if (e.origin !== "https://domain") {
  //    return;
  // }
  doc.querySelectorAll(`[${searchTargetAttr}]`);
  iframe.style.height = e.data + 40 + "px";
});

async function embedIfTargetExists(doc) {
  console.log(`-------    start 10s`);
  const promises = Array.from(
    doc.querySelectorAll(`[${searchTargetAttr}]`)
  ).map(async (targetEl) => {
    console.log(targetEl);
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
    const iframe = doc.createElement("iframe");
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

    const filename = ((type) => {
      if (type === "list") return "list.html";
      return "index.html";
    })(targetEmbedType);
    const src = `${BASE_URL}${filename}`;
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

function insertSizingCss(doc) {
  console.log(`-------    add style 2222`);
  const style = doc.createElement("style");
  doc.head.appendChild(style);
  const styleSheet = style.sheet;

  styleSheet.insertRule(`@media screen and ( max-width:520px) {
    [data-sample="done-index"] {
      height: 560px;
    }
    [data-sample="done-list"] {
      height: calc(100vw * 9.16);
    }
  }`);
  styleSheet.insertRule(`@media screen and (min-width:521px) and ( max-width:849px) {
    [data-sample="done-index"] {
      height: 380px;
    }
    [data-sample="done-list"] {
      height: calc(100vw * 2.085);
    }
  }`);
  styleSheet.insertRule(`@media screen and (min-width:850px) {
    [data-sample="done-index"] {
      height: 520px;
      max-width: 1200px;
    }
    [data-sample="done-list"] {
      height: calc(100vw * 1.29);
    }
  }`);
}

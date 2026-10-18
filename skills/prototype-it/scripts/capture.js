async () => {
  const RECEIVER = "http://127.0.0.1:4799/";
  const URL_PATTERN = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

  const toDataUrl = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return url;
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(url);
        reader.readAsDataURL(blob);
      });
    } catch {
      return url;
    }
  };

  const inlineCssUrls = async (cssText, base) => {
    const refs = new Set();
    for (const match of cssText.matchAll(URL_PATTERN)) {
      if (!match[2].startsWith("data:") && !match[2].startsWith("#")) refs.add(match[2]);
    }
    const inlined = new Map();
    for (const ref of refs) inlined.set(ref, await toDataUrl(new URL(ref, base).href));
    return cssText.replace(URL_PATTERN, (whole, quote, ref) =>
      inlined.has(ref) ? `url("${inlined.get(ref)}")` : whole,
    );
  };

  const collectSheet = async (sheet) => {
    const base = sheet.href || location.href;
    let rules;
    try {
      rules = [...sheet.cssRules];
    } catch {
      if (!sheet.href) return "";
      try {
        return await inlineCssUrls(await (await fetch(sheet.href)).text(), sheet.href);
      } catch {
        return "";
      }
    }
    let text = "";
    for (const rule of rules) {
      text += rule instanceof CSSImportRule && rule.styleSheet
        ? await collectSheet(rule.styleSheet)
        : rule.cssText + "\n";
    }
    return inlineCssUrls(text, base);
  };

  let css = "";
  for (const sheet of [...document.styleSheets, ...(document.adoptedStyleSheets || [])]) {
    if (sheet.disabled) continue;
    const media = sheet.media && sheet.media.mediaText;
    const text = await collectSheet(sheet);
    css += media && media !== "all" ? `@media ${media} {\n${text}}\n` : text;
  }

  const doc = document.documentElement.cloneNode(true);
  const pairs = (selector) => {
    const copies = doc.querySelectorAll(selector);
    return [...document.querySelectorAll(selector)].map((el, i) => [el, copies[i]]);
  };

  for (const [el, copy] of pairs("a[href]")) copy.setAttribute("href", el.href);

  for (const [el, copy] of pairs("input, textarea, select")) {
    if (el.type === "checkbox" || el.type === "radio") {
      el.checked ? copy.setAttribute("checked", "") : copy.removeAttribute("checked");
    } else if (el.tagName === "SELECT") {
      [...copy.options].forEach((option, i) =>
        el.options[i].selected ? option.setAttribute("selected", "") : option.removeAttribute("selected"),
      );
    } else if (el.tagName === "TEXTAREA") {
      copy.textContent = el.value;
    } else if (el.type === "password" || el.type === "file") {
      copy.removeAttribute("value");
    } else {
      copy.setAttribute("value", el.value);
    }
  }

  for (const [el, copy] of pairs("img")) {
    const src = el.currentSrc || el.src;
    if (src) copy.setAttribute("src", await toDataUrl(src));
    copy.removeAttribute("srcset");
    copy.removeAttribute("sizes");
    copy.removeAttribute("loading");
  }
  doc.querySelectorAll("picture source").forEach((node) => node.remove());

  for (const [el, copy] of pairs("canvas")) {
    try {
      const img = document.createElement("img");
      img.src = el.toDataURL();
      for (const attr of el.attributes) img.setAttribute(attr.name, attr.value);
      img.style.width = `${el.clientWidth}px`;
      img.style.height = `${el.clientHeight}px`;
      copy.replaceWith(img);
    } catch {
      // A canvas tainted by cross-origin content cannot be read; it stays blank in the capture.
    }
  }

  for (const el of doc.querySelectorAll('[style*="url("]')) {
    el.setAttribute("style", await inlineCssUrls(el.getAttribute("style"), location.href));
  }

  doc
    .querySelectorAll('script, noscript, style, base, link[rel~="stylesheet"], link[rel~="preload"], link[rel~="modulepreload"], link[rel~="prefetch"]')
    .forEach((node) => node.remove());
  for (const el of doc.querySelectorAll("*")) {
    for (const attr of [...el.attributes]) {
      if (attr.name.startsWith("on")) el.removeAttribute(attr.name);
    }
  }

  const head = doc.querySelector("head");
  if (!head.querySelector("meta[charset]")) {
    const meta = document.createElement("meta");
    meta.setAttribute("charset", "utf-8");
    head.prepend(meta);
  }
  const style = document.createElement("style");
  style.textContent = css;
  head.appendChild(style);

  const html =
    `<!doctype html>\n<!--\nPROTOTYPE captured from ${location.href} on ${new Date().toISOString()}\n` +
    `PROTOTYPE CHANGES:\n- (none yet)\n-->\n` +
    doc.outerHTML;

  const res = await fetch(RECEIVER, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: html,
  });
  return `${res.status} ${await res.text()} (${html.length} characters)`;
}

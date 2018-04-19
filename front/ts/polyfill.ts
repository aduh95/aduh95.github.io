namespace aduh95.resume.polyfill {
  export const getElementCSSFontValue = (elem: Element) => {
    const elemStyle = window.getComputedStyle(elem);

    return (
      elemStyle.getPropertyValue("font") ||
      // Gecko (on Firefox) does not compute the font property, so each sub property must be retrieved
      ["font-style", "font-variant", "font-weight", "font-size", "font-family"]
        .map(property => elemStyle.getPropertyValue(property))
        .join(" ")
    );
  };

  // FontAwesome WOFF2 detection using CSS Font Loading API
  document.addEventListener(
    "DOMContentLoaded",
    function(this: Document) {
      if (
        !("fonts" in document) ||
        // If a browser eventually implements the WOFF2 format but does not implement the Font Loading API,
        // this script will report a false negative (which is preferable than having missing font).
        !document.fonts.check(
          getElementCSSFontValue(document.querySelector(".fa"))
        )
      ) {
        // For browsers in which WOFF2 support is not detected, the whole Font Awesome CSS is downloaded
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href =
          "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
        link.media = "all";
        document.head.appendChild(link);
      }
    },
    false
  );
}

interface Document {
  fonts: { check: (font: string) => boolean };
}

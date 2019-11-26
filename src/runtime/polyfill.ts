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

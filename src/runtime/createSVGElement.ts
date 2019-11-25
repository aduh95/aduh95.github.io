const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

interface Props {
  ref: { current: Node };
  style?:
    | string
    | {
        [propertyName: string]: string;
      };
  [key: string]: any;
}

export default function h(element: string, props: Props | null = null, ...children: any) {
  const domElement = document.createElementNS(SVG_NAMESPACE, element);

  if (props) {
    if ("object" === typeof props.style) {
      Object.entries(props.style).forEach(([propertyName, value]) =>
        domElement.style.setProperty(propertyName, value)
      );
      props.style = undefined;
    }
    if (props.className) {
      // className is read-only on SVGElement
      // @see https://svgwg.org/svg2-draft/types.html#InterfaceSVGElement
      domElement.setAttribute("class", props.className);
      props.className = undefined;
    }
    Object.entries(props)
      .filter(([name, value]) => value !== undefined)
      .forEach(([name, value]) => domElement.setAttribute(name, value));
  }

  if (children.length) {
    const subElements: Node[] = children.flat(Infinity);
    domElement.append(...subElements.filter(Boolean));
  }

  return domElement;
}

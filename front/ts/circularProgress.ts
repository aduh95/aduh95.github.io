module aduh95.resume.circularProgress {

    const DYNAMIC_CLASS = "dynamic";
    const BALLOON_CLASS = "balloon";

    let insertAfter = function (newNode: Node, referenceNode: Node) {
        if (referenceNode.nextSibling) {
            referenceNode.parentNode.insertBefore(
                newNode,
                referenceNode.nextSibling
            );
        } else {
            referenceNode.parentNode.appendChild(
                newNode
            );
        }
    }

    let getSlice = () => {
        let slice = document.createElement("div");
        let bar = document.createElement("div");
        let fill = document.createElement("div");
        fill.className = "fill";
        bar.className = "bar";
        slice.className = "slice";

        slice.appendChild(bar);
        slice.appendChild(fill);

        return slice;
    }

    document.addEventListener('DOMContentLoaded', function (this: Document) {
        let progressElem = this.querySelectorAll("meter,progress");

        for (let elem of <HTMLMeterElement[]><any>progressElem) {
            let newElem = document.createElement("output");
            if (elem.hasChildNodes()) {
                for (let child of <HTMLElement[]><any>elem.children) {
                    newElem.appendChild(child.cloneNode(true));
                }
            }
            newElem.appendChild(getSlice());
            newElem.classList.add(DYNAMIC_CLASS);
            newElem.dataset.title = elem.title;

            insertAfter(newElem, elem);
            elem.hidden = true;
        }
    }, false);
}

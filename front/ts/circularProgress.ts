module aduh95.resume.circularProgress {

    const DYNAMIC_CLASS = "dynamic";
    const BALLOON_CLASS = "balloon";

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

        for (let elem of <Element[]><any>progressElem) {
            if (elem.hasChildNodes()) {
                elem.classList.add(BALLOON_CLASS);
            }
            elem.appendChild(getSlice());
            elem.classList.add(DYNAMIC_CLASS);
        }
    }, false);
}
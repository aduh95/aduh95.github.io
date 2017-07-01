module aduh95.resume.linkToWebsite {

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
        let progressElem = this.querySelectorAll(".website");

        for (let elem of <Element[]><any>progressElem) {
            let linkElem = this.createElement("a");

            linkElem.href = elem.textContent;
            linkElem.innerText = linkElem.hostname.replace(/^(www\.)/,"");

            elem.replaceChild(linkElem, elem.firstChild);
        }
    }, false);
}

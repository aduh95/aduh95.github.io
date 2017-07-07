if (!window.hasOwnProperty("HTMLDetailsElement")) {
    document.addEventListener('DOMContentLoaded', function (this: Document) {
        let summaryElem = this.querySelectorAll("summary");

        for (let elem of <HTMLElement[]><any>summaryElem) {
            elem.hidden = true;
        }
    }, false);
}

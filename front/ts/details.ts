interface HTMLDetailsElement extends HTMLElement {
    open: boolean;
}

document.addEventListener(
    'DOMContentLoaded',
    function(this: Document) {
        let summaryElem = this.querySelectorAll('summary');
        for (let elem of <HTMLElement[]>(<any>summaryElem)) {
            if (window.hasOwnProperty('HTMLDetailsElement')) {
                // Allow the user to close the detail element by clicking on it
                elem.parentNode.addEventListener(
                    'click',
                    function(this: HTMLDetailsElement) {
                        if (this.open) {
                            this.open = false;
                        }
                    },
                    true
                );
            } else {
                // For browsers that do not support <details>, let's hide the summaries
                elem.hidden = true;
            }
        }
    },
    false
);

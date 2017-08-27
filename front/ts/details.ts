interface HTMLDetailsElement extends HTMLElement {
    open: boolean;
}

document.addEventListener(
    'DOMContentLoaded',
    function(this: Document) {
        const SUMMARY_ELEMENT = 'SUMMARY';
        let summaryElem = this.querySelectorAll(SUMMARY_ELEMENT);
        for (let elem of <HTMLElement[]>(<any>summaryElem)) {
            if (window.hasOwnProperty('HTMLDetailsElement')) {
                // Allow the user to close the detail element by clicking on it
                elem.parentNode.addEventListener(
                    'click',
                    function(this: HTMLDetailsElement, ev: Event) {
                        if (
                            SUMMARY_ELEMENT !==
                                (<HTMLElement>ev.target).nodeName &&
                            this.open
                        ) {
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

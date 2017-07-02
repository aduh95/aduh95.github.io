module aduh95.resume.i18n {

    if (!location.hash) {
        let locale =  (<any>window).navigator.userLanguage || window.navigator.language;

        if ("fr" === locale.substr(0, 2)) {
            locale = "fr-"+(locale.split("-")[1] || "FR");
        } else {
            locale = "en-"+(locale.split("-")[1] || "US");
        }

        location.hash = locale;
    }

    let changeLanguage = function () {
        let locale = location.hash.replace(/^#/, "");
        let progressElem = document.querySelectorAll("time");

        document.documentElement.setAttribute("lang", locale.substr(0, 2));

        for (let elem of <HTMLTimeElement[]><any>progressElem) {
            let dateTime = elem.dateTime || elem.getAttribute("datetime");
            elem.innerText = (new Date(dateTime)).toLocaleDateString(
                locale,
                {
                    year: "numeric",
                    month: "long",
                }
            );
        }
    };

    window.addEventListener("hashchange", changeLanguage);

    document.addEventListener('DOMContentLoaded', changeLanguage, false);
}

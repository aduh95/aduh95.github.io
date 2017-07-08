namespace aduh95.resume.i18n {
    const supportedLanguages = ["en", "fr"];
    const htmlElement = window.document.documentElement;

    let extractLocale = (locale: string) => {
        let localeLang = locale.substr(0, 2);

        if (~supportedLanguages.indexOf(localeLang)) {
            let countryCode = locale.split("-")[1];
            locale = localeLang;
            if (countryCode) {
                locale += "-" + countryCode;
            }
        } else {
            locale = "en-" + (locale.split("-")[1] || "US");
        }

        return locale;
    };

    let changeLanguage = function() {
        let locale = extractLocale(location.hash.replace(/^#/, ""));
        let progressElem = document.querySelectorAll("time");
        let lang = locale.substr(0, 2);

        htmlElement.setAttribute("lang", lang);

        for (let elem of <HTMLTimeElement[]>(<any>progressElem)) {
            let dateTime = elem.dateTime || elem.getAttribute("datetime");
            elem.innerText = new Date(dateTime).toLocaleDateString(locale, {
                year: "numeric",
                month: "long"
            });
        }
    };

    if (!location.hash) {
        let navigator = window.navigator;
        location.hash = extractLocale(
            (<any>navigator).userLanguage ||
                ("languages" in navigator && navigator.languages[0]) ||
                navigator.language ||
                htmlElement.getAttribute("lang")
        );
    }

    window.addEventListener("hashchange", changeLanguage);

    document.addEventListener("DOMContentLoaded", changeLanguage, false);
}

(function() {
    const tb = document.getElementById("tb");
    const clearButton = document.getElementById("clear");

    let currentCookies =  {};

    const clearTable = () => {
        tb.innerHTML = '';
    };

    const clear = () => {
        currentCookies = {};
    }

    const clearAll = () => {
        clear();
        clearTable();
    }

    clearButton.addEventListener("click", clearAll);

    const renderCookies = () => {
        clearTable();
        for (const [urlKey, cookies] of Object.entries(currentCookies)) {
            for (const [cookieName, cookie] of Object.entries(cookies)) {
                let requestUrl = `<td title="${urlKey}">${urlKey}</td>`;
                let cookieName = `<td title="${cookie.name}">${cookie.name}</td>`;
                let httpOnly = `<td title="${cookie.httpOnly}">${cookie.httpOnly}</td>`;
                let secure = `<td title="${cookie.secure}">${cookie.secure}</td>`;
                let sameSite = `<td title="${cookie.sameSite || '' }">${cookie.sameSite || ''}</td>`;
                let cookieValue = `<td title="${cookie.value}">${cookie.value}</td>`;
                let tr = `<tr>${requestUrl}${cookieName}${httpOnly}${secure}${sameSite}${cookieValue}</tr>`;
                tb.innerHTML += tr;
            }
        }
    };

    chrome.devtools.network.onRequestFinished.addListener(function(request) {
        if (request.request.url.startsWith('http://localhost') ||
            request.request.url.startsWith('https://localhost') ||
            request.request.url.startsWith('http://127.0.0.1') ||
            request.request.url.startsWith('https://127.0.0.1')) {

            const url = new URL(request.request.url);

            const urlKey = `${url.protocol}://${url.host}`;
            // Ensure entry for url
            let currentCookiesForUrl = currentCookies[urlKey];
            if (currentCookiesForUrl === undefined){
                currentCookiesForUrl = {};
                currentCookies[urlKey] = currentCookiesForUrl;
            }

            const cookies = request.response.cookies;
            if (cookies && cookies.length > 0) {
                cookies.forEach((cookie) => {

                    let cn = cookie.name;
                    let cv = cookie.value;

                    if (!cv || !cv.trim()) {
                        // Delete entry for cookie when there is no value
                        delete currentCookiesForUrl[cn];
                    } else {
                        // Add entry for cookie when there is value
                        currentCookiesForUrl[cn] = cookie;
                    }
                });
                console.log(JSON.stringify(currentCookies, null, '  '));
            }
            renderCookies();
        }
    });
})();

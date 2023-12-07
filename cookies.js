(function() {
    chrome.devtools.panels.create("Cookies",
        "icons/cookiespanel.png",
        "cookiespanel.html",
        (panel) => {}
    );
})();
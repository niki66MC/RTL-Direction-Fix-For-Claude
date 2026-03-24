const toggle = document.getElementById("rtlToggle");

// Load saved state and set checkbox position
browser.storage.local.get("rtlEnabled").then((result) => {
    const enabled = result.rtlEnabled !== undefined ? result.rtlEnabled : true;
    toggle.checked = enabled;
});

// On toggle change: save state + notify content script
toggle.addEventListener("change", () => {
    const enabled = toggle.checked;

    browser.storage.local.set({ rtlEnabled: enabled });

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, { type: "SET_RTL", enabled });
        }
    });
});
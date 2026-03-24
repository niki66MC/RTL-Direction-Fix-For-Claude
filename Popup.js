const toggle = document.getElementById("rtlToggle");
const status = document.getElementById("status");
 
function setStatus(enabled) {
  if (enabled) {
    status.classList.add("active");
  } else {
    status.classList.remove("active");
  }
}
 
// Load saved state
browser.storage.local.get("rtlEnabled").then((result) => {
  const enabled = result.rtlEnabled !== undefined ? result.rtlEnabled : true;
  toggle.checked = enabled;
  setStatus(enabled);
});
 
// On toggle change: save state + notify content script
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
 
  browser.storage.local.set({ rtlEnabled: enabled });
 
  setStatus(enabled);
 
  // Send message to the active Claude.ai tab
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0]) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: "SET_RTL",
        enabled,
      });
    }
  });
});
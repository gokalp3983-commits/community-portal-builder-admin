const fs = require("fs");
const path = require("path");

const boot = fs.readFileSync(path.join(__dirname, "public", "cpb-boot.js"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(boot.includes('history.scrollRestoration="manual"'), "Browser scroll restoration must be disabled for CPB reloads");
assert(boot.includes('window.scrollTo(0,0)'), "CPB boot must force the page to the top");
assert(boot.includes('window.addEventListener("pageshow"'), "CPB must re-assert top position after pageshow restoration");
assert(boot.includes('window.addEventListener("load"'), "CPB must re-assert top position after load");

console.log("Chapter 22C refresh-to-top regression: PASS");

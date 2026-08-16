const fs=require("fs");
const html=fs.readFileSync("public/index.html","utf8");
const css=fs.readFileSync("public/style.css","utf8");
const js=fs.readFileSync("public/app.js","utf8");
function ok(v,m){if(!v)throw new Error(m)}
ok(html.includes('id="qa-export-project"'),"temporary QA export missing");
ok(html.includes('id="qa-import-project"'),"temporary QA import missing");
ok(html.includes("TEMPORARY CHAPTER 22C QA FIELD"),"QA removal marker missing");
ok(css.includes(".qa-transfer-tools"),"QA isolated styling missing");
ok(js.includes('qaExportProject.addEventListener'),"QA export alias not bound");
ok(js.includes('qaImportProject.addEventListener'),"QA import alias not bound");
ok(js.includes('exportProject()'),"preserved export function missing");
ok(js.includes('importProjectFile.click()'),"preserved import path missing");
console.log("PASS Chapter 22C temporary QA transfer field");

const fs = require('fs');
let content = fs.readFileSync('c:/Users/Aabid/OneDrive/Desktop/birthday/index.html', 'utf8');
content = content.replace(/<section class=\"scene\"/g, 'SECTION_START');
let parts = content.split('SECTION_START');
let out = parts[0];
for (let i = 1; i < parts.length; i++) {
    let p = parts[i];
    let closeTag = p.indexOf('>');
    let tag = '<section class=\"scene\"' + p.substring(0, closeTag + 1);
    let rest = p.substring(closeTag + 1);
    let lastClose = rest.lastIndexOf('</section>');
    out += tag + '\n        <div class=\"scene-inner-wrapper\">\n  ' + rest.substring(0, lastClose) + '        </div>\n      ' + rest.substring(lastClose);
}
fs.writeFileSync('c:/Users/Aabid/OneDrive/Desktop/birthday/index.html', out, 'utf8');

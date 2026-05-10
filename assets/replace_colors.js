const fs = require('fs');
let css = fs.readFileSync('assets/css/sections/hero-detail.css', 'utf-8');
const replacements = [
  [/rgba\(203,\s*255,\s*174/g, 'rgba(174, 237, 255'],
  [/rgba\(185,\s*255,\s*148/g, 'rgba(148, 228, 255'],
  [/rgba\(210,\s*255,\s*190/g, 'rgba(190, 235, 255'],
  [/rgba\(204,\s*255,\s*182/g, 'rgba(182, 235, 255'],
  [/rgba\(154,\s*236,\s*130/g, 'rgba(130, 218, 236'],
  [/rgba\(170,\s*245,\s*144/g, 'rgba(144, 220, 245'],
  [/rgba\(236,\s*255,\s*226/g, 'rgba(226, 245, 255'],
  [/rgba\(187,\s*255,\s*156/g, 'rgba(156, 220, 255'],
  [/rgba\(196,\s*255,\s*176/g, 'rgba(176, 230, 255'],
  [/rgba\(235,\s*255,\s*223/g, 'rgba(223, 245, 255'],
  [/rgba\(177,\s*220,\s*152/g, 'rgba(152, 200, 220'],
  [/rgba\(218,\s*255,\s*197/g, 'rgba(197, 230, 255'],
  [/rgba\(213,\s*255,\s*192/g, 'rgba(192, 235, 255'],
  [/rgba\(211,\s*255,\s*193/g, 'rgba(193, 235, 255'],
  [/rgba\(198,\s*255,\s*171/g, 'rgba(171, 235, 255'],
  [/rgba\(222,\s*248,\s*208/g, 'rgba(208, 240, 248'],
  [/rgba\(218,\s*249,\s*203/g, 'rgba(203, 240, 249'],
  [/rgba\(207,\s*255,\s*187/g, 'rgba(187, 235, 255']
];

replacements.forEach(([regex, neu]) => {
  css = css.replace(regex, neu);
});

fs.writeFileSync('assets/css/sections/hero-detail.css', css, 'utf-8');
console.log('Done!');

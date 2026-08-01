const mod = require('next-auth');
console.log(JSON.stringify({
  keys: Object.keys(mod),
  defaultKeys: Object.keys(mod.default || {}),
  defaultType: typeof mod.default,
  defaultString: String(mod.default).slice(0, 400),
}, null, 2));

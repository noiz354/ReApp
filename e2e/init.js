// e2e/init.js
const detox = require('detox');
const config = require('../.detoxrc.json');

beforeAll(async () => {
  await detox.init(config);
}, 300000);

afterAll(async () => {
  await detox.cleanup();
});

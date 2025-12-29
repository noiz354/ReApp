// e2e/offline.test.ts
describe('Offline Mode', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('shows cached products when offline', async () => {
    await device.setURLBlacklist(['.*']);
    await expect(element(by.text('Product 1-0'))).toBeVisible();
  });
});

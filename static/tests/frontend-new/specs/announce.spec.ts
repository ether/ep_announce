import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
  // Wait for the plugin to install its checkbox.
  await expect(page.locator('#ep_announce-enabled')).toHaveCount(1, {timeout: 10_000});
});

test.describe('ep_announce — checkbox / cookie wiring', () => {
  test('clicking the checkbox toggles the cookie', async ({page}) => {
    const cb = page.locator('#ep_announce-enabled');
    const initial = await cb.isChecked();
    await cb.click();
    await expect.poll(async () => cb.isChecked()).toBe(!initial);
    await expect.poll(async () => page.evaluate(() => document.cookie)).toMatch(
        new RegExp(`ep_announce-enabled%22%3A${!initial}`));
  });
});

test.describe('ep_announce — playChime', () => {
  test.beforeEach(async ({page}) => {
    // Force the feature on regardless of saved cookie state.
    const cb = page.locator('#ep_announce-enabled');
    if (!(await cb.isChecked())) await cb.click();
  });

  test('plays chime under basic circumstances', async ({page}) => {
    await page.evaluate(() => {
      (window as any).__chimeFired = new Promise<void>((resolve) => {
        (window as any).ep_announce.playChime = () => resolve();
      });
      (window as any).ep_announce.userJoinOrUpdate(
          null, {userInfo: {userId: 1000}}, () => {});
    });
    await page.evaluate(() => (window as any).__chimeFired);
  });

  test('does not play chime when list is uninitialized', async ({page}) => {
    await page.evaluate(() => new Promise<void>((resolve, reject) => {
      (window as any).ep_announce.playChime = () =>
        reject(new Error('playChime fired before initialization'));
      (window as any).ep_announce.setUserIdList(undefined);
      (window as any).ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, resolve);
    }));
  });

  test('does not play chime for the viewing user', async ({page}) => {
    await page.evaluate(() => new Promise<void>((resolve, reject) => {
      (window as any).ep_announce.playChime = () =>
        reject(new Error('playChime fired for viewing user'));
      (window as any).ep_announce.getUserId = () => 1000;
      (window as any).ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, resolve);
    }));
  });

  test('does not play chime for existing users', async ({page}) => {
    await page.evaluate(() => new Promise<void>((resolve, reject) => {
      (window as any).ep_announce.playChime = () =>
        reject(new Error('playChime fired for existing user'));
      (window as any).ep_announce.setUserIdList([1000]);
      (window as any).ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, resolve);
    }));
  });
});

test.describe('ep_announce — feature disabled', () => {
  test.beforeEach(async ({page}) => {
    const cb = page.locator('#ep_announce-enabled');
    if (await cb.isChecked()) await cb.click();
  });

  test('does not play chime when disabled', async ({page}) => {
    await page.evaluate(() => new Promise<void>((resolve, reject) => {
      (window as any).ep_announce.playChime = () =>
        reject(new Error('playChime fired despite feature being disabled'));
      (window as any).ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, resolve);
    }));
  });
});

test.describe('ep_announce — user list updates', () => {
  test.beforeEach(async ({page}) => {
    const cb = page.locator('#ep_announce-enabled');
    if (!(await cb.isChecked())) await cb.click();
  });

  test('updates user list on join/update', async ({page}) => {
    await page.evaluate(() => new Promise<void>((resolve) => {
      (window as any).ep_announce.updateUserIdList = () => resolve();
      (window as any).ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, () => {});
    }));
  });

  test('updates user list on leave', async ({page}) => {
    await page.evaluate(() => new Promise<void>((resolve) => {
      (window as any).ep_announce.updateUserIdList = () => resolve();
      (window as any).ep_announce.userLeave(null, {userInfo: {userId: 1000}}, () => {});
    }));
  });
});

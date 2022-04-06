import Browser    from '../../util/Browser';
import Config     from '../../config';
import { assert } from 'chai';
import login from '../../util/common/login';
import elements from '../../util/common/elements';


describe('Login', () => {

  it('should fail to login', async () => {

    // get a tab
    const page = await Browser.openTab();

    // ensure no user is logged in
    await login.logoff(page);

    // wait for the username input field
    await assert.isFulfilled(page.waitForSelector('#id_login'), 'should wait for the username input field');

    // enter a username
    await assert.isFulfilled(page.type('#id_login', 'loginFailUsernameTest'), 'should enter a username');

    // wait for the password input field
    await assert.isFulfilled(page.waitForSelector('#id_password'), 'should wait for the password input field');

    // enter a password
    await assert.isFulfilled(page.type( '#id_password', 'loginFailPasswordTest'), 'should enter a password');

    // submit and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      elements.clickElementByButtonText(page, 'Login')
    ]);

    // wait for the alert danger to appear
    await assert.isFulfilled(page.waitForXPath('//div[contains(@class,"alert alert-block")]', {visible: true}), 'should wait for alert danger');

    // get the alert danger after login fail
    const loginFailText = await elements.getTextFromDiv(page, 'div.alert.alert-block.alert-danger');

    // alert danger should be equal to the following text
    assert.equal(loginFailText, 'The username and/or password you specified are not correct.', 'alert danger should show that the user failed to login');

  });

  it('should successfully login and logout', async () => {

    // get a tab
    const page = await Browser.openTab();

    // ensure no user is logged in
    await login.logoff(page);

    // wait for the username input field
    await assert.isFulfilled(page.waitForSelector('#id_login'), 'should wait for the username input field');

    // enter a username
    await assert.isFulfilled(page.type('#id_login', Config.browser.userNormal.userName), 'should enter a username');

    // wait for the password input field
    await assert.isFulfilled(page.waitForSelector('#id_password'), 'should wait for the password input field');

    // enter a password
    await assert.isFulfilled(page.type('#id_password', Config.browser.userNormal.password), 'should enter a password');

    // submit and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      elements.clickElementByButtonText(page, 'Login')
    ]);

    // wait for the alert success to appear
    await assert.isFulfilled(page.waitForSelector('body > div.container > div.alert.alert-success', {visible: true}), 'should wait for success alert');

    // get the text content of success alert
    const successAlertText = await elements.getTextFromDiv(page, 'body > div.container > div.alert.alert-success');

    // alert success should contain the user name for a successful login
    assert.equal(successAlertText, `Successfully signed in as ${Config.browser.userNormal.userName}.×`, 'alert success should contain the user name for a successful login');

    // wait for sign out link from the navigation bar
    await assert.isFulfilled(page.waitForSelector('#signout'), 'should wait for the sign out button');

    // click the sign out link from the navigation bar and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('#signout'),
    ]);

    // wait for conformation button for sign out to appear
    await assert.isFulfilled(page.waitForXPath('//button[text()="Sign Out"]', {visible: true}), 'should wait for the Sign Out button for the confirmation');

    // click sign out button and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      elements.clickElementByButtonText(page, 'Sign Out'),
    ]);

    // wait for alert success to appear after signing out
    await assert.isFulfilled(page.waitForXPath('//div[@class="alert alert-success"]', {visible: true}), 'should wait for alert success to appear after signing out');

    // get the alert success text after signing out
    const signOutSuccessText = await elements.getTextFromDiv(page, 'body > div.container > div.alert.alert-success');

    // alert success text should be equal to the following message
    assert.equal(signOutSuccessText, 'You have signed out.×', 'alert success should show "You have signed out.×" for a successful sign out');
  });
});
/**
 * handle login / log off
 */
import Config     from '../../config';
import elements   from './elements';


export default
{
  loginUser: (page) => login(page, 'normal'),
  loginAdmin: (page) => login(page, 'admin'),
  checkAndLoginUser: (page) => checkAndLogin(page, 'normal'),
  checkAndLoginAdmin: (page) => checkAndLogin(page, 'admin'),
  logoff: logoff,
  isLoggedIn: checkLogin,
};


/**
 * login
 *
 * @param   {Object}    page      page to work upon
 * @param   {String}    userType  type of user
 */
async function login(page, userType = 'normal') {

  // fill user name and password
  if (userType == 'normal'){

    await page.waitForSelector('#id_login');
    await page.type('#id_login', Config.browser.userNormal.userName);

    await page.waitForSelector('#id_password');
    await page.type('#id_password', Config.browser.userNormal.password);
  }
  else if (userType == 'admin'){

    await page.waitForSelector('#id_login');
    await page.type('#id_login', Config.browser.userAdmin.userName);

    await page.waitForSelector('#id_password');
    await page.type('#id_password', Config.browser.userAdmin.password);
  }

  // submit and wait for navigation
  await Promise.all([
    page.waitForNavigation(),
    elements.clickElementByButtonText(page, 'Login')
  ]);

  // wait for the alert success to appear
  await page.waitForSelector('body > div.container > div.alert.alert-success', {visible: true});
}

/**
 * Check, if a user is still logged in. Login, if not.
 *
 * @param   {Object}    page      page to work upon
 * @param   {String}    userType  type of user
 */
async function checkAndLogin(page, userType){
  const elem = await page.$x('//button[text()="Login"]');

  if (await elem[0] != null){
    await login(page, userType);
  }
}

/**
 * Log off
 * @param {Object} page
 */
async function logoff(page) {

  if (await checkLogin(page)){

    // wait for sign out link from the navigation bar
    await page.waitForSelector('#signout');

    // click the sign out link from the navigation bar and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('#signout'),
    ]);

    // wait for conformation button for sign out to appear
    await page.waitForXPath('//button[text()="Sign Out"]', {visible: true});

    // click sign out button and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      elements.clickElementByButtonText(page, 'Sign Out'),
    ]);

    // wait for alert success to appear after signing out
    await page.waitForXPath('//div[@class="alert alert-success"]', {visible: true});
  }
}

/**
 *  Check if any user is logged in
 *
 * @param {Object} page
 * @returns {Promise<boolean>}
 */
async function checkLogin(page){
  const $el = await page.$x('//button[text()="Login"]');
  return $el == null;
}
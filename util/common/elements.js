/**
 * handle find certain elements
 */

export default {
  clickElementByLabelText,
  clickElementByLinkText,
  clickElementBySpanText,
  clickElementByButtonText,
  clickAnyElementByText,
  getTextFromDiv,
  returnContent,
  clearInputField,
  typeInputField,
  hasEntry,
  hasListing,
  hasErrors
};


/**
  * Find label element by text and click on it
  *
  * @param {{ $x: (arg0: string) => any; }} page
  * @param {string} text
  */

async function clickElementByLabelText(page, text){
  const element = await page.$x('//label[text() ="'+text+'"]');
  await (await element[0].asElement()).click();
}

/**
  * Find link element by text and click on it
  *
  * @param {Object} page
  * @param {string} text
  */

async function clickElementByLinkText(page, text){
  const element = await page.$x('//a[text() ="'+text+'"]');
  await (await element[0].asElement()).click();
}

/**
  * Find span element by text and click on it
  *
  * @param {Object} page
  * @param {string} text
  */

async function clickElementBySpanText(page, text){
  const element = await page.$x('//span[text() ="'+text+'"]');
  await (await element[0].asElement()).click();
}

/**
  * Find button element by text and click on it
  *
  * @param {Object} page
  * @param {string} text
  */

async function clickElementByButtonText(page, text){
  const element = await page.$x('//button[text() ="'+text+'"]');
  await (await element[0].asElement()).click();
}

/**
  * Find any element by text and click on it
  *
  * @param {Object} page
  * @param {string} text
  */

async function clickAnyElementByText(page, text){
  const element = await page.$x(`//*[contains(text(), '${text}')]`);
  await (await element[0].asElement()).click();
}

/**
  * Get text content from a div element
  *
  * @param {Object} page
  * @param {string} selector
  */

async function getTextFromDiv(page, selector) {
  const result = await page.evaluate( (selector) => {
    const element = document.querySelector(selector);
    return element.textContent.trim();
  }, selector);
  return result;
}

/**
  * Return content
  * @param {Object} page page to work upon
  * @param {string} selector
  */

async function returnContent( page, selector) {
  const result = await page.evaluate((selector) => {
    const rows = document.querySelectorAll(selector);
    return Array.from(rows, row => row.textContent);
  }, selector);
  return result;
}

/**
  * Clear an Input field
  *
  * @param {Object} page to work upon
  * @param {string} selector element selector
  */

async function clearInputField(page, selector) {
  await page.evaluate(selector => {
    document.querySelector(selector).value = '';
  }, selector);
}

/**
  * Type in Input field
  *
  * @param {Object} page
  * @param {string} selector
  * @param {string} text
  */

async function typeInputField(page, selector, text) {
  await page.evaluate((selector, text) => {
    document.querySelector(selector).value = text;
  }, selector, text);
}

/**
  * Check for an entry in table td
  *
  * @param {Object} page
  * @param {string} table
  * @param {string} entry
  * @param {string} tdChild
  */

async function hasEntry(page, table, entry, tdChild){
  const result =  await page.$$eval(table, (rows, entry, tdChild) => {
    return rows.some((tr) => tr.querySelector(`td:nth-child(${tdChild})`).textContent.trim() == entry);
  }, entry, tdChild);
  return result;
}

/**
  * Check for an entry in a table
  *
  * @param {Object} page
  * @param {string} table
  * @param {string} entry
  */

async function hasListing(page, table, entry){
  const result =  await page.$$eval(table, (rows, entry) => {
    return rows.some((tr) => tr.querySelector('td').textContent.trim() == entry);
  }, entry);
  return result;
}

/**
  * Checks error message fields for form windows
  *
  * @param {Object} page
  * @param {string} errMsgField
  */

async function hasErrors(page, errMsgField) {
  return await page.evaluate((errMsgField) => Array
    .from(document.querySelectorAll(errMsgField))
    .some((el) => el.textContent.trim()), errMsgField);
}
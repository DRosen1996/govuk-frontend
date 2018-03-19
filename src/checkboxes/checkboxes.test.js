/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const cheerio = require('cheerio')

const configPaths = require('../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

const goToAndGetComponent = async (name, example) => {
  const componentPath = `${baseUrl}/components/${name}/${example}/preview`
  await page.goto(componentPath, { waitUntil: 'load' })
  const html = await page.evaluate(() => document.body.innerHTML)
  const $ = cheerio.load(html)
  return $
}

const waitForHiddenSelector = async (selector) => {
  return page.waitForSelector(selector, {
    hidden: true,
    timeout: 1000
  })
}

const waitForVisibleSelector = async (selector) => {
  return page.waitForSelector(selector, {
    visible: true,
    timeout: 1000
  })
}

beforeEach(async () => {
  browser = global.__BROWSER__
  page = await browser.newPage()
})

afterEach(async () => {
  await page.close()
})

describe('Checkboxes', () => {
  describe('must be visible as static content if JavaScript is unavaliable or fails', () => {
    it('with no aria attributes', async () => {
      await page.setJavaScriptEnabled(false)

      const $ = await goToAndGetComponent('checkboxes', 'with-conditional')
      const $component = $('.govuk-checkboxes')

      const hasAriaHidden = $component.find('[aria-hidden]').length
      const hasAriaExpanded = $component.find('[aria-expanded]').length
      const hasAriaControls = $component.find('[aria-controls]').length

      expect(hasAriaHidden).toBeFalsy()
      expect(hasAriaExpanded).toBeFalsy()
      expect(hasAriaControls).toBeFalsy()
    })

    it('with visible content', async () => {
      await page.setJavaScriptEnabled(false)

      await goToAndGetComponent('checkboxes', 'with-conditional')

      const isVisible = await waitForVisibleSelector('.govuk-checkboxes__conditional')
      expect(isVisible).toBeTruthy()
    })
  })
  describe('must be hidden if JavaScript is avaliable and is collapsed', () => {
    it('with is-hidden', () => {})
    it('with aria-hidden', () => {})
  })
  describe('must be visible if JavaScript is avaliable and is assosiated with checked input', async () => {
    it('checked input conditonal visible', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-checked')
      const $component = $('.govuk-checkboxes')
      const $checkedInput = $component.find('.govuk-checkboxes__input:checked')
      const inputAriaControls = $checkedInput.attr('aria-controls')

      const secondInputIsVisible = await waitForVisibleSelector(`[id="${inputAriaControls}"]`)
      expect(secondInputIsVisible).toBeTruthy()
    })
    it('first input conditional hidden', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-checked')
      const $component = $('.govuk-checkboxes')
      const $firstInput = $component.find('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
      const firstInputAriaControls = $firstInput.attr('aria-controls')

      const firstInputIsVisible = await waitForHiddenSelector(`[id="${firstInputAriaControls}"]`)
      expect(firstInputIsVisible).toBeTruthy()
    })
    it('last input conditional hidden', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-checked')
      const $component = $('.govuk-checkboxes')
      const $lastInput = $component.find('.govuk-checkboxes__item:last-child .govuk-checkboxes__input')
      const lastInputAriaControls = $lastInput.attr('aria-controls')

      const lastInputIsHidden = await waitForHiddenSelector(`[id="${lastInputAriaControls}"]`)
      expect(lastInputIsHidden).toBeTruthy()
    })
  })
  describe('must indicate that there is collapsed content to interact with', () => {
    it('with associations between input and collapsed area', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-checked')
      const $component = $('.govuk-checkboxes')
      const $firstInput = $component.find('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
      const firstInputAriaControls = $firstInput.attr('aria-controls')

      const firstInputIsHidden = await waitForHiddenSelector(`[id="${firstInputAriaControls}"]`)
      expect(firstInputIsHidden).toBeTruthy()
    })
  })
  describe('must indicate if collapsed content is expanded', () => {
    describe('keyboard', () => {
      it('visible content toggles checking input', async () => {
        const $ = await goToAndGetComponent('checkboxes', 'with-conditional')
        const $component = $('.govuk-checkboxes')
        const $firstInput = $component.find('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
        const firstInputAriaControls = $firstInput.attr('aria-controls')

        await page.focus('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
        await page.keyboard.press('Space')

        const firstInputIsVisible = await waitForVisibleSelector(`[id="${firstInputAriaControls}"]`)
        expect(firstInputIsVisible).toBeTruthy()

        await page.keyboard.press('Space')

        const firstInputIsHidden = await waitForHiddenSelector(`[id="${firstInputAriaControls}"]`)
        expect(firstInputIsHidden).toBeTruthy()
      })
      it('indicate if content is expanded', async () => {
        await goToAndGetComponent('checkboxes', 'with-conditional')

        const firstInputIsNotExpanded = await waitForVisibleSelector('.govuk-checkboxes__item:first-child .govuk-checkboxes__input[aria-expanded=false]')
        expect(firstInputIsNotExpanded).toBeTruthy()

        await page.focus('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
        await page.keyboard.press('Space')

        const firstInputIsExpanded = await waitForVisibleSelector('.govuk-checkboxes__item:first-child .govuk-checkboxes__input[aria-expanded=true]')
        expect(firstInputIsExpanded).toBeTruthy()
      })
    })
    describe('click', () => {
      it('visible content toggles checking input', async () => {
        const $ = await goToAndGetComponent('checkboxes', 'with-conditional')
        const $component = $('.govuk-checkboxes')
        const $firstInput = $component.find('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
        const firstInputAriaControls = $firstInput.attr('aria-controls')

        await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

        const firstInputIsVisible = await waitForVisibleSelector(`[id="${firstInputAriaControls}"]`)
        expect(firstInputIsVisible).toBeTruthy()

        await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

        const firstInputIsHidden = await waitForHiddenSelector(`[id="${firstInputAriaControls}"]`)
        expect(firstInputIsHidden).toBeTruthy()
      })
      it('indicate if content is expanded', async () => {
        await goToAndGetComponent('checkboxes', 'with-conditional')

        const firstInputIsNotExpanded = await waitForVisibleSelector('.govuk-checkboxes__item:first-child .govuk-checkboxes__input[aria-expanded=false]')
        expect(firstInputIsNotExpanded).toBeTruthy()

        await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

        const firstInputIsExpanded = await waitForVisibleSelector('.govuk-checkboxes__item:first-child .govuk-checkboxes__input[aria-expanded=true]')
        expect(firstInputIsExpanded).toBeTruthy()
      })
    })
  })
})
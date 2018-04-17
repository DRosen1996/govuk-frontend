import '../globals/polyfills/Function/prototype/bind'
import '../globals/polyfills/Event' // addEventListener and event.target normaliziation
import { nodeListForEach } from '../globals/common'

function Checkboxes ($module) {
  this.$module = $module
}

Checkboxes.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked
  $input.setAttribute('aria-expanded', inputIsChecked)

  var $content = document.querySelector('#' + $input.getAttribute('aria-controls'))
  $content.setAttribute('aria-hidden', !inputIsChecked)
}

Checkboxes.prototype.handleClick = function (event) {
  var $target = event.target

  // If a checkbox with aria-controls, handle click
  var isCheckbox = $target.getAttribute('type') === 'checkbox'
  var hasAriaControls = $target.getAttribute('aria-controls')
  if (isCheckbox && hasAriaControls) {
    this.setAttributes($target)
  }
}

Checkboxes.prototype.init = function () {
  var $module = this.$module
  var $inputs = $module.querySelectorAll('input[type="checkbox"]')

  /**
  * Loop over all items with [data-controls]
  * Check if they have a matching conditional reveal
  * If they do, assign attributes.
  **/
  nodeListForEach($inputs, function ($input) {
    var controls = $input.getAttribute('data-aria-controls')

    // Check if input controls anything
    // Check if content exists, before setting attributes.
    if (!controls || !$module.querySelector('#' + controls)) {
      return
    }

    // If we have content that is controlled, set attributes.
    $input.setAttribute('aria-controls', controls)
    $input.removeAttribute('data-aria-controls')
    this.setAttributes($input)
  }.bind(this))

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this))
}

export default Checkboxes

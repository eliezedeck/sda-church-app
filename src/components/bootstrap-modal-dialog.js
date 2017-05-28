import _ from 'lodash'


let confirmSelector = 'div#appConfirmModal'

export function confirm(title, body, onConfirm, onDismiss) {
  $(`${confirmSelector} .modal-title`).html(title)
  $(`${confirmSelector} .modal-body`).html(body)

  // Create a "once" version of the callbacks
  if (typeof onConfirm === 'function') {
  	onConfirm = _.once(onConfirm)
  }
  if (typeof onDismiss === 'function') {
  	onDismiss = _.once(onDismiss)
  }

  // Confirm
  $(`${confirmSelector} .modal-footer button.btn-danger`).on('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    $(`${confirmSelector} .modal-footer button.btn-danger`).off('click')
    $(confirmSelector).unbind('hide.bs.modal')
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    $(confirmSelector).modal('hide')
  })

  // Dismiss / Cancel
  $(confirmSelector).on('hide.bs.modal', () => {
    $(confirmSelector).unbind('hide.bs.modal')
    if (typeof onDismiss === 'function') {
    	onDismiss()
    }
  })

  $(confirmSelector).modal('show')
}

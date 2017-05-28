import _ from 'lodash'


let confirmSelector = 'div#appConfirmModal'

export function confirm(title, body, onConfirm, onDismiss) {
  $(`${confirmSelector} .modal-title`).html(title)
  $(`${confirmSelector} .modal-body`).html(body)

  // Confirm
  $(`${confirmSelector} .modal-footer button.btn-primary`).on('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    $(`${confirmSelector} .modal-footer button.btn-primary`).off('click')
    $(confirmSelector).off('hide.bs.modal')
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    $(confirmSelector).modal('hide')
  })

  // Dismiss / Cancel
  $(confirmSelector).on('hide.bs.modal', () => {
    $(confirmSelector).off('hide.bs.modal')
    if (typeof onDismiss === 'function') {
    	onDismiss()
    }
  })

  $(confirmSelector).modal('show')
}

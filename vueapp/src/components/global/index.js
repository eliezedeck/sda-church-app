import Vue from 'vue'

import ErrorAlert from './ErrorAlert.vue'
import SubmitButton from './SubmitButton.vue'
import ToolbarAndContent from './ToolbarAndContent.vue'

import DataMember from './data/Member.vue'

// Register the global components
Vue.component('error-alert', ErrorAlert)
Vue.component('submit-button', SubmitButton)
Vue.component('toolbar-and-content', ToolbarAndContent)

Vue.component('loading', {
  /* TAG: i18n */
  template: '<span><i class="glyphicon glyphicon-refresh spin"></i> <slot>Loading ...</slot></span>'
})

Vue.component('member', DataMember)

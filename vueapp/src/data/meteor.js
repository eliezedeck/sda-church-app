import Vue from 'vue'
import {SubsCache} from 'meteor/ccorcos:subs-cache'
import VueMeteorTracker from 'vue-meteor-tracker'


Vue.use(VueMeteorTracker)

const subsCache = new SubsCache({
  expireAfter: 15,
  cacheLimit: -1
})

// Override the $subscribe function thru this
Vue.config.meteor.subscribe = function (...args) {
  return subsCache.subscribe(...args)
}

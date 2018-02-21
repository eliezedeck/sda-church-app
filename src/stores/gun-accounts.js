import gun from '../gun'
import uuidv4 from 'uuid/v4'
import _ from 'lodash'

export default {
  state: {
    set: {}, // list of Accounts
    setCount: 0,
    unlinkedSet: {}, // list of Unlinked accounts
    unlinkedSetCount: 0
  },

  mutations: {
    update (state, set) {
      state.set = set
      state.setCount = Object.keys(set).length

      state.unlinkedSet = {}
      state.unlinkedSetCount = 0
      _.forEach(set, (v, k) => {
        if (!v.isDepartmentAccount) {
          state.unlinkedSet[k] = v
          state.unlinkedSetCount++
        }
      })
    }
  },

  actions: {
    subscribe ({commit}) {
      gun.get('accounts').open((set) => {
        console.log('GUN accounts updated ...')
        commit('update', set)
      })
    },

    add (_, account) {
      account.id = uuidv4()

      const a = gun.get(`account/${account.id}`).put(account)
      gun.get('accounts').set(a)
    }
  }
}

import gun from '../gun'

export default {
  state: {
    set: {}, // list of Accounts
    setCount: 0
  },

  mutations: {
    update (state, set) {
      state.set = set
      state.setCount = Object.keys(set).length
    }
  },

  actions: {
    subscribe ({commit}) {
      gun.get('accounts').open((set) => {
        console.log('GUN accounts updated ...')
        commit('update', set)
      })
    }
  }
}

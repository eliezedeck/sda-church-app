import gun from '../gun'

export default {
  state: {
    set: {} // list of Accounts
  },

  mutations: {
    update (state, set) {
      state.set = set
    }
  },

  actions: {
    subscribe ({commit}) {
      gun.get('accounts').open((set) => {
        commit('update', set)
      })
    }
  }
}

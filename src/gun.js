import Vue from 'vue'
import Gun from 'gun/gun'
import _ from 'lodash'

// Create a global instance of GUN
const gun = new Gun({
  peers: ['http://localhost:8000/gun']
})

Vue.use({
  install: function (Vue) {
    Vue.prototype.$gun = gun

    Vue.mixin({
      data () {
        const data = {}

        if (typeof this.$options.gun === 'object') {
          if (typeof this.$options.gun.mappedSets === 'object') {

            //
            // mappedSets
            //

            const ms = this.$options.gun.mappedSets
            for (const gunPath in ms) {
              const templateVarName = ms[gunPath]
              data[templateVarName] = {} // prepare the template to have the data
            }
          }
        }
        return data
      },

      mounted () {
        this.gunTmpStore = {}
        this.gunMapSet = (gunPath, templateVarName) => {
          const store = this.gunTmpStore[gunPath] = {}
          const doUpdate = _.debounce(() => {
            this.$set(this, templateVarName, store) // Vue object update
          }, 20)

          gun.get(gunPath).map().on((node, id) => {
            if (node) {
              store[id] = node
            } else {
              delete store[id]
            }
            doUpdate()
          })
        }

        if (typeof this.$options.gun === 'object') {
          if (typeof this.$options.gun.mappedSets === 'object') {

            //
            // mappedSets
            //

            const ms = this.$options.gun.mappedSets
            for (const gunPath in ms) {
              const templateVarName = ms[gunPath]
              this.gunMapSet(gunPath, templateVarName)
              console.log(`Mapping gun ${gunPath} => ${templateVarName}`)
            }
          }
        }
      },

      destroyed () {
        if (typeof this.$options.gun === 'object') {
          if (typeof this.$options.gun.mappedSets === 'object') {

            //
            // mappedSets
            //

            const ms = this.$options.gun.mappedSets
            for (const gunPath in ms) {
              gun.get(gunPath).off()
              const templateVarName = ms[gunPath]
              console.log(`Unmapped gun ${gunPath} => ${templateVarName}`)
            }
          }
        }
      }
    })
  }
})

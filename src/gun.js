import Vue from 'vue'
import Gun from 'gun/gun'
import 'gun/lib/open'

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
          if (typeof this.$options.gun.open === 'object') {

            //
            // map
            //

            const ms = this.$options.gun.open
            for (const gunPath in ms) {
              const templateVarName = ms[gunPath]
              data[templateVarName] = {} // prepare the template to have the data
            }
          }
        }
        return data
      },

      mounted () {
        if (typeof this.$options.gun === 'object') {
          if (typeof this.$options.gun.open === 'object') {

            //
            // map
            //

            const ms = this.$options.gun.open
            for (const gunPath in ms) {
              const templateVarName = ms[gunPath]
              gun.get(gunPath).open((node) => {
                this[templateVarName] = Object.assign({}, node)
              })
              console.log(`Mapping gun ${gunPath} => ${templateVarName}`)
            }
          }
        }
      },

      destroyed () {
        if (typeof this.$options.gun === 'object') {
          if (typeof this.$options.gun.open === 'object') {

            //
            // map
            //

            const ms = this.$options.gun.open
            for (const gunPath in ms) {
              gun.get(gunPath).off()
              console.log(`Unmapped gun ${gunPath} => ${ms[gunPath]}`)
            }
          }
        }
      }
    })
  }
})

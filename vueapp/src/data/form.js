import _ from 'lodash'
import {Meteor} from 'meteor/meteor'


export const getFormHelperMixin = ({base, overwritePropsKey, insertMethod, updateMethod, insertDataModifier}) => {
  // Prepare the watch property
  const watch = {}
  if (overwritePropsKey)
    watch[overwritePropsKey] = 'dataAssign'

  return {
    data() {
      const state = this.dataAssign()
      return _.assign(_.pickBy(state, s => s !== undefined), {
        inProgress: false,
        error: null
      })
    },

    watch,

    methods: {
      _dataAssignBase() {
        const source = {}
        _.forEach(base, (v, k) => {
          if (typeof v === 'function')
            source[k] = v.bind(this)()
          else
            source[k] = _.clone(v)
        })
        return source
      },

      dataAssign() {
        // Execute computed properties for the base
        const source = this._dataAssignBase()
        const overwrite = overwritePropsKey ? _.get(this, overwritePropsKey, {}) : {}
        const state = _.keys(overwrite).length > 0 ? _.assign(source, overwrite) : source

        if (this._dataAssignInitialized) {
          // Override the current `this`
          _.forEach(state, (v, k) => {
            this[k] = v
          })
        } else {
          this._dataAssignInitialized = true
        }

        return state
      },

      onSubmit() {
        this.inProgress = true

        // Reconstruct the actual data that we need
        let data = {}
        _.forEach(this._dataAssignBase(), (v, key) => {
          data[key] = this[key]
        })

        const callback = (err, response) => {
          this.inProgress = false
          if (err) {
            this.error = err.message
          } else {
            this.$emit('dismiss', response)
          }
        }

        if (_.keys(this.editObj).length > 0) {
          // Updating
          if (updateMethod) {
            Meteor.call(updateMethod, {
              id: _.get(this, [overwritePropsKey, '_id']),
              doc: data
            }, callback)
          }
        }
        else {
          // Inserting
          if (insertMethod) {
            const d = {doc: data}
            if (typeof insertDataModifier === 'function')
              insertDataModifier.bind(this)(d)

            Meteor.call(insertMethod, d, callback)
          }
        }
      }
    }
  }
}

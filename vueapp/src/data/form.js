import _ from 'lodash'
import {Meteor} from 'meteor/meteor'


export const getFormHelperMixin = ({base, overwritePropsKey, insertMethod, updateMethod}) => {
  // Prepare the watch property
  const watch = {}
  watch[overwritePropsKey] = 'dataAssign'

  return {
    data() {
      return _.assign(this.dataAssign(), {
        inProgress: false,
        error: null
      })
    },

    watch,

    methods: {
      dataAssign() {
        const source = _.cloneDeep(base) // make sure to preserve the original base
        const overwrite = _.get(this, overwritePropsKey, {})
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
        _.forEach(base, (v, key) => {
          data[key] = this[key]
        })

        const callback = (err) => {
          this.inProgress = false
          if (err) {
            this.error = err.message
          } else {
            this.$emit('dismiss')
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
            Meteor.call(insertMethod, {
              doc: data
            }, callback)
          }
        }
      }
    }
  }
}

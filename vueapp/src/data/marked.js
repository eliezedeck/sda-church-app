import _ from 'lodash'
import markedNPM from 'marked'


export const MarkedMixin = {
  methods: {
    marked(text) {
      return markedNPM(text)
    },

    markedFirstLine(text) {
      const first_line = _.trim(_.split(text, '\n')[0])
      return markedNPM(first_line)
    }
  }
}

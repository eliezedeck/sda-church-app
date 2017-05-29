import marked from 'marked'


export const Marked = {
  methods: {
    marked(text) {
      return marked(text)
    }
  }
}

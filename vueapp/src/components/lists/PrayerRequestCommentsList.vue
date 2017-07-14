<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <tbody>
      <tr v-for="comment in comments" :key="comment._id">
        <td>
          <div v-html="marked(comment.content)"></div>
          <a href="#">Delete this comment</a>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import PrayerRequestCommentsCollection from 'server/collections/prayerRequestComments'
  import {MarkedMixin} from '../../data/marked.js'

  export default {
    name: 'PrayerRequestCommentsList',

    mixins: [MarkedMixin],

    props: {
      prayerRequestId: {
        type: String,
        required: true
      }
    },

    meteor: {
      $subscribe: {
        'prayerRequestComments.forPrayerId'() {
          return [{prayerRequestId: this.prayerRequestId}]
        }
      },

      comments: {
        params() {
          return {id: this.prayerRequestId}
        },
        update({id}) {
          return PrayerRequestCommentsCollection.find({
            prayerRequestId: id
          })
        }
      }
    }
  }
</script>

<style>
</style>
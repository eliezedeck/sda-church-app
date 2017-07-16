<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <tbody>
      <tr v-for="comment in comments" :key="comment._id">
        <td>
          <div v-html="marked(comment.content)"></div>
          <div class="text-right">
            <small>posted by <member :memberObj="lo.get(membersLookup, [comment.createdBy], {})"></member> (<a @click.prevent="console.log('Net yet implemented')" href="#">Delete</a>)</small>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import PrayerRequestCommentsCollection from 'server/collections/prayerRequestComments'
  import {MarkedMixin} from '../../data/marked.js'
  import {membersMixin} from '../../stores/data/members.js'

  export default {
    name: 'PrayerRequestCommentsList',

    mixins: [MarkedMixin, membersMixin],

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
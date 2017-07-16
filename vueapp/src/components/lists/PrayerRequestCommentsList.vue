<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <tbody>
      <tr v-for="comment in comments" :key="comment._id">
        <td>
          <div v-html="marked(comment.content)"></div>
          <p class="help-block text-right">
            <span v-if="auth.user._id === comment.createdBy">You</span>
            <member v-else :memberObj="lo.get(membersLookup, [comment.createdBy], {})" />
            posted this on {{comment.createdAt | nice-date}}
            <span v-if="isAllowedToDeleteComment(comment)">(<a @click.prevent="onDeleteComment(comment._id)" href="#" style="color: red">Delete</a>)</span>
          </p>
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
          }, {
            sort: {createdAt: -1},
          })
        }
      }
    },

    methods: {
      onDeleteComment(id) {
        Meteor.call('prayerRequestComments.remove', {id}, (err) => {
          if (err) {
            window.alert(err.message)
          }
        })
      },

      isAllowedToDeleteComment(comment) {
        return comment.createdBy === this.auth.user._id ||
            this.auth.isChurchClerk ||
            this.auth.isZedeck
      }
    }
  }
</script>

<style>
</style>
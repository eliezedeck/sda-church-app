<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <tbody>
      <tr v-for="(comment, id) in prayer.comments">
        <td>
          <div v-html="marked(comment.content)"></div>
          <small>{{comment.createdAt | ts2date}}</small>
        </td>
        <td class="text-right">
          By <strong><member-span :member="membersLookup(comment.createdBy)"></member-span></strong>
          <small>
            <span>(<a @click.prevent="onDeleteComment(id)" href="#">Delete</a>)</span>
          </small>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import {SAuth} from '../../stores/auth.js'
  import {SMembersMixin} from '../../stores/members.js'
  import {Marked} from '../../mixins.js'
  import FApp from '../../stores/firebase.js'

  export default {
    name: 'PrayerCommentsList',

    mixins: [SMembersMixin, Marked],

    props: {
      prayer: {
        type: Object
      }
    },

    computed: {
      user() {
        return SAuth.state.user
      }
    },

    methods: {
      onDeleteComment(id) {
        FApp.database().ref(`/prayers/${this.prayer.id}/comments/${id}`).remove()
      }
    }
  }
</script>

<style scoped="">
  small {
    color: #aaaaaa;
  }
</style>
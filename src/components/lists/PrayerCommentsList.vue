<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <tbody>
      <tr v-if="comment !== null && id !== '.key'" v-for="(comment, id) in comments">
        <td>
          <div v-html="marked(comment.content|| '')"></div>
          <small>{{comment.createdAt | ts2date}}</small>
        </td>
        <td class="text-right">
          By <strong><member-span :member="membersLookup(comment.createdBy)"></member-span></strong>
          <small v-if="user && comment.createdBy === user.uid">
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
  import {VueFire} from 'vuefire'

  export default {
    name: 'PrayerCommentsList',

    mixins: [SMembersMixin, Marked],

    props: {
      prayer: {
        type: Object,
        required: true
      }
    },

    created() {
      this.$bindAsObject('comments', FApp.database().ref(`/prayerComments/${this.prayer.$id}`))
    },

    computed: {
      user() {
        return SAuth.state.user
      }
    },

    methods: {
      onDeleteComment(id) {
        FApp.database().ref(`/prayerComments/${this.prayer.$id}/${id}`).remove()
      }
    }
  }
</script>

<style scoped="">
  small {
    color: #aaaaaa;
  }
</style>
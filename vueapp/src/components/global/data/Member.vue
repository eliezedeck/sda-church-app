<script>
  export default {
    name: 'Member',

    functional: true,

    props: {
      memberObj: {
        type: Object
      }
    },

    render(h, ctx) {
      const memberObj = ctx.props.memberObj

      return (
        <span>
          <router-link to={`/members/${memberObj._id}`}>{memberObj.profile.displayName}</router-link>
        </span>
      )
    }
  }
</script>

<style>
</style>
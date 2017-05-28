<template>
  <span>
    {{member ? (member.displayName || member.name || member.phoneNumber) : ''}}
  </span>
</template>

<script>
  export default {
    name: 'MemberSpan',

    props: {
      member: {
        type: Object,
        default: {
          displayName: ''
        }
      }
    }
  }
</script>

<style>
</style>
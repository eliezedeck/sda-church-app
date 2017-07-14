<template>
  <button
      :disabled="inProgress || disabled"
      :class="className" type="submit">
    <span v-if="inProgress">
      <i v-if="inProgress" class="glyphicon glyphicon-refresh spin"></i>&nbsp;&nbsp;Please wait ...
    </span>
    <span v-else="">
      <slot><i class="glyphicon glyphicon-floppy-save"></i> Save</slot>
    </span>
  </button>
</template>

<script>
  export default {
    name: 'SubmitButton',
    props: {
      disabled: {
        type: Boolean,
        'default': false
      },

      inProgress: {
        type: Boolean,
        'default': false
      },

      className: {
        type: String,
        'default': "btn btn-primary"
      }
    }
  }
</script>

<style>
</style>
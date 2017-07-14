<template>
  <div class="well well-sm">
    <form>
      <div class="form-group">
        <label class="control-label">Your testimony</label>
        <textarea rows="6" class="form-control input-lg"></textarea>
        <p class="help-block">Text is in &quot;Markdown&quot; notation</p>
      </div>
      <div class="checkbox">
        <label>
          <input type="checkbox" />Make this Testimony also visible in the Testimonies page</label>
      </div>
      <div role="group" class="btn-group">
        <button class="btn btn-primary" type="button">Add my Testimony</button>
        <button class="btn btn-default" type="button">Cancel </button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'TestimonyForm'
  }
</script>

<style>
</style>
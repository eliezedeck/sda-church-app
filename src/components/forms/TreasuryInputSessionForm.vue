<template>
  <form>
    <div class="card text-light bg-dark">
      <div class="card-body">
        <h4 class="card-title">Start a New session</h4>
        <div class="form-group">
          <label>Session name</label>
          <input type="text" autofocus autocomplete="off" class="form-control" />
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea class="form-control"></textarea>
        </div>
        <div role="group" class="btn-group">
          <button class="btn btn-primary" type="submit">Save</button>
          <button @click="$emit('dismissed')" class="btn btn-secondary" type="button">Cancel</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'TreasuryInputSessionForm'
}
</script>


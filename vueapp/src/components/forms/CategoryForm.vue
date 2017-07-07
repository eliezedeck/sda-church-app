<template>
  <div class="well well-sm">
    <form>
      <div class="form-group">
        <label class="control-label">Nom de la catégorie d&#39;articles</label>
        <input type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label class="control-label">Code </label>
        <input type="text" class="form-control" />
      </div>
      <div role="group" class="btn-group">
        <button class="btn btn-primary" type="submit"><i class="glyphicon glyphicon-floppy-save"></i> Enregistrer </button>
        <button @click="$emit('dismiss')" class="btn btn-default" type="button">Fermer </button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {}
</script>

<style>
</style>
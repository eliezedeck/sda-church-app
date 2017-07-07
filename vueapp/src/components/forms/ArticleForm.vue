<template>
  <div class="well well-sm">
    <form>
      <div class="form-group">
        <label class="control-label">Code unique de l'article</label>
        <input type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label class="control-label">Description</label>
        <input type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label class="control-label">Prix d&#39;achat</label>
        <input type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label class="control-label">Prix de vente</label>
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
  export default {
    name: 'ArticleForm'
  }
</script>

<style>
</style>
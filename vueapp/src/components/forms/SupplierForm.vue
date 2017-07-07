<template>
  <div class="well well-sm">
    <form @submit.prevent.stop="onSubmit">
      <div class="form-group">
        <label class="control-label">Nom du Fournisseur</label>
        <input v-focus v-model="name" class="form-control" type="text" />
      </div>
      <div class="form-group">
        <label class="control-label">Code</label>
        <input v-model="code" class="form-control" type="text" />
      </div>

      <error-alert :error="error"></error-alert>

      <div class="btn-group" role="group">
        <submit-button :disabled="name.length < 2 || code.length < 2" :inProgress="inProgress"></submit-button>
        <button @click="$emit('dismiss')" class="btn btn-default" type="button">Fermer</button>
      </div>
    </form>
  </div>
</template>

<script>
  import _ from 'lodash'
  import {getFormHelperMixin} from '../../data/form.js'


  export default {
    name: 'SupplierForm',

    props: ['editObj'],

    mixins: [
      getFormHelperMixin({
        base: {
          name: '',
          code: ''
        },
        overwritePropsKey: 'editObj',
        insertMethod: 'suppliers.add',
        updateMethod: 'suppliers.update'
      })
    ]
  }
</script>

<style>
</style>
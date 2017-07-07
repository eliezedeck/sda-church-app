<template>
  <div class="row">
    <div class="col-md-4" v-if="showForm">
      <supplier-form @dismiss="$emit('dismissForm')" :editObj="selectedSupplierObj"></supplier-form>
    </div>
    <div :class="{'col-md-8': showForm, 'col-md-12': !showForm}">
      <suppliers-list></suppliers-list>
    </div>
  </div>
</template>

<script>
  import FormSupplier from './forms/SupplierForm.vue'
  import ListSuppliers from './lists/SuppliersList.vue'
  import {pageArticlesDataMixin} from '../stores/page-articles.js'

  export default {
    name: 'Articles--Suppliers',

    mixins: [pageArticlesDataMixin],

    props: ['showForm'],

    components: {
      'supplier-form': FormSupplier,
      'suppliers-list': ListSuppliers
    }
  }
</script>

<style>
</style>
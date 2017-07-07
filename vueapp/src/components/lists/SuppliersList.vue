<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover">
      <thead>
      <tr>
        <th>Code</th>
        <th>Fournisseur</th>
        <th class="text-right">Nombre d&#39;articles</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="supplier in allSuppliers"
          @click="$store.commit('pageArticles/updateSelection', {domain: 'suppliers', id: supplier._id})"
          :class="{active: selectedId === supplier._id}"
      >
        <td><strong>{{supplier.code}}</strong></td>
        <td>{{supplier.name}}</td>
        <td class="text-right">{{supplier.articlesCount || 0}}</td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td>TOTAL</td>
        <td>{{allSuppliers.length}} fournisseur(s)</td>
        <td class="text-right">{{footer.total}}</td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
  import _ from 'lodash'
  import SuppliersCollection from 'server/collections/suppliers'

  export default {
    name: 'SuppliersList',

    data() {
      return {
        allSuppliers: []
      }
    },

    meteor: {
      $subscribe: {
        'suppliers.all': []
      },

      allSuppliers() {
        return SuppliersCollection.find({}, {sort: {code: 1}})
      }
    },

    computed: {
      footer() {
        let total = 0
        return {total}
      },

      selectedId() {
        return this.$store.state.pageArticles.selectedSupplierId
      }
    }
  }
</script>

<style>
</style>
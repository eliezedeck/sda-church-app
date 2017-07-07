<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h3>Articles &mdash;
          <div role="group" class="btn-group">
            <button @click="onNew" :disabled="showForm && !selectedId" class="btn btn-default" type="button"><i class="glyphicon glyphicon-plus"></i> Nouveau</button>
            <button @click="showForm = true" :disabled="showForm || !selectedId" class="btn btn-warning" type="button"><i class="glyphicon glyphicon-pencil"></i> Édition</button>
          </div>
        </h3>
      </div>
      <div class="col-sm-2" style="padding-bottom: 1em">
        <router-link
            v-for="section in sections"
            :key="section.path"
            :class="{'active btn-info': currentRoutePath.indexOf(section.path) !== -1}"
            @click.native="showForm = false"
            class="btn btn-default btn-block" role="button" :to="section.path">{{section.label}}</router-link>
      </div>
      <div class="col-sm-10">
        <div class="row" v-if="currentSection === 'types'">
          <div class="col-md-4" v-if="showForm">
            <article-form @dismiss="showForm = false"></article-form>
          </div>
          <div :class="{'col-md-8': showForm, 'col-md-12': !showForm}">
            <div class="table-responsive">
              <table class="table table-condensed table-striped table-hover">
                <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Prix d&#39;achat</th>
                  <th>Prix de vente</th>
                  <th>Bénéfice</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Cell 1</td>
                  <td>Cell 2</td>
                  <td>Cell 3</td>
                  <td>Cell 3</td>
                  <td>Cell 5</td>
                </tr>
                <tr>
                  <td>Cell 3</td>
                  <td>Cell 4</td>
                  <td>Cell 3</td>
                  <td>Cell 3</td>
                  <td>Cell 5</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row" v-if="currentSection === 'category'">
          <div class="col-md-4" v-if="showForm">
            <category-form @dismiss="showForm = false"></category-form>
          </div>
          <div :class="{'col-md-8': showForm, 'col-md-12': !showForm}">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                <tr>
                  <th>Catégorie </th>
                  <th>Code </th>
                  <th>Nombre d&#39;articles</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Cell 1</td>
                  <td>Cell 2</td>
                  <td>Cell 3</td>
                </tr>
                <tr>
                  <td>Cell 3</td>
                  <td>Cell 4</td>
                  <td>Cell 3</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td>TOTAL </td>
                  <td> </td>
                  <td>46164 </td>
                </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <suppliers-section
            v-if="currentSection === 'suppliers'"
            :showForm="showForm"
            @dismissForm="showForm = false" />
      </div>
    </div>
  </div>
</template>

<script>
  import Form from './forms/ArticleForm.vue'
  import FormCategory from './forms/CategoryForm.vue'
  import SuppliersSection from './Articles--Suppliers.vue'

  export default {
    name: 'Articles',

    data() {
      return {
        showForm: false,
        sections: [
          /* i18n */
          {path: '/articles/types', label: `Type d'articles`},
          {path: '/articles/category', label: `Catégories`},
          {path: '/articles/suppliers', label: `Fournisseurs`},
        ]
      }
    },

    computed: {
      currentRoutePath() {
        return this.$route.path
      },

      currentSection() {
        return this.$route.params.section
      },

      selectedId() {
        const section = this.$route.params.section
        if (section === 'suppliers')
          return this.$store.state.pageArticles.selectedSupplierId
      }
    },

    methods: {
      onNew() {
        // This is mainly just going to deselect any selection for the current section
        const section = this.$route.params.section
        if (section === 'suppliers')
          this.$store.commit('pageArticles/updateSelection', {domain: 'suppliers', id: ''})

        this.showForm = true
      }
    },

    components: {
      'article-form': Form,
      'category-form': FormCategory,
      SuppliersSection
    }
  }
</script>

<style>
  h3 {
    margin-top: .5em;
  }
</style>
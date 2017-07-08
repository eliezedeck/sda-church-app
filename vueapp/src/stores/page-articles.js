// import SuppliersCollection from 'server/collections/suppliers'
//
//
// export default {
//   state: {
//     selectedSupplierId: ''
//   },
//
//   mutations: {
//     updateSelection(state, {domain, id}) {
//       if (domain === 'suppliers')
//         state.selectedSupplierId = id
//     }
//   }
// }
//
// export const pageArticlesDataMixin = {
//   meteor: {
//     selectedSupplierObj: {
//       params() {
//         return {id: this.$store.state.pageArticles.selectedSupplierId}
//       },
//
//       update({id}) {
//         if (id) {
//           return SuppliersCollection.findOne(id)
//         }
//         return {}
//       }
//     }
//   }
// }

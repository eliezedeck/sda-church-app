<template>
  <div>
    <div ref="toolbar" class="toolbar hidden-print">
      <slot name="toolbar"></slot>
    </div>
    <div ref="content" class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'ToolbarAndContent',

    mounted() {
      const toolbar = $(this.$refs.toolbar)
      const content = $(this.$refs.content)

      const doDebouncedResize = _.debounce((height) => {
        content.css({
          marginTop: height + 15
        })
      }, 50 /* enough time to avoid CPU drain */)

      $(window).on('resize', function () {
        const height = toolbar.height()
        if (height)
          doDebouncedResize(height)
      })

      doDebouncedResize(toolbar.height())
    }
  }
</script>

<style scoped>
  @media only screen {
    div.toolbar {
      width: 100%;
      background-color: #ffce73;
      position: fixed;
      top: 51px;
      z-index: 100;

      -webkit-box-shadow: 0 0 11px 0 rgba(0, 0, 0, 0.75);
      -moz-box-shadow: 0 0 11px 0 rgba(0, 0, 0, 0.75);
      box-shadow: 0 0 11px 0 rgba(0, 0, 0, 0.75);
    }

    div.toolbar > div > h3 {
      margin: 0;
      padding: .15em 0 .3em 0;
      line-height: 1.7em;
    }

    div.toolbar > div > h3 > div.btn-group {
      margin-top: -2px;
    }

    div.content {
      margin-top: 50px;
    }
  }

  @media only print {
    div.content {
      margin-top: 0 !important;
    }
  }
</style>
<template>
  <div v-if="mode === 'inline'" :id="elementId"></div>

  <div v-else class="form-group">
    <div class="input-group date" :id="elementId" data-target-input="nearest">
      <input type="text" class="form-control datetimepicker-input" :data-target="element$"/>
      <div class="input-group-append" :data-target="element$" data-toggle="datetimepicker">
        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import 'tempusdominus-bootstrap-4'
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.css'

export default {
  name: 'DateTimePicker',

  props: {
    mode: {
      type: String,
      default: 'normal',
      validator (value) {
        return value === 'normal' || value === 'inline'
      }
    },

    format: {
      type: String,
      default: 'dddd, MMMM Do YYYY'
    },

    value: {
      type: Date,
      default () {
        return new Date()
      }
    }
  },

  data () {
    const elementId = new Date().getTime()
    return {
      elementId,
      element$: '#' + elementId
    }
  },

  mounted () {
    const options = {
      format: this.format,
      date: this.value
    }

    if (this.mode === 'inline') {
      options.inline = true
    }

    $(this.element$).datetimepicker(options)
    $(this.element$).on('change.datetimepicker', (e) => {
      this.$emit('input', e.date.toDate())
    })

    // For some reason, this is not available inside beforeDestroy(), so we store this reference
    this.dp = $(this.element$).data('datetimepicker')
  },

  beforeDestroy () {
    this.dp.destroy()
  }
}
</script>

<template>
  <a-form-item :label="this.$t('diskSize')">
    <a-row>
      <a-col :span="10">
        <a-slider
          :min="0"
          :max="1024"
          v-decorator="[inputDecorator]"
        />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-decorator="[inputDecorator, {
            rules: [{ required: false, message: 'Please enter a number' }]
          }]"
          :formatter="value => `${value} GB`"
          :parser="value => value.replace(' GB', '')"
        />
      </a-col>
    </a-row>
  </a-form-item>
</template>

<script>
export default {
  name: 'DiskSizeSelection',
  props: {
    inputDecorator: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>

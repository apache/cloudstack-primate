<template>
  <a-select labelInValue :defaultValue="{ key: defaultValue }" style="width: 120px" @change="handleChange">
    <a-select-option value="allow">Allow</a-select-option>
    <a-select-option value="deny">Deny</a-select-option>
  </a-select>
</template>

<script>
export default {
  props: {
    defaultValue: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    handleChange (e) {
      this.$emit('change', e.key)
    }
  }

}
</script>

<style lang="scss" scoped>

</style>

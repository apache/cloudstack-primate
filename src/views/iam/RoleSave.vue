<template>
  <a-button @click="handleSave">
    <a-icon
      type="save"
    />
  </a-button>
</template>

<script>
export default {
  name: 'RoleSave',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleSave () {
      this.$emit('save')
    }
  }
}
</script>

<style scoped>

</style>

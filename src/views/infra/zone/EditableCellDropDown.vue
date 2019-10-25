<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-select
        :defaultValue="value"
        @change="handleChange"
        @pressEnter="check"
      >
        <a-select-option value="VLAN"> VLAN </a-select-option>
        <a-select-option value="GRE"> GRE </a-select-option>
        <a-select-option value="STT"> STT </a-select-option>
        <a-select-option value="BCF_SEGMENT"> BCF_SEGMENT </a-select-option>
        <a-select-option value="VXLAN"> VXLAN </a-select-option>
        <a-select-option value="ODL"> ODL </a-select-option>
        <a-select-option value="L3VPN"> L3VPN </a-select-option>
        <a-select-option value="VSP"> VSP </a-select-option>
        <a-select-option value="VCS"> VCS </a-select-option>
      </a-select>
      <a-icon
        type="check"
        class="editable-cell-icon-check"
        @click="check"
      />
    </div>
    <div v-else class="editable-cell-text-wrapper" @click="edit">
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: 'VLAN'
    }
  },
  data () {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    handleChange (val) {
      this.value = val
    },
    check () {
      this.editable = false
      this.$emit('change', this.value)
    },
    edit () {
      this.editable = true
    }
  }
}
</script>

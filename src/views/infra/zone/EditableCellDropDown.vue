// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

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

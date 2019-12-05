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
  <div>
    <a-auto-complete
      :filterOption="filterOption"
      :dataSource="sortedData"
      @select="onSelect"
      placeholder="Select API"
      :value="defaultValue"
      :class="{'rule-dropdown-error' : error}" />
    <div v-if="error" class="error-label">* Required</div>
  </div>
</template>

<script>
export default {
  name: 'APIAutoComplete',
  props: {
    error: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      required: true
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sortedData: []
    }
  },
  mounted () {
    this.sortedData = Object.keys(this.data).sort((a, b) => a.localeCompare(b))
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      )
    },
    onSelect (value) {
      this.$emit('selectedRecord', value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .error-label {
    color: #ff0000;
    font-size: 12px;
  }
</style>

<style lang="scss">
  .rule-dropdown-error {

    .ant-input {
      border-color: #ff0000
    }

  }
</style>

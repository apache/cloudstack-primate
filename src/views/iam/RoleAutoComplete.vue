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
    <a-icon v-if="loading" type="loading"></a-icon>
    <a-auto-complete
      v-else
      :filterOption="filterOption"
      @select="onSelect"
      placeholder="Select Rule"
      :class="{'rule-dropdown-error' : error}">
      <template slot="dataSource">
        <a-select-option
          v-for="item in dataSource"
          :key="item.name"
        >{{ item.name }}</a-select-option>
      </template>
    </a-auto-complete>
    <div v-if="error" class="error-label">* Required</div>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'RoleAutoComplete',
  props: {
    error: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataSource: [],
      loading: true
    }
  },
  beforeMount () {
    this.dataSource = api('listApis', {}).then(response => {
      this.dataSource = response.listapisresponse.api
    }).catch(error => {
      console.error(error)
    }).finally(() => {
      this.loading = false
    })
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

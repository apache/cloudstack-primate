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
  <span v-if="!dataView">
    <span v-if="!searchFilters || searchFilters.length === 0">
      <a-select
        v-if="filters && filters.length > 0"
        placeholder="Filter By"
        :value="$t('label.' + selectedFilter)"
        style="min-width: 100px; margin-left: 10px"
        @change="changeFilter">
        <a-icon slot="suffixIcon" type="filter" />
        <a-select-option v-for="filter in filters" :key="filter">
          {{ $t('label.' + filter) }}
        </a-select-option>
      </a-select>
      <a-input-search
        class="input-search"
        placeholder="Search"
        v-model="searchQuery"
        allowClear
        @search="onSearch" />
    </span>

    <span
      v-else
      class="filter-group">
      <a-select
        v-if="filters && filters.length > 0"
        placeholder="Filter By"
        :value="$t('label.' + selectedFilter)"
        style="min-width: 100px; margin-left: 10px"
        @change="changeFilter">
        <a-icon slot="suffixIcon" type="filter" />
        <a-select-option v-for="filter in filters" :key="filter">
          {{ $t('label.' + filter) }}
        </a-select-option>
      </a-select>
      <a-input-search
        allowClear
        class="input-search"
        placeholder="Search"
        @search="onSearch">
        <a-popover
          placement="bottomRight"
          slot="addonAfter"
          trigger="click"
          v-model="visibleFilter">
          <template slot="content">
            <a-form
              :form="form"
              layout="vertical"
              @submit="handleSubmit">
              <a-form-item
                v-for="(field, index) in fields"
                :key="index"
                :label="field.name==='keyword' ? $t('name') : $t(field.name)">
                <a-select
                  allowClear
                  v-if="field.type==='list'"
                  v-decorator="[field.name]"
                  :loading="field.loading">
                  <a-select-option
                    v-for="(opt, idx) in field.opts"
                    :key="idx"
                    :value="opt.id">{{ $t(opt.name) }}</a-select-option>
                </a-select>
                <a-input
                  v-else-if="field.type==='input'"
                  v-decorator="[field.name]" />
                <div v-else-if="field.type==='tag'">
                  <a-tag
                    v-if="!inputVisible && tags.length === 0"
                    @click="showInput"
                    style="background: #fff; borderStyle: dashed;">
                    <a-icon type="plus" /> New Tag
                  </a-tag>
                  <template
                    v-if="tags.length > 0"
                    v-for="(tag, tagIdx) in tags">
                    <a-tag :key="tagIdx" :closable="true" :afterClose="handleDeleteTag">
                      {{ tag.key }} = {{ tag.value }}
                    </a-tag>
                  </template>
                  <div v-if="inputVisible">
                    <a-input-group
                      type="text"
                      size="small"
                      @blur="handleInputConfirm"
                      @keyup.enter="handleInputConfirm"
                      compact>
                      <a-input ref="input" :value="inputKey" @change="handleKeyChange" style="width: 50px; text-align: center" placeholder="Key" />
                      <a-input style=" width: 20px; border-left: 0; pointer-events: none; backgroundColor: #fff" placeholder="=" disabled />
                      <a-input :value="inputValue" @change="handleValueChange" style="width: 50px; text-align: center; border-left: 0" placeholder="Value" />
                      <a-button shape="circle" size="small" @click="handleInputConfirm">
                        <a-icon type="check"/>
                      </a-button>
                      <a-button shape="circle" size="small" @click="inputVisible=false">
                        <a-icon type="close"/>
                      </a-button>
                    </a-input-group>
                  </div>
                </div>
              </a-form-item>
              <div class="filter-group-button">
                <a-button
                  class="filter-group-button-clear"
                  type="default"
                  size="small"
                  icon="stop"
                  @click="onClear">Clear</a-button>
                <a-button
                  class="filter-group-button-search"
                  type="primary"
                  size="small"
                  icon="search"
                  @click="handleSubmit">Search</a-button>
              </div>
            </a-form>
          </template>
          <a-button
            class="filter-group-button"
            icon="filter"
            size="small"/>
        </a-popover>
      </a-input-search>
    </span>
  </span>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'SearchView',
  props: {
    dataView: {
      type: Boolean,
      default: false
    },
    treeView: {
      type: Boolean,
      default: false
    },
    filters: {
      type: Array,
      default: () => []
    },
    searchFilters: {
      type: Array,
      default: () => []
    },
    apiName: {
      type: String,
      default: () => ''
    },
    selectedFilter: {
      type: String,
      default: () => ''
    }
  },
  inject: ['parentSearch', 'parentFilter', 'parentChangeFilter'],
  data () {
    return {
      searchQuery: null,
      paramsFilter: {},
      visibleFilter: false,
      inputVisible: false,
      fields: [],
      tags: [],
      inputKey: '',
      inputValue: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  watch: {
    visibleFilter (newValue, oldValue) {
      if (newValue) {
        this.initFormFieldData()
      }
    }
  },
  methods: {
    async initFormFieldData () {
      this.fields = this.searchFilters.map(item => {
        if (['zoneid', 'domainid', 'state', 'level'].includes(item)) {
          return {
            type: 'list',
            name: item,
            opts: [],
            loading: false
          }
        }
        if (item === 'tags') {
          return {
            type: 'tag',
            name: item
          }
        }
        return {
          type: 'input',
          name: item
        }
      })

      const promises = []
      let zoneIndex = -1
      let domainIndex = -1

      if (this.searchFilters.includes('state')) {
        const stateIndex = this.fields.findIndex(item => item.name === 'state')
        this.fields[stateIndex].loading = true
        this.fields[stateIndex].opts = this.fetchState()
        this.fields[stateIndex].loading = false
      }

      if (this.searchFilters.includes('level')) {
        const levelIndex = this.fields.findIndex(item => item.name === 'level')
        this.fields[levelIndex].loading = true
        this.fields[levelIndex].opts = this.fetchLevel()
        this.fields[levelIndex].loading = false
      }

      if (this.searchFilters.includes('zoneid')) {
        zoneIndex = this.fields.findIndex(item => item.name === 'zoneid')
        this.fields[zoneIndex].loading = true
        promises.push(await this.fetchZones())
      }

      if (this.searchFilters.includes('domainid')) {
        domainIndex = this.fields.findIndex(item => item.name === 'domainid')
        this.fields[domainIndex].loading = true
        promises.push(await this.fetchDomains())
      }

      Promise.all(promises).then(response => {
        if (zoneIndex > -1) {
          const zones = response.filter(item => item.type === 'zoneid')
          if (zones && zones.length > 0) {
            this.fields[zoneIndex].opts = zones[0].data
          }
        }
        if (domainIndex > -1) {
          const domain = response.filter(item => item.type === 'domainid')
          if (domain && domain.length > 0) {
            this.fields[domainIndex].opts = domain[0].data
          }
        }
        this.$forceUpdate()
      }).finally(() => {
        if (zoneIndex > -1) {
          this.fields[zoneIndex].loading = false
        }
        if (domainIndex > -1) {
          this.fields[domainIndex].loading = false
        }
      })
    },
    fetchZones () {
      return new Promise((resolve, reject) => {
        api('listZones', { listAll: true }).then(json => {
          const zones = json.listzonesresponse.zone
          resolve({
            type: 'zoneid',
            data: zones
          })
        }).catch(error => {
          reject(error.response.headers['x-description'])
        })
      })
    },
    fetchDomains () {
      return new Promise((resolve, reject) => {
        api('listDomains', { listAll: true }).then(json => {
          const domain = json.listdomainsresponse.domain
          resolve({
            type: 'domainid',
            data: domain
          })
        }).catch(error => {
          reject(error.response.headers['x-description'])
        })
      })
    },
    fetchState () {
      console.log(this.apiName)
      const state = []
      if (this.apiName.indexOf('listVolumes') > -1) {
        state.push({
          id: 'Allocated',
          name: 'Allocated'
        })
        state.push({
          id: 'Ready',
          name: 'Ready'
        })
        state.push({
          id: 'Destroy',
          name: 'Destroy'
        })
        state.push({
          id: 'Expunging',
          name: 'Expunging'
        })
        state.push({
          id: 'Expunged',
          name: 'Expunged'
        })
      }
      return state
    },
    fetchLevel () {
      const levels = []
      levels.push({
        id: 'INFO',
        name: 'INFO'
      })
      levels.push({
        id: 'WARN',
        name: 'WARN'
      })
      levels.push({
        id: 'ERROR',
        name: 'ERROR'
      })
      return levels
    },
    onSearch (value) {
      this.searchQuery = value
      this.parentSearch(this.searchQuery)
    },
    onClear () {
      this.searchFilters.map(item => {
        const field = {}
        field[item] = undefined
        this.paramsFilter[item] = undefined
        this.form.setFieldsValue(field)
      })
      this.tags = []
      this.parentFilter(this.paramsFilter)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.paramsFilter = {}
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        for (const key in values) {
          const input = values[key]
          if (input === '' || input === null || input === undefined) {
            continue
          }
          this.paramsFilter[key] = input
        }
        if (this.searchFilters.includes('tags')) {
          if (this.tags.length > 0) {
            this.paramsFilter['tags[0].key'] = this.tags[0].key
            this.paramsFilter['tags[0].value'] = this.tags[0].value
          }
        }

        this.parentFilter(this.paramsFilter)
      })
    },
    handleKeyChange (e) {
      this.inputKey = e.target.value
    },
    handleValueChange (e) {
      this.inputValue = e.target.value
    },
    handleInputConfirm () {
      const args = {}
      args['tags[0].key'] = this.inputKey
      args['tags[0].value'] = this.inputValue

      this.tags.push({
        key: this.inputKey,
        value: this.inputValue
      })

      this.inputVisible = false
      this.inputKey = ''
      this.inputValue = ''
    },
    handleDeleteTag () {
      this.tags = []
    },
    showInput () {
      this.inputVisible = true
    },
    changeFilter (filter) {
      this.parentChangeFilter(filter)
    }
  }
}
</script>

<style scoped lang="less">
.input-search {
  width: 20vw;
  margin-left: 10px;
}

.filter-group {
  /deep/.ant-input-group-addon {
    padding: 0 5px;
  }

  &-button {
    background: inherit;
    border: 0;
    padding: 0;
  }

  &-button {
    position: relative;
    display: block;
    min-height: 25px;

    &-clear {
      position: absolute;
      left: 0;
    }

    &-search {
      position: absolute;
      right: 0;
    }
  }
}
</style>

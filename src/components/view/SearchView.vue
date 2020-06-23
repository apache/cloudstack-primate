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
  <span v-if="!dataView" :style="styleSearch">
    <span v-if="!searchFilters || searchFilters.length === 0" style="display: flex;">
      <a-input-search
        style="width: 100%; display: table-cell"
        :placeholder="$t('label.search')"
        v-model="searchQuery"
        allowClear
        @search="onSearch" />
    </span>

    <span
      v-else
      class="filter-group">
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
              style="min-width: 170px"
              :form="form"
              layout="vertical"
              @submit="handleSubmit">
              <a-form-item
                v-for="(field, index) in fields"
                :key="index"
                :label="field.name==='keyword' ? $t('label.name') : $t('label.' + field.name)">
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
                    <a-icon type="plus" /> {{ $t('label.new.tag') }}
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
                      <a-input ref="input" :value="inputKey" @change="handleKeyChange" style="width: 50px; text-align: center" :placeholder="$t('label.key')" />
                      <a-input style=" width: 20px; border-left: 0; pointer-events: none; backgroundColor: #fff" placeholder="=" disabled />
                      <a-input :value="inputValue" @change="handleValueChange" style="width: 50px; text-align: center; border-left: 0" :placeholder="$t('label.value')" />
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
                  @click="onClear">{{ $t('label.clear') }}</a-button>
                <a-button
                  class="filter-group-button-search"
                  type="primary"
                  size="small"
                  icon="search"
                  @click="handleSubmit">{{ $t('label.search') }}</a-button>
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
  computed: {
    styleSearch () {
      if (!this.searchFilters || this.searchFilters.length === 0) {
        return {
          width: '100%',
          display: 'table-cell'
        }
      }

      return {
        width: '100%',
        display: 'table-cell',
        lineHeight: '31px'
      }
    }
  },
  methods: {
    async initFormFieldData () {
      const arrayField = []
      this.fields = []
      this.searchFilters.forEach(item => {
        let type = 'input'

        if (item === 'domainid' && !('listDomains' in this.$store.getters.apis)) {
          return true
        }
        if (item === 'account' && ('addAccountToProject' in this.$store.getters.apis || 'createAccount' in this.$store.getters.apis)) {
          return true
        }
        if (['zoneid', 'domainid', 'state', 'level'].includes(item)) {
          type = 'list'
        } else if (item === 'tags') {
          type = 'tag'
        }

        this.fields.push({
          type: type,
          name: item,
          opts: [],
          loading: false
        })
        arrayField.push(item)
      })

      const promises = []
      let zoneIndex = -1
      let domainIndex = -1

      if (arrayField.includes('state')) {
        const stateIndex = this.fields.findIndex(item => item.name === 'state')
        this.fields[stateIndex].loading = true
        this.fields[stateIndex].opts = this.fetchState()
        this.fields[stateIndex].loading = false
      }

      if (arrayField.includes('level')) {
        const levelIndex = this.fields.findIndex(item => item.name === 'level')
        this.fields[levelIndex].loading = true
        this.fields[levelIndex].opts = this.fetchLevel()
        this.fields[levelIndex].loading = false
      }

      if (arrayField.includes('zoneid')) {
        zoneIndex = this.fields.findIndex(item => item.name === 'zoneid')
        this.fields[zoneIndex].loading = true
        promises.push(await this.fetchZones())
      }

      if (arrayField.includes('domainid')) {
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

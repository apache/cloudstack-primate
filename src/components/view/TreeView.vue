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
  <resource-layout>
    <a-spin :spinning="loading" slot="left">
      <a-card :bordered="false">
        <a-input-search
          size="default"
          placeholder="Search"
          v-model="searchQuery"
          @search="onSearch"
        >
          <a-icon slot="prefix" type="search" />
        </a-input-search>
        <a-spin :spinning="loadingSearch">
          <a-directory-tree
            showLine
            v-if="treeViewData.length > 0"
            class="list-tree-view"
            :loadData="onLoadData"
            :treeData="treeViewData"
            :expandAction="false"
            :showIcon="false"
            :defaultSelectedKeys="defaultSelected"
            :checkStrictly="true"
            @select="onSelect"
            :defaultExpandedKeys="arrExpand" />
        </a-spin>
      </a-card>
    </a-spin>
    <a-spin :spinning="detailLoading" slot="right">
      <a-card
        class="spin-content"
        :bordered="true"
        style="width:100%">
        <a-tabs
          style="width: 100%"
          :animated="false"
          :defaultActiveKey="tabs[0].name"
          @change="onTabChange" >
          <a-tab-pane
            v-for="tab in tabs"
            :tab="$t(tab.name)"
            :key="tab.name"
            v-if="checkShowTabDetail(tab.name)">
            <component
              :is="tab.component"
              :resource="resource"
              :items="items"
              :tab="tabActive"
              :loading="loading" />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-spin>
  </resource-layout>
</template>

<script>
import store from '@/store'
import { api } from '@/api'
import DetailsTab from '@/components/view/DetailsTab'
import ResourceView from '@/components/view/ResourceView'
import ResourceLayout from '@/layouts/ResourceLayout'

export default {
  name: 'TreeView',
  components: {
    ResourceLayout,
    ResourceView
  },
  props: {
    treeData: {
      type: Array,
      required: true
    },
    treeSelected: {
      type: Object,
      required: true
    },
    tabs: {
      type: Array,
      default: function () {
        return [{
          name: 'details',
          component: DetailsTab
        }]
      }
    },
    loadedKeys: {
      type: Array,
      default: function () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      detailLoading: false,
      loadingSearch: false,
      tabActive: 'details',
      selectedTreeKey: '',
      resource: {},
      defaultSelected: [],
      treeVerticalData: [],
      treeViewData: [],
      apiList: '',
      apiChildren: '',
      apiDetail: '',
      metaName: '',
      page: 1,
      pageSize: 20,
      items: [],
      showSetting: false,
      oldSearchQuery: '',
      searchQuery: '',
      arrExpand: [],
      rootKey: ''
    }
  },
  created: function () {
    this.metaName = this.$route.meta.name
    this.apiList = this.$route.meta.permission[0] ? this.$route.meta.permission[0] : ''
    this.apiChildren = this.$route.meta.permission[1] ? this.$route.meta.permission[1] : ''
  },
  watch: {
    loading () {
      this.detailLoading = this.loading
    },
    treeData: function () {
      this.treeViewData = this.treeData
      this.searchQuery = ''
      if (this.treeViewData.length > 0) {
        this.rootKey = this.treeViewData[0].key
      }
    },
    treeSelected: function () {
      if (Object.keys(this.treeSelected).length === 0) {
        return
      }
      this.resource = this.treeSelected
      this.selectedTreeKey = this.resource.key
      this.defaultSelected.push(this.selectedTreeKey)
      if (this.defaultSelected.length > 1) {
        const arrSelected = this.defaultSelected
        this.defaultSelected = []
        this.defaultSelected.push(arrSelected[0])
      }
    }
  },
  methods: {
    onLoadData (treeNode) {
      if (this.searchQuery !== '' && treeNode.eventKey !== this.rootKey) {
        return new Promise(resolve => {
          resolve()
        })
      }
      const params = {
        listAll: true,
        id: treeNode.eventKey
      }
      return new Promise(resolve => {
        api(this.apiChildren, params).then(json => {
          const jsonRespone = this.getResponseJsonData(json)
          const jsonGenerate = this.generateTreeData(jsonRespone)
          treeNode.dataRef.children = jsonGenerate
          if (this.treeVerticalData.length === 0) {
            this.treeVerticalData = this.treeViewData
          }
          this.treeViewData = [...this.treeViewData]
          this.treeVerticalData = this.treeVerticalData.concat(jsonGenerate)
          resolve()
        })
      })
    },
    onSelect (selectedKeys) {
      // check item tree selected, set selectedTreeKey
      if (selectedKeys && selectedKeys[0]) {
        this.selectedTreeKey = selectedKeys[0]
      }

      // get item resource
      const resource = this.treeVerticalData.filter(item => item.id === this.selectedTreeKey)

      // check resource exists
      if (resource && resource[0]) {
        this.resource = resource[0]
        this.$emit('change-resource', this.resource)
      }
    },
    onSearch (value) {
      if (this.searchQuery === '' && this.oldSearchQuery === '') {
        return
      }

      this.searchQuery = value
      this.newTreeData = this.treeViewData
      this.treeVerticalData = this.newTreeData

      // set parameter for the request
      const params = {}
      params.listall = true

      // Check the search query to set params and variables using reset data
      if (this.searchQuery !== '') {
        this.oldSearchQuery = this.searchQuery
        params.keyword = this.searchQuery
      } else if (this.metaName === 'domain') {
        this.oldSearchQuery = ''
        params.id = this.$store.getters.userInfo.domainid
      }

      this.arrExpand = []
      this.treeViewData = []
      this.loadingSearch = true

      api(this.apiList, params).then(json => {
        const listDomains = this.getResponseJsonData(json)
        this.treeVerticalData = this.treeVerticalData.concat(listDomains)

        if (!listDomains || listDomains.length === 0) {
          return
        }

        if (listDomains[0].id === this.rootKey) {
          const rootDomain = this.generateTreeData(listDomains)
          this.treeViewData = rootDomain
          return
        }

        // get the max level of data search response
        const maxLevel = Math.max.apply(Math, listDomains.map((o) => { return o.level }))
        this.recursiveTreeData(listDomains, maxLevel)

        // check treeViewData, set to expand first children
        if (this.treeViewData &&
            this.treeViewData[0] &&
            this.treeViewData[0].children &&
            this.treeViewData[0].children.length > 0
        ) {
          this.arrExpand.push(this.treeViewData[0].children[0].key)
        }
      }).finally(() => {
        this.loadingSearch = false
      })
    },
    onTabChange (key) {
      this.tabActive = key
    },
    getResponseJsonData (json) {
      let responseName
      let objectName
      for (const key in json) {
        if (key.includes('response')) {
          responseName = key
          break
        }
      }
      for (const key in json[responseName]) {
        if (key === 'count') {
          continue
        }
        objectName = key
        break
      }
      return json[responseName][objectName]
    },
    checkShowTabDetail (tabKey) {
      // get tab item from the route
      const itemTab = this.tabs.filter(item => item.name === tabKey)

      // check tab item not exists
      if (!itemTab || !itemTab[0]) {
        return false
      }

      // get permission from the route
      const permission = itemTab[0].permission ? itemTab[0].permission[0] : ''

      // check permission not exists
      if (!permission || permission === '') {
        return true
      }

      // Check the permissions to see the tab for a user
      if (!Object.prototype.hasOwnProperty.call(store.getters.apis, permission)) {
        return false
      }

      return true
    },
    generateTreeData (jsonData) {
      if (!jsonData || jsonData.length === 0) {
        return []
      }

      for (let i = 0; i < jsonData.length; i++) {
        jsonData[i].title = jsonData[i].name
        jsonData[i].key = jsonData[i].id
      }

      return jsonData
    },
    recursiveTreeData (treeData, maxLevel) {
      const items = treeData.filter(item => item.level <= maxLevel)
      this.treeViewData = this.getNestedChildren(items, 0, maxLevel)
    },
    getNestedChildren (dataItems, level, maxLevel, id) {
      if (level > maxLevel) {
        return
      }

      let items = []

      if (!id || id === '') {
        items = dataItems.filter(item => item.level === level)
      } else {
        items = dataItems.filter(item => {
          let parentKey = ''
          const arrKeys = Object.keys(item)
          for (let i = 0; i < arrKeys.length; i++) {
            if (arrKeys[i].indexOf('parent') > -1 && arrKeys[i].indexOf('id') > -1) {
              parentKey = arrKeys[i]
              break
            }
          }

          return parentKey ? item[parentKey] === id : item.level === level
        })
      }

      if (items.length === 0) {
        return this.getNestedChildren(dataItems, (level + 1), maxLevel)
      }

      for (let i = 0; i < items.length; i++) {
        items[i].title = items[i].name
        items[i].key = items[i].id

        if (items[i].haschild) {
          items[i].children = this.getNestedChildren(dataItems, (level + 1), maxLevel, items[i].key)
        }
      }

      return items
    }
  }
}
</script>

<style lang="less" scoped>
.list-tree-view {
  overflow-y: hidden;
}
/deep/.ant-tree.ant-tree-directory {
  li.ant-tree-treenode-selected {
    span.ant-tree-switcher {
      color: rgba(0, 0, 0, 0.65);
    }
    span.ant-tree-node-content-wrapper.ant-tree-node-selected > span {
      color: rgba(0, 0, 0, 0.65);
      background-color: #bae7ff;
    }
    span.ant-tree-node-content-wrapper::before {
      background: #ffffff;
    }
  }

  .ant-tree-child-tree {
    li.ant-tree-treenode-selected {
      span.ant-tree-switcher {
        color: rgba(0, 0, 0, 0.65);
      }
      span.ant-tree-node-content-wrapper::before {
        background: #ffffff;
      }
    }
  }
}
</style>

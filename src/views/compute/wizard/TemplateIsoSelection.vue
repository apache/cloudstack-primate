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
  <a-tabs :defaultActiveKey="Object.keys(osTypes)[0]">
    <a-popover slot="tabBarExtraContent" title="Filter" trigger="click" placement="bottomRight" v-model="visible">
      <a-input-search slot="content" v-model="filter" style="width: 200px;"></a-input-search>
      <a-button icon="filter" :type="filter !== '' ? 'primary' : 'default'" />
    </a-popover>
    <a-tab-pane v-for="(osList, osName) in osTypes" :key="osName">
      <span slot="tab">
        <os-logo :os-name="osName"></os-logo>
      </span>
      <a-form-item>
        <a-radio-group
          v-for="(os, osIndex) in osList"
          :key="osIndex"
          class="radio-group"
          v-decorator="[inputDecorator, {
            rules: [{ required: true, message: 'Please select option' }]
          }]"
        >
          <a-radio
            class="radio-group__radio"
            :value="os.id"
          >
            {{ os.displaytext }}&nbsp;
            <a-tag
              :visible="os.ispublic && !os.isfeatured"
              color="blue"
            >{{ $t('isPublic') }}</a-tag>
            <a-tag
              :visible="os.isfeatured"
              color="green"
            >{{ $t('isFeatured') }}</a-tag>
            <a-tag
              :visible="isSelf(os)"
              color="orange"
            >{{ $t('isSelf') }}</a-tag>
            <a-tag
              :visible="isShared(os)"
              color="cyan"
            >{{ $t('isShared') }}</a-tag>
          </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import store from '@/store'
import OsLogo from '@/components/widgets/OsLogo'
import { getNormalizedOsName } from '@/utils/icons'
import _ from 'lodash'

export default {
  name: 'TemplateIsoSelection',
  components: { OsLogo },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    inputDecorator: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      filter: '',
      filteredItems: this.items
    }
  },
  computed: {
    osTypes () {
      let mappedItems = {}
      this.filteredItems.forEach((os) => {
        const osName = getNormalizedOsName(os.ostypename)
        if (Array.isArray(mappedItems[osName])) {
          mappedItems[osName].push(os)
        } else {
          mappedItems[osName] = [os]
        }
      })
      mappedItems = _.mapValues(mappedItems, (list) => {
        let featuredItems = list.filter((item) => item.isfeatured)
        let nonFeaturedItems = list.filter((item) => !item.isfeatured)
        featuredItems = _.sortBy(featuredItems, (item) => item.displaytext.toLowerCase())
        nonFeaturedItems = _.sortBy(nonFeaturedItems, (item) => item.displaytext.toLowerCase())
        return featuredItems.concat(nonFeaturedItems) // pin featured isos/templates at the top
      })
      return mappedItems
    }
  },
  watch: {
    items (items) {
      this.filteredItems = items
    },
    filter (filterString) {
      if (filterString !== '') {
        this.filteredItems = this.filteredItems.filter((item) => item.displaytext.toLowerCase().includes(filterString))
      } else {
        this.filteredItems = this.items
      }
    }
  },
  methods: {
    isShared (item) {
      return !item.ispublic && (item.account !== store.getters.userInfo.account)
    },
    isSelf (item) {
      return !item.ispublic && (item.account === store.getters.userInfo.account)
    }
  }
}
</script>

<style lang="less" scoped>
  .radio-group {
    display: flex;
    flex-direction: column;

    &__radio {
      margin: 0.5rem 0;
    }
  }
</style>

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
  <a-table
    :columns="columns"
    :dataSource="items"
    :rowKey="record => record.id"
    :pagination="false"
    :scroll="{x: 0, y: 320}"
    :rowSelection="rowSelection"
    size="middle"
  >
  </a-table>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'NetworkSelection',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      columns: [
        {
          dataIndex: 'name',
          title: this.$t('networks'),
          width: '40%'
        },
        {
          dataIndex: 'displaytext',
          title: this.$t('description'),
          width: '30%'
        },
        {
          dataIndex: 'type',
          title: this.$t('guestIpType'),
          width: '30%'
        }
      ],
      selectedRowKeys: []
    }
  },
  computed: {
    rowSelection () {
      return {
        type: 'checkbox',
        selectedRowKeys: this.selectedRowKeys,
        onChange: (rows) => {
          this.$emit('select-network-item', rows)
        }
      }
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue && !_.isEqual(newValue, oldValue)) {
        this.selectedRowKeys = newValue
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-table-wrapper {
    margin: 2rem 0;
  }
</style>

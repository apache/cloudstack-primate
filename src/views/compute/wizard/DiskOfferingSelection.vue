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
    :dataSource="tableSource"
    :pagination="false"
    :scroll="{x: 0, y: 320}"
    :rowSelection="rowSelection"
    size="middle"
  >
    <span slot="diskSizeTitle"><a-icon type="hdd" /> {{ $t('disksize') }}</span>
    <span slot="iopsTitle"><a-icon type="rocket" /> {{ $t('minMaxIops') }}</span>
  </a-table>
</template>

<script>
export default {
  name: 'DiskOfferingSelection',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      columns: [
        {
          dataIndex: 'name',
          width: '40%'
        },
        {
          dataIndex: 'diskSize',
          slots: { title: 'diskSizeTitle' },
          width: '30%'
        },
        {
          dataIndex: 'iops',
          slots: { title: 'iopsTitle' },
          width: '30%'
        }
      ],
      selectedRowKeys: []
    }
  },
  computed: {
    tableSource () {
      return this.items.map((item) => {
        return {
          key: item.id,
          name: item.name,
          diskSize: item.disksize > 0 ? `${item.disksize} GB` : this.$t('isCustomized'),
          iops: `${item.miniops} – ${item.maxiops}`
        }
      })
    },
    rowSelection () {
      return {
        type: 'radio',
        selectedRowKeys: this.selectedRowKeys,
        onSelect: (row) => {
          this.$emit('select-disk-offering-item', row.key)
        }
      }
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.selectedRowKeys = [newValue]
      }
    }
  }
}
</script>

<style scoped>

</style>

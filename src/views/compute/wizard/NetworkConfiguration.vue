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
    :pagination="{showSizeChanger: true}"
    :rowSelection="rowSelection"
    :rowKey="record => record.id"
    size="middle"
  >
    <template slot="ipAddress" slot-scope="text, record">
      <a-input
        style="width: 150px;"
        :placeholder="$t('ipAddress')"
        @change="($event) => updateNetworkData('ipAddress', record.id, $event.target.value)" />
    </template>
    <template slot="macAddress" slot-scope="text, record">
      <a-input
        style="width: 150px;"
        :placeholder="$t('macAddress')"
        @change="($event) => updateNetworkData('macAddress', record.id, $event.target.value)" />
    </template>
  </a-table>
</template>

<script>
export default {
  name: 'NetworkConfiguration',
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
      networks: [],
      columns: [
        {
          dataIndex: 'name',
          title: this.$t('defaultNetwork'),
          width: '40%'
        },
        {
          dataIndex: 'ip',
          title: this.$t('ip'),
          width: '30%',
          scopedSlots: { customRender: 'ipAddress' }
        },
        {
          dataIndex: 'mac',
          title: this.$t('macaddress'),
          width: '30%',
          scopedSlots: { customRender: 'macAddress' }
        }
      ],
      selectedRowKeys: []
    }
  },
  created () {
    this.$emit('select-default-network-item', this.items[0].id)
  },
  computed: {
    rowSelection () {
      return {
        type: 'radio',
        onSelect: (row) => {
          this.$emit('select-default-network-item', row.id)
        },
        getCheckboxProps: record => ({
          props: {
            defaultChecked: (record.name === this.items[0].name)
          }
        })
      }
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.selectedRowKeys = [newValue]
      }
    }
  },
  methods: {
    updateNetworkData (name, key, value) {
      if (this.networks.length === 0) {
        const networkItem = {}
        networkItem.key = key
        networkItem[name] = value
        this.networks.push(networkItem)
        this.$emit('update-network-config', this.networks)
        return
      }

      this.networks.filter((item, index) => {
        if (item.key === key) {
          this.$set(this.networks[index], name, value)
        }
      })
      this.$emit('update-network-config', this.networks)
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-table-wrapper {
    margin: 2rem 0;
  }
</style>

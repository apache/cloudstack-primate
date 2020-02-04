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
    <a-table
      v-if="networkItems.length > 0"
      :columns="columns"
      :dataSource="networkItems"
      :rowKey="record => record.key"
      :pagination="false"
    >
      <template slot="name" slot-scope="text, record">
        <a-input
          style="width: 15vw"
          :placeholder="$t('networks')"
          @change="($event) => handleChangeInput(record.key, $event.target.value, 'name')"/>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="networkItems.length > 1"
          title="Sure to delete?"
          @confirm="removeItem(record.key)"
        >
          <a-button type="link">Delete</a-button>
        </a-popconfirm>
      </template>
      <template slot="networkOffering" slot-scope="text, record">
        <a-select
          :placeholder="$t('networkOfferingId')"
          :options="networkOfferingOptions"
          @change="($event) => handleChangeInput(record.key, $event, 'networkOfferingId')"
        ></a-select>
      </template>
      <template slot="vpc" slot-scope="text, record">
        <a-select
          :placeholder="$t('vpc')"
          :options="vpcOptions"
          style="min-width: 12vw"
          @change="($event) => handleChangeInput(record.key, $event, 'vpcid')"
        ></a-select>
      </template>
    </a-table>

    <div style="text-align: right; margin-top: 1rem;">
      <a-button
        type="primary"
        @click="addNewItem"
      >{{ $t('addAnotherNetwork') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import store from '@/store'
import _ from 'lodash'

/*
 * ToDo: Implement real functionality
 */
export default {
  name: 'NetworkCreation',
  props: {
    zoneId: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      networkItems: [{
        key: this.randomKey()
      }],
      columns: [
        {
          dataIndex: 'name',
          title: this.$t('networks'),
          scopedSlots: { customRender: 'name' },
          width: '30%'
        },
        {
          dataIndex: 'offering',
          title: this.$t('networkOfferingId'),
          scopedSlots: { customRender: 'networkOffering' },
          width: '30%'
        },
        {
          dataIndex: 'vpcName',
          title: this.$t('VPC'),
          scopedSlots: { customRender: 'vpc' },
          width: '30%'
        },
        {
          dataIndex: 'action',
          scopedSlots: { customRender: 'operation' },
          width: '10%'
        }
      ],
      networkOfferings: [],
      vpcs: [],
      dataNetworkCreated: []
    }
  },
  computed: {
    network () {
      return {
        key: undefined,
        name: undefined,
        displayText: undefined,
        networkOfferingId: undefined,
        vpcid: undefined
      }
    },
    networkOfferingOptions () {
      return this.networkOfferings.map((offering) => {
        return {
          label: offering.name,
          value: offering.id
        }
      })
    },
    vpcOptions () {
      return this.vpcs.map((vpc) => {
        return {
          label: vpc.name,
          value: vpc.id
        }
      })
    }
  },
  created () {
    api('listNetworkOfferings', {
      forvpc: false,
      zoneid: this.zoneId,
      guestiptype: 'Isolated',
      supportedServices: 'SourceNat',
      specifyvlan: false,
      state: 'Enabled'
    }).then((response) => {
      this.networkOfferings = _.get(response, 'listnetworkofferingsresponse.networkoffering')
    })
    // ToDo: Remove this redundant api call – see the NetworkSelection component
    api('listVPCs', {
      projectid: store.getters.project.id
    }).then((response) => {
      this.vpcs = _.get(response, 'listvpcsresponse.vpc')
    })
  },
  methods: {
    addNewItem () {
      const key = this.randomKey()
      this.networkItems.push({
        key: key
      })
    },
    removeItem (key) {
      this.networkItems = this.networkItems.filter((item) => item.key !== key)
      this.dataNetworkCreated = this.dataNetworkCreated.filter((item) => item.key !== key)
    },
    handleChangeInput (key, value, name) {
      let network = { ...this.network }
      const networkExist = this.dataNetworkCreated.filter((item) => item.key === key)
      if (networkExist && networkExist.length > 0) {
        network = { ...networkExist[0] }
        this.dataNetworkCreated = this.dataNetworkCreated.filter((item) => item.key !== key)
        network.key = key
        network[name] = value
      } else {
        network.key = key
        network[name] = value
      }
      this.dataNetworkCreated.push(network)
      this.$emit('handle-update-network', this.dataNetworkCreated)
    },
    randomKey () {
      const now = new Date()
      const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      return [random, now.getTime()].join('')
    }
  }
}
</script>

<style scoped>

</style>

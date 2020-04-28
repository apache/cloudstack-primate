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
    <a-form
      :form="form"
      @submit="handleSubmit">
      <a-row :gutter="12" v-if="isAddNew">
        <a-col :md="6" :lg="6">
          <a-form-item :label="$t('networks')">
            <a-input
              v-decorator="['name', {
                rules: [{ required: true, message: 'Please enter input' }]
              }]"
              :placeholder="$t('networks')"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :lg="12">
          <a-form-item :label="$t('networkOfferingId')">
            <a-select
              v-decorator="['networkofferingid', {
                rules: [{ required: true, message: 'Please select option' }]
              }]"
              :placeholder="$t('networkOfferingId')"
              :options="networkOfferingOptions"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :lg="6">
          <a-form-item :label="$t('vpc')">
            <a-select
              v-decorator="['vpcid']"
              :placeholder="$t('vpc')"
              :options="vpcOptions"
              style="min-width: 12vw"
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div style="text-align: right; margin-top: 1rem;">
      <a-button
        v-if="!isAddNew"
        type="primary"
        @click="addNewItem"
      >{{ $t('addAnotherNetwork') }}
      </a-button>
      <a-button
        v-else
        type="primary"
        @click="handleSubmit"
      >{{ $t('add') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import store from '@/store'
import _ from 'lodash'

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
      networkItems: [],
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
      isAddNew: false,
      dataNetwork: {
        name: undefined,
        networkOfferingId: undefined,
        vpc: undefined,
        isCreate: false
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
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
      this.networkOfferings = _.get(response, 'listnetworkofferingsresponse.networkoffering') || []
    })
    // ToDo: Remove this redundant api call – see the NetworkSelection component
    api('listVPCs', {
      projectid: store.getters.project.id
    }).then((response) => {
      this.vpcs = _.get(response, 'listvpcsresponse.vpc') || []
      this.vpcs.unshift({
        name: this.$t('all'),
        id: -1
      })
    })
  },
  methods: {
    addNewItem () {
      this.form.setFieldsValue({
        name: undefined,
        networkOfferingId: undefined,
        vpcid: undefined
      })
      this.dataNetwork = {}

      this.isAddNew = true
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (error) {
          return
        }

        this.dataNetwork.name = values.name
        this.dataNetwork.networkOfferingId = values.networkofferingid
        this.dataNetwork.vpcid = values.vpcid
        this.dataNetwork.id = this.randomKey()
        this.dataNetwork.isCreate = true

        this.isAddNew = false
        this.$emit('handle-update-network', this.dataNetwork)
      })
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

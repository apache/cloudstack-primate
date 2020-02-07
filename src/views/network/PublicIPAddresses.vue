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
    <a-button type="dashed" style="width:100%;margin-bottom:50px" @click="showModal('acquire')"> <a-icon type="plus" />{{ $t("label.acquire.new.ip") }}</a-button>
    <a-modal title="Acquire New IP" v-model="visible" v-if="clicked === 'acquire'" @ok="handleOk(clicked, null)">
      <p>{{ action.acquire }}</p>
    </a-modal>
    <a-table
      class="table"
      size="small"
      :columns="columns"
      :dataSource="IpAddresses"
      :rowKey="item => item.id"
      :pagination="true"
    >
      <template slot="ipaddress" slot-scope="text, item">
        <router-link :to="{ path: '/publicip/' + item.id }" >{{ text }}</router-link>
        <a-tag v-if="item.issourcenat === true">source-nat</a-tag>
      </template>
      <template slot="action" slot-scope="text, item">
        <a-popconfirm
          v-if="IpAddresses.length"
          :title="action.release"
          @confirm="() => handleOk(clicked, item.id)"
        >
          <a-button v-if="item.issourcenat !== true" type="dashed" @click="showModal('release')"> <a-icon type="minus" /></a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
import { api } from '@/api'

export default {
  name: 'IPAddresses',
  props: {
    resource: {
      type: Object,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      columns: [
        {
          title: this.$t('ipaddress'),
          dataIndex: 'ipaddress',
          scopedSlots: { customRender: 'ipaddress' }
        },
        {
          title: this.$t('Network'),
          dataIndex: 'associatednetworkname'
        },
        {
          title: this.$t('vm'),
          dataIndex: 'vm'
        },
        {
          title: this.$t('account'),
          dataIndex: 'account'
        },
        {
          title: this.$t('zone'),
          dataIndex: 'zonename'
        },
        {
          title: this.$t('label.action.release.ip'),
          scopedSlots: { customRender: 'action' }
        }
      ],
      IpAddresses: [],
      zones: [],
      zoneSelected: null,
      regions: [],
      clicked: '',
      action: {
        acquire: 'Please confirm that you want to acquire new IP',
        release: 'Please confirm that you want to release this IP'
      },
      visible: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listZones()
      this.listIpAddresses()
    },
    cancel (e) {
    },
    showModal (action) {
      this.visible = true
      if (action === 'acquire') {
        this.clicked = 'acquire'
      } else {
        this.clicked = 'release'
      }
      this.listRegions()
    },
    closeModal () {
      this.$emit('close')
    },
    handleOk (action, id) {
      console.log('id = ', id)
      this.visible = false
      this.clicked = ''
      if (action === 'acquire') {
        this.associateIPAddress()
      } else {
        this.releaseIP(id)
      }
    },
    listZones () {
      api('listZones').then(json => {
        if (json && json.listzonesresponse && json.listzonesresponse.zone) {
          this.zones = json.listzonesresponse.zone
          if (this.zones.length > 0) {
            this.zoneSelected = this.zones[0]
          }
        }
      })
    },
    listIpAddresses () {
      console.log('resource = ', this.resource)
      api('listPublicIpAddresses', {
        listall: true,
        associatednetworkid: this.resource.id
      }).then(json => {
        var count = 0
        if (json && json.listpublicipaddressesresponse && json.listpublicipaddressesresponse.publicipaddress) {
          console.log(json)
          this.IpAddresses = json.listpublicipaddressesresponse.publicipaddress
          count = json.listpublicipaddressesresponse.count
          console.log('count = ', count)
        }
      })
    },
    listRegions () {
      api('listRegions').then(json => {
        if (json && json.listregionsresponse && json.listregionsresponse.region) {
          this.regions = json.listregionsresponse.region
        }
      })
    },
    associateIPAddress () {
      api('associateIpAddress', {
        networkid: this.resource.id
      }).then(response => {
        this.$pollJob({
          jobId: response.associateipaddressresponse.jobid,
          successMessage: `Successfully acquired IP for ${this.resource.name}`,
          successMethod: () => {
            this.closeModal()
            this.fetchData()
          },
          errorMessage: 'Failed to acquire IP',
          errorMethod: () => {
            this.closeModal()
            this.fetchData()
          },
          loadingMessage: `Acquiring IP for network ${this.resource.name} is in progress`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.closeModal()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
      })
    },
    releaseIP (id) {
      api('disassociateIpAddress', {
        id: id
      }).then(response => {
        this.$pollJob({
          jobId: response.disassociateipaddressresponse.jobid,
          successMessage: 'Successfully released IP',
          successMethod: () => {
            this.fetchData()
            this.closeModal()
          },
          errorMessage: 'Failed to release IP',
          errorMethod: () => {
            this.closeModal()
            this.fetchData()
          },
          loadingMessage: `Releasing IP for network ${this.resource.name} is in progress`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.closeModal()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

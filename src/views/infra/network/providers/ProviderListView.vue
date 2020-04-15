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
    <strong>{{ $t(title) }}</strong>
    <a-table
      style="margin-top: 10px;"
      size="small"
      class="row-list-data"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :rowKey="record => record.id || record.name || record.nvpdeviceid || record.resourceid"
      :pagination="false"
      :scroll="scrollable">
      <template slot="action" slot-scope="text, record">
        <a-tooltip placement="top">
          <template slot="title">
            <span v-if="resource.name==='BigSwitchBcf'">{{ $t('label.delete.BigSwitchBcf') }}</span>
            <span v-else-if="resource.name==='BrocadeVcs'">{{ $t('label.delete.BrocadeVcs') }}</span>
            <span v-else-if="resource.name==='NiciraNvp'">{{ $t('label.delete.NiciaNvp') }}</span>
            <span v-else-if="resource.name==='F5BigIp'">{{ $t('label.delete.F5') }}</span>
            <span v-else-if="resource.name==='JuniperSRX'">{{ $t('label.delete.SRX') }}</span>
            <span v-else-if="resource.name==='Netscaler'">{{ $t('label.delete.Netscaler') }}</span>
            <span v-else-if="resource.name==='Opendaylight'">{{ $t('label.delete.OpenDaylight.device') }}</span>
            <span v-else-if="resource.name==='PaloAlto'">{{ $t('label.delete.PA') }}</span>
            <span v-else-if="resource.name==='CiscoVnmc' && title==='listCiscoVnmcResources'">
              {{ $t('label.delete.ciscovnmc.resource') }}
            </span>
            <span v-else-if="resource.name==='CiscoVnmc' && title==='listCiscoAsa1000vResources'">
              {{ $t('label.delete.ciscoASA1000v') }}
            </span>
          </template>
          <a-button
            v-if="resource.name==='Ovs'"
            type="default"
            shape="circle"
            icon="setting"
            size="small"
            :loading="actionLoading"
            @click="onConfigureOvs(record)"/>
          <a-button
            v-else
            type="danger"
            shape="circle"
            icon="close"
            size="small"
            :loading="actionLoading"
            @click="onDelete(record)"/>
        </a-tooltip>
      </template>
    </a-table>
    <a-pagination
      size="small"
      class="row-pagination"
      :current="page"
      :pageSize="pageSize"
      :total="itemCount"
      :showTotal="total => `Total ${total} items`"
      :pageSizeOptions="['10', '20', '40', '80', '100']"
      @change="changePage"
      @showSizeChange="changePageSize"
      showSizeChanger
      showQuickJumper />
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'ProviderListView',
  props: {
    title: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: () => 1
    },
    pageSize: {
      type: Number,
      default: () => 10
    },
    itemCount: {
      type: Number,
      default: () => 0
    },
    resource: {
      type: Object,
      default: () => {}
    },
    action: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      actionLoading: false
    }
  },
  computed: {
    scrollable () {
      if (this.dataSource.length === 0) {
        return { y: '60vh', x: 'auto' }
      } else if (this.columns.length > 3) {
        return { y: '60vh', x: '50vw' }
      }

      return { y: '60vh' }
    }
  },
  inject: ['providerChangePage', 'provideReload', 'parentPollActionCompletion'],
  methods: {
    changePage (page, pageSize) {
      this.providerChangePage(this.title, page, pageSize)
    },
    changePageSize (currentPage, pageSize) {
      this.providerChangePage(this.title, currentPage, pageSize)
    },
    onDelete (record) {
      console.log(record)
      let apiName
      let confirmation
      let label
      let name
      const params = {}
      switch (this.resource.name) {
        case 'BigSwitchBcf':
          label = 'label.delete.BigSwitchBcf'
          name = record.hostname
          apiName = 'deleteBigSwitchBcfDevice'
          confirmation = 'message.confirm.delete.BigSwitchBcf'
          params.bcfdeviceid = record.bcfdeviceid
          break
        case 'F5BigIp':
          label = 'label.delete.F5'
          name = record.ipaddress
          apiName = 'deleteF5LoadBalancer'
          confirmation = 'message.confirm.delete.F5'
          params.lbdeviceid = record.lbdeviceid
          break
        case 'NiciraNvp':
          label = 'label.delete.NiciaNvp'
          name = record.hostname
          apiName = 'deleteNiciraNvpDevice'
          confirmation = 'message.confirm.delete.NiciraNvp'
          params.nvpdeviceid = record.nvpdeviceid
          break
        case 'BrocadeVcs':
          label = 'label.delete.BrocadeVcs'
          name = record.hostname
          apiName = 'deleteBrocadeVcsDevice'
          confirmation = 'message.confirm.delete.BrocadeVcs'
          params.vcsdeviceid = record.vcsdeviceid
          break
        case 'JuniperSRX':
          label = 'label.delete.SRX'
          name = record.ipaddress
          apiName = 'deleteSrxFirewall'
          confirmation = 'message.confirm.delete.SRX'
          params.fwdeviceid = record.fwdeviceid
          break
        case 'Netscaler':
          label = 'label.delete.Netscaler'
          name = record.ipaddress
          apiName = 'deleteNetscalerLoadBalancer'
          confirmation = 'message.confirm.delete.NetScaler'
          params.lbdeviceid = record.lbdeviceid
          break
        case 'Opendaylight':
          label = 'label.delete.OpenDaylight.device'
          name = record.name
          apiName = 'deleteOpenDaylightController'
          confirmation = 'message.confirm.delete.Opendaylight'
          params.id = record.id
          break
        case 'PaloAlto':
          label = 'label.delete.PA'
          name = record.ipaddress
          apiName = 'deletePaloAltoFirewall'
          confirmation = 'message.confirm.delete.PA'
          params.fwdeviceid = record.fwdeviceid
          break
        case 'CiscoVnmc':
          if (this.title === 'listCiscoVnmcResources') {
            label = 'label.delete.ciscovnmc.resource'
            apiName = 'deleteCiscoVnmcResource'
            confirmation = 'message.confirm.delete.ciscovnmc.resource'
          } else {
            label = 'label.delete.ciscoASA1000v'
            apiName = 'deleteCiscoAsa1000vResource'
            confirmation = 'message.confirm.delete.ciscoASA1000v'
          }

          name = record.hostname
          params.resourceid = record.resourceid
          break
        default:
          break
      }

      this.$confirm({
        title: this.$t('label.confirmation'),
        content: confirmation,
        onOk: async () => {
          if (apiName) {
            this.actionLoading = true
            try {
              const jobId = await this.executeDeleteRecord(apiName, params)
              if (jobId) {
                this.$store.dispatch('AddAsyncJob', {
                  title: this.$t(label),
                  jobid: jobId,
                  description: this.$t(name),
                  status: 'progress'
                })
                this.parentPollActionCompletion(jobId, this.action)
              } else {
                this.$success('Success')
                this.provideReload()
              }
              this.actionLoading = false
            } catch (error) {
              this.actionLoading = false
              this.$notification.error({
                message: 'Request Failed',
                description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
              })
            }
          }
        }
      })
    },
    onConfigureOvs (record) {
      const params = {}
      params.id = record.id
      params.enabled = true

      this.$confirm({
        title: this.$t('label.confirmation'),
        content: this.$t('message.confirm.configure.ovs'),
        onOk: async () => {
          this.actionLoading = true
          try {
            const jobId = await this.configureOvsElement(params)
            if (jobId) {
              this.$store.dispatch('AddAsyncJob', {
                title: this.$t('label.configure.ovs'),
                jobid: jobId,
                description: this.$t(record.id),
                status: 'progress'
              })
              this.parentPollActionCompletion(jobId, this.action)
            } else {
              this.$success('Success')
              this.provideReload()
            }
            this.actionLoading = false
          } catch (error) {
            this.actionLoading = false
            this.$notification.error({
              message: 'Request Failed',
              description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
            })
          }
        }
      })
    },
    executeDeleteRecord (apiName, args) {
      return new Promise((resolve, reject) => {
        let jobId = null
        api(apiName, args).then(json => {
          for (const obj in json) {
            if (obj.includes('response')) {
              for (const res in json[obj]) {
                if (res === 'jobid') {
                  jobId = json[obj][res]
                  break
                }
              }
              break
            }
          }

          resolve(jobId)
        }).catch(error => {
          reject(error)
        })
      })
    },
    configureOvsElement (args) {
      return new Promise((resolve, reject) => {
        api('configureOvsElement', args).then(json => {
          const jobId = json.configureovselementresponse.jobid
          resolve(jobId)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.row-pagination {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
}
</style>

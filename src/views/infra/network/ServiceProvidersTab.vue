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
    <a-spin :spinning="fetchLoading">
      <a-tabs
        :tabPosition="device === 'mobile' ? 'top' : 'left'"
        :animated="false">
        <a-tab-pane v-for="nsp in hardcodedNsps" :key="nsp.title">
          <span slot="tab">
            {{ $t(nsp.title) }}
            <status :text="nsp.title in nsps ? nsps[nsp.title].state : 'Disabled'" style="margin-bottom: 6px; margin-left: 6px" />
          </span>
          <component
            :is="nsp.component"
            :nsp="nsps[nsp.title]"
            :actions="nsp.actions"
            :bordered="false"
            :loading="fetchLoading"
          />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <a-modal
      :title="$t(currentAction.label)"
      :visible="showFormAction"
      :confirmLoading="actionLoading"
      style="top: 20px;"
      @ok="handleSubmit"
      @cancel="handleClose"
      centered
    >
      <a-form
        :form="form"
        layout="vertical">
        <a-form-item
          v-for="(field, index) in currentAction.fieldParams"
          :key="index"
          :label="$t(field.name)">
          <span v-if="field.name==='password'">
            <a-input-password
              v-decorator="[field.name, {
                rules: [
                  {
                    required: field.required,
                    message: 'Please enter password'
                  }
                ]
              }]"
              :placeholder="field.description" />
          </span>
          <span v-else>
            <a-input
              v-decorator="[field.name, {
                rules: [
                  {
                    required: field.required,
                    message: 'Please enter input'
                  }
                ]
              }]"
              :placeholder="field.description" />
          </span>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import store from '@/store'
import { api } from '@/api'
import { mixinDevice } from '@/utils/mixin.js'
import Status from '@/components/widgets/Status'

export default {
  name: 'ServiceProvidersTab',
  components: {
    Status
  },
  mixins: [mixinDevice],
  props: {
    resource: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      nsps: {},
      nsp: {},
      details: ['name', 'state', 'id', 'servicelist'],
      fetchLoading: false,
      actionLoading: false,
      showFormAction: false,
      currentAction: {}
    }
  },
  computed: {
    hardcodedNsps () {
      return [
        {
          title: 'BaremetalDhcpProvider',
          component: () => import('@/views/infra/network/providers/BaremetalDhcpProvider.vue'),
          actions: [
            {
              api: 'addBaremetalDhcp',
              isNew: true,
              listView: true,
              icon: 'plus',
              label: 'label.add.baremetal.dhcp.device',
              args: ['url', 'username', 'password'],
              show: (record) => { return record && record.state === 'Enabled' },
              mapping: {
                dhcpservertype: {
                  value: (record) => { return 'DHCPD' }
                }
              }
            },
            {
              api: 'updateNetworkServiceProvider',
              icon: 'stop',
              listView: true,
              label: 'label.disable.provider',
              confirm: 'Please confirm that you would like to disable this provider?',
              show: (record) => { return record && record.state === 'Enabled' },
              mapping: {
                state: {
                  value: (record) => { return 'Disabled' }
                }
              }
            },
            {
              api: 'updateNetworkServiceProvider',
              icon: 'play-circle',
              listView: true,
              label: 'label.enable.provider',
              confirm: 'Please confirm that you would like to enable this provider?',
              show: (record) => { return record && record.state === 'Disabled' },
              mapping: {
                state: {
                  value: (record) => { return 'Enabled' }
                }
              }
            },
            {
              api: 'deleteNetworkServiceProvider',
              isDel: true,
              listView: true,
              icon: 'delete',
              label: 'label.shutdown.provider',
              confirm: 'Please confirm that you would like to delete this provider?',
              show: (record) => { return record && record.state === 'Enabled' }
            }
          ]
        },
        {
          title: 'BaremetalPxeProvider'
        },
        {
          title: 'BigSwitchBcf'
        },
        {
          title: 'BrocadeVcs'
        },
        {
          title: 'CiscoVnmc'
        },
        {
          title: 'ConfigDrive'
        },
        {
          title: 'F5BigIp'
        },
        {
          title: 'GloboDns'
        },
        {
          title: 'InternalLbVm'
        },
        {
          title: 'JuniperSRX'
        },
        {
          title: 'Netscaler'
        },
        {
          title: 'NiciraNvp'
        },
        {
          title: 'Opendaylight'
        },
        {
          title: 'Ovs'
        },
        {
          title: 'PaloAlto'
        },
        {
          title: 'SecurityGroupProvider'
        },
        {
          title: 'VirtualRouter'
        },
        {
          title: 'VpcVirtualRouter'
        }
      ]
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    loading (newData, oldData) {
      if (!newData && this.resource.id) {
        this.fetchData()
      }
    }
  },
  inject: ['parentPollActionCompletion'],
  provide () {
    return {
      provideSetNsp: this.setNsp,
      provideExecuteAction: this.executeAction
    }
  },
  methods: {
    fetchData () {
      this.fetchServiceProvider()
    },
    fetchServiceProvider (name) {
      this.fetchLoading = true
      api('listNetworkServiceProviders', { physicalnetworkid: this.resource.id, name: name }).then(json => {
        var sps = json.listnetworkserviceprovidersresponse.networkserviceprovider || []
        if (sps.length > 0) {
          for (const sp of sps) {
            this.nsps[sp.name] = sp
          }
        }
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description'],
          duration: 0
        })
      }).finally(() => {
        this.fetchLoading = false
      })
    },
    setNsp (nsp) {
      this.nsp = nsp
    },
    async handleSubmit () {
      if (this.currentAction.confirm) {
        await this.executeConfirmAction()
        return
      }

      await this.form.validateFields(async (err, values) => {
        if (err) {
          return
        }
        const params = {}
        params.id = this.nsp.id
        params.physicalnetworkid = this.nsp.physicalnetworkid
        for (const key in values) {
          const input = values[key]
          for (const param of this.currentAction.fieldParams) {
            if (param.type === 'uuid') {
              params[key] = param.opts[input].id
            } else if (param.type === 'list') {
              params[key] = input.map(e => { return param.opts[e].id }).reduce((str, name) => { return str + ',' + name })
            } else {
              params[key] = input
            }
          }
        }
        if (this.currentAction.mapping) {
          for (const key in this.currentAction.mapping) {
            if (!this.currentAction.mapping[key].value) {
              continue
            }
            params[key] = this.currentAction.mapping[key].value(this.resource, params)
          }
        }
        this.actionLoading = true

        try {
          const hasJobId = await this.executeApi(this.currentAction.api, params)
          if (!hasJobId) {
            await this.fetchData()
          }
          this.actionLoading = false
          this.handleClose()
        } catch (error) {
          this.actionLoading = false
          this.$notification.error({
            message: 'Request Failed',
            description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
          })
        }
      })
    },
    handleClose () {
      this.currentAction = {}
      this.showFormAction = false
    },
    executeAction (action) {
      this.currentAction = action
      if (this.currentAction.confirm) {
        this.$confirm({
          title: this.$t('label.confirmation'),
          content: action.confirm,
          onOk: this.handleSubmit
        })
      } else {
        this.showFormAction = true
        const apiParams = store.getters.apis[action.api].params || []
        this.currentAction.fieldParams = action.args.map(arg => {
          return apiParams.filter(param => param.name === arg)[0]
        }) || []
      }
    },
    async executeConfirmAction () {
      const params = {}
      params.id = this.nsp.id
      if (this.currentAction.mapping) {
        for (const key in this.currentAction.mapping) {
          if (!this.currentAction.mapping[key].value) {
            continue
          }
          params[key] = this.currentAction.mapping[key].value(this.resource, params)
        }
      }
      this.actionLoading = true

      try {
        const hasJobId = await this.executeApi(this.currentAction.api, params)
        if (!hasJobId) {
          await this.fetchData()
        }
        this.actionLoading = false
        this.handleClose()
      } catch (error) {
        this.actionLoading = false
        this.$notification.error({
          message: 'Request Failed',
          description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
        })
      }
    },
    executeApi (apiName, args) {
      return new Promise((resolve, reject) => {
        let hasJobId = false
        api(apiName, args).then(json => {
          for (const obj in json) {
            if (obj.includes('response')) {
              for (const res in json[obj]) {
                if (res === 'jobid') {
                  this.$store.dispatch('AddAsyncJob', {
                    title: this.$t(this.currentAction.label),
                    jobid: json[obj][res],
                    description: this.$t(this.nsp.name),
                    status: 'progress'
                  })
                  this.parentPollActionCompletion(json[obj][res], this.currentAction)
                  hasJobId = true
                  break
                }
              }
              break
            }
          }

          resolve(hasJobId)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

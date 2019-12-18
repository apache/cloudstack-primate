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
  <a-row class="usage-dashboard" :gutter="12">
    <a-col
      :xl="16">
      <a-row :gutter="12">
        <a-card>
          <a-tabs
            v-if="showProject"
            :animated="false"
            @change="onTabChange">
            <a-tab-pane
              v-for="tab in $route.meta.tabs"
              :tab="$t(tab.name)"
              :key="tab.name"
              v-if="('show' in tab ? tab.show(project) : true)">
              <component
                :is="tab.component"
                :resource="project"
                :loading="loading"
                :bordered="false"
                :stats="stats" />
            </a-tab-pane>
            <a-tooltip v-if="showAddAccount" placement="top" slot="tabBarExtraContent">
              <template slot="title">
                {{ $t('label.action.project.add.account') }}
              </template>
              <a-button
                icon="user-add"
                type="default"
                shape="circle"
                @click="onShowAction"
              />
            </a-tooltip>
          </a-tabs>
        </a-card>
      </a-row>
    </a-col>
    <a-col
      :xl="8">
      <chart-card>
        <div class="usage-dashboard-chart-card-inner">
          <a-button><router-link :to="{ name: 'event' }">View Events</router-link></a-button>
        </div>
        <template slot="footer">
          <div class="usage-dashboard-chart-footer">
            <a-timeline>
              <a-timeline-item
                v-for="event in events"
                :key="event.id"
                :color="getEventColour(event)">
                <span :style="{ color: '#999' }"><small>{{ event.created }}</small></span><br/>
                <span :style="{ color: '#666' }"><small>{{ event.type }}</small></span><br/>
                <span :style="{ color: '#aaa' }">({{ event.username }}) {{ event.description }}</span>
              </a-timeline-item>
            </a-timeline>
          </div>
        </template>
      </chart-card>
    </a-col>
    <a-modal
      :visible="showAction"
      :closable="true"
      :confirmLoading="actionLoading"
      style="top: 20px;"
      centered
      @ok="handleSubmit"
      @cancel="() => showAction = false"
    >
      <span slot="title">{{ $t('label.action.project.add.account') }}</span>
      <a-spin :spinning="actionLoading">
        <a-form
          :form="form"
          @submit="handleSubmit"
          layout="vertical">
          <a-form-item :label="this.$t('account')">
            <a-select
              v-decorator="['account', {
                rules: [{ required: accountRequired, message: 'Please select option' }]
              }]"
              :placeholder="this.$t('project.account.description')"
            >
              <a-select-option v-for="(opt, optIndex) in listAccounts" :key="optIndex">
                {{ opt.name ? opt.name : opt.name || opt.description }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="this.$t('email')">
            <a-input
              v-decorator="['email', {
                rules: [{ required: emailRequired, message: 'Please enter input' }]
              }]"
              :placeholder="this.$t('project.email.description')"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-row>
</template>

<script>
import { api } from '@/api'
import store from '@/store'

import ChartCard from '@/components/widgets/ChartCard'
import UsageDashboardChart from '@/views/dashboard/UsageDashboardChart'

export default {
  name: 'UsageDashboard',
  components: {
    ChartCard,
    UsageDashboardChart
  },
  props: {
    showProject: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      showAction: false,
      showAddAccount: false,
      events: [],
      stats: [],
      project: {},
      listAccounts: [],
      adminType: 'Admin',
      actionLoading: false,
      accountRequired: false,
      emailRequired: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.project = store.getters.project
    if (store.getters.userInfo.roletype === this.adminType ||
        store.getters.userInfo.account === this.project.account) {
      this.$set(this.project, 'owner', true)
    }

    this.fetchData()
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'dashboard') {
        this.fetchData()
      }
    },
    showProject (newData, oldData) {
      if (newData) {
        this.project = store.getters.project
        if (store.getters.userInfo.roletype === this.adminType ||
            store.getters.userInfo.account === this.project.account) {
          this.$set(this.project, 'owner', true)
        }
      }
    }
  },
  methods: {
    fetchData () {
      this.stats = [{}, {}, {}, {}, {}, {}]
      api('listVirtualMachines', { state: 'Running', listall: true }).then(json => {
        var count = 0
        if (json && json.listvirtualmachinesresponse) {
          count = json.listvirtualmachinesresponse.count
        }
        this.stats.splice(0, 1, { name: 'Running VMs', count: count, path: 'vm' })
      })
      api('listVirtualMachines', { state: 'Stopped', listall: true }).then(json => {
        var count = 0
        if (json && json.listvirtualmachinesresponse) {
          count = json.listvirtualmachinesresponse.count
        }
        this.stats.splice(1, 1, { name: 'Stopped VMs', count: count, path: 'vm' })
      })
      api('listVirtualMachines', { listall: true }).then(json => {
        var count = 0
        if (json && json.listvirtualmachinesresponse) {
          count = json.listvirtualmachinesresponse.count
        }
        this.stats.splice(2, 1, { name: 'Total VMs', count: count, path: 'vm' })
      })
      api('listVolumes', { listall: true }).then(json => {
        var count = 0
        if (json && json.listvolumesresponse) {
          count = json.listvolumesresponse.count
        }
        this.stats.splice(3, 1, { name: 'Total Volumes', count: count, path: 'volume' })
      })
      api('listNetworks', { listall: true }).then(json => {
        var count = 0
        if (json && json.listnetworksresponse) {
          count = json.listnetworksresponse.count
        }
        this.stats.splice(4, 1, { name: 'Total Networks', count: count, path: 'guestnetwork' })
      })
      api('listPublicIpAddresses', { listall: true }).then(json => {
        var count = 0
        if (json && json.listpublicipaddressesresponse) {
          count = json.listpublicipaddressesresponse.count
        }
        this.stats.splice(5, 1, { name: 'Public IP Addresses', count: count, path: 'publicip' })
      })
      this.listEvents()
    },
    listEvents () {
      const params = {
        page: 1,
        pagesize: 6,
        listall: true
      }
      this.loading = true
      api('listEvents', params).then(json => {
        this.events = []
        this.loading = false
        if (json && json.listeventsresponse && json.listeventsresponse.event) {
          this.events = json.listeventsresponse.event
        }
      })
    },
    getEventColour (event) {
      if (event.level === 'ERROR') {
        return 'red'
      }
      if (event.state === 'Completed') {
        return 'green'
      }
      return 'blue'
    },
    onTabChange (key) {
      this.showAddAccount = false

      if (key !== 'Dashboard') {
        this.showAddAccount = true
      }
    },
    onShowAction () {
      this.showAction = true
      this.actionLoading = false
      this.form = this.$form.createForm(this)

      const params = {}
      params.listAll = true

      api('listAccounts', params).then(json => {
        const listAccounts = json.listaccountsresponse.account
        this.listAccounts = listAccounts && listAccounts.length > 0 ? listAccounts : []
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.handleValidateForm().then(() => {
        this.form.validateFields((err, values) => {
          if (err) {
            return
          }

          const params = {}
          const title = this.$t('label.action.project.add.account')
          const loading = this.$message.loading(title + 'in progress for ' + this.project.name, 0)

          // create parameter from form
          for (const key in values) {
            const input = values[key]

            if (input === undefined) {
              continue
            }

            if (key === 'account') {
              params[key] = this.listAccounts[input].name
            } else {
              params[key] = input
            }
          }

          this.actionLoading = true

          api('addAccountToProject', params).then(json => {
            const hasJobId = this.checkForAddAsyncJob(json, title, this.project.name)

            if (hasJobId) {
              this.fetchData()
              this.$emit('refresh-data')
            }
          }).catch(error => {
            this.$notification.error({
              message: 'Request Failed',
              description: error.response.headers['x-description']
            })
          }).finally(() => {
            this.actionLoading = false
            this.showAction = false
            setTimeout(loading, 1000)
          })
        })
      })
    },
    handleValidateForm () {
      return new Promise(resolve => {
        const accountVal = this.form.getFieldValue('account')
        const emailVal = this.form.getFieldValue('email')

        if (!accountVal && (!emailVal || emailVal.trim() === '')) {
          this.accountRequired = true
          this.emailRequired = true
        } else {
          this.accountRequired = false
          this.emailRequired = false
        }

        this.$nextTick(() => {
          this.form.validateFields(['account'], { force: true })
          this.form.validateFields(['email'], { force: true })
        })

        resolve()
      })
    },
    checkForAddAsyncJob (json, title, description) {
      let hasJobId = false

      for (const obj in json) {
        if (obj.includes('response')) {
          for (const res in json[obj]) {
            if (res === 'jobid') {
              hasJobId = true
              const jobId = json[obj][res]
              this.$store.dispatch('AddAsyncJob', {
                title: title,
                jobid: jobId,
                description: description,
                status: 'progress'
              })
            }
          }
        }
      }

      return hasJobId
    }
  }
}
</script>

<style lang="less" scoped>
  .usage-dashboard {

    &-chart-tile {
      margin-bottom: 12px;
    }

    &-chart-card {
      padding-top: 24px;
    }

    &-chart-card-inner {
      text-align: center;
    }

    &-footer {
       padding-top: 12px;
       padding-left: 3px;
       white-space: normal;
    }
  }
</style>

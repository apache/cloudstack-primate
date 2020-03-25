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
    <a-row :gutter="12">
      <a-col :md="24" :lg="24" style="text-align: right">
        <action-button
          :actions="actions"
          :resource="nsp"
          :loading="loading"
          @exec-action="handleExecAction"/>
      </a-col>
    </a-row>
    <provider-detail
      style="margin-top: 10px"
      :details="details"
      :nsp="nsp"
      :loading="loading" />
    <list-device
      style="margin-top: 10px"
      :dataSource="listDevice"
      :columns="columns"
      :itemCount="itemCount"
      :page="page"
      :pageSize="pageSize"
      :loading="loading || fetchLoading" />
  </div>
</template>

<script>
import { api } from '@/api'
import ActionButton from '@/components/view/ActionButton'
import ProviderDetail from '@/views/infra/network/providers/ProviderDetail'
import ListDevice from '@/views/infra/network/providers/ListDevice'

export default {
  name: 'BaremetalDhcpProvider',
  components: {
    ActionButton,
    ProviderDetail,
    ListDevice
  },
  props: {
    nsp: {
      type: Object,
      default: () => {}
    },
    actions: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  provide () {
    return {
      providerChangePage: this.changePage
    }
  },
  inject: ['provideSetNsp', 'provideExecuteAction'],
  data () {
    return {
      nsps: {},
      details: ['name', 'state', 'id', 'servicelist'],
      columns: [
        {
          title: this.$t('url'),
          dataIndex: 'url'
        }
      ],
      fetchLoading: false,
      listDevice: [],
      page: 1,
      pageSize: 10,
      itemCount: 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  watch: {
    nsp (newData, oldData) {
      this.nsp = newData
      if (Object.keys(this.nsp).length > 0) {
        this.provideSetNsp(this.nsp)
        this.fetchListDevice()
      }
    }
  },
  methods: {
    async fetchListDevice () {
      const params = {}
      params.physicalnetworkid = this.nsp.physicalnetworkid
      params.page = this.page
      params.pageSize = this.pageSize
      this.fetchLoading = true

      try {
        const listResult = await this.listBaremetalDhcp(params)
        this.fetchLoading = false
        this.listDevice = listResult.listbaremetaldhcpresponse.listbaremetaldhcp || []
        this.itemCount = listResult.listbaremetaldhcpresponse.count || 0
      } catch (error) {
        this.fetchLoading = false
        this.$notification.error({
          message: 'Request Failed',
          description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
        })
      }
    },
    listBaremetalDhcp (args) {
      return new Promise((resolve, reject) => {
        api('listBaremetalDhcp', args).then(json => {
          resolve(json)
        }).catch(e => {
          reject(e)
        })
      })
    },
    handleExecAction (action) {
      this.provideExecuteAction(action)
    },
    changePage (page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.fetchListDevice()
    }
  }
}
</script>

<style scoped>
</style>

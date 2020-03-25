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
  <a-spin :spinning="fetchLoading">
    <a-tabs
      :activeKey="currentTab"
      :tabPosition="device === 'tablet' || device === 'mobile' ? 'top' : 'left'"
      :animated="false"
      @change="handleChangeTab">
      <a-tab-pane :tab="$t('details')" key="details">
        <DetailsTab :resource="resource" :loading="loading" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('access')" key="access">
        <DetailsTab :resource="resource" :loading="loading" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('instances')" key="instances">
        <DetailsTab :resource="resource" :loading="loading" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('firewall')" key="firewall">
        <FirewallRules :resource="this.network" :loading="this.fetchLoading" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('portforwarding')" key="portforwarding">
        <PortForwarding :resource="this.network" :loading="this.fetchLoading" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('loadbalancing')" key="loadbalancing">
        <LoadBalancing :resource="this.network" :loading="this.fetchLoading" />
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
import { api } from '@/api'
import DetailsTab from '@/components/view/DetailsTab'
import FirewallRules from '@/views/network/FirewallRules'
import PortForwarding from '@/views/network/PortForwarding'
import LoadBalancing from '@/views/network/LoadBalancing'

export default {
  name: 'KubernetesClusterInfoTab',
  components: {
    DetailsTab,
    FirewallRules,
    PortForwarding,
    LoadBalancing
  },
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
      fetchLoading: false,
      network: {},
      currentTab: 'details'
    }
  },
  beforeCreate () {
  },
  mounted () {
    this.handleFetchData()
  },
  watch: {
    loading (newData, oldData) {
      if (!newData && this.resource.id) {
        this.handleFetchData()
      }
    }
  },
  methods: {
    isObjectEmpty (obj) {
      return !(obj !== null && obj !== undefined && Object.keys(obj).length > 0 && obj.constructor === Object)
    },
    handleChangeTab (e) {
      this.currentTab = e
    },
    handleFetchData () {
      this.fetchNetwork()
    },
    fetchNetwork () {
      this.fetchLoading = true
      var params = {}
      if (!this.isObjectEmpty(this.resource)) {
        params.id = this.resource.associatednetworkid
      }
      api('listNetworks', params).then(json => {
        const listNetworks = json.listnetworksresponse.network
        if (this.arrayHasItems(listNetworks)) {
          this.network = listNetworks[0]
        }
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
        })
      }).finally(() => {
        this.fetchLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list {

  &__item,
  &__row {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  &__item {
    margin-bottom: -20px;
  }

  &__col {
    flex: 1;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  &__label {
    font-weight: bold;
  }

}

.pagination {
  margin-top: 20px;
}

.table {
  margin-top: 20px;
  overflow-y: auto;
}
</style>

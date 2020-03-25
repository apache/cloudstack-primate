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
  <a-spin :spinning="networkLoading">
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
        <a-table
          class="table"
          size="small"
          :columns="this.vmColumns"
          :dataSource="this.virtualmachines"
          :rowKey="item => item.id"
          :pagination="false"
        >
        </a-table>
      </a-tab-pane>
      <a-tab-pane :tab="$t('firewall')" key="firewall">
        <FirewallRules :resource="this.publicIpAddress" :loading="this.networkLoading" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('portforwarding')" key="portforwarding">
        <PortForwarding :resource="this.publicIpAddress" :loading="this.networkLoading" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('loadbalancing')" key="loadbalancing">
        <LoadBalancing :resource="this.publicIpAddress" :loading="this.networkLoading" />
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
import { api } from '@/api'
import { mixinDevice } from '@/utils/mixin.js'
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
      instanceLoading: false,
      virtualmachines: [],
      vmColumns: [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('instancename'),
          dataIndex: 'instancename'
        },
        {
          title: this.$t('displayname'),
          dataIndex: 'displayname'
        },
        {
          title: this.$t('ipaddress'),
          dataIndex: 'ipaddress'
        },
        {
          title: this.$t('zonename'),
          dataIndex: 'zonename'
        },
        {
          title: this.$t('state'),
          dataIndex: 'state'
        }
      ],
      networkLoading: false,
      network: {},
      publicIpAddress: {},
      currentTab: 'details'
    }
  },
  beforeCreate () {
  },
  created () {
    if (this.isAdminOrDomainAdmin()) {
      this.vmColumns = [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('instancename'),
          dataIndex: 'instancename'
        },
        {
          title: this.$t('displayname'),
          dataIndex: 'displayname'
        },
        {
          title: this.$t('ipaddress'),
          dataIndex: 'ipaddress'
        },
        {
          title: this.$t('zonename'),
          dataIndex: 'zonename'
        },
        {
          title: this.$t('state'),
          dataIndex: 'state'
        }
      ]
    } else {
      this.vmColumns = [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('displayname'),
          dataIndex: 'displayname'
        },
        {
          title: this.$t('ipaddress'),
          dataIndex: 'ipaddress'
        },
        {
          title: this.$t('state'),
          dataIndex: 'state'
        }
      ]
    }
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
    isAdminOrDomainAdmin () {
      return ['Admin', 'DomainAdmin'].includes(this.$store.getters.userInfo.roletype)
    },
    isValidValueForKey (obj, key) {
      return key in obj && obj[key] != null
    },
    arrayHasItems (array) {
      return array !== null && array !== undefined && Array.isArray(array) && array.length > 0
    },
    isObjectEmpty (obj) {
      return !(obj !== null && obj !== undefined && Object.keys(obj).length > 0 && obj.constructor === Object)
    },
    handleChangeTab (e) {
      this.currentTab = e
    },
    handleFetchData () {
      this.fetchInstances()
      this.fetchPublicIpAddress()
    },
    fetchInstances () {
      this.instanceLoading = true
      this.virtualmachines = []
      if (!this.isObjectEmpty(this.resource) && this.arrayHasItems(this.resource.virtualmachineids)) {
        var params = {}
        if (this.isValidValueForKey(this.resource, 'projectid') &&
          this.resource.projectid !== '') {
          params.projectid = this.resource.projectid
        }
        params.ids = this.resource.virtualmachineids.join()
        api('listVirtualMachines', params).then(json => {
          const listVms = json.listvirtualmachinesresponse.virtualmachine
          if (this.arrayHasItems(listVms)) {
            for (var i = 0; i < listVms.length; ++i) {
              var vm = listVms[i]
              if (vm.nic && vm.nic.length > 0 && vm.nic[0].ipaddress) {
                vm.ipaddress = vm.nic[0].ipaddress
                listVms[i] = vm
              }
            }
            this.virtualmachines = this.virtualmachines.concat(listVms)
            console.log(this.virtualmachines)
          }
        }).catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: error.response.headers['x-description']
          })
        }).finally(() => {
          this.instanceLoading = false
        })
      }
    },
    fetchPublicIpAddress () {
      this.networkLoading = true
      var params = {
        listAll: true,
        forvirtualnetwork: true
      }
      if (!this.isObjectEmpty(this.resource)) {
        if (this.isValidValueForKey(this.resource, 'projectid') &&
          this.resource.projectid !== '') {
          params.projectid = this.resource.projectid
        }
        if (this.isValidValueForKey(this.resource, 'associatednetworkid')) {
          params.associatednetworkid = this.resource.associatednetworkid
        }
      }
      api('listPublicIpAddresses', params).then(json => {
        const ips = json.listpublicipaddressesresponse.publicipaddress
        if (this.arrayHasItems(ips)) {
          this.publicIpAddress = ips[0]
        }
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
        })
      }).finally(() => {
        this.networkLoading = false
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

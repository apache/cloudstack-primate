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
    <a-card class="breadcrumb-card">
      <a-row>
        <a-col :span="device === 'mobile' ? 24 : 12" style="padding-left: 12px">
          <breadcrumb>
            <a-tooltip placement="bottom" slot="end">
              <template slot="title">{{ $t('label.refresh') }}</template>
              <a-button
                style="margin-top: 4px"
                :loading="loading"
                shape="round"
                size="small"
                icon="reload"
                @click="fetchData()"
              >{{ $t('label.refresh') }}</a-button>
            </a-tooltip>
          </breadcrumb>
        </a-col>
      </a-row>
    </a-card>

    <div class="row-element">
      <list-view
        :columns="columns"
        :items="items"
        :loading="loading"
        @refresh="this.fetchData" />
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import { genericCompare } from '@/utils/sort.js'
import { mixinDevice } from '@/utils/mixin.js'
import Breadcrumb from '@/components/widgets/Breadcrumb'
import ListView from '@/components/view/ListView.vue'

export default {
  name: 'CpuSockets',
  components: {
    ListView,
    Breadcrumb
  },
  mixins: [mixinDevice],
  provide: function () {
    return {
      parentFetchData: this.fetchData,
      parentToggleLoading: this.loading
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    pushData (hypervisor) {
      if (!(hypervisor in this.supportSocketHypervisors)) {
        this.data[hypervisor].cpusockets = 'N/A'
      }
      if (hypervisor === 'Hyperv') {
        this.data[hypervisor].id = 'Hyper-V'
      }
      this.items.push(this.data[hypervisor])
    },
    callListHostsWithPage (hypervisor, currentPage) {
      const pageSize = 1
      api('listHosts', {
        type: 'routing',
        hypervisor: hypervisor,
        page: currentPage,
        pagesize: pageSize
      }).then(json => {
        if (json.listhostsresponse.count === undefined) {
          this.pushData(hypervisor)
          return
        }

        this.data[hypervisor].hosts = json.listhostsresponse.count
        this.data[hypervisor].currentHosts += json.listhostsresponse.host.length

        for (const host of json.listhostsresponse.host) {
          if (host.cpusockets !== undefined && isNaN(host.cpusockets) === false) {
            this.data[hypervisor].cpusockets += host.cpusockets
          }
        }

        if (this.data[hypervisor].currentHosts < this.data[hypervisor].hosts) {
          this.callListHostsWithPage(hypervisor, currentPage + 1)
        } else {
          this.pushData(hypervisor)
        }
      })
    },
    callListHostsWithPageXen (hypervisor, currentPage) {
      const pageSize = 100
      api('listHosts', {
        type: 'routing',
        hypervisor: hypervisor,
        page: currentPage,
        pagesize: pageSize
      }).then(json => {
        if (json.listhostsresponse.count === undefined) {
          this.data[this.XenServerHypervisors['']].cpusockets = 'N/A'
          for (const key in this.XenServerHypervisors) {
            this.items.push(this.data[this.XenServerHypervisors[key]])
          }
          return
        }

        this.data[hypervisor].hosts = json.listhostsresponse.count
        this.data[hypervisor].currentHosts += json.listhostsresponse.host.length

        for (const host in json.listhostsresponse.host) {
          if (host.hypervisorversion in this.XenServerHypervisors) {
            this.data[this.XenServerHypervisors[host.hypervisorversion]].hosts++
            if (host.cpusockets !== undefined && isNaN(host.cpusockets) === false) {
              this.data[this.XenServerHypervisors[host.hypervisorversion]].cpusockets += host.cpusockets
            }
          } else {
            this.data[this.XenServerHypervisors['']].hosts++
          }
        }

        if (this.data[hypervisor].currentHosts < this.data[hypervisor].hosts) {
          this.callListHostsWithPage(hypervisor, currentPage + 1)
        } else {
          this.data[this.XenServerHypervisors['']].cpusockets = 'N/A'
          for (const key in this.XenServerHypervisors) {
            this.items.push(this.data[this.XenServerHypervisors[key]])
          }
        }
      })
    },
    fetchData () {
      this.loading = true
      this.items = []
      this.data = {}
      var hypervisors = ['Hyperv', 'KVM', 'VMware', 'BareMetal', 'LXC', 'Ovm3', 'Simulator']

      for (const hypervisor of hypervisors) {
        this.data[hypervisor] = {
          id: hypervisor,
          hosts: 0,
          cpusockets: 0,
          currentHosts: 0
        }
        this.callListHostsWithPage(hypervisor, 0)
      }

      for (const key in this.XenServerHypervisors) {
        this.data[this.XenServerHypervisors[key]] = {
          id: this.XenServerHypervisors[key],
          hosts: 0,
          cpusockets: 0,
          currentHosts: 0
        }
      }
      // Adding this since all versions of Xenserver come under the same hypervisor
      this.data.Xenserver = {
        id: 'Xenserver',
        hosts: 0,
        cpusockets: 0,
        currentHosts: 0
      }

      this.callListHostsWithPageXen('Xenserver', 0)
      this.loading = false
    }
  },
  data () {
    return {
      loading: false,
      items: [],
      data: {},
      columns: [
        {
          dataIndex: 'id',
          title: this.$t('label.hypervisor'),
          sorter: function (a, b) { return genericCompare(a[this.dataIndex] || '', b[this.dataIndex] || '') }
        },
        {
          dataIndex: 'hosts',
          title: this.$t('label.hosts'),
          sorter: function (a, b) { return genericCompare(a[this.dataIndex] || '', b[this.dataIndex] || '') }
        },
        {
          dataIndex: 'cpusockets',
          title: this.$t('label.cpusockets'),
          sorter: function (a, b) { return genericCompare(a[this.dataIndex] || '', b[this.dataIndex] || '') }
        }
      ],
      XenServerHypervisors: {
        '7.0.0': 'XenServer 7.0.0',
        '6.5.0': 'XenServer 6.5.0',
        '6.2.0': 'XenServer 6.2.0',
        '': 'XenServer 6.1.0 and before'
      },
      supportSocketHypervisors: { Hyperv: 1, KVM: 1, VMware: 1, Ovm3: 1 }
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb-card {
  margin-left: -24px;
  margin-right: -24px;
  margin-top: -18px;
  margin-bottom: 12px;
}

.row-element {
  margin-top: 10px;
  margin-bottom: 10px;
}

.ant-breadcrumb {
  vertical-align: text-bottom;
}

.ant-breadcrumb .anticon {
  margin-left: 8px;
}
</style>

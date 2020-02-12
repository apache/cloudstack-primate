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
      class="table"
      size="small"
      :columns="listVMCols"
      :dataSource="vms"
      :rowKey="item => item.id"
      :loading="fetchLoading"
      :pagination="false"
    >
      <template slot="name" slot-scope="text, record">
        {{ record.name }}
        <a-card v-if="selected === true" size="small" title="Use VM IP">
          <div v-for="nic in record.nic" :key="nic.id">
            <a-radio @click="vmIpSelected(record, nic)">{{ nic.ipaddress }}</a-radio>
          </div>
        </a-card>
      </template>
      <template slot="state" slot-scope="text, record">
        <status :text="record.state" displayText></status>
      </template>
      <template slot="select">
        <a-checkbox @change="handleChange"></a-checkbox>
      </template>
    </a-table>
    <a-divider/>
    <a-pagination
      class="row-element pagination"
      size="small"
      :current="page"
      :pageSize="pageSize"
      :total="vmCounts"
      :showTotal="total => `Total ${total} items`"
      :pageSizeOptions="['10', '20', '40', '80', '100']"
      @change="changePage"
      @showSizeChange="changePageSize"
      showSizeChanger/>
    <div class="actions">
      <a-button @click="closeModal">
        {{ $t('Cancel') }}
      </a-button>
      <a-button type="primary" @click="handleSubmit">
        {{ $t('OK') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import Status from '@/components/widgets/Status'

export default {
  name: 'AssignVMsToLB',
  components: {
    Status
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      page: 1,
      pageSize: 10,
      vmCounts: 0,
      vms: [],
      selected: false,
      params: {},
      assignedVMs: [],
      index: 0,
      fetchLoading: false,
      listVMCols: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
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
          title: this.$t('host')
        },
        {
          title: this.$t('accountId'),
          dataIndex: 'account'
        },
        {
          title: this.$t('zoneId'),
          dataIndex: 'zonename'
        },
        {
          title: this.$t('state'),
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: this.$t('select'),
          scopedSlots: { customRender: 'select' }
        }
      ]
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchLoadBalancers()
      this.fetchVirtualMachines()
    },
    fetchLoadBalancers () {
      this.fetchLoading = true
      api('listLoadBalancers', {
        id: this.resource.id
      }).then(response => {
        this.assignedVMs = response.listloadbalancersresponse.loadbalancer[0].loadbalancerinstance || []
      }).finally(() => {
        this.fetchLoading = false
      })
    },
    differenceBy (array1, array2, key) {
      return array1.filter(a => !array2.some(b => b[key] === a[key]))
    },
    fetchVirtualMachines () {
      this.fetchLoading = true
      api('listVirtualMachines', {
        listAll: true,
        networkid: this.resource.networkid,
        page: this.page,
        pageSize: this.pageSize
      }).then(response => {
        var vms = response.listvirtualmachinesresponse.virtualmachine || []
        this.vms = this.differenceBy(vms, this.assignedVMs, 'id')
        this.vmCounts = this.vms.length
      }).finally(() => {
        this.fetchLoading = false
      })
    },
    vmIpSelected (vm, nic) {
      this.params['vmidipmap[' + this.index + '].vmid'] = vm.id
      this.params['vmidipmap[' + this.index + '].vmip'] = nic.ipaddress
      this.index++
    },
    closeModal () {
      this.$emit('close-action')
    },
    handleChange (e) {
      this.selected = e.target.checked
    },
    handleSubmit () {
      this.params.id = this.resource.id
      this.fetchLoading = true
      api('assignToLoadBalancerRule', this.params).then(response => {
        this.$pollJob({
          jobId: response.assigntoloadbalancerruleresponse.jobid,
          successMessage: `Successfully assigned VMs to ${this.resource.name}`,
          successMethod: () => {
            this.fetchData()
          },
          errorMessage: `Failed to assign VMs to ${this.resource.name}`,
          errorMethod: () => {
            this.fetchLoading = false
            this.fetchData()
          },
          loadingMessage: `Assigning VMs to ${this.resource.name}`,
          catchMessage: 'Error encountered while fetching async job result'
        })
      }).catch(error => {
        this.fetchLoading = false
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext,
          duration: 0
        })
      }).finally(() => {
        this.fetchLoading = false
        this.closeModal()
      })
    },
    changePage (page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.fetchData()
    },
    changePageSize (currentPage, pageSize) {
      this.page = currentPage
      this.pageSize = pageSize
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;

    button {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
</style>

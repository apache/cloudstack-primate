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
    <a-button type="dashed" icon="plus" style="width: 100%;margin-bottom: 20px;" @click="handleOpenModal">Add Network</a-button>
    <a-list class="list">
      <a-list-item v-for="(network, idx) in networks" :key="idx" class="list__item">
        <div class="list__item-outer-container">
          <div class="list__item-container">
            <div class="list__col">
              <div class="list__label">
                {{ $t('name') }}
              </div>
              <div>
                <router-link :to="{ path: '/guestnetwork/' + network.id }">{{ network.name }} </router-link>
                <a-tag v-if="network.broadcasturi">{{ network.broadcasturi }}</a-tag>
              </div>
            </div>
            <div class="list__col">
              <div class="list__label">{{ $t('state') }}</div>
              <div><status :text="network.state" displayText></status></div>
            </div>
            <div class="list__col">
              <div class="list__label">
                {{ $t('CIDR') }}
              </div>
              <div>{{ network.cidr }}</div>
            </div>
            <div class="list__col">
              <div class="list__label">
                {{ $t('aclid') }}
              </div>
              <div>
                <router-link :to="{ path: '/acllist/' + network.aclid }">
                  {{ network.aclid }}
                </router-link>
              </div>
            </div>
          </div>
          <a-collapse defaultActiveKey="1" :bordered="false">
            <template v-slot:expandIcon="props">
              <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <a-collapse-panel header="Internal LB" key="1" :style="customStyle">
              <a-table
                class="table"
                size="small"
                :columns="internalLbCols"
                :dataSource="internalLB[network.id]"
                :rowKey="item => item.id"
                :pagination="false">
                <template slot="name" slot-scope="text, item">
                  <router-link
                    :to="{ path: '/ilb/'+item.id}">{{ item.name }}
                  </router-link>
                </template>
              </a-table>
              <a-divider/>
              <a-pagination
                class="row-element pagination"
                size="small"
                :current="page"
                :pageSize="pageSize"
                :total="itemCounts.internalLB[network.id]"
                :showTotal="total => `Total ${total} items`"
                :pageSizeOptions="['10', '20', '40', '80', '100']"
                @change="changePage"
                @showSizeChange="changePageSize"
                showSizeChanger/>
              <a-button type="primary" icon="plus" style="float: right;margin:10px" @click="handleAddInternalLB(network.id)">{{ $t('label.add.internal.lb') }}</a-button>
            </a-collapse-panel>
            <a-collapse-panel header="Public LB IP" key="2" :style="customStyle">
              <a-table
                class="table"
                size="small"
                :columns="LBPublicIPCols"
                :dataSource="LBPublicIPs[network.id]"
                :rowKey="item => item.id"
                :pagination="false">
                <template slot="name" slot-scope="text, item">
                  <router-link
                    :to="{ path: '/publicip/'+item.id}">{{ item.name }}
                  </router-link>
                </template>
              </a-table>
              <a-divider/>
              <a-pagination
                class="row-element pagination"
                size="small"
                :current="page"
                :pageSize="pageSize"
                :total="itemCounts.publicIps[network.id]"
                :showTotal="total => `Total ${total} items`"
                :pageSizeOptions="['10', '20', '40', '80', '100']"
                @change="changePage"
                @showSizeChange="changePageSize"
                showSizeChanger/>
            </a-collapse-panel>
            <a-collapse-panel header="Static NATS" key="3" :style="customStyle">
              <a-table
                class="table"
                size="small"
                :columns="StaticNatCols"
                :dataSource="staticNats[network.id]"
                :rowKey="item => item.id"
                :pagination="false">
                <template slot="name" slot-scope="text, item">
                  <router-link
                    :to="{ path: '/publicip/'+item.id}">{{ item.name }}
                  </router-link>
                </template>
              </a-table>
              <a-divider/>
              <a-pagination
                class="row-element pagination"
                size="small"
                :current="page"
                :pageSize="pageSize"
                :total="itemCounts.publicIps[network.id]"
                :showTotal="total => `Total ${total} items`"
                :pageSizeOptions="['10', '20', '40', '80', '100']"
                @change="changePage"
                @showSizeChange="changePageSize"
                showSizeChanger/>
            </a-collapse-panel>
            <a-collapse-panel header="VMs" key="4" :style="customStyle">
              <a-table
                class="table"
                size="small"
                :columns="vmCols"
                :dataSource="vms[network.id]"
                :rowKey="item => item.id"
                :pagination="false">
                <template slot="name" slot-scope="text, item">
                  <router-link
                    :to="{ path: '/vm/'+item.id}">{{ item.name }}
                  </router-link>
                </template>
              </a-table>
              <a-pagination
                class="row-element pagination"
                size="small"
                :current="page"
                :pageSize="pageSize"
                :total="itemCounts.vms[network.id]"
                :showTotal="total => `Total ${total} items`"
                :pageSizeOptions="['10', '20', '40', '80', '100']"
                @change="changePage"
                @showSizeChange="changePageSize"
                showSizeChanger/>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-list-item>
    </a-list>

    <a-modal v-model="showCreateNetworkModal" :title="$t('label.add.new.tier')" @ok="handleAddNetworkSubmit">
      <a-spin :spinning="modalLoading">
        <a-form @submit.prevent="handleAddNetworkSubmit" :form="form">
          <a-form-item :label="$t('name')">
            <a-input
              placeholder="A unique name of the tier"
              v-decorator="['name',{rules: [{ required: true, message: 'Required' }]}]"></a-input>
          </a-form-item>
          <a-form-item :label="$t('networkOfferingId')">
            <a-select
              v-decorator="['networkOffering',{rules: [{ required: true, message: 'Required' }]}]">
              <a-select-option v-for="item in networkOfferings" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('gateway')">
            <a-input
              placeholder="The gateway of the tier in the super CIDR range and not overlapping the CIDR of any other tier in this VPC."
              v-decorator="['gateway',{rules: [{ required: true, message: 'Required' }]}]"></a-input>
          </a-form-item>
          <a-form-item :label="$t('netmask')">
            <a-input
              placeholder="Netmask of the tier. For example, with VPC CIDR of 10.0.0.0/16 and network tier CIDR of 10.1.1.0/24, gateway is 10.1.1.1 and netmask is 255.255.255.0"
              v-decorator="['netmask',{rules: [{ required: true, message: 'Required' }]}]"></a-input>
          </a-form-item>
          <a-form-item :label="$t('externalId')">
            <a-input
              v-decorator="['externalId']"></a-input>
          </a-form-item>
          <a-form-item :label="$t('aclid')">
            <a-select v-decorator="['acl']">
              <a-select-option v-for="item in networkAclList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal v-model="showAddInternalLB" :title="$t('label.add.internal.lb')" @ok="handleAddInternalLBSubmit">
      <a-spin :spinning="modalLoading">
        <a-form @submit.prevent="handleAddInternalLBSubmit" :form="form">
          <a-form-item :label="$t('name')">
            <a-input
              placeholder="Unique name for Internal LB"
              v-decorator="['name', { rules: [{ required: true, message: 'Please specify a name for the Internal LB'}] }]"/>
          </a-form-item>
          <a-form-item :label="$t('description')">
            <a-input
              placeholder="Brief description of the Internal LB"
              v-decorator="['description']"/>
          </a-form-item>
          <a-form-item :label="$t('sourceipaddress')">
            <a-input
              placeholder="Brief description of the Internal LB"
              v-decorator="['sourceIP']"/>
          </a-form-item>
          <a-form-item :label="$t('sourceport')">
            <a-input
              v-decorator="['sourcePort', { rules: [{ required: true, message: 'Please specify a Source Port'}] }]"/>
          </a-form-item>
          <a-form-item :label="$t('instanceport')">
            <a-input
              v-decorator="['instancePort', { rules: [{ required: true, message: 'Please specify a Instance Port'}] }]"/>
          </a-form-item>
          <a-form-item :label="$t('algorithm')">
            <a-select
              v-decorator="[
                'algorithm',
                {
                  initialValue: 'Source',
                  rules: [{ required: true, message: 'required'}]
                }]">
              <a-select-option v-for="(key, idx) in Object.keys(algorithms)" :key="idx" :value="algorithms[key]">
                {{ key }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-spin>
</template>

<script>
import { api } from '@/api'
import Status from '@/components/widgets/Status'

export default {
  name: 'VpcTiersTab',
  components: {
    Status
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
      networks: [],
      networkid: '',
      fetchLoading: false,
      showCreateNetworkModal: false,
      showAddInternalLB: false,
      networkOfferings: [],
      networkAclList: [],
      modalLoading: false,
      internalLB: {},
      LBPublicIPs: {},
      staticNats: {},
      vms: {},
      algorithms: {
        Source: 'source',
        'Round-robin': 'roundrobin',
        'Least connections': 'leastconn'
      },
      internalLbCols: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('sourceipaddress'),
          dataIndex: 'sourceipaddress'
        },
        {
          title: this.$t('algorithm'),
          dataIndex: 'algorithm'
        },
        {
          title: this.$t('account'),
          dataIndex: 'account'
        }
      ],
      LBPublicIPCols: [
        {
          title: this.$t('ip'),
          dataIndex: 'ipaddress',
          scopedSlots: { customRender: 'ipaddress' }
        },
        {
          title: this.$t('state'),
          dataIndex: 'state'
        },
        {
          title: this.$t('networkid'),
          dataIndex: 'associatedNetworkName'
        },
        {
          title: this.$t('vm'),
          dataIndex: 'virtualmachinename'
        }
      ],
      StaticNatCols: [
        {
          title: this.$t('ips'),
          dataIndex: 'ipaddress',
          scopedSlots: { customRender: 'ipaddress' }
        },
        {
          title: this.$t('zoneid'),
          dataIndex: 'zonename'
        },
        {
          title: this.$t('networkid'),
          dataIndex: 'associatedNetworkName'
        },
        {
          title: this.$t('state'),
          dataIndex: 'state'
        }
      ],
      vmCols: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('ip'),
          dataIndex: 'nic[0].ipaddress'
        }
      ],
      customStyle: 'border-radius: 4px;margin-bottom: -5px;',
      page: 1,
      pageSize: 10,
      itemCounts: {
        internalLB: {},
        publicIps: {},
        snats: {},
        vms: {}
      }
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
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    fetchData () {
      this.fetchLoading = true
      var i = 0
      api('listNetworks', { vpcid: this.resource.id }).then(json => {
        this.networks = json.listnetworksresponse.network
      }).then(() => {
        for (i = 0; i < this.networks.length; i++) {
          var id = this.networks[i].id
          this.fetchLoadBalancers(id)
          this.fetchLBPublicIPs(id, 'LB')
          this.fetchLBPublicIPs(id, 'SNAT')
          this.fetchVMs(id)
        }
      }).finally(() => {
        this.fetchLoading = false
      })
    },
    fetchNetworkAclList () {
      this.fetchLoading = true
      this.modalLoading = true
      api('listNetworkACLLists', { vpcid: this.resource.id }).then(json => {
        this.networkAclList = json.listnetworkacllistsresponse.networkacllist
        this.$nextTick(function () {
          this.form.setFieldsValue({
            acl: this.networkAclList[0].id
          })
        })
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description'],
          duration: 0
        })
      }).finally(() => {
        this.fetchLoading = false
        this.modalLoading = false
      })
    },
    fetchNetworkOfferings () {
      this.fetchLoading = true
      this.modalLoading = true
      api('listNetworkOfferings', {
        forvpc: true,
        guestiptype: 'Isolated',
        supportedServices: 'SourceNat',
        state: 'Enabled'
      }).then(json => {
        this.networkOfferings = json.listnetworkofferingsresponse.networkoffering
        this.$nextTick(function () {
          this.form.setFieldsValue({
            networkOffering: this.networkOfferings[0].id
          })
        })
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description'],
          duration: 0
        })
      }).finally(() => {
        this.fetchLoading = false
        this.modalLoading = false
      })
    },
    fetchLoadBalancers (id) {
      api('listLoadBalancers', {
        networkid: id,
        page: this.page,
        pagesize: this.pageSize
      }).then(json => {
        this.internalLB[id] = json.listloadbalancersresponse.loadbalancer || []
        this.itemCounts.internalLB[id] = json.listloadbalancersresponse.count
      })
    },
    fetchLBPublicIPs (id, op) {
      var variableKey = null
      var variableValue = null
      if (op === 'LB') {
        variableKey = 'forloadbalancing'
        variableValue = true
      } else {
        variableKey = 'isstaticnat'
        variableValue = true
      }
      api('listPublicIpAddresses', {
        listAll: true,
        [variableKey]: variableValue,
        associatednetworkid: id,
        page: this.page,
        pagesize: this.pageSize
      }).then(json => {
        if (op === 'LB') {
          this.LBPublicIPs[id] = json.listpublicipaddressesresponse.publicipaddress || []
        } else {
          this.staticNats[id] = json.listpublicipaddressesresponse.publicipaddress || []
        }
        this.itemCounts.publicIps[id] = json.listpublicipaddressesresponse.count
      })
    },
    fetchVMs (id) {
      api('listVirtualMachines', {
        listAll: true,
        vpcid: this.resource.id,
        networkid: id,
        page: this.page,
        pagesize: this.pageSize
      }).then(json => {
        this.vms[id] = json.listvirtualmachinesresponse.virtualmachine || []
        this.itemCounts.vms[id] = json.listvirtualmachinesresponse.count
      })
    },
    closeModal () {
      this.$emit('close-action')
    },
    handleOpenModal () {
      this.form = this.$form.createForm(this)
      this.fetchNetworkAclList()
      this.fetchNetworkOfferings()
      this.showCreateNetworkModal = true
    },
    handleAddInternalLB (id) {
      this.form = this.$form.createForm(this)
      this.showAddInternalLB = true
      this.networkid = id
    },
    handleAddNetworkSubmit () {
      this.fetchLoading = true

      this.form.validateFields((errors, values) => {
        if (errors) {
          this.fetchLoading = false
          return
        }

        this.showCreateNetworkModal = false
        api('createNetwork', {
          vpcid: this.resource.id,
          domainid: this.resource.domainid,
          account: this.resource.account,
          networkOfferingId: values.networkOffering,
          name: values.name,
          displayText: values.name,
          gateway: values.gateway,
          netmask: values.netmask,
          zoneId: this.resource.zoneid,
          externalid: values.externalId,
          aclid: values.acl
        }).then(() => {
          this.$notification.success({
            message: 'Successfully added VPC Network'
          })
          this.fetchData()
        }).catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: error.response.headers['x-description'],
            duration: 0
          })
        }).finally(() => {
          this.fetchLoading = false
          this.fetchData()
        })
      })
    },
    handleAddInternalLBSubmit () {
      this.fetchLoading = true
      this.modalLoading = true
      this.form.validateFields((errors, values) => {
        if (errors) {
          this.fetchLoading = false
          return
        }
        api('createLoadBalancer', {
          name: values.name,
          sourceport: values.sourcePort,
          instanceport: values.instancePort,
          algorithm: values.algorithm,
          networkid: this.networkid,
          sourceipaddressnetworkid: this.networkid,
          scheme: 'Internal'
        }).then(response => {
          this.$store.dispatch('AddAsyncJob', {
            title: `Creating Internal LB`,
            jobid: response.createloadbalancerresponse.jobid,
            description: values.name,
            status: 'progress'
          })
          this.$pollJob({
            jobId: response.createloadbalancerresponse.jobid,
            successMessage: `Successfully created Internal LB`,
            successMethod: () => {
              this.fetchData()
            },
            errorMessage: 'Failed to create Internal LB' + response,
            errorMethod: () => {
              this.fetchData()
            },
            loadingMessage: `Creation of Internal LB is in progress`,
            catchMessage: 'Error encountered while fetching async job result',
            catchMethod: () => {
              this.fetchData()
            }
          })
        }).catch(error => {
          console.error(error)
          this.$message.error('Failed to create Internal LB')
        }).finally(() => {
          this.fetchLoading = false
          this.modalLoading = false
          this.showAddInternalLB = false
          this.fetchData()
        })
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
.list {

  &__label {
    font-weight: bold;
  }

  &__col {
    flex: 1;

    @media (min-width: 480px) {
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }

  &__item {
    margin-right: -8px;
    align-items: flex-start;

    &-outer-container {
      width: 100%;
    }

    &-container {
      display: flex;
      flex-direction: column;
      width: 100%;

      @media (min-width: 480px) {
        flex-direction: row;
        margin-bottom: 10px;
      }
    }
  }

  .blue {

  }
}
</style>

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
    <a-button type="dashed" icon="plus" style="width: 100%" @click="handleOpenModal">Add Network</a-button>

    <a-table
      size="small"
      style="overflow-y: auto; margin-top: 20px;"
      :loading="fetchLoading"
      :columns="columns"
      :dataSource="networks"
      :pagination="false"
      :scroll="{ x: 1000 }"
      :rowKey="record => record.id">
      <template slot="name" slot-scope="record">
        <router-link :to="{ path: '/guestnetwork/' + record.id }">{{ record.name }} </router-link>
        <a-tag v-if="record.broadcasturi">{{ record.broadcasturi }}</a-tag>
      </template>
      <template slot="state" slot-scope="record">
        <status :text="record.state" displayText></status>
      </template>
      <template slot="aclid" slot-scope="record">
        <router-link :to="{ path: '/acllist/' + record.aclid }">{{ record.aclid }}</router-link>
      </template>
      <div slot="actions" slot-scope="record" class="actions">
        <div class="list__col">
          <a-button icon="share-alt">
            <router-link :to="{ path: '/ilb?networkid=' + record.id }"> Internal LB</router-link>
          </a-button>
        </div>
        <div class="list__col">
          <a-button icon="share-alt">
            <router-link :to="{ path: '/publicip?forloadbalancing=true' + '&associatednetworkid=' + record.id }">
              Public LB IP
            </router-link>
          </a-button>
        </div>
        <div class="list__col">
          <a-button icon="environment">
            <router-link :to="{ path: '/publicip?isstaticnat=true' + '&associatednetworkid=' + record.id }">
              Static NATS
            </router-link>
          </a-button>
        </div>
        <div class="list__col">
          <a-button icon="desktop">
            <router-link :to="{ path: '/vm/?vpcid=' + resource.id + '&networkid=' + record.id }">VMs</router-link>
          </a-button>
        </div>
      </div>
    </a-table>
    <a-pagination
      class="pagination"
      size="small"
      :current="page"
      :pageSize="pageSize"
      :total="networks ? networks.length : 0"
      :showTotal="total => `Total ${total} items`"
      :pageSizeOptions="['10', '20', '40', '80', '100']"
      @change="handleChangePage"
      @showSizeChange="handleChangePageSize"
      showSizeChanger/>

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
      fetchLoading: false,
      showCreateNetworkModal: false,
      networkOfferings: [],
      networkAclList: [],
      modalLoading: false,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: this.$t('name'),
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('state'),
          scopedSlots: { customRender: 'state' }
        },
        {
          title: this.$t('CIDR'),
          dataIndex: 'cidr'
        },
        {
          title: this.$t('aclid'),
          scopedSlots: { customRender: 'aclid' }
        },
        {
          title: this.$t('action'),
          scopedSlots: { customRender: 'actions' }
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
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    fetchData () {
      this.fetchLoading = true
      api('listNetworks', {
        vpcid: this.resource.id,
        page: this.page,
        pageSize: this.pageSize
      }).then(json => {
        this.networks = json.listnetworksresponse.network
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
        })
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
          description: error.response.headers['x-description']
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
          description: error.response.headers['x-description']
        })
      }).finally(() => {
        this.fetchLoading = false
        this.modalLoading = false
      })
    },
    handleOpenModal () {
      this.form = this.$form.createForm(this)
      this.fetchNetworkAclList()
      this.fetchNetworkOfferings()
      this.showCreateNetworkModal = true
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
            description: error.response.headers['x-description']
          })
        }).finally(() => {
          this.fetchLoading = false
          this.fetchData()
        })
      })
    },
    handleChangePage (page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.fetchData()
    },
    handleChangePageSize (currentPage, pageSize) {
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
}
.pagination {
  margin-top: 20px;
}
  .actions {
    display: flex;
  }
</style>

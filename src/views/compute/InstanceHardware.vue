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
    <a-collapse v-model="activeKey">
      <a-collapse-panel :header="'ISO: ' + vm.isoname" v-if="vm.isoid" key="1">
        <a-list
          itemLayout="horizontal">
          <a-list-item>
            <a-list-item-meta :description="vm.isoid">
              <a slot="title" href="">
                <router-link :to="{ path: '/iso/' + vm.isoid }">{{ vm.isoname }}</router-link>
              </a> ({{ vm.isoname }})
              <a-avatar slot="avatar">
                <a-icon type="usb" />
              </a-avatar>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-collapse-panel>

      <a-collapse-panel :header="'Disks: ' + volumes.length" key="2">
        <a-list
          size="small"
          itemLayout="horizontal"
          :dataSource="volumes"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <div slot="title">
                <router-link :to="{ path: '/volume/' + item.id }">{{ item.name }}</router-link> ({{ item.type }}) <br/>
                <status :text="item.state" displayText /><br/>
              </div>
              <div slot="description">
                <a-icon type="barcode"/> {{ item.id }}
              </div>
              <a-avatar slot="avatar">
                <a-icon type="hdd" />
              </a-avatar>
            </a-list-item-meta>
            <p>
              Size: {{ (item.size / (1024 * 1024 * 1024.0)).toFixed(4) }} GB<br/>
              Physical Size: {{ (item.physicalsize / (1024 * 1024 * 1024.0)).toFixed(4) }} GB<br/>
              Provisioning: {{ item.provisioningtype }}<br/>
              Storage Pool: {{ item.storage }} ({{ item.storagetype }})<br/>
            </p>
          </a-list-item>
        </a-list>

      </a-collapse-panel>
      <a-collapse-panel :header="'Network Adapter(s): ' + (vm && vm.nic ? vm.nic.length : 0)" key="3" >
        <a-button type="primary" style="display: block; margin-left: auto;" @click="showAddModal" :loading="loadingNIC">
          <a-icon type="plus-circle"></a-icon> Add network to VM
        </a-button>
        <a-list
          size="small"
          itemLayout="horizontal"
          :dataSource="vm.nic"
          class="list"
          :loading="loadingNIC"
        >
          <a-list-item slot="renderItem" slot-scope="item" class="list__item">
            <a-list-item-meta>
              <div slot="title">
                <span v-show="item.isdefault">(Default) </span>
                <router-link :to="{ path: '/guestnetwork/' + item.networkid }">{{ item.networkname }} </router-link><br/>
                Mac Address: {{ item.macaddress }}<br/>
                <span v-if="item.ipaddress">Address: {{ item.ipaddress }} <br/></span>
                Netmask: {{ item.netmask }}<br/>
                Gateway: {{ item.gateway }}<br/>
              </div>
              <div slot="description">
                <a-icon type="barcode"/> {{ item.id }}
              </div>
              <a-avatar slot="avatar">
                <a-icon type="wifi" />
              </a-avatar>
            </a-list-item-meta>
            <p>
              Type: {{ item.type }}<br/>
              Broadcast URI: {{ item.broadcasturi }}<br/>
              Isolation URI: {{ item.isolationuri }}<br/>
            </p>
            <div slot="actions" class="actions">
              <a-tooltip placement="left">
                <template slot="title">
                  {{ "Edit IP Address" }}
                </template>
                <a-button
                  type="primary"
                  icon="edit"
                  shape="circle"
                  @click="editIpAddressNIC = item.id; showUpdateIPModal = true" />
              </a-tooltip>
              <a-tooltip placement="left">
                <template slot="title">
                  {{ "Edit/Add secondary IP Address" }}
                </template>
                <a-button icon="edit" shape="circle" @click="fetchSecondaryIPs(item)" />
              </a-tooltip>
              <a-tooltip placement="left" v-if="!item.isdefault">
                <template slot="title">
                  {{ "Set as default" }}
                </template>
                <a-popconfirm
                  title="Confirm set as default?"
                  @confirm="setAsDefault(item)"
                  okText="Yes"
                  cancelText="No"
                >
                  <a-button icon="form" shape="circle" />
                </a-popconfirm>
              </a-tooltip>
              <a-tooltip placement="left" v-if="!item.isdefault">
                <template slot="title">
                  {{ "Remove" }}
                </template>
                <a-popconfirm
                  :title="$t('message.network.removeNIC')"
                  @confirm="removeNIC(item)"
                  okText="Yes"
                  cancelText="No"
                >
                  <a-button type="danger" icon="delete" shape="circle" />
                </a-popconfirm>
              </a-tooltip>
            </div>
          </a-list-item>
        </a-list>
      </a-collapse-panel>
    </a-collapse>

    <a-modal
      :visible="showAddNetworkModal"
      :title="$t('label.network.addVM')"
      @cancel="closeModals"
      @ok="submitAddNetwork">
      {{ $t('message.network.addVM.desc') }}

      <div class="modal-form">
        <p class="modal-form__label">{{ $t('Network') }}:</p>
        <a-select :defaultValue="addNetworkData.network" @change="e => addNetworkData.network === e">
          <a-select-option
            v-for="network in addNetworkData.allNetworks"
            :key="network.id"
            :value="network.id">
            {{ network.name }}
          </a-select-option>
        </a-select>
        <p class="modal-form__label">{{ $t('publicip') }}:</p>
        <a-input v-model="addNetworkData.ip"></a-input>
      </div>

    </a-modal>

    <a-modal
      :visible="showUpdateIPModal"
      :title="$t('label.change.ipaddress')"
      @cancel="closeModals"
      @ok="submitUpdateIP"
    >
      {{ $t('message.network.updateIp') }}

      <div class="modal-form">
        <p class="modal-form__label">{{ $t('publicip') }}:</p>
        <a-input v-model="editIPAddressValue"></a-input>
      </div>

    </a-modal>

    <a-modal
      :visible="showSecondaryIPModal"
      :title="$t('label.acquire.new.secondary.ip')"
      :footer="null"
      class="wide-modal"
    >
      <p>
        {{ $t('message.network.secondaryIP') }}
      </p>
      <a-divider />
      <p class="modal-form__label">Add new secondary {{ $t('publicip') }}:</p>
      <a-input placeholder="Enter new secondary IP Address" v-model="newSecondaryIP"></a-input>

      <div style="margin-top: 10px; display: flex; justify-content:flex-end;">
        <a-button @click="submitSecondaryIP" type="primary" style="margin-right: 10px;">Add</a-button>
        <a-button @click="closeModals">Cancel</a-button>
      </div>

      <a-divider />
      <a-list itemLayout="vertical">
        <a-list-item v-for="(ip, index) in secondaryIPs" :key="index">
          <p class="modal-form__label modal-form__label--no-margin">IP Address:</p>
          {{ ip.ipaddress }}
          <p class="modal-form__label modal-form__label--no-margin">ID:</p>
          {{ ip.id }}
          <p class="modal-form__label modal-form__label--no-margin">VM Name:</p>
          {{ vm.name }}
          <p class="modal-form__label modal-form__label--no-margin">Zone Name:</p>
          {{ vm.zonename }}

          <a-popconfirm
            title="Release IP?"
            @confirm="removeSecondaryIP(ip.id)"
            okText="Yes"
            cancelText="No"
          >
            <a-button
              style="display: block; margin-top: 10px; margin-bottom: -10px;"
              type="danger"
              shape="circle"
              icon="delete" />
          </a-popconfirm>

        </a-list-item>
      </a-list>
    </a-modal>

  </div>
</template>

<script>

import { api } from '@/api'
import ResourceLayout from '@/layouts/ResourceLayout'
import Status from '@/components/widgets/Status'

export default {
  name: 'InstanceHardware',
  components: {
    ResourceLayout,
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
  inject: ['parentFetchData'],
  data () {
    return {
      vm: {},
      volumes: [],
      totalStorage: 0,
      activeKey: ['1', '2', '3'],
      showAddNetworkModal: false,
      showUpdateIPModal: false,
      showSecondaryIPModal: false,
      addNetworkData: {
        allNetworks: [],
        network: '',
        ip: ''
      },
      loadingNIC: false,
      editIpAddressNIC: '',
      editIPAddressValue: '',
      secondaryIPs: [],
      selectedSecondaryIPNIC: '',
      newSecondaryIP: ''
    }
  },
  created () {
    this.vm = this.resource
    this.fetchData()
  },
  watch: {
    resource: function (newItem, oldItem) {
      this.vm = newItem
      if (newItem.id === oldItem.id) {
        return
      }
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      this.volumes = []
      if (!this.vm || !this.vm.id) {
        return
      }
      api('listVolumes', { listall: true, virtualmachineid: this.vm.id }).then(json => {
        this.volumes = json.listvolumesresponse.volume
        if (this.volumes) {
          this.volumes.sort((a, b) => { return a.deviceid - b.deviceid })
        }
        this.$set(this.resource, 'volumes', this.volumes)
      })
    },
    listNetworks () {
      api('listNetworks', {
        response: 'json',
        listAll: 'true',
        zoneid: this.vm.zoneid
      }).then(response => {
        this.addNetworkData.allNetworks = response.listnetworksresponse.network
        this.addNetworkData.network = this.addNetworkData.allNetworks[0].id
      })
    },
    fetchSecondaryIPs (item) {
      this.showSecondaryIPModal = true
      this.selectedSecondaryIPNIC = item.id
      api('listNics', {
        response: 'json',
        nicId: item.id,
        keyword: '',
        virtualmachineid: this.vm.id
      }).then(response => {
        this.secondaryIPs = response.listnicsresponse.nic[0].secondaryip
      })
    },
    showAddModal () {
      this.showAddNetworkModal = true
      this.listNetworks()
    },
    closeModals () {
      this.showAddNetworkModal = false
      this.showUpdateIPModal = false
      this.showSecondaryIPModal = false
      this.addNetworkData.network = ''
      this.addNetworkData.ip = ''

      this.editIPAddressValue = ''

      this.newSecondaryIP = ''
    },
    submitAddNetwork () {
      this.loadingNIC = true
      this.showAddNetworkModal = false
      api('addNicToVirtualMachine', {
        response: 'json',
        virtualmachineid: this.vm.id,
        networkid: this.addNetworkData.network,
        ipaddress: this.addNetworkData.ip
      }).then(response => {
        this.queryAsyncJobResult({
          jobId: response.addnictovirtualmachineresponse.jobid,
          successMessage: `Successfully added network`,
          successMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          },
          errorMessage: 'Adding network failed',
          errorMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          },
          loadingMessage: `Adding network...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.loadingNIC = false
      })
    },
    setAsDefault (item) {
      this.loadingNIC = true
      api('updateDefaultNicForVirtualMachine', {
        response: 'json',
        virtualmachineid: this.vm.id,
        nicid: item.id
      }).then(response => {
        this.queryAsyncJobResult({
          jobId: response.updatedefaultnicforvirtualmachineresponse.jobid,
          successMessage: `Successfully set ${item.networkname} to default. Please manually update the default NIC on the VM now.`,
          successMethod: () => {
            this.loadingNIC = false
            this.parentFetchData()
          },
          errorMessage: `Error setting ${item.networkname} to default`,
          errorMethod: () => {
            this.loadingNIC = false
            this.parentFetchData()
          },
          loadingMessage: `Setting ${item.networkname} to default...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.loadingNIC = false
            this.parentFetchData()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.loadingNIC = false
      })
    },
    submitUpdateIP () {
      this.loadingNIC = true
      this.showUpdateIPModal = false
      api('updateVmNicIp', {
        response: 'json',
        nicId: this.editIpAddressNIC,
        ipaddress: this.editIPAddressValue
      }).then(response => {
        this.queryAsyncJobResult({
          jobId: response.updatevmnicipresponse.jobid,
          successMessage: `Successfully updated IP Address`,
          successMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          },
          errorMessage: `Error`,
          errorMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          },
          loadingMessage: `Updating IP Address...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          }
        })
      })
        .catch(error => {
          this.$notification.error({
            message: `Error ${error.response.status}`,
            description: error.response.data.errorresponse.errortext
          })
          this.loadingNIC = false
        })
    },
    removeNIC (item) {
      this.loadingNIC = true

      api('removeNicFromVirtualMachine', {
        response: 'json',
        nicid: item.id,
        virtualmachineid: this.vm.id
      }).then(response => {
        this.queryAsyncJobResult({
          jobId: response.removenicfromvirtualmachineresponse.jobid,
          successMessage: `Successfully removed`,
          successMethod: () => {
            this.loadingNIC = false
            this.parentFetchData()
          },
          errorMessage: `There was an error`,
          errorMethod: () => {
            this.loadingNIC = false
            this.parentFetchData()
          },
          loadingMessage: `Removing NIC...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.loadingNIC = false
            this.parentFetchData()
          }
        })
      })
        .catch(error => {
          this.$notification.error({
            message: `Error ${error.response.status}`,
            description: error.response.data.errorresponse.errortext
          })
          this.loadingNIC = false
        })
    },
    submitSecondaryIP () {
      this.loadingNIC = true

      api('addIpToNic', {
        response: 'json',
        nicid: this.selectedSecondaryIPNIC,
        ipaddress: this.newSecondaryIP
      }).then(response => {
        this.queryAsyncJobResult({
          jobId: response.addiptovmnicresponse.jobid,
          successMessage: `Successfully added secondary IP Address`,
          successMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          },
          errorMessage: `There was an error adding the secondary IP Address`,
          errorMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          },
          loadingMessage: `Add Secondary IP address...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          }
        })
      })
        .catch(error => {
          this.$notification.error({
            message: `Error ${error.response.status}`,
            description: error.response.data.addiptovmnicresponse.errortext
          })
          this.loadingNIC = false
        })
    },
    removeSecondaryIP (id) {
      this.loadingNIC = true

      api('removeIpFromNic', {
        response: 'json',
        id
      }).then(response => {
        this.queryAsyncJobResult({
          jobId: response.removeipfromnicresponse.jobid,
          successMessage: `Successfully removed secondary IP Address`,
          successMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          },
          errorMessage: `There was an error removing the secondary IP Address`,
          errorMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          },
          loadingMessage: `Removing Secondary IP address...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.loadingNIC = false
            this.closeModals()
            this.parentFetchData()
          }
        })
      })
        .catch(error => {
          this.$notification.error({
            message: `Error ${error.response.status}`,
            description: error.response.data.errorresponse.errortext
          })
          this.loadingNIC = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;
  .vm-detail {
    .svg-inline--fa {
      margin-left: -1px;
      margin-right: 8px;
    }
    span {
      margin-left: 10px;
    }
    margin-bottom: 8px;
  }
}

  .list {
    margin-top: 20px;

    &__item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      @media (min-width: 760px) {
        flex-direction: row;
        align-items: center;
      }

    }

  }

  .modal-form {
    display: flex;
    flex-direction: column;

    &__label {
      margin-top: 20px;
      margin-bottom: 5px;
      font-weight: bold;

      &--no-margin {
        margin-top: 0;
      }

    }

  }

  .actions {
    display: flex;
    margin-left: -24px;

    button {

      &:not(:last-child) {
        margin-right: 10px;
      }

    }

    @media (min-width: 760px) {
      flex-direction: column;
      margin-left: 24px;

      button {

        &:not(:last-child) {
          margin-bottom: 10px;
          margin-right: 0;
        }

      }

    }

  }
</style>

<style lang="scss">
  .wide-modal {
    min-width: 60vw;
  }
</style>

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
      <a-col :md="24" :lg="17">
        <a-card :bordered="true" :title="this.$t('newInstance')">
          <a-form
            :form="form"
            @submit="handleSubmit"
            layout="vertical"
          >
            <a-steps direction="vertical" size="small">
              <a-step :title="this.$t('BasicSetup')" status="process">
                <template slot="description">
                  <div style="margin-top: 15px">
                    <a-form-item :label="this.$t('name')">
                      <a-input
                        v-decorator="['name']"
                        :placeholder="apiParams.name.description"
                      />
                    </a-form-item>
                    <a-form-item :label="this.$t('zoneid')">
                      <a-select
                        v-decorator="['zoneid', {
                          rules: [{ required: true, message: 'Please select option' }]
                        }]"
                        :placeholder="apiParams.zoneid.description"
                        :options="zoneSelectOptions"
                        @change="onSelectZoneId"
                        :loading="loading.zones"
                      ></a-select>
                    </a-form-item>
                    <a-form-item :label="this.$t('podId')">
                      <a-select
                        v-decorator="['podid']"
                        :placeholder="apiParams.podid.description"
                        :options="podSelectOptions"
                        :loading="loading.pods"
                      ></a-select>
                    </a-form-item>
                    <a-form-item :label="this.$t('clusterid')">
                      <a-select
                        v-decorator="['clusterid']"
                        :placeholder="apiParams.clusterid.description"
                        :options="clusterSelectOptions"
                        :loading="loading.clusters"
                      ></a-select>
                    </a-form-item>
                    <a-form-item :label="this.$t('hostId')">
                      <a-select
                        v-decorator="['hostid']"
                        :placeholder="apiParams.hostid.description"
                        :options="hostSelectOptions"
                        :loading="loading.hosts"
                      ></a-select>
                    </a-form-item>
                  </div>
                </template>
              </a-step>
              <a-step
                :title="this.$t('templateIso')"
                :status="zoneSelected ? 'process' : 'wait'">
                <template slot="description">
                  <div v-if="zoneSelected">
                    <a-collapse
                      :accordion="true"
                      defaultActiveKey="templates"
                      @change="onTemplatesIsosCollapseChange"
                    >
                      <a-collapse-panel :header="this.$t('Templates')" key="templates">
                        <template-iso-selection
                          input-decorator="templateid"
                          :items="options.templates"
                          :loading="loading.templates"
                        ></template-iso-selection>
                        <disk-size-selection input-decorator="rootdisksize" />
                      </a-collapse-panel>

                      <a-collapse-panel :header="this.$t('ISOs')" key="isos">
                        <template-iso-selection
                          input-decorator="isoid"
                          :items="options.isos"
                          :loading="loading.isos"
                        ></template-iso-selection>
                      </a-collapse-panel>
                    </a-collapse>
                  </div>
                </template>
              </a-step>
              <a-step
                :title="this.$t('serviceOfferingId')"
                :status="zoneSelected ? 'process' : 'wait'">
                <template slot="description">
                  <div v-if="zoneSelected">
                    <compute-selection
                      :compute-items="options.serviceOfferings"
                      :value="serviceOffering ? serviceOffering.id : ''"
                      :loading="loading.serviceOfferings"
                      @select-compute-item="($event) => updateComputeOffering($event)"
                      @handle-search-filter="($event) => handleSearchFilter('serviceOfferings', $event)"
                    ></compute-selection>
                  </div>
                </template>
              </a-step>
              <a-step
                :title="this.$t('diskOfferingId')"
                :status="zoneSelected ? 'process' : 'wait'">
                <template slot="description">
                  <div v-if="zoneSelected">
                    <disk-offering-selection
                      :items="options.diskOfferings"
                      :value="diskOffering ? diskOffering.id : ''"
                      :loading="loading.diskOfferings"
                      @select-disk-offering-item="($event) => updateDiskOffering($event)"
                      @handle-search-filter="($event) => handleSearchFilter('diskOfferings', $event)"
                    ></disk-offering-selection>
                    <disk-size-selection
                      v-if="diskOffering && diskOffering.iscustomized"
                      input-decorator="size"
                    ></disk-size-selection>
                  </div>
                </template>
              </a-step>
              <a-step
                :title="this.$t('Affinity Groups')"
                :status="zoneSelected ? 'process' : 'wait'">
                <template slot="description">
                  <div v-if="zoneSelected">
                    <affinity-group-selection
                      :items="options.affinityGroups"
                      :value="affinityGroupIds"
                      :loading="loading.affinityGroups"
                      @select-affinity-group-item="($event) => updateAffinityGroups($event)"
                      @handle-search-filter="($event) => handleSearchFilter('affinityGroups', $event)"
                    ></affinity-group-selection>
                  </div>
                </template>
              </a-step>
              <a-step
                :title="this.$t('networks')"
                :status="zoneSelected ? 'process' : 'wait'">
                <template slot="description">
                  <div v-if="zoneSelected">
                    <network-selection
                      :items="options.networks"
                      :value="networkOfferingIds"
                      :loading="loading.networks"
                      :zoneId="zoneId"
                      @select-network-item="($event) => updateNetworks($event)"
                      @handle-search-filter="($event) => handleSearchFilter('networks', $event)"
                    ></network-selection>
                    <network-configuration
                      v-if="networks.length > 0"
                      :items="networks"
                    ></network-configuration>
                  </div>
                </template>
              </a-step>
              <a-step
                :title="this.$t('sshKeyPairs')"
                :status="zoneSelected ? 'process' : 'wait'">
                <template slot="description">
                  <div v-if="zoneSelected">
                    <ssh-key-pair-selection
                      :items="options.sshKeyPairs"
                      :value="sshKeyPair ? sshKeyPair.name : ''"
                      :loading="loading.sshKeyPairs"
                      @select-ssh-key-pair-item="($event) => updateSshKeyPairs($event)"
                      @handle-search-filter="($event) => handleSearchFilter('sshKeyPairs', $event)"
                    />
                  </div>
                </template>
              </a-step>
            </a-steps>
            <div class="card-footer">
              <!-- ToDo extract as component -->
              <a-button @click="() => this.$router.back()" :loading="loading.deploy">
                {{ this.$t('cancel') }}
              </a-button>
              <a-button type="primary" @click="handleSubmit" :loading="loading.deploy">
                <a-icon type="poweroff" />
                {{ this.$t('Launch VM') }}
              </a-button>
            </div>
          </a-form>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="7" v-if="!isMobile()">
        <a-affix :offsetTop="75">
          <info-card :resource="vm" :title="this.$t('yourInstance')">
            <!-- ToDo: Refactor this, maybe move everything to the info-card component -->
            <div slot="details" v-if="diskSize" style="margin-bottom: 12px;">
              <a-icon type="hdd"></a-icon>
              <span style="margin-left: 10px">{{ diskSize }}</span>
            </div>
            <div slot="details" v-if="networks">
              <div v-for="network in networks" :key="network.id" style="margin-bottom: 12px;">
                <a-icon type="api"></a-icon>
                <span style="margin-left: 10px">{{ network.name }}</span>
              </div>
            </div>
          </info-card>
        </a-affix>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { api } from '@/api'
import _ from 'lodash'
import { mixin, mixinDevice } from '@/utils/mixin.js'
import store from '@/store'

import InfoCard from '@/components/view/InfoCard'
import ComputeSelection from './wizard/ComputeSelection'
import DiskOfferingSelection from '@views/compute/wizard/DiskOfferingSelection'
import DiskSizeSelection from '@views/compute/wizard/DiskSizeSelection'
import TemplateIsoSelection from '@views/compute/wizard/TemplateIsoSelection'
import AffinityGroupSelection from '@views/compute/wizard/AffinityGroupSelection'
import NetworkSelection from '@views/compute/wizard/NetworkSelection'
import NetworkConfiguration from '@views/compute/wizard/NetworkConfiguration'
import NetworkCreation from '@views/compute/wizard/NetworksCreation'
import SshKeyPairSelection from '@views/compute/wizard/SshKeyPairSelection'

export default {
  name: 'Wizard',
  components: {
    SshKeyPairSelection,
    NetworkCreation,
    NetworkConfiguration,
    NetworkSelection,
    AffinityGroupSelection,
    TemplateIsoSelection,
    DiskSizeSelection,
    DiskOfferingSelection,
    InfoCard,
    ComputeSelection
  },
  props: {
    visible: {
      type: Boolean
    }
  },
  mixins: [mixin, mixinDevice],
  data () {
    return {
      zoneId: '',
      zoneSelected: false,
      vm: {},
      options: {
        templates: [],
        isos: [],
        serviceOfferings: [],
        diskOfferings: [],
        zones: [],
        affinityGroups: [],
        networks: [],
        sshKeyPairs: [],
        pods: [],
        clusters: [],
        hosts: []
      },
      loading: {
        deploy: false,
        templates: false,
        isos: false,
        serviceOfferings: false,
        diskOfferings: false,
        affinityGroups: false,
        networks: false,
        sshKeyPairs: false,
        zones: false,
        pods: false,
        clusters: false,
        hosts: false
      },
      instanceConfig: [],
      template: {},
      iso: {},
      serviceOffering: {},
      diskOffering: {},
      affinityGroups: [],
      networks: [],
      networksAdd: [],
      zone: {},
      sshKeyPair: {},
      isoFilter: [
        'executable',
        'selfexecutable',
        'sharedexecutable'
      ],
      templateIsoKey: '',
      steps: {
        BASIC: 0,
        TEMPLATE_ISO: 1,
        COMPUTE: 2,
        DISK_OFFERING: 3,
        AFFINITY_GROUP: 4,
        NETWORK: 5,
        SSH_KEY_PAIR: 6
      },
      initDataConfig: {}
    }
  },
  computed: {
    diskSize () {
      const rootDiskSize = _.get(this.instanceConfig, 'rootdisksize', 0)
      const customDiskSize = _.get(this.instanceConfig, 'size', 0)
      const diskOfferingDiskSize = _.get(this.diskOffering, 'disksize', 0)
      const dataDiskSize = diskOfferingDiskSize > 0 ? diskOfferingDiskSize : customDiskSize
      const size = []
      if (rootDiskSize > 0) {
        size.push(`${rootDiskSize} GB (Root)`)
      }
      if (dataDiskSize > 0) {
        size.push(`${dataDiskSize} GB (Data)`)
      }
      return size.join(' | ')
    },
    affinityGroupIds () {
      return _.map(this.affinityGroups, 'id')
    },
    params () {
      return {
        templates: {
          list: 'listTemplates',
          options: {
            templatefilter: 'executable',
            zoneid: _.get(this.zone, 'id')
          }
        },
        serviceOfferings: {
          list: 'listServiceOfferings',
          options: {
            zoneid: _.get(this.zone, 'id'),
            issystem: false,
            page: 1,
            pageSize: 10,
            keyword: undefined
          }
        },
        diskOfferings: {
          list: 'listDiskOfferings',
          options: {
            zoneid: _.get(this.zone, 'id'),
            page: 1,
            pageSize: 10,
            keyword: undefined
          }
        },
        zones: {
          list: 'listZones'
        },
        affinityGroups: {
          list: 'listAffinityGroups',
          options: {
            page: 1,
            pageSize: 10,
            keyword: undefined
          }
        },
        sshKeyPairs: {
          list: 'listSSHKeyPairs',
          options: {
            zoneid: _.get(this.zone, 'id'),
            page: 1,
            pageSize: 10,
            keyword: undefined
          }
        },
        networks: {
          list: 'listNetworks',
          options: {
            zoneid: _.get(this.zone, 'id'),
            canusefordeploy: true,
            projectid: store.getters.project.id,
            page: 1,
            pageSize: 10,
            keyword: undefined
          }
        },
        pods: {
          list: 'listPods',
          options: {
            zoneid: _.get(this.zone, 'id')
          }
        },
        clusters: {
          list: 'listClusters',
          options: {
            zoneid: _.get(this.zone, 'id')
          }
        },
        hosts: {
          list: 'listHosts',
          options: {
            zoneid: _.get(this.zone, 'id'),
            state: 'Up',
            type: 'Routing'
          }
        }
      }
    },
    networkOfferingIds () {
      return _.map(this.networks, 'id')
    },
    zoneSelectOptions () {
      return this.options.zones.map((zone) => {
        return {
          label: zone.name,
          value: zone.id
        }
      })
    },
    podSelectOptions () {
      return this.options.pods.map((pod) => {
        return {
          label: pod.name,
          value: pod.id
        }
      })
    },
    clusterSelectOptions () {
      return this.options.clusters.map((cluster) => {
        return {
          label: cluster.name,
          value: cluster.id
        }
      })
    },
    hostSelectOptions () {
      return this.options.hosts.map((host) => {
        return {
          label: host.name,
          value: host.id
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'deployVirtualMachine') {
        this.resetData()
      }
    },
    instanceConfig (instanceConfig) {
      this.template = _.find(this.options.templates, (option) => option.id === instanceConfig.templateid)
      this.iso = _.find(this.options.isos, (option) => option.id === instanceConfig.isoid)
      this.serviceOffering = _.find(this.options.serviceOfferings, (option) => option.id === instanceConfig.computeofferingid)
      this.diskOffering = _.find(this.options.diskOfferings, (option) => option.id === instanceConfig.diskofferingid)
      this.zone = _.find(this.options.zones, (option) => option.id === instanceConfig.zoneid)
      this.affinityGroups = _.filter(this.options.affinityGroups, (option) => _.includes(instanceConfig.affinitygroupids, option.id))
      this.networks = _.filter(this.options.networks, (option) => _.includes(instanceConfig.networkids, option.id))
      this.sshKeyPair = _.find(this.options.sshKeyPairs, (option) => option.name === instanceConfig.keypair)

      if (this.zone) {
        this.vm.zoneid = this.zone.id
        this.vm.zonename = this.zone.name
      }

      if (this.template) {
        this.vm.templateid = this.template.id
        this.vm.templatename = this.template.displaytext
        this.vm.ostypeid = this.template.ostypeid
        this.vm.ostypename = this.template.ostypename
      }

      if (this.iso) {
        this.vm.templateid = this.iso.id
        this.vm.templatename = this.iso.displaytext
        this.vm.ostypeid = this.iso.ostypeid
        this.vm.ostypename = this.iso.ostypename
      }

      if (this.serviceOffering) {
        this.vm.serviceofferingid = this.serviceOffering.id
        this.vm.serviceofferingname = this.serviceOffering.displaytext
        this.vm.cpunumber = this.serviceOffering.cpunumber
        this.vm.cpuspeed = this.serviceOffering.cpuspeed
        this.vm.memory = this.serviceOffering.memory
      }

      if (this.diskOffering) {
        this.vm.diskofferingid = this.diskOffering.id
        this.vm.diskofferingname = this.diskOffering.displaytext
        this.vm.diskofferingsize = this.diskOffering.disksize
      }

      if (this.affinityGroups) {
        this.vm.affinitygroup = this.affinityGroups
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      onValuesChange: (props, fields) => {
        if (fields.isoid) {
          this.form.setFieldsValue({
            templateid: null,
            rootdisksize: 0
          })
        } else if (fields.templateid) {
          this.form.setFieldsValue({ isoid: null })
        }
        this.instanceConfig = { ...this.form.getFieldsValue(), ...fields }
        this.vm = this.instanceConfig
      }
    })
    this.form.getFieldDecorator('computeofferingid', { initialValue: undefined, preserve: true })
    this.form.getFieldDecorator('diskofferingid', { initialValue: undefined, preserve: true })
    this.form.getFieldDecorator('affinitygroupids', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('isoid', { initialValue: undefined, preserve: true })
    this.form.getFieldDecorator('networkids', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('keypair', { initialValue: undefined, preserve: true })
    this.apiParams = {}
    this.apiDeployVirtualMachine = this.$store.getters.apis.deployVirtualMachine || {}
    this.apiDeployVirtualMachine.params.forEach(param => {
      this.apiParams[param.name] = param
    })
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchOptions(this.params.zones, 'zones')
      this.fetchOptions(this.params.pods, 'pods')
      this.fetchOptions(this.params.clusters, 'clusters')
      this.fetchOptions(this.params.hosts, 'hosts')
      Vue.nextTick().then(() => {
        this.instanceConfig = this.form.getFieldsValue() // ToDo: maybe initialize with some other defaults
      })
    },
    resetData () {
      this.vm = {}
      this.zoneSelected = false
      this.form.resetFields()
      this.fetchData()
    },
    updateComputeOffering (id) {
      this.form.setFieldsValue({
        computeofferingid: id
      })
    },
    updateDiskOffering (id) {
      this.form.setFieldsValue({
        diskofferingid: id
      })
    },
    updateAffinityGroups (ids) {
      this.form.setFieldsValue({
        affinitygroupids: ids
      })
    },
    updateNetworks (ids) {
      this.form.setFieldsValue({
        networkids: ids
      })
    },
    updateSshKeyPairs (name) {
      this.form.setFieldsValue({
        keypair: name
      })
    },
    getText (option) {
      return _.get(option, 'displaytext', _.get(option, 'name'))
    },
    handleSubmit (e) {
      console.log('wizard submit')
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const deployVmData = {}
        // step 1 : select zone
        deployVmData.zoneid = values.zoneid
        deployVmData.podid = values.podid
        deployVmData.clusterid = values.clusterid
        deployVmData.hostid = values.hostid
        // step 2: select template/iso
        if (this.templateIsoKey === 'templates') {
          deployVmData.templateid = values.templateid
        } else {
          deployVmData.templateid = values.templateid
        }
        if (values.rootdisksize && values.rootdisksize > 0) {
          deployVmData.rootdisksize = values.rootdisksize
        }
        // step 3: select service offering
        deployVmData.serviceofferingid = values.computeofferingid
        // step 4: select disk offering
        deployVmData.diskofferingid = values.diskofferingid
        if (values.size) {
          deployVmData.size = values.size
        }
        // step 5: select an affinity group
        deployVmData.affinitygroupids = values.affinitygroupids.join(',')
        // step 6: select network
        if (values.networkids && values.networkids.length > 0) {
          for (let i = 0; i < values.networkids.length; i++) {
            deployVmData['iptonetworklist[' + i + '].networkid'] = values.networkids[i]
          }
        }
        // step 7: select ssh key pair
        deployVmData.keypair = values.keypair
        deployVmData.name = values.name
        deployVmData.displayname = values.name
        const title = this.$t('Launch Virtual Machine')
        const description = this.$t('zone') + ' ' + values.zoneid
        this.loading.deploy = true
        api('deployVirtualMachine', deployVmData).then(response => {
          const jobId = response.deployvirtualmachineresponse.jobid
          if (jobId) {
            this.$pollJob({
              jobId,
              successMethod: result => {
                const successDescription = result.jobresult.snapshot.name
                this.$store.dispatch('AddAsyncJob', {
                  title: title,
                  jobid: jobId,
                  description: successDescription,
                  status: 'progress'
                })
              },
              loadingMessage: `${title} in progress for ${description}`,
              catchMessage: 'Error encountered while fetching async job result'
            })
          }
          this.$router.back()
        }).catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
          })
        }).finally(() => {
          this.loading.deploy = false
        })
      })
    },
    fetchOptions (param, name) {
      this.loading[name] = true
      param.loading = true
      param.opts = []
      const options = param.options || {}
      options.listall = true
      api(param.list, options).then((response) => {
        param.loading = false
        _.map(response, (responseItem, responseKey) => {
          if (Object.keys(responseItem).length === 0) {
            this.options[name] = []
            this.$forceUpdate()
            return
          }
          if (!responseKey.includes('response')) {
            return
          }
          _.map(responseItem, (response, key) => {
            if (key === 'count') {
              return
            }
            param.opts = response
            this.options[name] = response
            this.$forceUpdate()
          })
        })
      }).catch(function (error) {
        console.log(error.stack)
        param.loading = false
      }).finally(() => {
        this.loading[name] = false
      })
    },
    fetchIsos (isoFilter) {
      return new Promise((resolve, reject) => {
        api('listIsos', {
          zoneid: _.get(this.zone, 'id'),
          isofilter: isoFilter,
          bootable: true
        }).then((response) => {
          resolve(response)
        }).catch((reason) => {
          // ToDo: Handle errors
          reject(reason)
        })
      })
    },
    fetchAllIsos () {
      const promises = []
      this.options.isos = []
      this.loading.isos = true
      this.isoFilter.forEach((filter) => {
        promises.push(this.fetchIsos(filter))
      })
      Promise.all(promises).then(response => {
        response.forEach((resItem) => {
          const concatedIsos = _.concat(this.options.isos, _.get(resItem, 'listisosresponse.iso', []))
          this.options.isos = _.uniqWith(concatedIsos, _.isEqual)
          this.$forceUpdate()
        })
      }).catch((reason) => {
        console.log(reason)
      }).finally(() => {
        this.loading.isos = false
      })
    },
    onSelectZoneId (value) {
      this.zoneId = value
      this.zoneSelected = true
      _.each(this.params, this.fetchOptions)
    },
    onTemplatesIsosCollapseChange (key) {
      if (key === 'isos' && this.options.isos.length === 0) {
        this.fetchAllIsos()
      }
    },
    handleSearchFilter (name, options) {
      this.params[name].options = { ...options }
      this.fetchOptions(this.params[name], name)
    }
  }
}
</script>

<style lang="less" scoped>
  .card-footer {
    text-align: right;
    margin-top: 2rem;

    button + button {
      margin-left: 8px;
    }
  }

  .ant-list-item-meta-avatar {
    font-size: 1rem;
  }

  .ant-collapse {
    margin: 2rem 0;
  }
</style>

<style lang="less">
  @import url('../../style/index');

  .ant-table-selection-column {
    // Fix for the table header if the row selection use radio buttons instead of checkboxes
    > div:empty {
      width: 16px;
    }
  }

  .ant-collapse-borderless > .ant-collapse-item {
    border: 1px solid @border-color-split;
    border-radius: @border-radius-base !important;
    margin: 0 0 1.2rem;
  }
</style>

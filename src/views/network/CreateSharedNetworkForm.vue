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
  <a-spin :spinning="loading">
    <div class="form-layout">
      <label>
        {{ 'Isolated Network' }}
      </label>
      <div class="form">
        <a-form
          :form="form"
          layout="vertical"
          @submit="handleSubmit">
          <a-form-item :label="$t('name')">
            <a-input
              v-decorator="['name', {
                rules: [{ required: true, message: 'Please enter name' }]
              }]"
              :placeholder="this.$t('Name')"/>
          </a-form-item>
          <a-form-item :label="$t('displaytext')">
            <a-input
              v-decorator="['displaytext', {
                rules: [{ required: true, message: 'Please enter display text' }]
              }]"
              :placeholder="this.$t('Display text')"/>
          </a-form-item>
          <a-form-item :label="$t('label.zoneid')">
            <a-select
              v-decorator="['zoneid', {
                rules: [
                  {
                    required: true,
                    message: 'Please select option'
                  }
                ]
              }]"
              showSearch
              optionFilterProp="children"
              :filterOption="(input, option) => {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }"
              :loading="zoneLoading"
              :placeholder="this.$t('label.zoneid')"
              @change="val => { this.handleZoneChanged(this.zones[val]) }">
              <a-select-option v-for="(opt, optIndex) in this.zones" :key="optIndex">
                {{ opt.name || opt.description }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('label.physical.network')">
            <a-select
              v-decorator="['physicalnetworkid', {
                rules: [
                  {
                    required: true,
                    message: 'Please select option'
                  }
                ]
              }]"
              showSearch
              optionFilterProp="children"
              :filterOption="(input, option) => {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }"
              :loading="zoneLoading"
              :placeholder="this.$t('label.physical.network')"
              @change="val => { this.handleZoneChanged(this.formPhysicalNetworks[val]) }">
              <a-select-option v-for="(opt, optIndex) in this.formPhysicalNetworks" :key="optIndex">
                {{ opt.name || opt.description }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('label.vlan.id')">
            <a-input
              v-decorator="['vlanid', {
                rules: [{ required: true, message: 'Please enter value' }]
              }]"
              :placeholder="this.$t('label.vlan.id')"/>
          </a-form-item>
          <a-form-item :label="$t('label.bypass.vlan.overlap.check')">
            <a-switch v-decorator="['bypassvlanoverlapcheck']" />
          </a-form-item>
          <a-form-item :label="$t('label.secondary.isolated.vlan.id')">
            <a-input
              v-decorator="['isolatedpvlanid', {}]"
              :placeholder="this.$t('label.secondary.isolated.vlan.id')"/>
          </a-form-item>
          <a-form-item :label="$t('label.scope')">
            <a-radio-group
              v-decorator="['scope', {
                initialValue: this.scopeType
              }]"
              buttonStyle="solid"
              @change="selected => { this.scopeType = selected.target.value }">
              <a-radio-button value="all">
                {{ $t('All') }}
              </a-radio-button>
              <a-radio-button value="domain" v-if="!this.parseBooleanValueForKey(this.selectedZone, 'securitygroupsenabled')">
                {{ $t('Domain') }}
              </a-radio-button>
              <a-radio-button value="account" v-if="!this.parseBooleanValueForKey(this.selectedZone, 'securitygroupsenabled')">
                {{ $t('Account') }}
              </a-radio-button>
              <a-radio-button value="project" v-if="!this.parseBooleanValueForKey(this.selectedZone, 'securitygroupsenabled')">
                {{ $t('Project') }}
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('label.domain')" v-if="this.scopeType === 'domain' || this.scopeType === 'account'">
            <a-select
              v-decorator="['domainid', {}]"
              showSearch
              optionFilterProp="children"
              :filterOption="(input, option) => {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }"
              :loading="domainLoading"
              :placeholder="this.$t('label.domain')"
              @change="val => { this.handleDomainChange(this.domains[val]) }">
              <a-select-option v-for="(opt, optIndex) in this.domains" :key="optIndex">
                {{ opt.name || opt.description }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('label.subdomain.access')" v-if="this.scopeType === 'domain'">
            <a-switch v-decorator="['subdomainaccess']" />
          </a-form-item>
          <a-form-item :label="$t('label.account')" v-if="this.scopeType === 'account'">
            <a-input
              v-decorator="['account', {}]"
              :placeholder="this.$t('label.account')"/>
          </a-form-item>
          <a-form-item :label="$t('label.project')" v-if="this.scopeType === 'project'">
            <a-select
              v-decorator="['projectid', {}]"
              showSearch
              optionFilterProp="children"
              :filterOption="(input, option) => {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }"
              :loading="domainLoading"
              :placeholder="this.$t('label.project')"
              @change="val => { this.handleDomainChange(this.domains[val]) }">
              <a-select-option v-for="(opt, optIndex) in this.domains" :key="optIndex">
                {{ opt.name || opt.description }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('label.networkofferingid')">
            <a-select
              v-decorator="['networkofferingid', {
                rules: [
                  {
                    required: true,
                    message: 'Please select option'
                  }
                ]
              }]"
              showSearch
              optionFilterProp="children"
              :filterOption="(input, option) => {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }"
              :loading="networkOfferingLoading"
              :placeholder="this.$t('label.networkofferingid')"
              @change="val => { this.handleNetworkOfferingChange(this.networkOfferings[val]) }">
              <a-select-option v-for="(opt, optIndex) in this.networkOfferings" :key="optIndex">
                {{ opt.name || opt.description }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('label.ipv4.gateway')">
            <a-input
              v-decorator="['ip4gateway', {}]"
              :placeholder="this.$t('label.ipv4.gateway')"/>
          </a-form-item>
          <a-form-item :label="$t('label.ipv4.netmask')">
            <a-input
              v-decorator="['ip4netmask', {}]"
              :placeholder="this.$t('label.ipv4.netmask')"/>
          </a-form-item>
          <a-form-item :label="$t('label.ipv4.start.ip')">
            <a-input
              v-decorator="['startipv4', {}]"
              :placeholder="this.$t('label.ipv4.start.ip')"/>
          </a-form-item>
          <a-form-item :label="$t('label.ipv4.end.ip')">
            <a-input
              v-decorator="['endipv4', {}]"
              :placeholder="this.$t('label.ipv4.end.ip')"/>
          </a-form-item>
          <a-form-item :label="$t('label.ipv6.gateway')">
            <a-input
              v-decorator="['ip6gateway', {}]"
              :placeholder="this.$t('label.ipv6.gateway')"/>
          </a-form-item>
          <a-form-item :label="$t('label.ipv6.netmask')">
            <a-input
              v-decorator="['ip6netmask', {}]"
              :placeholder="this.$t('label.ipv6.netmask')"/>
          </a-form-item>
          <a-form-item :label="$t('label.ipv6.start.ip')">
            <a-input
              v-decorator="['startipv6', {}]"
              :placeholder="this.$t('label.ipv6.start.ip')"/>
          </a-form-item>
          <a-form-item :label="$t('label.ipv6.end.ip')">
            <a-input
              v-decorator="['endipv6', {}]"
              :placeholder="this.$t('label.ipv6.end.ip')"/>
          </a-form-item>
          <a-form-item :label="$t('label.network.domain')">
            <a-input
              v-decorator="['networkdomain', {}]"
              :placeholder="this.$t('label.network.domain')"/>
          </a-form-item>
          <a-form-item :label="$t('label.network.hideipaddressusage')">
            <a-switch v-decorator="['hideipaddressusage']" />
          </a-form-item>
          <div :span="24" class="action-button">
            <a-button
              :loading="actionLoading"
              @click="closeAction">
              {{ this.$t('Cancel') }}
            </a-button>
            <a-button
              :loading="actionLoading"
              type="primary"
              @click="handleSubmit">
              {{ this.$t('OK') }}
            </a-button>
          </div>
        </a-form>
      </div>
    </div>
  </a-spin>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'CreateSharedNetworkForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    resource: {
      type: Object,
      required: true
    },
    zone: {
      type: Object,
      default: null
    },
    physicalNetworks: {
      type: Array,
      default: null
    },
    vpc: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      actionLoading: false,
      zones: [],
      zoneLoading: false,
      selectedZone: {},
      formPhysicalNetworks: [],
      formPhysicalNetworkLoading: false,
      formSelectedPhysicalNetwork: {},
      scopeType: 'all',
      domains: [],
      domainLoading: false,
      selectedDomain: {},
      networkOfferings: [],
      networkOfferingLoading: false,
      selectedNetworkOffering: {},
      projects: [],
      projectLoading: false,
      selectedProject: {},
      accountVisible: this.isAdminOrDomainAdmin()
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.domains = [
      {
        id: '-1',
        name: ' '
      }
    ]
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchZoneData()
    },
    isAdmin () {
      return ['Admin'].includes(this.$store.getters.userInfo.roletype)
    },
    isAdminOrDomainAdmin () {
      return ['Admin', 'DomainAdmin'].includes(this.$store.getters.userInfo.roletype)
    },
    isObjectEmpty (obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object
    },
    arrayHasItems (array) {
      return Array.isArray(array) && array.length > 0
    },
    isValidValueForKey (obj, key) {
      return key in obj && obj[key] != null
    },
    parseBooleanValueForKey (obj, key) {
      return this.isValidValueForKey(obj, key) && obj[key] === true
    },
    isValidTextValueForKey (obj, key) {
      return this.isValidValueForKey(obj, key) && obj[key].length > 0
    },
    fetchZoneData () {
      if (this.zone !== null) {
        this.zones = this.zones.concat(this.zone)
        if (this.arrayHasItems(this.zones)) {
          this.form.setFieldsValue({
            zoneid: 0
          })
          this.handleZoneChange(this.zones[0])
        }
      } else {
        const params = {}
        params.listAll = true
        this.zoneLoading = true
        api('listZones', params).then(json => {
          for (const i in json.listzonesresponse.zone) {
            const zone = json.listzonesresponse.zone[i]
            if (zone.networktype === 'Advanced') {
              this.zones = this.zones.concat(zone)
            }
          }
        }).finally(() => {
          this.zoneLoading = false
          if (this.arrayHasItems(this.zones)) {
            this.form.setFieldsValue({
              zoneid: 0
            })
            this.handleZoneChange(this.zones[0])
          }
        })
      }
    },
    handleZoneChange (zone) {
      this.selectedZone = zone
      this.fetchPhysicalNetworkData()
    },
    fetchPhysicalNetworkData () {
      if (this.physicalNetworks != null) {
        this.formPhysicalNetworks = this.physicalNetworks
        if (this.arrayHasItems(this.formPhysicalNetworks)) {
          this.form.setFieldsValue({
            physicalnetworkid: 0
          })
          this.handlePhysicalNetworkChange(this.formPhysicalNetworks[0])
        }
      } else {
        if (this.selectedZone === null || this.selectedZone === undefined) {
          return
        }
        const params = {}
        params.zoneid = this.selectedZone.id
        this.formPhysicalNetworksLoading = true
        api('listPhysicalNetworks', params).then(json => {
          this.formPhysicalNetworks = []
          var networks = json.listphysicalnetworksresponse.physicalnetwork
          if (this.arrayHasItems(networks)) {
            for (const i in networks) {
              this.addPhysicalNetworkForGuestTrafficType(networks[i], i === networks.length - 1)
            }
          } else {
            this.formPhysicalNetworkLoading = false
          }
        }).finally(() => {
        })
      }
    },
    addPhysicalNetworkForGuestTrafficType (physicalNetwork, isLastNetwork) {
      if (isLastNetwork) {
        this.form.setFieldsValue({
          zoneid: 0
        })
        this.handleZoneChange(this.zones[0])
      }
    },
    handleScopeTypeChange (scope) {
      this.scopeType = scope
      switch (scope) {
        case 'domain':
        {
          this.fetchDomainData()
          break
        }
        case 'account':
        {
          break
        }
        case 'project':
        {
          this.fertchProjectData()
          break
        }
        default:
        {
        }
      }
    },
    updateVPCCheckAndFetchNetworkOfferingData () {
      if (this.vpc !== null) { // from VPC section
        this.fetchNetworkOfferingData(true)
      } else { // from guest network section
        var params = {}
        this.networkOfferingLoading = true
        api('listVPCs', params).then(json => {
          const listVPCs = json.listvpcsresponse.vpc
          var vpcAvailable = this.arrayHasItems(listVPCs)
          if (vpcAvailable === false) {
            this.fetchNetworkOfferingData(false)
          } else {
            this.fetchNetworkOfferingData()
          }
        })
      }
    },
    fetchNetworkOfferingData () {
      if (this.selectedZone === null || this.selectedZone === undefined) {
        return
      }
      this.networkOfferingLoading = true
      var params = {
        zoneid: this.selectedZone.id,
        state: 'Enabled'
      }
      if (this.formSelectedPhysicalNetwork !== null &&
        this.formSelectedPhysicalNetwork !== undefined &&
        this.formSelectedPhysicalNetwork.tags !== null &&
        this.formSelectedPhysicalNetwork.tags.length > 0) {
        params.tags = this.formSelectedPhysicalNetwork.tags
      }
      // Network tab in Guest Traffic Type in Infrastructure menu is only available when it's under Advanced zone.
      // zone dropdown in add guest network dialog includes only Advanced zones.
      if (this.scopeType === 'zone' || this.scopeType === 'domain') {
        params.guestiptype = 'Shared'
        if (this.scopeType === 'domain') {
          params.domainid = this.selectedDomain.id
        }
      }
      api('listNetworkOfferings', params).then(json => {
        this.networkOfferings = json.listnetworkofferingsresponse.networkoffering
      }).finally(() => {
        this.networkOfferingLoading = false
        if (this.arrayHasItems(this.networkOfferings)) {
          this.form.setFieldsValue({
            networkofferingid: 0
          })
          this.handleNetworkOfferingChange(this.networkOfferings[0])
        }
      })
    },
    handleNetworkOfferingChange (networkOffering) {
      this.selectedNetworkOffering = networkOffering
    },
    fetchDomainData () {
      const params = {}
      params.listAll = true
      params.details = 'min'
      this.domainLoading = true
      api('listDomains', params).then(json => {
        const listDomains = json.listdomainsresponse.domain
        this.domains = this.domains.concat(listDomains)
      }).finally(() => {
        this.domainLoading = false
        this.form.setFieldsValue({
          domainid: 0
        })
        this.handleDomainChange(this.domains[0])
      })
    },
    handleDomainChange (domain) {
      this.selectedDomain = domain
      this.accountVisible = domain.id !== '-1'
      if (this.isAdminOrDomainAdmin) {
        this.fetchNetworkOfferingData()
      }
    },
    handleSubmit (e) {
      this.form.validateFields((error, values) => {
        if (error) {
          return
        }
        this.actionLoading = true
        var params = {
          zoneId: this.selectedZone.id,
          name: values.name,
          displayText: values.displaytext,
          networkOfferingId: this.selectedNetworkOffering.id
        }
        if (this.isValidTextValueForKey(values, 'vlanid')) {
          params.vlan = values.vlanid
        }
        if (this.isValidValueForKey(values, 'bypassvlanoverlapcheck')) {
          params.bypassvlanoverlapcheck = values.bypassvlanoverlapcheck
        }
        if ('domainid' in values && values.domainid > 0) {
          params.domainid = this.selectedDomain.id
          if (this.isValidTextValueForKey(values, 'account')) {
            params.account = values.account
          }
        }
        api('createNetwork', params).then(json => {
          this.$notification.success({
            message: 'Network',
            description: 'Successfully created L2 network'
          })
          this.resetForm()
        }).catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
          })
        }).finally(() => {
          this.actionLoading = false
          this.closeAction()
        })
      })
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },
    resetForm () {
      this.form.setFieldsValue({
      })
      this.tags = []
    },
    closeAction () {
      this.$emit('close-action')
    }
  }
}
</script>

<style lang="less" scoped>
.form-layout {
  .ant-tag {
    margin-bottom: 10px;
  }

  /deep/.custom-time-select .ant-time-picker {
    width: 100%;
  }

  /deep/.ant-divider-horizontal {
    margin-top: 0;
  }
}

.form {
  margin: 10px 0;
}

.tagsTitle {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
}

.action-button {
  text-align: right;

  button {
    margin-right: 5px;
  }
}
</style>

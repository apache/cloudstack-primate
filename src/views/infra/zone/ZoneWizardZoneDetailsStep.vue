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
    <a-form class="form-content" :form="form" @submit="handleSubmit">
      <a-form-item label="Name" v-bind="formItemLayout" has-feedback>
        <a-input
          v-decorator="['name', {
            rules: [{ required: true, message: 'Please enter zone name', initialValue: name }]
          }]"
        />
      </a-form-item>
      <a-form-item
        label="IpV4 DNS 1"
        v-bind="formItemLayout"
        has-feedback>
        <a-input
          v-decorator="['ipv4Dns1', {
            rules: [
              {
                required: true,
                message: 'Please enter IpV4 DNS 1',
                initialValue: ipv4Dns1
              },
              {
                validator: validateIPAddress,
                ipV4: true,
                message: 'Please enter a valid IP v4 address.'
              }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="IpV4 DNS 2" v-bind="formItemLayout" has-feedback>
        <a-input
          v-decorator="['ipv4Dns2', {
            rules: [
              {
                message: 'Please enter IpV4 DNS 2',
                initialValue: ipv4Dns2
              },
              {
                validator: validateIPAddress,
                ipV4: true,
                message: 'Please enter a valid IP v4 address.'
              }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item
        label="IpV6 DNS 1"
        v-bind="formItemLayout"
        v-if="isAdvancedZone && !securityGroupsEnabled"
        has-feedback>
        <a-input
          v-decorator="['ipv6Dns1', {
            rules: [
              {
                message: 'Please enter IpV6 DNS 1',
                initialValue: ipv6Dns1
              },
              {
                validator: validateIPAddress,
                ipV6: true,
                message: 'Please enter a valid IP v6 address.'
              }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item
        label="IpV6 DNS 2"
        v-bind="formItemLayout"
        v-if="isAdvancedZone && !securityGroupsEnabled"
        has-feedback>
        <a-input
          v-decorator="['ipv6Dns2', {
            rules: [
              {
                message: 'Please enter IpV6 DNS 2',
                initialValue: ipv6Dns2
              },
              {
                validator: validateIPAddress,
                ipV6: true,
                message: 'Please enter a valid IP v6 address.'
              }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="Internal DNS 1" v-bind="formItemLayout" has-feedback>
        <a-input
          v-decorator="['internalDns1', {
            rules: [
              {
                required: true,
                message: 'Please enter Internal DNS 1',
                initialValue: internalDns1
              },
              {
                validator: validateIPAddress,
                ipV4: true,
                message: 'Please enter a valid IP v4 address.'
              }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="Internal DNS 2" v-bind="formItemLayout" has-feedback>
        <a-input
          v-decorator="['internalDns2', {
            rules: [
              {
                message: 'Please enter Internal DNS 2',
                initialValue: internalDns2
              },
              {
                validator: validateIPAddress,
                ipV4: true,
                message: 'Please enter a valid IP v4 address.'
              }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Hypervisor" has-feedback>
        <a-select
          :loading="hypervisors === null"
          showSearch
          v-decorator="[
            'hypervisor',
            { rules: [{ required: true, message: 'Please select hypervisor type', initialValue: currentHypervisor }] },
          ]"
          placeholder="Please select hypervisor type"
        >
          <a-select-option v-for="hypervisor in hypervisors" :key="hypervisor.name">
            {{ hypervisor.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="Network Offering"
        has-feedback
        v-if="!isAdvancedZone || securityGroupsEnabled">
        <a-select
          :loading="availableNetworkOfferings === null"
          v-decorator="[
            'networkOfferingId',
            { rules: [{ message: 'Please select network offering', initialValue: currentNetworkOfferingId }] },
          ]"
          placeholder="Please select network offering"
        >
          <a-select-option
            v-for="networkOffering in availableNetworkOfferings"
            :key="networkOffering.id">
            {{ networkOffering.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Network Domain" v-bind="formItemLayout" has-feedback>
        <a-input
          v-decorator="['networkDomain', {
            rules: [{ message: 'Please enter Network domain', intialValue: networkDomain }]
          }]"
        />
      </a-form-item>
      <a-form-item
        label="Guest CIDR"
        v-bind="formItemLayout"
        v-if="isAdvancedZone && !securityGroupsEnabled"
        has-feedback>
        <a-input
          v-decorator="['guestcidraddress', {
            rules: [{ message: 'Please enter Guest CIDR', intialValue: guestcidraddress }]
          }]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Dedicated">
        <a-switch
          v-decorator="['isDedicated', { valuePropName: 'checked' }]"
          :value="isDedicated"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="Domains"
        has-feedback
        v-if="isDedicated">
        <a-select
          :loading="domains === null"
          v-decorator="['domainId', {
            rules: [{ message: 'Please select domain to dedicate to', initialValue: domain }]
          }]"
          placeholder="Please select domain to dedicate to"
        >
          <a-select-option v-for="dom in domains" :key="dom.id">
            {{ dom.path }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Account" v-bind="formItemLayout" v-if="isDedicated">
        <a-input
          v-decorator="['account', {
            rules: [{ message: 'Please enter account to dedicate to', intialValue: guestcidraddress }]
          }]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="User VMs Local Storage enabled">
        <a-switch
          v-decorator="['localstorageenabled', { valuePropName: 'checked' }]"
          :value="localstorageenabled"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="System VMs Local Storage enabled">
        <a-switch
          v-decorator="['localstorageenabledforsystemvm', { valuePropName: 'checked' }]"
          :value="localstorageenabledforsystemvm"
        />
      </a-form-item>
    </a-form>
    <div class="form-action">
      <a-button @click="handleBack" class="button-back">
        Back
      </a-button>
      <a-button type="primary" @click="handleSubmit" class="button-next">
        Next
      </a-button>
    </div>
  </div>
</template>

<script>

import { api } from '@/api'

export default {
  props: {
    prefillContent: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
    formItemLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    },
    hypervisors: null,
    networkOfferings: null,
    domains: null,
    baremetalProviders: ['BaremetalDhcpProvider', 'BaremetalPxeProvider', 'BaremetalUserdataProvider'],
    selectedBaremetalProviders: [],
    availableNetworkOfferings: null,
    ipV4Regex: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i,
    ipV6Regex: /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i
  }),
  created () {
    this.hypervisors = this.prefillContent.hypervisors ? this.prefillContent.hypervisors : null
    this.networkOfferings = this.prefillContent.networkOfferings ? this.prefillContent.networkOfferings : null
    this.form = this.$form.createForm(this, {
      onFieldsChange: (_, changedFields) => {
        if (this.networkOfferings && changedFields.networkOfferingId) {
          changedFields.networkOfferings = this.networkofferings
          changedFields.networkOfferingSelected = this.networkOfferings[changedFields.networkOfferingId.value]
        }
        if (this.hypervisors && changedFields.hypervisor) {
          changedFields.hypervisors = this.hypervisors
          this.availableNetworkOfferings = this.getAvailableNetworkOfferings(changedFields.hypervisor)
        }
        if (this.domains && changedFields.domain) {
          changedFields.domains = this.domains
        }
        this.$emit('fieldsChanged', changedFields)
      }
    })
  },
  mounted () {
    this.form.setFieldsValue({
      name: this.name,
      ipv4Dns1: this.ipv4Dns1,
      ipv4Dns2: this.ipv4Dns2,
      ipv6Dns1: this.ipv6Dns1,
      ipv6Dns2: this.ipv6Dns2,
      internalDns1: this.internalDns1,
      internalDns2: this.internalDns2,
      hypervisor: this.currentHypervisor,
      networkOfferingId: this.currentNetworkOfferingId,
      networkDomain: this.networkDomain,
      guestcidraddress: this.isAdvancedZone && !this.securityGroupsEnabled ? this.guestcidraddress : null,
      isDedicated: this.isDedicated,
      domain: this.domain,
      account: this.account,
      localstorageenabled: this.localstorageenabled,
      localstorageenabledforsystemvm: this.localstorageenabledforsystemvm
    })

    const cForm = this.form
    api('listHypervisors', { listAll: true }).then(json => {
      this.hypervisors = json.listhypervisorsresponse.hypervisor
      cForm.setFieldsValue({
        hypervisor: this.currentHypervisor
      })
    })

    if (!this.isAdvancedZone || this.securityGroupsEnabled) {
      api('listNetworkOfferings', { state: 'Enabled', guestiptype: 'Shared' }).then(json => {
        this.networkOfferings = {}
        json.listnetworkofferingsresponse.networkoffering.forEach(offering => {
          this.setupNetworkOfferingAdditionalFlags(offering)
          this.networkOfferings[offering.id] = offering
        })
        this.availableNetworkOfferings = this.getAvailableNetworkOfferings(this.currentHypervisor)
        cForm.setFieldsValue({
          networkOfferingId: this.currentNetworkOfferingId
        })
      })
    }

    api('listDomains', { listAll: true }).then(json => {
      this.domains = {}
      json.listdomainsresponse.domain.forEach(dom => {
        this.domains[dom.id] = dom
      })
      cForm.setFieldsValue({
        domain: this.domain
      })
    })
  },
  computed: {
    isAdvancedZone () {
      return this.zoneType === 'Advanced'
    },
    zoneType () {
      return this.prefillContent.zoneType ? this.prefillContent.zoneType.value : null
    },
    securityGroupsEnabled () {
      return this.isAdvancedZone && (this.prefillContent.securityGroupsEnabled ? this.prefillContent.securityGroupsEnabled.value : false)
    },
    name () {
      return this.prefillContent.name ? this.prefillContent.name.value : null
    },
    ipv4Dns1 () {
      return this.prefillContent.ipv4Dns1 ? this.prefillContent.ipv4Dns1.value : null
    },
    ipv4Dns2 () {
      return this.prefillContent.ipv4Dns2 ? this.prefillContent.ipv4Dns2.value : null
    },
    ipv6Dns1 () {
      return this.prefillContent.ipv6Dns1 ? this.prefillContent.ipv6Dns1.value : null
    },
    ipv6Dns2 () {
      return this.prefillContent.ipv6Dns2 ? this.prefillContent.ipv6Dns2.value : null
    },
    internalDns1 () {
      return this.prefillContent.internalDns1 ? this.prefillContent.internalDns1.value : null
    },
    internalDns2 () {
      return this.prefillContent.internalDns2 ? this.prefillContent.internalDns2.value : null
    },
    currentHypervisor () {
      if (this.prefillContent.hypervisor) {
        return this.prefillContent.hypervisor.value
      } else if (this.hypervisors && this.hypervisors.length > 0) {
        return this.hypervisors[0]
      }
      return null
    },
    currentNetworkOfferingId () {
      const lastNetworkOfferingId = this.prefillContent.networkOfferingId ? this.prefillContent.networkOfferingId.value : null
      if (this.networkOfferings) {
        if (lastNetworkOfferingId !== null && this.networkOfferings[lastNetworkOfferingId]) {
          return lastNetworkOfferingId
        }
        return this.availableNetworkOfferings[0].id
      }
      return null
    },
    networkDomain () {
      return this.prefillContent.networkDomain ? this.prefillContent.networkDomain.value : null
    },
    guestcidraddress () {
      return this.prefillContent.guestcidraddress ? this.prefillContent.guestcidraddress.value : '10.1.1.0/24'
    },
    isDedicated () {
      return this.prefillContent.isDedicated ? this.prefillContent.isDedicated.value : false
    },
    domain () {
      const lastDomainId = this.prefillContent.domainId ? this.prefillContent.domainId.value : null
      if (this.domains !== null && lastDomainId !== null && this.domains[lastDomainId]) {
        return lastDomainId
      }
      return null
    },
    account () {
      return this.prefillContent.account ? this.prefillContent.account.value : null
    },
    localstorageenabled () {
      return this.prefillContent.localstorageenabled ? this.prefillContent.localstorageenabled.value : false
    },
    localstorageenabledforsystemvm () {
      return this.prefillContent.localstorageenabledforsystemvm ? this.prefillContent.localstorageenabledforsystemvm.value : false
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('nextPressed')
        }
      })
    },
    handleBack (e) {
      this.$emit('backPressed')
    },
    setupNetworkOfferingAdditionalFlags (nOffering) {
      nOffering.havingNetscaler = false
      nOffering.havingSG = false
      nOffering.havingEIP = false
      nOffering.havingELB = false

      nOffering.service.forEach(service => {
        service.provider.forEach(provider => {
          if (provider.name === 'Netscaler') {
            nOffering.havingNetscaler = true
          } else if (this.baremetalProviders.includes(provider.name)) {
            this.selectedBaremetalProviders.push(this.name)
          }
        })

        if (service.name === 'SecurityGroup') {
          nOffering.havingSG = true
        } else if (service.name === 'StaticNat') {
          service.capability.forEach(capability => {
            if (capability.name === 'ElasticIp' && capability.value === 'true') {
              nOffering.havingEIP = true
            }
          })
        } else if (service.name === 'Lb') {
          service.capability.forEach(capability => {
            if (capability.name === 'ElasticLb' && capability.value === 'true') {
              nOffering.havingELB = true
            }
          })
        }
      })
    },
    getAvailableNetworkOfferings (hypervisor) {
      if (this.networkOfferings) {
        return Object.values(this.networkOfferings).filter(nOffering => {
          if ((hypervisor === 'VMware' ||
            (this.isAdvancedZone && this.securityGroupsEnabled)) &&
            (nOffering.havingEIP && nOffering.havingELB)) {
            return false
          }

          if (this.isAdvancedZone && this.securityGroupsEnabled && !nOffering.havingSG) {
            return false
          }

          return true
        })
      }
      return null
    },
    validateIPAddress (rule, value, callback) {
      if (!value || value === '') {
        callback()
      } else if (rule.ipV4 && !this.ipV4Regex.test(value)) {
        callback(rule.message)
      } else if (rule.ipV6 && !this.ipV6Regex.test(value)) {
        callback(rule.message)
      } else {
        callback()
      }
    }
  }
}
</script>
<style scoped lang="less">
  .form-content {
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    vertical-align: center;
    padding: 8px;
    padding-top: 16px;
    margin-top: 8px;

    /deep/.has-error {
      .ant-form-explain {
        text-align: left;
      }
    }

    /deep/.ant-form-item-control {
      text-align: left;
    }
  }
</style>
<template>
  <div>
    <a-form class="form-content" :form="form" @submit="handleSubmit">
      <a-form-item label="Name" v-bind="formItemLayout">
        <a-input
          v-decorator="['name', { rules: [{ required: true, message: 'Please enter zone name', initialValue: name }] }]"
        />
      </a-form-item>
      <a-form-item label="IpV4 DNS 1" v-bind="formItemLayout">
        <a-input
          v-decorator="['ipv4Dns1', { rules: [{ required: true, message: 'Please enter IpV4 DNS 1', initialValue: ipv4Dns1 }] }]"
        />
      </a-form-item>
      <a-form-item label="IpV4 DNS 2" v-bind="formItemLayout">
        <a-input
          v-decorator="['ipv4Dns2', { rules: [{ message: 'Please enter IpV4 DNS 2', initialValue: ipv4Dns2 }] }]"
        />
      </a-form-item>
      <a-form-item label="IpV6 DNS 1" v-bind="formItemLayout" v-if="isAdvancedZone && !securityGroupsEnabled">
        <a-input
          v-decorator="['ipv6Dns1', { rules: [{ message: 'Please enter IpV6 DNS 1', initialValue: ipv6Dns1 }] }]"
        />
      </a-form-item>
      <a-form-item label="IpV6 DNS 2" v-bind="formItemLayout" v-if="isAdvancedZone && !securityGroupsEnabled">
        <a-input
          v-decorator="['ipv6Dns2', { rules: [{ message: 'Please enter IpV6 DNS 2', initialValue: ipv6Dns2 }] }]"
        />
      </a-form-item>
      <a-form-item label="Internal DNS 1" v-bind="formItemLayout">
        <a-input
          v-decorator="['internalDns1', { rules: [{ required: true, message: 'Please enter Internal DNS 1', initialValue: internalDns1 }] }]"
        />
      </a-form-item>
      <a-form-item label="Internal DNS 2" v-bind="formItemLayout">
        <a-input
          v-decorator="['internalDns2', { rules: [{ message: 'Please enter Internal DNS 2', initialValue: internalDns2 }] }]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Hypervisor" has-feedback>
        <a-select
          :loading="hypervisors === null"
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
      <a-form-item v-bind="formItemLayout" label="Network Offering" has-feedback v-if="!isAdvancedZone || securityGroupsEnabled">
        <a-select
          :loading="networkOfferings === null"
          v-decorator="[
            'networkOfferingId',
            { rules: [{ message: 'Please select network offering', initialValue: currentNetworkOfferingId }] },
          ]"
          placeholder="Please select network offering"
        >
          <a-select-option v-for="networkOffering in networkOfferings" :key="networkOffering.id">
            {{ networkOffering.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Network Domain" v-bind="formItemLayout">
        <a-input
          v-decorator="['networkDomain', { rules: [{ message: 'Please enter Network domain', intialValue: networkDomain }] }]"
        />
      </a-form-item>
      <a-form-item label="Guest CIDR" v-bind="formItemLayout" v-if="isAdvancedZone && !securityGroupsEnabled">
        <a-input
          v-decorator="['guestcidraddress', { rules: [{ message: 'Please enter Guest CIDR', intialValue: guestcidraddress }] }]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Dedicated">
        <a-switch
          v-decorator="['dedicated', { valuePropName: 'checked' }]"
          :value="dedicated"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Domains" has-feedback v-if="dedicated">
        <a-select
          :loading="domains === null"
          v-decorator="[
            'domainId',
            { rules: [{ message: 'Please select domain to dedicate to', initialValue: domain }] },
          ]"
          placeholder="Please select domain to dedicate to"
        >
          <a-select-option v-for="dom in domains" :key="dom.id">
            {{ dom.path }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Account" v-bind="formItemLayout" v-if="dedicated">
        <a-input
          v-decorator="['account', { rules: [{ message: 'Please enter account to dedicate to', intialValue: guestcidraddress }] }]"
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
      <a-button @click="handleBack">
        Back
      </a-button>
      <a-button style="margin-left: 8px" type="primary" @click="handleSubmit">
        Next
      </a-button>
    </div>
  </div>
</template>

<script>

import { api } from '@/api'

export default {
  props: {
    preFillContent: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
    formItemLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    },
    hypervisors: null,
    networkOfferings: null,
    domains: null
  }),
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      onFieldsChange: (_, changedFields) => {
        this.$emit('fieldsChanged', changedFields)
      }
    })
  },
  mounted () {
    this.form.setFieldsValue({
      'name': this.name,
      'ipv4Dns1': this.ipv4Dns1,
      'ipv4Dns2': this.ipv4Dns2,
      'ipv6Dns1': this.ipv6Dns1,
      'ipv6Dns2': this.ipv6Dns2,
      'internalDns1': this.internalDns1,
      'internalDns2': this.internalDns2,
      'hypervisor': this.currentHypervisor,
      'networkOfferingId': this.currentNetworkOfferingId
    })
    api('listHypervisors').then(json => {
      this.hypervisors = json.listhypervisorsresponse.hypervisor
      this.form.setFieldsValue({
        'hypervisor': this.currentHypervisor
      })
    })

    var cForm = this.form
    api('listNetworkOfferings', { 'state': 'Enabled', 'guestiptype': 'Shared' }).then(json => {
      this.networkOfferings = {}
      json.listnetworkofferingsresponse.networkoffering.forEach(offering => {
        this.networkOfferings[offering.id] = offering
      })
      cForm.setFieldsValue({
        'networkOfferingId': this.currentNetworkOfferingId
      })
    })

    api('listDomains', { 'listAll': true }).then(json => {
      this.domains = {}
      json.listdomainsresponse.domain.forEach(dom => {
        this.domains[dom.id] = dom
      })
      cForm.setFieldsValue({
        'domain': this.domain
      })
    })
  },
  computed: {
    isAdvancedZone () {
      return this.zoneType === 'Advanced'
    },
    zoneType () {
      return this.preFillContent.zoneType ? this.preFillContent.zoneType.value : null
    },
    securityGroupsEnabled () {
      return this.isAdvancedZone && (this.preFillContent.securityGroupsEnabled ? this.preFillContent.securityGroupsEnabled.value : false)
    },
    name () {
      return this.preFillContent.name ? this.preFillContent.name.value : null
    },
    ipv4Dns1 () {
      return this.preFillContent.ipv4Dns1 ? this.preFillContent.ipv4Dns1.value : null
    },
    ipv4Dns2 () {
      return this.preFillContent.ipv4Dns2 ? this.preFillContent.ipv4Dns2.value : null
    },
    ipv6Dns1 () {
      return this.preFillContent.ipv6Dns1 ? this.preFillContent.ipv6Dns1.value : null
    },
    ipv6Dns2 () {
      return this.preFillContent.ipv6Dns2 ? this.preFillContent.ipv6Dns2.value : null
    },
    internalDns1 () {
      return this.preFillContent.internalDns1 ? this.preFillContent.internalDns1.value : null
    },
    internalDns2 () {
      return this.preFillContent.internalDns2 ? this.preFillContent.internalDns2.value : null
    },
    currentHypervisor () {
      var lastHypervisor = this.preFillContent.hypervisor ? this.preFillContent.hypervisor.value : null
      if (this.hypervisors !== null && lastHypervisor !== null) {
        this.hypervisors.forEach(hyp => {
          if (hyp.name === lastHypervisor) {
            return hyp
          }
        })
      }
      return null
    },
    currentNetworkOfferingId () {
      var lastNetworkOfferingId = this.preFillContent.networkOfferingId ? this.preFillContent.networkOfferingId.value : null
      if (this.networkOfferings !== null && lastNetworkOfferingId !== null && this.networkOfferings[lastNetworkOfferingId]) {
        return lastNetworkOfferingId
      }
      return null
    },
    networkDomain () {
      return this.preFillContent.networkDomain ? this.preFillContent.networkDomain.value : null
    },
    guestcidraddress () {
      return this.preFillContent.guestcidraddress ? this.preFillContent.guestcidraddress : '10.1.1.0/24'
    },
    dedicated () {
      return this.preFillContent.dedicated ? this.preFillContent.dedicated.value : false
    },
    domain () {
      var lastDomainId = this.preFillContent.domainId ? this.preFillContent.domainId.value : null
      if (this.domains !== null && lastDomainId !== null && this.domains[lastDomainId]) {
        return lastDomainId
      }
      return null
    },
    account () {
      return this.preFillContent.account ? this.preFillContent.account.value : null
    },
    localstorageenabled () {
      return this.preFillContent.localstorageenabled ? this.preFillContent.localstorageenabled.value : false
    },
    localstorageenabledforsystemvm () {
      return this.preFillContent.localstorageenabledforsystemvm ? this.preFillContent.localstorageenabledforsystemvm.value : false
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
    }
  }
}
</script>
<style scoped>
  .form-content {
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    vertical-align: 'center';
    padding: 8px;
    padding-top: 16px;
    margin-top: 8px;
  }

  .form-action {
    margin-top: 16px;
  }
</style>

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
  <div style="width: auto;">
    <a-steps progressDot :current="currentStep" size="small" style="margin-left: 0px; margin-top: 16px;">
      <a-step v-for="step in steps" :key="step.title" :title="step.title" />
    </a-steps>
    <zone-wizard-physical-network-setup-step
      v-if="steps && steps[currentStep].formKey === 'physicalNetwork'"
      @nextPressed="nextPressed"
      @backPressed="handleBack"
      @fieldsChanged="fieldsChanged"
      :prefillContent="prefillContent"
    />
    <ip-address-range-form
      v-if="steps && steps[currentStep].formKey === 'publicTraffic'"
      @nextPressed="nextPressed"
      @backPressed="handleBack"
      @fieldsChanged="fieldsChanged"
      traffic="public"
      :description="publicTrafficDescription[zoneType.toLowerCase()]"
      :prefillContent="prefillContent"
    />

    <static-inputs-form
      v-if="steps && steps[currentStep].formKey === 'pod'"
      @nextPressed="nextPressed"
      @backPressed="handleBack"
      @fieldsChanged="fieldsChanged"
      :fields="podFields"
      :prefillContent="prefillContent"
      :description="podSetupDescription"
    />

    <static-inputs-form
      v-if="steps && steps[currentStep].formKey === 'guestTraffic'"
      @nextPressed="nextPressed"
      @backPressed="handleBack"
      @fieldsChanged="fieldsChanged"
      :fields="guestTrafficFields"
      :prefillContent="prefillContent"
      :description="guestTrafficDescription[this.zoneType.toLowerCase()]"
    />

    <ip-address-range-form
      v-if="steps && steps[currentStep].formKey === 'storageTraffic'"
      @nextPressed="nextPressed"
      @backPressed="handleBack"
      @fieldsChanged="fieldsChanged"
      traffic="storage"
      :description="storageTrafficDescription"
      :prefillContent="prefillContent"
    />
  </div>
</template>
<script>
import ZoneWizardPhysicalNetworkSetupStep from '@views/infra/zone/ZoneWizardPhysicalNetworkSetupStep'
import IpAddressRangeForm from '@views/infra/zone/IpAddressRangeForm'
import StaticInputsForm from '@views/infra/zone/StaticInputsForm'

export default {
  components: {
    ZoneWizardPhysicalNetworkSetupStep,
    IpAddressRangeForm,
    StaticInputsForm
  },
  props: {
    prefillContent: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    zoneType () {
      return this.prefillContent.zoneType ? this.prefillContent.zoneType.value : null
    }
  },
  data () {
    return {
      physicalNetworks: null,
      currentStep: 0,
      steps: null,
      allSteps: [
        {
          title: 'Physical Network',
          formKey: 'physicalNetwork'
        },
        {
          title: 'Public Traffic',
          formKey: 'publicTraffic',
          trafficType: 'public'
        },
        {
          title: 'Pod',
          formKey: 'pod'
        },
        {
          title: 'Guest Traffic',
          formKey: 'guestTraffic',
          trafficType: 'guest'
        },
        {
          title: 'Storage Traffic',
          formKey: 'storageTraffic',
          trafficType: 'storage'
        }
      ],
      publicTrafficDescription: {
        advanced: 'Public traffic is generated when VMs in the cloud access the internet. Publicly-accessible IPs must be allocated for this purpose. End users can use the CloudStack UI to acquire these IPs to implement NAT between their guest network and their public network.<br/> <br/>Provide at least one range of IP addresses for internet traffic.',
        basic: 'Public traffic is generated when VMs in the cloud access the Internet or provide services to clients over the Internet. Publicly accessible IPs must be allocated for this purpose. When a instance is created, an IP from this set of Public IPs will be allocated to the instance in addition to the guest IP address. Static 1-1 NAT will be set up automatically between the public IP and the guest IP. End users can also use the CloudStack UI to acquire additional IPs to implement static NAT between their instances and the public IP.'
      },
      guestTrafficDescription: {
        advanced: 'Guest network traffic is communication between end-user virtual machines. Specify a range of VLAN IDs to carry guest traffic for each physical network.',
        basic: 'Guest network traffic is communication between end-user virtual machines. Specify a range of IP addresses that CloudStack can assign to guest VMs. Make sure this range does not overlap the reserved system IP range.'
      },
      podSetupDescription: 'Each zone must contain in one or more pods, and we will add the first pod now. A pod contains hosts and primary storage servers, which you will add in a later step. First, configure a range of reserved IP addresses for CloudStack\'s internal management traffic. The reserved IP range must be unique for each zone in the cloud.',
      storageTrafficDescription: 'Traffic between CloudStack\'s internal resources, including any components that communicate with the Management Server, such as hosts and CloudStack system VMs. Please configure storage traffic here.',
      podFields: [
        {
          title: 'Pod Name',
          key: 'podName',
          placeHolder: 'Please enter pod name',
          required: true
        },
        {
          title: 'Reserved System Gateway',
          key: 'podReservedGateway',
          placeHolder: 'Please enter system gateway for Pod',
          required: true
        },
        {
          title: 'Reserved System Netmask',
          key: 'podReservedNetmask',
          placeHolder: 'Please enter system netmask for Pod',
          required: true
        },
        {
          title: 'Start Reserved System IP',
          key: 'podReservedStartIp',
          placeHolder: 'Please enter reserved system start ip for Pod',
          required: true,
          ipV4: true,
          message: 'Please enter a valid IP v4 address.'
        },
        {
          title: 'Stop Reserved System IP',
          key: 'podReservedStopIp',
          placeHolder: 'Please enter reserved system stop ip for Pod',
          required: false,
          ipV4: true,
          message: 'Please enter a valid IP v4 address.'
        }
      ],
      guestTrafficFields: [
        {
          title: 'Guest Gateway',
          key: 'guestGateway',
          placeHolder: 'Please enter guest gateway',
          required: false
        },
        {
          title: 'Guest Netmask',
          key: 'guestNetmask',
          placeHolder: 'Please enter guest netmask',
          required: false
        },
        {
          title: 'Guest Start IP',
          key: 'guestStartIp',
          placeHolder: 'Please enter start ip for guest traffic',
          required: false,
          ipV4: true,
          message: 'Please enter a valid IP v4 address.'
        },
        {
          title: 'Guest Stop IP',
          key: 'guestStopIp',
          placeHolder: 'Please enter stop ip for guest traffic',
          required: false,
          ipV4: true,
          message: 'Please enter a valid IP v4 address.'
        }
      ]
    }
  },
  mounted () {
    this.physicalNetworks = this.prefillContent.physicalNetworks
    this.steps = this.filteredSteps()
    this.currentStep = this.prefillContent.networkStep ? this.prefillContent.networkStep : 0
  },
  methods: {
    nextPressed () {
      if (this.currentStep === this.steps.length - 1) {
        this.$emit('nextPressed')
      } else {
        this.currentStep++
        this.$emit('fieldsChanged', { networkStep: this.currentStep })
      }
    },
    handleBack (e) {
      if (this.currentStep === 0) {
        this.$emit('backPressed')
      } else {
        this.currentStep--
        this.$emit('fieldsChanged', { networkStep: this.currentStep })
      }
    },
    fieldsChanged (changed) {
      if (changed.physicalNetworks) {
        this.physicalNetworks = changed.physicalNetworks
        this.steps = this.filteredSteps()
      }
      this.$emit('fieldsChanged', changed)
    },
    filteredSteps () {
      return this.allSteps.filter(step => {
        if (!step.trafficType) return true
        if (this.physicalNetworks) {
          let neededTraffic = false
          this.physicalNetworks.forEach(net => {
            net.traffics.forEach(traffic => {
              if (traffic.type === step.trafficType) {
                neededTraffic = true
              }
            })
          })
          if (neededTraffic) return true
        }
        return false
      })
    }
  }
}
</script>
<style scoped>
</style>

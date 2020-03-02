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
  <div v-if="!isLaunchZone">
    <a-card
      class="ant-form-text"
      style="text-align: center; margin: 10px 0;width: 100%;padding: 20px;font-size: 20px;">
      <a-icon
        type="check-circle"
        theme="twoTone"
        twoToneColor="#52c41a"
        style="font-size: 20px;"/>
      {{ description }}
    </a-card>
    <div class="form-action">
      <a-button class="button-prev" @click="handleBack">
        Back
      </a-button>
      <a-button class="button-next" type="primary" @click="handleSubmit">
        <a-icon type="rocket" /> Launch zone
      </a-button>
    </div>
  </div>
  <div v-else>
    <a-card
      id="launch-content"
      class="ant-form-text"
      style="text-align: justify; margin: 10px 0;width: 100%; font-size: 15px; max-height: 55vh; overflow-y: auto">
      <a-steps
        size="small"
        direction="vertical"
        :current="currentStep"
      >
        <a-step
          v-for="(step, index) in steps"
          :key="index"
          :title="step.title"
          :status="step.status">
          <a-icon v-if="step.status===status.PROCESS" type="loading" slot="icon" />
          <a-icon v-else-if="step.status===status.FAILED" type="close-circle" slot="icon" />
        </a-step>
      </a-steps>
    </a-card>
    <div class="form-action">
      <a-button class="button-next" type="primary" @click="handleStop">
        <a-icon type="poweroff" /> stop
      </a-button>
    </div>
  </div>
</template>

<script>
const BASIC_ZONE = 'Basic'
const ADVANCED_ZONE = 'Advanced'
const STATUS_PROCESS = 'process'
const STATUS_FINISH = 'finish'
const STATUS_FAILED = 'error'

export default {
  props: {
    prefillContent: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      description: 'Zone is ready to launch; please proceed to the next step.',
      isLaunchZone: false,
      currentStep: 0,
      advZoneConfiguredVirtualRouterCount: 0,
      steps: [],
      status: {
        PROCESS: STATUS_PROCESS,
        FAILED: STATUS_FAILED,
        FINISH: STATUS_FINISH
      }
    }
  },
  mounted () {
    console.log(this.prefillContent)
  },
  updated () {
    const launchElm = this.$el.querySelector('#launch-content')
    if (launchElm) {
      launchElm.scrollTop = launchElm.scrollHeight
    }
  },
  computed: {
    zoneType () {
      return this.prefillContent.zoneType ? this.prefillContent.zoneType.value : null
    },
    isBasicZone () {
      return this.zoneType === ADVANCED_ZONE
    },
    isAdvancedZone () {
      return this.zoneType === BASIC_ZONE
    },
    isDedicated () {
      return this.prefillContent.isDedicated ? this.prefillContent.isDedicated.value : false
    },
    sgEnabled () {
      return this.prefillContent.securityGroupsEnabled ? this.prefillContent.securityGroupsEnabled.value : false
    },
    havingNetscaler () {
      return this.prefillContent.networkOfferingSelected ? this.prefillContent.networkOfferingSelected.havingNetscaler : false
    },
    havingSG () {
      return this.prefillContent.networkOfferingSelected ? this.prefillContent.networkOfferingSelected.havingSG : false
    },
    havingEIP () {
      return this.prefillContent.networkOfferingSelected ? this.prefillContent.networkOfferingSelected.havingEIP : false
    },
    havingELB () {
      return this.prefillContent.networkOfferingSelected ? this.prefillContent.networkOfferingSelected.havingELB : false
    },
    selectedBaremetalProviders () {
      return this.prefillContent.networkOfferingSelected ? this.prefillContent.networkOfferingSelected.selectedBaremetalProviders : []
    }
  },
  methods: {
    addStep (title) {
      this.steps.push({
        index: this.currentStep,
        title: title,
        status: STATUS_PROCESS
      })
      this.setStepStatus(STATUS_PROCESS)
    },
    setStepStatus (status) {
      const index = this.steps.findIndex(step => step.index === this.currentStep)
      this.steps[index].status = status
    },
    handleBack (e) {
      this.$emit('backPressed')
    },
    async handleSubmit (e) {
      e.preventDefault()
      this.isLaunchZone = true
      this.advZoneConfiguredVirtualRouterCount = 0
      await this.stepAddZone()
    },
    handleStop () {
      this.isLaunchZone = false
      this.steps = []
    },
    trafficLabelParam (trafficTypeID, physicalNetworkID) {
      const hypervisor = this.prefillContent.hypervisor.value
      physicalNetworkID = this.isAdvancedZone ? physicalNetworkID : 0
      let physicalNetwork = []
      let trafficConfig = null
      if (this.prefillContent.physicalNetworks) {
        physicalNetwork = this.prefillContent.physicalNetworks[0].traffics.filter(traffic => traffic.type === trafficTypeID)
        trafficConfig = physicalNetwork.length > 0 ? physicalNetwork[0] : null
      }
      let trafficLabel
      if (trafficConfig !== null) {
        if ('label' in trafficConfig) {
          trafficLabel = trafficConfig.label
        } else {
          trafficLabel = ''

          if ('vSwitchName' in trafficConfig) {
            trafficLabel += trafficConfig.vSwitchName
          }
          if ('vlanId' in trafficConfig) {
            if (trafficLabel.length > 0) {
              trafficLabel += ','
            }
            trafficLabel += trafficConfig.vlanId
          }
          if ('vSwitchType' in trafficConfig) {
            if (trafficLabel.length > 0) {
              trafficLabel += ','
            }
            trafficLabel += trafficConfig.vSwitchType
          }

          if (trafficLabel.length === 0) {
            trafficLabel = null
          } else if (trafficLabel.length >= 1) {
            if (trafficLabel.charAt(trafficLabel.length - 1) === ',') {
              trafficLabel = trafficLabel.substring(0, trafficLabel.length - 1)
            }
          }
        }
      }

      let hypervisorAttr
      switch (hypervisor) {
        case 'XenServer':
          hypervisorAttr = 'xennetworklabel'
          break
        case 'KVM':
          hypervisorAttr = 'kvmnetworklabel'
          break
        case 'VMware':
          hypervisorAttr = 'vmwarenetworklabel'
          break
        case 'Hyperv':
          hypervisorAttr = 'hypervnetworklabel'
          break
        case 'BareMetal':
          hypervisorAttr = 'baremetalnetworklabel'
          break
        case 'Ovm':
          hypervisorAttr = 'ovmnetworklabel'
          break
        case 'LXC':
          hypervisorAttr = 'lxcnetworklabel'
          break
        case 'Ovm3':
          hypervisorAttr = 'ovm3networklabel'
          break
      }
      const trafficLabelParams = {}
      if (trafficLabel) {
        trafficLabelParams[hypervisorAttr] = trafficLabel
      }

      return trafficLabelParams
    },
    async stepAddZone () {
      console.log('stepAddZone')
      this.addStep('message.creating.zone')
      const params = {}
      params.networktype = this.zoneType
      if (this.isBasicZone) {
        if (this.havingSG) {
          params.securitygroupenabled = true
        } else {
          params.securitygroupenabled = false
        }
      } else {
        if (!this.sgEnabled) {
          params.securitygroupenabled = false
          if (this.prefillContent.guestcidraddress.value != null && this.prefillContent.guestcidraddress.value.length > 0) {
            params.guestcidraddress = this.prefillContent.guestcidraddress.value
          }
        } else {
          params.securitygroupenabled = true
        }
      }
      params.name = this.prefillContent.name.value
      params.localstorageenabled = this.prefillContent.localstorageenabled.value
      params.dns1 = this.prefillContent.ipv4Dns1.value
      params.dns2 = this.prefillContent.ipv4Dns2 ? this.prefillContent.ipv4Dns2.value : null
      params.ip6dns1 = this.prefillContent.ipv6Dns1 ? this.prefillContent.ipv6Dns1.value : null
      params.ip6dns2 = this.prefillContent.ipv6Dns1 ? this.prefillContent.ipv6Dns1.value : null
      params.internaldns1 = this.prefillContent.internalDns1 ? this.prefillContent.internalDns1.value : null
      params.internaldns2 = this.prefillContent.internalDns2 ? this.prefillContent.internalDns2.value : null
      params.domain = this.prefillContent.networkDomain ? this.prefillContent.networkDomain.value : null

      try {
        const zone = await this.createZone(params)
        if (this.isDedicated) {
          await this.stepDedicateZone(zone.id)
        }
        await this.stepAddPhysicalNetworks(zone)
      } catch (e) {
        console.log(e)
      }
    },
    async stepDedicateZone (zoneId) {
      console.log('stepDedicateZone')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.dedicate.zone')
      const params = {}
      params.zoneid = zoneId
      params.domain = this.prefillContent.domainId ? this.prefillContent.domainId.value : null
      params.account = this.prefillContent.account ? this.prefillContent.account.value : null

      try {
        await this.dedicateZone()
      } catch (e) {
        this.setStepStatus(STATUS_FAILED)
      }
    },
    async stepAddPhysicalNetworks (zone) {
      console.log('stepAddPhysicalNetworks')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.physical.networks')
      const args = {}
      const params = {}
      args.zoneReturned = zone
      params.zoneid = zone.zoneid
      if (this.isBasicZone) {
        let requestedTrafficTypeCount = 2
        if (this.havingSG && this.havingEIP && this.havingELB) {
          requestedTrafficTypeCount++
        }
        args.requestedTrafficTypeCount = requestedTrafficTypeCount
        if (this.prefillContent.physicalNetworks && this.prefillContent.physicalNetworks.length > 0) {
          params.name = this.prefillContent.physicalNetworks[0].name
        } else {
          params.name = 'PhysicalNetworkInBasicZone'
        }
        // create physical network
        args.returnedTrafficTypes = []
        args.physicalNetworkReturned = {}
        try {
          const physicalNetworkResult = await this.createPhysicalNetwork(params)
          args.physicalNetworkReturned = physicalNetworkResult.jobresult.physicalnetwork
          // add guest traffic
          const guestTrafficResult = await this.addTrafficType('Guest', args)
          args.returnedTrafficTypes.push(guestTrafficResult.jobresult.traffictype)
          if (args.returnedTrafficTypes.length === requestedTrafficTypeCount) {
            args.physicalNetworkReturned.returnedTrafficTypes = args.returnedTrafficTypes
            await this.stepConfigurePhysicalNetwork(args)
          }
          // add management traffic
          const managementTrafficResult = await this.addTrafficType('Management', args)
          args.returnedTrafficTypes.push(managementTrafficResult.jobresult.traffictype)
          if (args.returnedTrafficTypes.length === requestedTrafficTypeCount) {
            args.physicalNetworkReturned.returnedTrafficTypes = args.returnedTrafficTypes
            await this.stepConfigurePhysicalNetwork(args)
          }
          const storageEx = this.prefillContent.physicalNetworks[0].traffics.filter(traffic => traffic.type === 'storage')
          if (!storageEx || storageEx.length === 0) {
            return
          }
          // add storage traffic
          const storageTrafficResult = await this.addTrafficType('Storage', args)
          args.returnedTrafficTypes.push(storageTrafficResult.jobresult.traffictype)
          if (args.returnedTrafficTypes.length === requestedTrafficTypeCount) {
            args.physicalNetworkReturned.returnedTrafficTypes = args.returnedTrafficTypes
            await this.stepConfigurePhysicalNetwork(args)
          }
          if (this.havingSG && this.havingEIP && this.havingELB) {
            // add public traffic
            const publicTrafficResult = await this.addTrafficType('Public', args)
            args.returnedTrafficTypes.push(publicTrafficResult.jobresult.traffictype)
            if (args.returnedTrafficTypes.length === requestedTrafficTypeCount) {
              args.physicalNetworkReturned.returnedTrafficTypes = args.returnedTrafficTypes
              await this.stepConfigurePhysicalNetwork(args)
            }
          }
        } catch (e) {
          console.log(e)
        }
      } else {
        args.physicalNetworksReturned = []
        args.returnedTrafficTypes = []
        args.physicalNetworkReturned = {}
        await this.prefillContent.physicalNetworks.map(async (physicalNetwork) => {
          params.name = physicalNetwork.name
          if (physicalNetwork.isolationMethod && physicalNetwork.isolationMethod.length > 0) {
            params.isolationmethods = physicalNetwork.isolationMethod
          }
          // create physical network
          args.physicalNetworkReturned = await this.createPhysicalNetwork(params)
          physicalNetwork.traffics.map(async (traffic) => {
            let trafficResult = null
            if (traffic.type === 'public') {
              trafficResult = await this.addTrafficType('Public', args)
            } else if (traffic.type === 'management') {
              trafficResult = await this.addTrafficType('Management', args)
            } else if (traffic.type === 'guest') {
              trafficResult = await this.addTrafficType('Guest', args)
            } else if (traffic.type === 'storage') {
              trafficResult = await this.addTrafficType('Storage', args)
            }
            args.returnedTrafficTypes.push(trafficResult.jobresult.traffictype)
            if (args.returnedTrafficTypes.length === args.requestedTrafficTypeCount) {
              args.physicalNetworkReturned.returnedTrafficTypes = args.returnedTrafficTypes
              args.physicalNetworksReturned.push(args.physicalNetworkReturned)
              await this.stepConfigurePhysicalNetwork(args)
            }
          })
        })
      }
    },
    async stepConfigurePhysicalNetwork (args) {
      console.log('stepConfigurePhysicalNetwork')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.configuring.physical.networks')

      if (this.isBasicZone) {
        const updPhysicalParams = {}
        updPhysicalParams.state = 'Enabled'
        updPhysicalParams.id = args.physicalNetworkReturned.id

        try {
          await this.updatePhysicalNetwork(updPhysicalParams)
          const listNetworkParams = {}
          listNetworkParams.state = 'Enabled'
          listNetworkParams.id = args.physicalNetworkReturned.id
          const virtualRouterProviderId = await this.listNetworkServiceProviders(listNetworkParams, 'virtualRouter')
          const virtualRouterElementId = await this.listVirtualRouterElements(virtualRouterProviderId)
          await this.configureVirtualRouterElement(virtualRouterElementId)
          await this.updateNetworkServiceProvider(virtualRouterElementId)

          for (let i = 0; i < this.selectedBaremetalProviders.length; i++) {
            const listParams = {}
            listParams.name = this.selectedBaremetalProviders[i]
            listParams.physicalNetworkId = args.physicalNetworkReturned.id
            const providerId = await this.listNetworkServiceProviders(listParams, 'baremetalProvider')
            await this.updateNetworkServiceProvider(providerId)
          }

          // need to Enable security group provider first
          if (this.havingSG) {
            await this.stepEnableSecurityGroupProvider(args)
          } else {
            await this.stepAddNetscalerProvider(args)
          }
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      } else if (this.isAdvancedZone) {
        try {
          await args.physicalNetworkReturned.map(async (physicalNetwork) => {
            const updPhysicalParams = {}
            updPhysicalParams.state = 'Enabled'
            updPhysicalParams.id = physicalNetwork.id
            await this.updatePhysicalNetwork(updPhysicalParams)
            // ***** Virtual Router ***** (begin) *****
            const listParams = {}
            listParams.name = 'VirtualRouter'
            listParams.physicalNetworkId = physicalNetwork.id
            const virtualRouterProviderId = await this.listNetworkServiceProviders(listParams)
            const virtualRouterElementId = await this.listVirtualRouterElements(virtualRouterProviderId)
            await this.configureVirtualRouterElement(virtualRouterElementId)
            await this.updateNetworkServiceProvider(virtualRouterProviderId)
            this.advZoneConfiguredVirtualRouterCount++
            if (this.advZoneConfiguredVirtualRouterCount === args.physicalNetworkReturned.length) {
              if (this.sgEnabled) {
                await this.stepAddPod(args)
              } else {
                await this.stepAddGuestNetwork(args)
              }
            }
            // ***** Virtual Router ***** (end) *****

            // ***** Ovs ***** (begin) *****
            await this.configOvs(physicalNetwork)
            // ***** Ovs ***** (end) *****

            // ***** Internal LB ***** (begin) *****
            await this.configInternalLBVM(physicalNetwork)
            // ***** Internal LB ***** (end) *****

            // Advanced SG-disabled zone
            if (!this.sgEnabled) {
              // ***** VPC Virtual Router ***** (begin) *****
              await this.configVpcVirtualRouter(physicalNetwork)
              // ***** VPC Virtual Router ***** (end) *****
            } else {
              args.physicalNetworkReturned = physicalNetwork
              await this.stepEnableSecurityGroupProvider(args)
            }
          })
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      }
    },
    async configOvs (physicalNetwork) {
      console.log('configOvs')
      const listParams = {}
      listParams.name = 'Ovs'
      listParams.physicalNetworkId = physicalNetwork.id

      try {
        const ovsProviderId = await this.listNetworkServiceProviders(listParams, 'ovsProvider')
        const ovsElementId = await this.listOvsElements(ovsProviderId)

        if (ovsElementId != null) {
          await this.configureOvsElement(ovsElementId)
          await this.updateNetworkServiceProvider(ovsProviderId)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async configInternalLBVM (physicalNetwork) {
      console.log('configInternalLBVM')
      const listParams = {}
      listParams.name = 'Internallbvm'
      listParams.physicalNetworkId = physicalNetwork.id

      try {
        const internalLbProviderId = await this.listNetworkServiceProviders(listParams)
        const internalLbElementId = await this.listInternalLoadBalancerElements(internalLbProviderId)
        await this.configureInternalLoadBalancerElement(internalLbElementId)
        await this.updateNetworkServiceProvider(internalLbProviderId)
      } catch (e) {
        console.log(e)
      }
    },
    async configVpcVirtualRouter (physicalNetwork) {
      console.log('configVpcVirtualRouter')
      const listParams = {}
      listParams.name = 'VpcVirtualRouter'
      listParams.physicalNetworkId = physicalNetwork.id

      try {
        const vpcVirtualRouterProviderId = this.listNetworkServiceProviders(listParams)
        const vpcVirtualRouterElementId = await this.listVirtualRouterElements(vpcVirtualRouterProviderId)
        await this.configureVirtualRouterElement(vpcVirtualRouterElementId)
        await this.updateNetworkServiceProvider(vpcVirtualRouterProviderId)
      } catch (e) {
        console.log(e)
      }
    },
    async stepAddNetscalerProvider (args) {
      console.log('stepAddNetscalerProvider', args)

      if (this.havingNetscaler) {
        this.setStepStatus(STATUS_FINISH)
        this.currentStep++
        this.addStep('message.adding.Netscaler.provider')

        const params = {}
        params.name = 'Netscaler'
        params.physicalnetworkid = args.physicalNetworkReturned.id

        try {
          const addResult = await this.addNetworkServiceProvider(params)
          args.netscalerProviderReturned = addResult.jobresult.networkserviceprovider
          await this.stepAddNetscalerDevice(args)
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      } else {
        await this.stepAddGuestNetwork(args)
      }
    },
    async stepAddNetscalerDevice (args) {
      console.log('stepAddNetscalerDevice')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.adding.Netscaler.device')
      const params = {}
      params.physicalnetworkid = args.physicalNetworkReturned.id
      params.username = this.prefillContent.netscalerUsername ? this.prefillContent.netscalerUsername.value : null
      params.password = this.prefillContent.netscalerPassword ? this.prefillContent.netscalerPassword.value : null
      params.networkdevicetype = this.prefillContent.netscalerType ? this.prefillContent.netscalerType.value : null
      params.gslbprovider = this.prefillContent.gslbprovider ? this.prefillContent.gslbprovider.value : false
      params.gslbproviderpublicip = this.prefillContent.gslbproviderpublicip ? this.prefillContent.gslbproviderpublicip.value : null
      params.gslbproviderprivateip = this.prefillContent.gslbproviderprivateip ? this.prefillContent.gslbproviderprivateip.value : null

      const url = []
      const ip = this.prefillContent.netscalerIp.value
      url.push('https://' + ip)
      let isQuestionMarkAdded = false
      const publicInterface = this.prefillContent.publicinterface ? this.prefillContent.publicinterface.value : null
      if (publicInterface != null && publicInterface.length > 0) {
        if (!isQuestionMarkAdded) {
          url.push('?')
          isQuestionMarkAdded = true
        } else {
          url.push('&')
        }
        url.push('publicinterface=' + publicInterface)
      }
      const privateInterface = this.prefillContent.privateinterface ? this.prefillContent.privateinterface.value : null
      if (privateInterface != null && privateInterface.length > 0) {
        if (!isQuestionMarkAdded) {
          url.push('?')
          isQuestionMarkAdded = true
        } else {
          url.push('&')
        }
        url.push('privateinterface=' + publicInterface)
      }
      const numretries = this.prefillContent.numretries ? this.prefillContent.numretries.value : null
      if (numretries != null && numretries.length > 0) {
        if (!isQuestionMarkAdded) {
          url.push('?')
          isQuestionMarkAdded = true
        } else {
          url.push('&')
        }
        url.push('numretries=' + numretries)
      }
      const capacity = this.prefillContent.capacity ? this.prefillContent.capacity.value : null
      if (capacity != null && capacity.length > 0) {
        if (!isQuestionMarkAdded) {
          url.push('?')
          isQuestionMarkAdded = true
        } else {
          url.push('&')
        }
        url.push('lbdevicecapacity=' + capacity)
      }
      params.url = encodeURIComponent(url.join(''))

      try {
        const addResult = await this.addNetscalerLoadBalancer(params)
        args.netscalerProviderReturned.netScalerLoadBalancer = addResult.jobresult.netscalerloadbalancer
        await this.updateNetworkServiceProvider(args.netscalerProviderReturned.id, 'netscalerProvider')
        await this.stepAddGuestNetwork(args)
      } catch (e) {
        console.log(e)
      }
    },
    async stepAddPod (args) {
      console.log('stepAddPod')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.pod')
      const params = {}
      params.zoneId = args.zoneReturned.id
      params.name = this.prefillContent.podName ? this.prefillContent.podName.value : null
      params.gateway = this.prefillContent.podReservedGateway ? this.prefillContent.podReservedGateway.value : null
      params.netmask = this.prefillContent.podReservedNetmask ? this.prefillContent.podReservedNetmask.value : null
      params.startIp = this.prefillContent.podReservedStartIp ? this.prefillContent.podReservedStartIp.value : null
      params.endIp = this.prefillContent.podReservedStopIp ? this.prefillContent.podReservedStopIp.value : null

      try {
        args.podReturned = await this.createPod(params)
        await this.stepConfigurePublicTraffic(args)
      } catch (e) {
        this.setStepStatus(STATUS_FAILED)
        console.log(e)
      }
    },
    async stepAddGuestNetwork (args) {
      console.log('stepAddGuestNetwork')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.guest.network')
      const params = {}
      params.zoneid = args.zoneReturned.id
      params.name = 'defaultGuestNetwork'
      params.displaytext = 'defaultGuestNetwork'
      params.networkofferingid = this.prefillContent.networkOfferingSelected.id

      if (this.isAdvancedZone && this.sgEnabled) {
        params.gateway = this.prefillContent.guestGateway ? this.prefillContent.guestGateway.value : null
        params.netmask = this.prefillContent.guestNetmask ? this.prefillContent.guestNetmask.value : null
        params.startip = this.prefillContent.guestStartIp ? this.prefillContent.guestStartIp.value : null
        params.endip = this.prefillContent.guestStopIp ? this.prefillContent.guestStopIp.value : null
        params.vlan = this.prefillContent.guestVlan ? this.prefillContent.guestVlan.value : null
      }

      try {
        args.networkReturned = await this.createNetwork(params)
        await this.stepAddPod(args)
      } catch (e) {
        this.setStepStatus(STATUS_FAILED)
        console.log(e)
      }
    },
    async stepConfigurePublicTraffic (args) {
      console.log('stepConfigurePublicTraffic')
      if (
        (this.isBasicZone &&
          (this.havingSG && this.havingEIP && this.havingELB)) ||
        (this.isAdvancedZone && !this.sgEnabled)) {
        this.setStepStatus(STATUS_FINISH)
        this.currentStep++
        this.addStep('message.configuring.public.traffic')
        let stopNow = false
        const returnedPublicVlanIpRanges = []
        await this.prefillContent['public-ipranges'].map(async (publicVlanIpRange) => {
          let isExisting = false
          returnedPublicVlanIpRanges.forEach(publicVlan => {
            if (publicVlan.vlan === publicVlanIpRange.vlan &&
              publicVlan.startIp === publicVlanIpRange.startIp &&
              publicVlan.netmask === publicVlanIpRange.netmask &&
              publicVlan.gateway === publicVlanIpRange.gateway) {
              isExisting = true
              return true
            }
          })

          if (isExisting) {
            return
          }

          const params = {}
          params.zoneId = args.zoneReturned.id
          if (publicVlanIpRange.vlan !== null && publicVlanIpRange.vlan.length > 0) {
            params.vlan = publicVlanIpRange.vlan
          } else {
            params.vlan = 'untagged'
          }
          params.gateway = publicVlanIpRange.gateway
          params.netmask = publicVlanIpRange.netmask
          params.startip = publicVlanIpRange.startIp
          params.endip = publicVlanIpRange.stopIp
          if (this.isBasicZone) {
            params.forVirtualNetwork = true
          } else if (this.isAdvancedZone) {
            if (!this.sgEnabled) {
              params.forVirtualNetwork = true
            } else {
              params.forVirtualNetwork = false
            }
          }
          try {
            const vlanIpRangeItem = await this.createVlanIpRange(params)
            returnedPublicVlanIpRanges.push(vlanIpRangeItem)
          } catch (e) {
            console.log(e)
            stopNow = true
          }
          if (stopNow) {
            return false
          }
        })
        if (stopNow) {
          return
        }
        args.returnedPublicTraffic = returnedPublicVlanIpRanges
        await this.stepConfigureStorageTraffic(args)
      } else if (this.isAdvancedZone && this.sgEnabled) {
        await this.stepConfigureStorageTraffic(args)
      } else {
        if (this.prefillContent.physicalNetworks) {
          const storageExists = this.prefillContent.physicalNetworks[0].traffics.filter(traffic => traffic.type === 'storage')
          if (storageExists && storageExists.length > 0) {
            await this.stepConfigureStorageTraffic(args)
          } else {
            await this.stepConfigureGuestTraffic(args)
          }
        }
      }
    },
    async stepConfigureStorageTraffic (args) {
      console.log('stepConfigureStorageTraffic')
      let targetNetwork = false
      this.prefillContent.physicalNetworks.map(physicalNetwork => {
        const storageEx = physicalNetwork.traffics.filter(traffic => traffic.type === 'storage')
        if (storageEx && storageEx.length > 0) {
          targetNetwork = true
          return false
        }
      })
      if (!targetNetwork) {
        await this.stepConfigureGuestTraffic(args)
        return
      }
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.configuring.storage.traffic')
      const tasks = []
      await this.prefillContent['storage-ipranges'].map(async (storageIpRange) => {
        const params = {}
        params.vlan = storageIpRange.vlan
        params.gateway = storageIpRange.gateway
        params.netmask = storageIpRange.netmask
        params.startip = storageIpRange.startIp
        params.endip = storageIpRange.stopIp
        if (!params.vlan || params.vlan.length === 0) {
          delete params.vlan
        }
        params.zoneid = args.zoneReturned.id
        params.podid = args.podReturned.id
        try {
          const createStorageItem = await this.createStorageNetworkIpRange(params)
          console.log('createStorageItem', createStorageItem)
          tasks.push(createStorageItem)
          console.log(tasks)
        } catch (e) {
          tasks.push({
            error: true,
            message: e
          })
        }
      })

      const taskTimer = setInterval(() => {
        const completedTasks = tasks.filter(item => item.complete || item.error)
        const errorTasks = tasks.filter(item => item.error)

        if (completedTasks.length === this.prefillContent['storage-ipranges'].length) {
          clearInterval(taskTimer)

          if (errorTasks.length) {
            console.log('error configureStorageTraffic: ' + errorTasks[0].message)
            return
          }

          this.stepConfigureGuestTraffic(args)
          return
        }

        if (tasks.length === this.prefillContent['storage-ipranges'].length) {
          tasks.forEach((task) => {
            if (task.error) {
              return true
            }

            // pollAsyncJobResult({
            //   _custom: {
            //     jobId: task.jobid
            //   },
            //   complete: function() {
            //     task.complete = true;
            //   },
            //   error: function(args) {
            //     task.error = true;
            //     task.message = args.message;
            //   }
            // });

            return true
          })
        }

        return true
      }, 1000)

      return true
    },
    async stepConfigureGuestTraffic (args) {
      if (this.prefillContent.skipGuestTrafficStep) {
        await this.stepAddCluster(args)
        return
      }
      console.log('stepConfigureGuestTraffic')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.configuring.guest.traffic')
      if (this.isBasicZone) {
        const params = {}
        params.podid = args.podReturned.id
        params.networkid = args.networkReturned.id
        params.gateway = this.prefillContent.guestGateway ? this.prefillContent.guestGateway.value : null
        params.netmask = this.prefillContent.guestNetmask ? this.prefillContent.guestNetmask.value : null
        params.startip = this.prefillContent.guestStartIp ? this.prefillContent.guestStartIp.value : null
        params.endip = this.prefillContent.guestStopIp ? this.prefillContent.guestStopIp.value : null
        params.forVirtualNetwork = false

        try {
          args.returnedGuestNetwork = await this.createVlanIpRange(params)
          const hypervisor = this.prefillContent.hypervisor.value
          if (hypervisor === 'BareMetal') {
            await this.stepComplete()
          } else {
            await this.stepAddCluster(args)
          }
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      } else if (this.isAdvancedZone) {
        const physicalNetworksHavingGuestIncludingVlan = []
        await this.prefillContent.physicalNetworks.map(async (network) => {
          if (this.prefillContent.vlanRangeStart && this.prefillContent.vlanRangeEnd) {
            if (this.prefillContent.vlanRangeStart.length > 0 && this.prefillContent.vlanRangeEnd.length > 0) {
              physicalNetworksHavingGuestIncludingVlan.push(network)
            }
          }
        })
        if (physicalNetworksHavingGuestIncludingVlan.length === 0) {
          await this.stepAddCluster(args)
        } else {
          let updatedCount = 0
          await physicalNetworksHavingGuestIncludingVlan.map(async (network) => {
            let vlan = null
            if (!this.prefillContent.vlanRangeEnd ||
              this.prefillContent.vlanRangeEnd.value === null ||
              this.prefillContent.vlanRangeEnd.value.length === 0) {
              vlan = this.prefillContent.vlanRangeStart.value
            } else {
              vlan = [this.prefillContent.vlanRangeStart.value, this.prefillContent.vlanRangeEnd.value].join('-')
            }
            const originalId = network.id
            let returnedId = null
            args.physicalNetworkReturned.forEach((item) => {
              if (item.id === originalId) {
                returnedId = item.id
                return false
              }
            })
            const updateParams = {}
            updateParams.id = returnedId
            updateParams.vlan = vlan
            try {
              await this.updatePhysicalNetwork(updateParams)
              updatedCount++
              if (updatedCount === physicalNetworksHavingGuestIncludingVlan.length) {
                await this.stepAddCluster(args)
              }
            } catch (e) {
              this.setStepStatus(STATUS_FAILED)
              console.log(e)
            }
          })
        }
      }
    },
    async stepAddCluster (args) {
      console.log('stepAddCluster')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.cluster')
      const hypervisor = this.prefillContent.hypervisor.value
      const params = {}
      params.zoneId = args.zoneReturned.id
      params.hypervisor = hypervisor
      let clusterType = null
      if (hypervisor === 'VMware') {
        clusterType = 'ExternalManaged'
      } else {
        clusterType = 'CloudManaged'
      }
      params.clustertype = clusterType
      params.podId = args.podReturned.id
      let clusterName = this.prefillContent.clusterName.value
      if (hypervisor === 'VMware') {
        params.username = this.prefillContent.vCenterUsername ? this.prefillContent.vCenterUsername.value : null
        params.password = this.prefillContent.vCenterPassword ? this.prefillContent.vCenterPassword.value : null
        params.vsmipaddress = this.prefillContent.vsmipaddress ? this.prefillContent.vsmipaddress.value : null
        params.vsmusername = this.prefillContent.vsmusername ? this.prefillContent.vsmusername.value : null
        params.vsmpassword = this.prefillContent.vsmpassword ? this.prefillContent.vsmpassword.value : null

        const hostname = this.prefillContent.vCenterHost ? this.prefillContent.vCenterHost.value : null
        const dcName = this.prefillContent.vCenterDatacenter ? this.prefillContent.vCenterDatacenter.value : null
        let url = null
        if (hostname.indexOf('http://') === -1) {
          url = ['http://', hostname].join('')
        } else {
          url = hostname
        }

        url += '/' + dcName + '/' + clusterName
        params.url = url
        clusterName = hostname + '/' + dcName + '/' + clusterName
      }
      params.clustername = clusterName
      if (hypervisor === 'VMware') {
        const vmwareData = {}
        vmwareData.zoneId = args.zoneReturned.id
        vmwareData.username = this.prefillContent.vCenterUsername ? this.prefillContent.vCenterUsername.value : null
        vmwareData.password = this.prefillContent.vCenterPassword ? this.prefillContent.vCenterPassword.value : null
        vmwareData.name = this.prefillContent.vCenterDatacenter ? this.prefillContent.vCenterDatacenter.value : null
        vmwareData.vcenter = this.prefillContent.vCenterHost ? this.prefillContent.vCenterHost.value : null

        try {
          const vmWareResult = await this.addVmwareDc(vmwareData)
          if (vmWareResult.id !== null) {
            args.clusterReturned = await this.addCluster(params)
            await this.stepAddPrimaryStorage(args)
          }
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      } else {
        try {
          args.clusterReturned = await this.addCluster(params)
          await this.stepAddHost(args)
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      }
    },
    async stepAddHost (args) {
      console.log('stepAddHost')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.adding.host')
      const hostData = {}
      hostData.zoneid = args.zoneReturned.id
      hostData.podid = args.podReturned.id
      hostData.clusterid = args.clusterReturned.id
      hostData.hypervisor = args.clusterReturned.hypervisortype
      hostData.clustertype = args.clusterReturned.clustertype
      hostData.hosttags = this.prefillContent.hostTags ? this.prefillContent.hostTags.value : null
      hostData.username = this.prefillContent.hostUserName ? this.prefillContent.hostUserName.value : null
      hostData.password = this.prefillContent.hostPassword ? this.prefillContent.hostPassword.value : null
      const hostname = this.prefillContent.hostName ? this.prefillContent.hostName.value : null
      let url = null
      if (hostname.indexOf('http://') === -1) {
        url = ['http://', hostname].join('')
      } else {
        url = hostname
      }
      hostData.url = url
      const hypervisor = this.prefillContent.hypervisor.value
      if (hypervisor === 'Ovm') {
        hostData.agentusername = this.prefillContent.agentUserName ? this.prefillContent.agentUserName.value : null
        hostData.agentpassword = this.prefillContent.agentPassword ? this.prefillContent.agentPassword.value : null
      }
      if (this.prefillContent.localstorageenabledforsystemvm.value) {
        const configParams = {}
        configParams.name = 'system.vm.use.local.storage'
        configParams.value = true
        configParams.zoneid = args.zoneReturned.id
        try {
          await this.updateConfiguration(configParams)
          args.returnedHost = await this.addHost(hostData)
          await this.stepAddPrimaryStorage(args)
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      } else {
        try {
          args.returnedHost = await this.addHost(hostData)
          await this.stepAddPrimaryStorage(args)
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      }
    },
    async stepAddPrimaryStorage (args) {
      if (this.prefillContent.localstorageenabled.value &&
        this.prefillContent.localstorageenabledforsystemvm.value) {
        await this.stepAddSecondaryStorage(args)
        return
      }
      console.log('stepAddPrimaryStorage')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.primary.storage')
      const params = {}
      params.zoneid = args.zoneReturned.id
      params.podId = args.podReturned.id
      params.clusterid = args.clusterReturned.id
      params.name = this.prefillContent.primaryStorageName ? this.prefillContent.primaryStorageName.value : null
      params.scope = this.prefillContent.primaryStorageScope ? this.prefillContent.primaryStorageScope.value : null
      if (params.scope === 'zone') {
        const hypervisor = this.prefillContent.hypervisor.value
        if (hypervisor !== undefined) {
          params.hypervisor = hypervisor
        } else if (args.clusterReturned.hypervisortype !== undefined) {
          params.hypervisor = args.clusterReturned.hypervisortype
        }
      }
      const server = this.prefillContent.primaryStorageServer ? this.prefillContent.primaryStorageServer.value : null
      let url = ''
      const protocol = this.prefillContent.primaryStorageProtocol.value
      if (protocol === 'nfs') {
        let path = this.prefillContent.primaryStoragePath.value
        if (path.substring(0, 1) !== '/') {
          path = '/' + path
        }
        url = this.nfsURL(server, path)
      } else if (protocol === 'SMB') {
        let path = this.prefillContent.primaryStoragePath.value
        if (path.substring(0, 1) !== '/') {
          path = '/' + path
        }
        url = this.smbURL(server, path)
        params['details[0].user'] = this.prefillContent.primaryStorageSMBUsername.value
        params['details[0].password'] = this.prefillContent.primaryStorageSMBPassword.value
        params['details[0].domain'] = this.prefillContent.primaryStorageSMBDomain.value
      } else if (protocol === 'PreSetup') {
        let path = this.prefillContent.primaryStoragePath.value
        if (path.substring(0, 1) !== '/') {
          path = '/' + path
        }
        url = this.presetupURL(server, path)
      } else if (protocol === 'ocfs2') {
        let path = this.prefillContent.primaryStoragePath.value
        if (path.substring(0, 1) !== '/') {
          path = '/' + path
        }
        url = this.ocfs2URL(server, path)
      } else if (protocol === 'SharedMountPoint') {
        let path = this.prefillContent.primaryStoragePath.value
        if (path.substring(0, 1) !== '/') {
          path = '/' + path
        }
        url = this.sharedMountPointURL(server, path)
      } else if (protocol === 'clvm') {
        let vg = this.prefillContent.primaryStorageVolumeGroup.value
        if (vg.substring(0, 1) !== '/') {
          vg = '/' + vg
        }
        url = this.clvmURL(vg)
      } else if (protocol === 'rbd') {
        const rbdmonitor = this.prefillContent.primaryStorageRADOSMonitor.value
        const rbdpool = this.prefillContent.primaryStorageRADOSPool.value
        const rbdid = this.prefillContent.primaryStorageRADOSUser.value
        const rbdsecret = this.prefillContent.primaryStorage.value
        url = this.rbdURL(rbdmonitor, rbdpool, rbdid, rbdsecret)
      } else if (protocol === 'vmfs') {
        let path = this.prefillContent.primaryStorageVmfsDatacenter.value
        if (path.substring(0, 1) !== '/') {
          path = '/' + path
        }
        path += '/' + this.prefillContent.primaryStorageVmfsDatastore.value
        url = this.vmfsURL('dummy', path)
      } else {
        let iqn = this.prefillContent.primaryStorageTargetIQN.value
        if (iqn.substring(0, 1) !== '/') {
          iqn = '/' + iqn
        }
        const lun = this.prefillContent.primaryStorageLUN.value
        url = this.iscsiURL(server, iqn, lun)
      }
      params.url = url
      params.tags = this.prefillContent.primaryStorageTags.value
      try {
        args.primaryStorageRetunred = await this.createStoragePool(params)
        await this.stepAddSecondaryStorage(args)
      } catch (e) {
        this.setStepStatus(STATUS_FAILED)
        console.log(e)
      }
    },
    async stepAddSecondaryStorage (args) {
      if (!this.prefillContent.secondaryStorageProvider.value ||
      this.prefillContent.secondaryStorageProvider.value.length === 0) {
        await this.stepComplete()
        return
      }
      console.log('stepAddSecondaryStorage')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.secondary.storage')

      const params = {}
      params.name = this.prefillContent.secondaryStorageName ? this.prefillContent.secondaryStorageName.value : null
      if (this.prefillContent.secondaryStorageProvider.value === 'NFS') {
        const nfsServer = this.prefillContent.secondaryStorageServer.value
        const path = this.prefillContent.secondaryStoragePath.value
        const url = this.nfsURL(nfsServer, path)

        params.provider = this.prefillContent.secondaryStorageProvider.value
        params.zoneid = args.zoneReturned.id
        params.url = url

        try {
          await this.addImageStore(params)
          await this.stepComplete()
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      } else if (this.prefillContent.secondaryStorageProvider.value === 'SMB') {
        const nfsServer = this.prefillContent.secondaryStorageServer.value
        const path = this.prefillContent.secondaryStoragePath.value
        const url = this.smbURL(nfsServer, path)

        params.provider = this.prefillContent.secondaryStorageProvider.value
        params.zoneid = args.zoneReturned.id
        params.url = url
        params['details[0].key'] = 'user'
        params['details[0].value'] = this.prefillContent.secondaryStorageSMBUsername.value
        params['details[1].key'] = 'password'
        params['details[1].value'] = this.prefillContent.secondaryStorageSMBPassword.value
        params['details[2].key'] = 'domain'
        params['details[2].value'] = this.prefillContent.secondaryStorageSMBDomain.value

        try {
          await this.addImageStore(params)
          await this.stepComplete()
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      } else if (this.prefillContent.secondaryStorageProvider.value === 'S3') {
        params.provider = this.prefillContent.secondaryStorageProvider.value
        params['details[0].key'] = 'accesskey'
        params['details[0].value'] = this.prefillContent.secondaryStorageAccessKey.value
        params['details[1].key'] = 'secretkey'
        params['details[1].value'] = this.prefillContent.secondaryStorageSecretKey.value
        params['details[2].key'] = 'bucket'
        params['details[2].value'] = this.prefillContent.secondaryStorageBucket.value
        params['details[3].key'] = 'usehttps'
        params['details[3].value'] = this.prefillContent.secondaryStorageHttps ? this.prefillContent.secondaryStorageHttps.value : false

        let index = 4
        if (this.prefillContent.secondaryStorageEndpoint &&
          this.prefillContent.secondaryStorageEndpoint.value.length > 0) {
          params['details[' + index.toString() + '].key'] = 'endpoint'
          params['details[' + index.toString() + '].value'] = this.prefillContent.secondaryStorageEndpoint.value
          index++
        }
        if (this.prefillContent.secondaryStorageConnectionTimeout &&
          this.prefillContent.secondaryStorageConnectionTimeout.value.length > 0) {
          params['details[' + index.toString() + '].key'] = 'connectiontimeout'
          params['details[' + index.toString() + '].value'] = this.prefillContent.secondaryStorageConnectionTimeout.value
          index++
        }
        if (this.prefillContent.secondaryStorageMaxError &&
          this.prefillContent.secondaryStorageMaxError.value.length > 0) {
          params['details[' + index.toString() + '].key'] = 'maxerrorretry'
          params['details[' + index.toString() + '].value'] = this.prefillContent.secondaryStorageMaxError.value
          index++
        }
        if (this.prefillContent.secondaryStorageSocketTimeout &&
          this.prefillContent.secondaryStorageSocketTimeout.value.length > 0) {
          params['details[' + index.toString() + '].key'] = 'sockettimeout'
          params['details[' + index.toString() + '].value'] = this.prefillContent.secondaryStorageSocketTimeout.value
          index++
        }

        try {
          await this.addImageStore(params)
          await this.stepComplete()
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }

        if (this.prefillContent.secondaryStorageNFSStaging.value) {
          const nfsServer = this.prefillContent.secondaryStorageNFSServer.value
          const path = this.prefillContent.secondaryStorageNFSPath.value
          const url = this.nfsURL(nfsServer, path)

          const nfsParams = {}
          nfsParams.provider = 'nfs'
          nfsParams.zoneid = args.zoneReturned.id
          nfsParams.url = url

          try {
            await this.createSecondaryStagingStore(nfsParams)
          } catch (e) {
            this.setStepStatus(STATUS_FAILED)
            console.log(e)
          }
        }
      } else if (this.prefillContent.secondaryStorageProvider.value === 'Swift') {
        params.provider = this.prefillContent.secondaryStorageProvider.value
        params.url = this.prefillContent.secondaryStorageURL.value

        let index = 0
        if (this.prefillContent.secondaryStorageAccount &&
          this.prefillContent.secondaryStorageAccount.value.length > 0) {
          params['details[' + index.toString() + '].key'] = 'account'
          params['details[' + index.toString() + '].value'] = this.prefillContent.secondaryStorageAccount.value
          index++
        }
        if (this.prefillContent.secondaryStorageUsername &&
          this.prefillContent.secondaryStorageUsername.value.length > 0) {
          params['details[' + index.toString() + '].key'] = 'username'
          params['details[' + index.toString() + '].value'] = this.prefillContent.secondaryStorageUsername.value
          index++
        }
        if (this.prefillContent.secondaryStorageKey &&
          this.prefillContent.secondaryStorageKey.value.length > 0) {
          params['details[' + index.toString() + '].key'] = 'key'
          params['details[' + index.toString() + '].value'] = this.prefillContent.secondaryStorageKey.value
          index++
        }

        try {
          await this.addImageStore(params)
          await this.stepComplete()
        } catch (e) {
          this.setStepStatus(STATUS_FAILED)
          console.log(e)
        }
      }
    },
    async stepEnableSecurityGroupProvider (args) {
      console.log('stepEnableSecurityGroupProvider')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.enabling.security.group.provider')

      const listNetworkParams = {}
      listNetworkParams.name = 'SecurityGroupProvider'
      listNetworkParams.physicalNetworkId = args.physicalNetworkReturned.id
      try {
        const securityGroupProviderId = await this.listNetworkServiceProviders(listNetworkParams)
        await this.updateNetworkServiceProvider(securityGroupProviderId, 'enableSecurityGroupProvider')
        await this.stepAddNetscalerProvider(args)
      } catch (e) {
        this.setStepStatus(STATUS_FAILED)
        console.log(e)
      }
    },
    stepComplete () {
      console.log('stepComplete')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.Zone.creation.complete')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
    },
    createZone (args) {
      return new Promise((resolve, reject) => {
        // api('createZone', args)
        // const zone = json.createzoneresponse.zone
        setTimeout(() => {
          const zone = {
            id: 'Zone-id'
          }
          resolve(zone)
        }, 1000)
      })
    },
    dedicateZone () {
      return new Promise((resolve, reject) => {
        // api('dedicateZone')
        resolve()
      })
    },
    createPhysicalNetwork (args) {
      console.log('createPhysicalNetwork')
      return new Promise((resolve, reject) => {
        let message = ''
        // api('createPhysicalNetwork', args)
        // const jobId = json.createphysicalnetworkresponse.jobid
        // this.$pollJob
        // const result = result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1,
          jobresult: {
            physicalnetwork: {
              id: 'createPhysicalNetwork-id'
            }
          }
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          this.setStepStatus(STATUS_FAILED)
          message = 'createPhysicalNetwork failed. Error: ' + result.jobresult.errortext
          reject(message)
          return
        }
        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    addTrafficType (trafficType, args) {
      console.log('addTrafficType')
      const getTrafficParams = this.trafficLabelParam(trafficType.toLowerCase())
      let params = {}
      params.trafficType = trafficType
      params.physicalnetworkid = args.physicalNetworkReturned.id
      params = { ...params, ...getTrafficParams }
      return new Promise((resolve, reject) => {
        let message = ''
        // const jobId = json.addtraffictyperesponse.jobid
        // this.$pollJob
        // const result = result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1,
          jobresult: {
            traffictype: {}
          }
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          message = 'Failed to add ' + trafficType + ' traffic type to basic zone. Error: ' + result.jobresult.errortext
          reject(message)
          return
        }
        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    updatePhysicalNetwork (args) {
      console.log('updatePhysicalNetwork')
      return new Promise((resolve, reject) => {
        let message = ''
        // updatePhysicalNetwork
        // this.$poll
        // const result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          message = 'updatePhysicalNetwork failed. Error:' + result.jobresult.errortext
          reject(message)
          return
        }

        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    listNetworkServiceProviders (params, type) {
      console.log('listNetworkServiceProviders')
      return new Promise((resolve, reject) => {
        let providerId = null
        let message = ''
        // listNetworkServiceProviders
        // const items = json.listnetworkserviceprovidersresponse.networkserviceprovider
        const items = [
          {
            id: 'abc'
          }
        ]
        if (items != null && items.length > 0) {
          providerId = items[0].id
        }
        if (providerId == null) {
          switch (type) {
            case 'virtualRouter':
              message = 'error: listNetworkServiceProviders API doesn\'t return VirtualRouter provider ID'
              break
            case 'baremetalProvider':
              message = 'error: listNetworkServiceProviders API doesn\'t return Baremetal provider ID'
              break
            case 'ovsProvider':
              message = 'error: listNetworkServiceProviders API doesn\'t return Ovs provider ID'
              break
            default:
              message = 'error: listNetworkServiceProviders API doesn\'t return VirtualRouter provider ID'
              break
          }
          reject(message)
          return
        }
        resolve(providerId)
      })
    },
    listVirtualRouterElements (virtualRouterProviderId) {
      console.log('listVirtualRouterElements')
      return new Promise((resolve, reject) => {
        let virtualRouterElementId = null
        let message = ''
        // api('listVirtualRouterElements', {nspid: virtualRouterProviderId})
        // const items = json.listvirtualrouterelementsresponse.virtualrouterelement
        const items = [{ id: 'abc' }]
        if (items != null && items.length > 0) {
          virtualRouterElementId = items[0].id
        }
        if (virtualRouterElementId === null) {
          message = 'error: listVirtualRouterElements API doesn\'t return Virtual Router Element Id'
          reject(message)
          return
        }
        resolve(virtualRouterElementId)
      })
    },
    configureVirtualRouterElement (virtualRouterElementId) {
      console.log('configureVirtualRouterElement')
      return new Promise((resolve, reject) => {
        let message = ''
        const params = {}
        params.enabled = true
        params.id = virtualRouterElementId

        // api('configureVirtualRouterElement', params)
        // this.$poll
        // const result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          message = 'configureVirtualRouterElement failed. Error: ' + result.jobresult.errortext
          reject(message)
          return
        }
        resolve(result)
      })
    },
    updateNetworkServiceProvider (providerId, type) {
      console.log('updateNetworkServiceProvider')
      return new Promise((resolve, reject) => {
        let message = ''
        const params = {}
        params.id = providerId
        params.state = 'Enabled'
        // api('updateNetworkServiceProvider', params)
        // this.$poll
        // const result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          message = 'updateNetworkServiceProvider failed. Error: '
          switch (type) {
            case 'netscalerProvider':
              message = 'failed to enable Netscaler provider. Error: '
              break
            case 'enableSecurityGroupProvider':
              message = 'failed to enable security group provider. Error: '
              break
          }
          message += result.jobresult.errortext
          reject(message)
          return
        }
        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    listOvsElements (ovsProviderId) {
      console.log('listOvsElements')
      return new Promise((resolve, reject) => {
        let ovsElementId = null
        // api('listOvsElements', { nspid: ovsProviderId })
        // const items = json.listovselementsresponse.ovselement
        const item = [
          {
            id: 'abc'
          }
        ]
        if (item !== null && item.length > 0) {
          ovsElementId = item[0].id
        }
        resolve(ovsElementId)
      })
    },
    configureOvsElement (ovsElementId) {
      console.log('configureOvsElement')
      return new Promise((resolve, reject) => {
        let message = ''
        // api('configureOvsElement', { enabled: true, id: ovsElementId })
        // this.$poll
        // const result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          message = 'configureOvsElement failed. Error: ' + result.jobresult.errortext
          reject(message)
          return
        }
        resolve(result)
      })
    },

    listInternalLoadBalancerElements (internalLbProviderId) {
      console.log('listInternalLoadBalancerElements')
      return new Promise((resolve, reject) => {
        let internalLbElementId = null
        let message = ''
        // api('listInternalLoadBalancerElements', { nspid: internalLbProviderId })
        // const items = json.listinternalloadbalancerelementsresponse.internalloadbalancerelement
        const item = [
          {
            id: 'abc'
          }
        ]
        if (item != null && item.length > 0) {
          internalLbElementId = item[0].id
        }
        if (internalLbElementId == null) {
          message = 'error: listInternalLoadBalancerElements API doesn\'t return Internal LB Element Id'
          reject(message)
          return
        }
        resolve(item)
      })
    },
    configureInternalLoadBalancerElement (internalLbElementId) {
      console.log('configureInternalLoadBalancerElement')
      return new Promise((resolve, reject) => {
        let message = ''
        // api('configureInternalLoadBalancerElement', { enabled: true, id: internalLbElementId })
        // const jobId = json.configureinternalloadbalancerelementresponse.jobid
        // this.$poll
        // const result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          message = 'configureVirtualRouterElement failed. Error: ' + result.jobresult.errortext
          reject(message)
          return
        }
        resolve(result)
      })
    },
    addNetworkServiceProvider (arg) {
      console.log('addNetworkServiceProvider')
      return new Promise((resolve, reject) => {
        let message = ''
        // api('addNetworkServiceProvider', arg)
        // const jobId = json.addnetworkserviceproviderresponse.jobid
        // this.$poll
        // const result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1,
          jobresult: {
            networkserviceprovider: {
              id: 'addNetworkServiceProvider-ID'
            }
          }
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          message = 'addNetworkServiceProvider&name=Netscaler failed. Error: ' + result.jobresult.errortext
          reject(message)
          return
        }
        resolve(result)
      })
    },
    createNetwork (args) {
      console.log('createNetwork')
      return new Promise((resolve, reject) => {
        // api('createNetwork', args)
        // const returnedGuestNetwork = json.createnetworkresponse.network
        const returnedGuestNetwork = {
          id: 'Network-id'
        }

        setTimeout(() => {
          resolve(returnedGuestNetwork)
        }, 1000)
      })
    },
    createPod (args) {
      console.log('createPod')
      return new Promise((resolve, reject) => {
        // api('createPod', args)
        // const returnedPod = json.createpodresponse.pod
        const returnedPod = {
          id: 'Pod-id'
        }

        setTimeout(() => {
          resolve(returnedPod)
        }, 1000)
      })
    },
    createVlanIpRange (args) {
      console.log('createVlanIpRange')
      return new Promise((resolve, reject) => {
        // api('createVlanIpRange', args)
        // const item = json.createvlaniprangeresponse.vlan
        const item = {
          id: 'VlanIP-id'
        }

        setTimeout(() => {
          resolve(item)
        }, 1000)
      })
    },
    createStorageNetworkIpRange (args) {
      console.log('createStorageNetworkIpRange')
      return new Promise((resolve, reject) => {
        // api('createStorageNetworkIpRange', args)
        // const jobId = json.createstoragenetworkiprangeresponse.jobid
        const jobId = 'createStorageNetworkIpRange-job-id'

        setTimeout(() => {
          resolve({
            jobid: jobId,
            complete: true
          })
        }, 1000)
      })
    },
    addVmwareDc (args) {
      console.log('addVmwareDc')
      return new Promise((resolve, reject) => {
        // api('addVmwareDc', args, 'POST')
        // const item = json.addvmwaredcresponse.vmwaredc
        const item = {
          id: 'addVmwareDc-id'
        }

        setTimeout(() => {
          resolve(item)
        }, 1000)
      })
    },
    addCluster (args) {
      console.log('addCluster')
      return new Promise((resolve, reject) => {
        // api('addCluster', args)
        // const result = json.addclusterresponse.cluster[0]
        const result = {
          id: 'addCluster-id',
          hypervisortype: '',
          clustertype: ''
        }

        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    addHost (args) {
      console.log('addHost')
      return new Promise((resolve, reject) => {
        // api('addHost', args)
        // const result = json.addhostresponse.host[0]
        const result = {
          id: 'addHost-id'
        }

        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    updateConfiguration (args) {
      console.log('updateConfiguration')
      return new Promise((resolve, reject) => {
        // api('updateConfiguration', args)
        // const result = {}
        const result = {}

        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    createStoragePool (args) {
      console.log('createStoragePool')
      return new Promise((resolve, reject) => {
        // api('createStoragePool', args)
        // const result = json.createstoragepoolresponse.storagepool
        const result = {}

        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    addImageStore (args) {
      console.log('addImageStore')
      return new Promise((resolve, reject) => {
        // api('addImageStore', args)
        // const result = json.addimagestoreresponse.secondarystorage
        const result = {}

        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    createSecondaryStagingStore (args) {
      console.log('createSecondaryStagingStore')
      return new Promise((resolve, reject) => {
        // api('createSecondaryStagingStore', args)
        // const result = json.addimagestoreresponse.secondarystorage
        const result = {}

        setTimeout(() => {
          resolve(result)
        }, 1000)
      })
    },
    addNetscalerLoadBalancer (args) {
      console.log('addNetscalerLoadBalancer')
      return new Promise((resolve, reject) => {
        let message = ''
        // api('addNetscalerLoadBalancer', args, 'POST')
        // const jobId = json.addnetscalerloadbalancerresponse.jobid
        // this.$pollAction
        // const result = json.queryasyncjobresultresponse
        const result = {
          jobstatus: 1,
          jobresult: {
            netscalerloadbalancer: {}
          }
        }
        if (result.jobstatus === 0) {
          reject(message)
          return
        }
        if (result.jobstatus === 2) {
          message = 'addNetscalerDevice' + result.jobresult.errortext
          reject(message)
          return
        }
        resolve(result)
      })
    },
    nfsURL (server, path) {
      let url = null
      if (path.substring(0, 1) !== '/') {
        path = '/' + path
      }
      if (server.indexOf('://') === -1) {
        url = 'nfs://' + server + path
      } else {
        url = server + path
      }
      return url
    },
    smbURL (server, path, smbUsername, smbPassword, smbDomain) {
      let url = ''
      if (path.substring(0, 1) !== '/') {
        path = '/' + path
      }
      if (server.indexOf('://') === -1) {
        url += 'cifs://'
      }
      url += (server + path)
      return url
    },
    presetupURL (server, path) {
      let url = null
      if (server.indexOf('://') === -1) {
        url = 'presetup://' + server + path
      } else {
        url = server + path
      }
      return url
    },
    ocfs2URL (server, path) {
      let url = null
      if (server.indexOf('://') === -1) {
        url = 'ocfs2://' + server + path
      } else {
        url = server + path
      }
      return url
    },
    sharedMountPointURL (server, path) {
      let url = ''
      if (server.indexOf('://') === -1) {
        url = 'SharedMountPoint://' + server + path
      } else {
        url = server + path
      }
      return url
    },
    rbdURL (monitor, pool, id, secret) {
      let url
      secret = secret.replace('+', '-')
      secret = secret.replace('/', '_')
      if (id != null && secret != null) {
        monitor = id + ':' + secret + '@' + monitor
      }
      if (pool.substring(0, 1) !== '/') {
        pool = '/' + pool
      }
      if (monitor.indexOf('://') === -1) {
        url = 'rbd://' + monitor + pool
      } else {
        url = monitor + pool
      }

      return url
    },
    clvmURL (vgname) {
      let url = ''
      if (vgname.indexOf('://') === -1) {
        url = 'clvm://localhost/' + vgname
      } else {
        url = vgname
      }
      return url
    },
    vmfsURL (server, path) {
      let url = ''
      if (server.indexOf('://') === -1) {
        url = 'vmfs://' + server + path
      } else {
        url = server + path
      }
      return url
    },
    iscsiURL (server, iqn, lun) {
      let url = ''
      if (server.indexOf('://') === -1) {
        url = 'iscsi://' + server + iqn + '/' + lun
      } else {
        url = server + iqn + '/' + lun
      }
      return url
    }
  }
}
</script>

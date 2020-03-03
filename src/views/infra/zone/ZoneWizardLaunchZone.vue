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
          <a-card
            slot="description"
            class="step-error"
            v-if="step.status===status.FAILED"
          >
            <div>{{ $t('error.something.went.wrong.please.correct.the.following') }}:</div>
            <div>{{ messageError }}</div>
          </a-card>
        </a-step>
      </a-steps>
    </a-card>
    <div class="form-action">
      <a-button
        v-if="processStatus==='finish'"
        class="button-next"
        type="primary"
        @click="handleClose"
      >Done</a-button>
      <a-button
        v-if="processStatus==='error'"
        class="button-next"
        type="primary"
        @click="handleFixesError"
      >Fix errors</a-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'

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
    },
    launchZone: {
      type: Boolean,
      default: false
    },
    launchData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      description: 'Zone is ready to launch; please proceed to the next step.',
      isLaunchZone: false,
      processStatus: null,
      messageError: '',
      currentStep: 0,
      advZoneConfiguredVirtualRouterCount: 0,
      steps: [],
      stepData: {},
      status: {
        PROCESS: STATUS_PROCESS,
        FAILED: STATUS_FAILED,
        FINISH: STATUS_FINISH
      }
    }
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
      return this.zoneType === BASIC_ZONE
    },
    isAdvancedZone () {
      return this.zoneType === ADVANCED_ZONE
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
  mounted () {
    if (this.launchZone) {
      this.handleSubmit()
    }
  },
  methods: {
    addStep (title, step) {
      this.steps.push({
        index: this.currentStep,
        title: title,
        step: step,
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
    async handleSubmit () {
      this.isLaunchZone = true
      this.advZoneConfiguredVirtualRouterCount = 0
      this.processStatus = STATUS_PROCESS
      await this.stepAddZone()
    },
    handleClose () {
      this.steps = []
      this.$emit('closeAction')
    },
    handleFixesError () {
      const stepError = this.steps.filter(step => step.index === this.currentStep)
      if (stepError && stepError.length > 0) {
        const step = stepError[0].step
        this.$emit('stepError', step, this.stepData)
      }
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
      this.addStep('message.creating.zone', 'stepAddZone')

      const guestcidraddress = this.prefillContent.guestcidraddress ? this.prefillContent.guestcidraddress.value : null
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
          if (guestcidraddress != null && guestcidraddress.length > 0) {
            params.guestcidraddress = guestcidraddress
          }
        } else {
          params.securitygroupenabled = true
        }
      }
      params.name = this.prefillContent.name.value
      params.localstorageenabled = this.prefillContent.localstorageenabled ? this.prefillContent.localstorageenabled.value : false
      params.dns1 = this.prefillContent.ipv4Dns1.value
      params.dns2 = this.prefillContent.ipv4Dns2 ? this.prefillContent.ipv4Dns2.value : null
      params.ip6dns1 = this.prefillContent.ipv6Dns1 ? this.prefillContent.ipv6Dns1.value : null
      params.ip6dns2 = this.prefillContent.ipv6Dns1 ? this.prefillContent.ipv6Dns1.value : null
      params.internaldns1 = this.prefillContent.internalDns1 ? this.prefillContent.internalDns1.value : null
      params.internaldns2 = this.prefillContent.internalDns2 ? this.prefillContent.internalDns2.value : null
      params.domain = this.prefillContent.networkDomain ? this.prefillContent.networkDomain.value : null

      try {
        this.stepData.zoneReturned = await this.createZone(params)
        await this.stepDedicateZone()
        await this.stepAddPhysicalNetworks()
      } catch (e) {
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
      }
    },
    async stepDedicateZone () {
      if (!this.isDedicated) {
        return
      }

      console.log('stepDedicateZone')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.dedicate.zone', 'stepDedicateZone')

      const params = {}
      params.zoneid = this.stepData.zoneReturned.id
      params.domain = this.prefillContent.domainId ? this.prefillContent.domainId.value : null
      params.account = this.prefillContent.account ? this.prefillContent.account.value : null

      try {
        await this.dedicateZone(params)
      } catch (e) {
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
      }
    },
    async stepAddPhysicalNetworks () {
      console.log('stepAddPhysicalNetworks')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.physical.networks', 'stepAddPhysicalNetworks')

      const params = {}
      params.zoneid = this.stepData.zoneReturned.id

      if (this.isBasicZone) {
        let requestedTrafficTypeCount = this.prefillContent.physicalNetworks[0].traffics.length

        if (this.havingSG && this.havingEIP && this.havingELB) {
          requestedTrafficTypeCount++
        }

        this.stepData.requestedTrafficTypeCount = requestedTrafficTypeCount
        this.stepData.returnedTrafficTypes = []
        this.stepData.physicalNetworkReturned = {}

        if (this.prefillContent.physicalNetworks && this.prefillContent.physicalNetworks.length > 0) {
          params.name = this.prefillContent.physicalNetworks[0].name
        } else {
          params.name = 'PhysicalNetworkInBasicZone'
        }

        try {
          // createPhysicalNetwork
          const physicalNetworkResult = await this.createPhysicalNetwork(params)
          this.stepData.physicalNetworkReturned = physicalNetworkResult.jobresult.physicalnetwork
          this.stepData.proccessIndex++

          // addTrafficType Guest
          const guestTrafficResult = await this.addTrafficType('Guest')
          this.stepData.returnedTrafficTypes.push(guestTrafficResult.jobresult.traffictype)
          this.stepData.proccessIndex++

          // addTrafficType Management
          const managementTrafficResult = await this.addTrafficType('Management')
          this.stepData.returnedTrafficTypes.push(managementTrafficResult.jobresult.traffictype)
          this.stepData.proccessIndex++

          // addTrafficType Storage
          const storageEx = this.prefillContent.physicalNetworks[0].traffics.filter(traffic => traffic.type === 'storage')
          if (storageEx && storageEx.length > 0) {
            const storageTrafficResult = await this.addTrafficType('Storage')
            this.stepData.returnedTrafficTypes.push(storageTrafficResult.jobresult.traffictype)
            this.stepData.proccessIndex++
          }

          // addTrafficType Public
          if (this.havingSG && this.havingEIP && this.havingELB) {
            const publicTrafficResult = await this.addTrafficType('Public')
            this.stepData.returnedTrafficTypes.push(publicTrafficResult.jobresult.traffictype)
            this.stepData.proccessIndex++
          }

          if (this.stepData.returnedTrafficTypes.length === requestedTrafficTypeCount) {
            this.stepData.physicalNetworkReturned.returnedTrafficTypes = this.stepData.returnedTrafficTypes
            await this.stepConfigurePhysicalNetwork()
            this.stepData.proccessIndex++
          }
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      } else {
        this.stepData.physicalNetworksReturned = []
        this.stepData.returnedTrafficTypes = []
        this.stepData.physicalNetworkReturned = {}

        this.prefillContent.physicalNetworks.each(async (index, physicalNetwork) => {
          params.name = physicalNetwork.name

          if (physicalNetwork.isolationMethod && physicalNetwork.isolationMethod.length > 0) {
            params.isolationmethods = physicalNetwork.isolationMethod
          }

          try {
            const physicalNetworkResult = await this.createPhysicalNetwork(params)
            this.stepData.physicalNetworkReturned = physicalNetworkResult.jobresult.physicalnetwork
          } catch (e) {
            this.messageError = e
            this.processStatus = STATUS_FAILED
            this.setStepStatus(STATUS_FAILED)
            return false
          }

          physicalNetwork.traffics.each(async (key, traffic) => {
            let trafficResult = null

            try {
              if (traffic.type === 'public') {
                trafficResult = await this.addTrafficType('Public')
              } else if (traffic.type === 'management') {
                trafficResult = await this.addTrafficType('Management')
              } else if (traffic.type === 'guest') {
                trafficResult = await this.addTrafficType('Guest')
              } else if (traffic.type === 'storage') {
                trafficResult = await this.addTrafficType('Storage')
              }

              this.stepData.returnedTrafficTypes.push(trafficResult.jobresult.traffictype)
            } catch (e) {
              this.messageError = e
              this.processStatus = STATUS_FAILED
              this.setStepStatus(STATUS_FAILED)
              return false
            }

            if (this.stepData.returnedTrafficTypes.length === physicalNetwork.traffics.length) {
              this.stepData.physicalNetworkReturned.returnedTrafficTypes = this.stepData.returnedTrafficTypes
              this.stepData.physicalNetworksReturned.push(this.stepData.physicalNetworkReturned)

              if (this.stepData.physicalNetworksReturned.length === this.prefillContent.physicalNetworks.length) {
                await this.stepConfigurePhysicalNetwork()
              }
            }
          })

          return true
        })
      }
    },
    async stepConfigurePhysicalNetwork () {
      console.log('stepConfigurePhysicalNetwork')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.configuring.physical.networks', 'stepConfigurePhysicalNetwork')

      if (this.isBasicZone) {
        const updPhysicalParams = {}
        updPhysicalParams.state = 'Enabled'
        updPhysicalParams.id = this.stepData.physicalNetworkReturned.id

        try {
          await this.updatePhysicalNetwork(updPhysicalParams)

          const listNetworkParams = {}
          listNetworkParams.name = 'VirtualRouter'
          listNetworkParams.physicalNetworkId = this.stepData.physicalNetworkReturned.id

          const providerId = await this.listNetworkServiceProviders(listNetworkParams, 'virtualRouter')
          const virtualRouterElementId = await this.listVirtualRouterElements(providerId)
          await this.configureVirtualRouterElement(virtualRouterElementId)
          await this.updateNetworkServiceProvider(providerId)

          for (let i = 0; i < this.selectedBaremetalProviders.length; i++) {
            const listParams = {}
            listParams.name = this.selectedBaremetalProviders[i]
            listParams.physicalNetworkId = this.stepData.physicalNetworkReturned.id
            const providerId = await this.listNetworkServiceProviders(listParams, 'baremetalProvider')
            await this.updateNetworkServiceProvider(providerId)
          }

          // need to Enable security group provider first
          if (this.havingSG) {
            await this.stepEnableSecurityGroupProvider()
          } else {
            await this.stepAddNetscalerProvider()
          }
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      } else if (this.isAdvancedZone) {
        try {
          await this.stepData.physicalNetworksReturned.map(async (physicalNetwork) => {
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

            if (this.advZoneConfiguredVirtualRouterCount === this.stepData.physicalNetworksReturned.length) {
              if (this.sgEnabled) {
                await this.stepAddPod()
              } else {
                await this.stepAddGuestNetwork()
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
              this.stepData.physicalNetworkReturned = physicalNetwork
              await this.stepEnableSecurityGroupProvider()
            }
          })
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
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
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
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
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
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
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
      }
    },
    async stepAddNetscalerProvider () {
      console.log('stepAddNetscalerProvider')

      if (this.havingNetscaler) {
        this.setStepStatus(STATUS_FINISH)
        this.currentStep++
        this.addStep('message.adding.Netscaler.provider', 'stepAddNetscalerProvider')

        const params = {}
        params.name = 'Netscaler'
        params.physicalnetworkid = this.stepData.physicalNetworkReturned.id

        try {
          const addResult = await this.addNetworkServiceProvider(params)
          this.stepData.netscalerProviderReturned = addResult.jobresult.networkserviceprovider
          await this.stepAddNetscalerDevice()
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      } else {
        await this.stepAddGuestNetwork()
      }
    },
    async stepAddNetscalerDevice () {
      console.log('stepAddNetscalerDevice')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.adding.Netscaler.device', 'stepAddNetscalerDevice')
      const params = {}
      params.physicalnetworkid = this.stepData.physicalNetworkReturned.id
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
        this.stepData.netscalerProviderReturned.netScalerLoadBalancer = addResult.jobresult.netscalerloadbalancer
        await this.updateNetworkServiceProvider(this.stepData.netscalerProviderReturned.id, 'netscalerProvider')
        await this.stepAddGuestNetwork()
      } catch (e) {
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
      }
    },
    async stepAddPod () {
      console.log('stepAddPod')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.pod', 'stepAddPod')
      const params = {}
      params.zoneId = this.stepData.zoneReturned.id
      params.name = this.prefillContent.podName ? this.prefillContent.podName.value : null
      params.gateway = this.prefillContent.podReservedGateway ? this.prefillContent.podReservedGateway.value : null
      params.netmask = this.prefillContent.podReservedNetmask ? this.prefillContent.podReservedNetmask.value : null
      params.startIp = this.prefillContent.podReservedStartIp ? this.prefillContent.podReservedStartIp.value : null
      params.endIp = this.prefillContent.podReservedStopIp ? this.prefillContent.podReservedStopIp.value : null

      try {
        this.stepData.podReturned = await this.createPod(params)
        await this.stepConfigurePublicTraffic()
      } catch (e) {
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
      }
    },
    async stepAddGuestNetwork () {
      console.log('stepAddGuestNetwork')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.guest.network', 'stepAddGuestNetwork')
      const params = {}
      params.zoneid = this.stepData.zoneReturned.id
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
        this.stepData.networkReturned = await this.createNetwork(params)
        await this.stepAddPod()
      } catch (e) {
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
      }
    },
    async stepConfigurePublicTraffic () {
      console.log('stepConfigurePublicTraffic')
      if (
        (this.isBasicZone &&
          (this.havingSG && this.havingEIP && this.havingELB)) ||
        (this.isAdvancedZone && !this.sgEnabled)) {
        this.setStepStatus(STATUS_FINISH)
        this.currentStep++
        this.addStep('message.configuring.public.traffic', 'stepConfigurePublicTraffic')
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
          params.zoneId = this.stepData.zoneReturned.id
          if (publicVlanIpRange.vlan && publicVlanIpRange.vlan.length > 0) {
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
            stopNow = true
          }
          if (stopNow) {
            return false
          }
        })
        if (stopNow) {
          return
        }
        this.stepData.returnedPublicTraffic = returnedPublicVlanIpRanges
        await this.stepConfigureStorageTraffic()
      } else if (this.isAdvancedZone && this.sgEnabled) {
        await this.stepConfigureStorageTraffic()
      } else {
        if (this.prefillContent.physicalNetworks) {
          const storageExists = this.prefillContent.physicalNetworks[0].traffics.filter(traffic => traffic.type === 'storage')
          if (storageExists && storageExists.length > 0) {
            await this.stepConfigureStorageTraffic()
          } else {
            await this.stepConfigureGuestTraffic()
          }
        }
      }
    },
    async stepConfigureStorageTraffic () {
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
        await this.stepConfigureGuestTraffic()
        return
      }

      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.configuring.storage.traffic', 'stepConfigureStorageTraffic')

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
        params.zoneid = this.stepData.zoneReturned.id
        params.podid = this.stepData.podReturned.id

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
            this.messageError = 'configureStorageTraffic. Error: ' + errorTasks[0].message
            this.processStatus = STATUS_FAILED
            this.setStepStatus(STATUS_FAILED)
            return
          }

          this.stepConfigureGuestTraffic()
          return
        }

        if (tasks.length === this.prefillContent['storage-ipranges'].length) {
          tasks.forEach(async (task) => {
            if (task.error) {
              return true
            }

            const jobResult = await this.pollJob(task.jobid)
            console.log('jobResult', jobResult)

            if (jobResult.jobstatus === 1) {
              task.complete = true
            } else if (jobResult.jobstatus === 2) {
              task.error = true
              task.message = jobResult.jobresult.errortext
            }

            console.log('task', task)

            return true
          })
        }

        return true
      }, 1000)

      return true
    },
    async stepConfigureGuestTraffic () {
      if (this.prefillContent.skipGuestTrafficStep) {
        await this.stepAddCluster()
        return
      }
      console.log('stepConfigureGuestTraffic')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.configuring.guest.traffic', 'stepConfigureGuestTraffic')
      if (this.isBasicZone) {
        const params = {}
        params.podid = this.stepData.podReturned.id
        params.networkid = this.stepData.networkReturned.id
        params.gateway = this.prefillContent.guestGateway ? this.prefillContent.guestGateway.value : null
        params.netmask = this.prefillContent.guestNetmask ? this.prefillContent.guestNetmask.value : null
        params.startip = this.prefillContent.guestStartIp ? this.prefillContent.guestStartIp.value : null
        params.endip = this.prefillContent.guestStopIp ? this.prefillContent.guestStopIp.value : null
        params.forVirtualNetwork = false

        try {
          this.stepData.returnedGuestNetwork = await this.createVlanIpRange(params)
          const hypervisor = this.prefillContent.hypervisor.value
          if (hypervisor === 'BareMetal') {
            await this.stepComplete()
          } else {
            await this.stepAddCluster()
          }
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
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
          await this.stepAddCluster()
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
            this.stepData.physicalNetworkReturned.forEach((item) => {
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
                await this.stepAddCluster()
              }
            } catch (e) {
              this.messageError = e
              this.processStatus = STATUS_FAILED
              this.setStepStatus(STATUS_FAILED)
            }
          })
        }
      }
    },
    async stepAddCluster () {
      console.log('stepAddCluster')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.cluster', 'stepAddCluster')
      const hypervisor = this.prefillContent.hypervisor.value
      const params = {}
      params.zoneId = this.stepData.zoneReturned.id
      params.hypervisor = hypervisor
      let clusterType = null
      if (hypervisor === 'VMware') {
        clusterType = 'ExternalManaged'
      } else {
        clusterType = 'CloudManaged'
      }
      params.clustertype = clusterType
      params.podId = this.stepData.podReturned.id
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
        vmwareData.zoneId = this.stepData.zoneReturned.id
        vmwareData.username = this.prefillContent.vCenterUsername ? this.prefillContent.vCenterUsername.value : null
        vmwareData.password = this.prefillContent.vCenterPassword ? this.prefillContent.vCenterPassword.value : null
        vmwareData.name = this.prefillContent.vCenterDatacenter ? this.prefillContent.vCenterDatacenter.value : null
        vmwareData.vcenter = this.prefillContent.vCenterHost ? this.prefillContent.vCenterHost.value : null

        try {
          const vmWareResult = await this.addVmwareDc(vmwareData)
          if (vmWareResult.id !== null) {
            this.stepData.clusterReturned = await this.addCluster(params)
            await this.stepAddPrimaryStorage()
          }
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      } else {
        try {
          this.stepData.clusterReturned = await this.addCluster(params)
          await this.stepAddHost()
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      }
    },
    async stepAddHost (args) {
      console.log('stepAddHost')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.adding.host', 'stepAddHost')
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
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      } else {
        try {
          args.returnedHost = await this.addHost(hostData)
          await this.stepAddPrimaryStorage(args)
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      }
    },
    async stepAddPrimaryStorage () {
      if (this.prefillContent.localstorageenabled.value &&
        this.prefillContent.localstorageenabledforsystemvm.value) {
        await this.stepAddSecondaryStorage()
        return
      }
      console.log('stepAddPrimaryStorage', 'stepAddPrimaryStorage')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.primary.storage')
      const params = {}
      params.zoneid = this.stepData.zoneReturned.id
      params.podId = this.stepData.podReturned.id
      params.clusterid = this.stepData.clusterReturned.id
      params.name = this.prefillContent.primaryStorageName ? this.prefillContent.primaryStorageName.value : null
      params.scope = this.prefillContent.primaryStorageScope ? this.prefillContent.primaryStorageScope.value : null
      if (params.scope === 'zone') {
        const hypervisor = this.prefillContent.hypervisor.value
        if (hypervisor !== undefined) {
          params.hypervisor = hypervisor
        } else if (this.stepData.clusterReturned.hypervisortype !== undefined) {
          params.hypervisor = this.stepData.clusterReturned.hypervisortype
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
        this.stepData.primaryStorageRetunred = await this.createStoragePool(params)
        await this.stepAddSecondaryStorage()
      } catch (e) {
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
        console.log(e)
      }
    },
    async stepAddSecondaryStorage () {
      if (!this.prefillContent.secondaryStorageProvider.value ||
      this.prefillContent.secondaryStorageProvider.value.length === 0) {
        await this.stepComplete()
        return
      }
      console.log('stepAddSecondaryStorage')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.creating.secondary.storage', 'stepAddSecondaryStorage')

      const params = {}
      params.name = this.prefillContent.secondaryStorageName ? this.prefillContent.secondaryStorageName.value : null
      if (this.prefillContent.secondaryStorageProvider.value === 'NFS') {
        const nfsServer = this.prefillContent.secondaryStorageServer.value
        const path = this.prefillContent.secondaryStoragePath.value
        const url = this.nfsURL(nfsServer, path)

        params.provider = this.prefillContent.secondaryStorageProvider.value
        params.zoneid = this.stepData.zoneReturned.id
        params.url = url

        try {
          await this.addImageStore(params)
          await this.stepComplete()
        } catch (e) {
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      } else if (this.prefillContent.secondaryStorageProvider.value === 'SMB') {
        const nfsServer = this.prefillContent.secondaryStorageServer.value
        const path = this.prefillContent.secondaryStoragePath.value
        const url = this.smbURL(nfsServer, path)

        params.provider = this.prefillContent.secondaryStorageProvider.value
        params.zoneid = this.stepData.zoneReturned.id
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
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
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
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }

        if (this.prefillContent.secondaryStorageNFSStaging.value) {
          const nfsServer = this.prefillContent.secondaryStorageNFSServer.value
          const path = this.prefillContent.secondaryStorageNFSPath.value
          const url = this.nfsURL(nfsServer, path)

          const nfsParams = {}
          nfsParams.provider = 'nfs'
          nfsParams.zoneid = this.stepData.zoneReturned.id
          nfsParams.url = url

          try {
            await this.createSecondaryStagingStore(nfsParams)
          } catch (e) {
            this.messageError = e
            this.processStatus = STATUS_FAILED
            this.setStepStatus(STATUS_FAILED)
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
          this.messageError = e
          this.processStatus = STATUS_FAILED
          this.setStepStatus(STATUS_FAILED)
        }
      }
    },
    async stepEnableSecurityGroupProvider () {
      console.log('stepEnableSecurityGroupProvider')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.enabling.security.group.provider', 'stepEnableSecurityGroupProvider')

      const listNetworkParams = {}
      listNetworkParams.name = 'SecurityGroupProvider'
      listNetworkParams.physicalNetworkId = this.stepData.physicalNetworkReturned.id

      try {
        const securityGroupProviderId = await this.listNetworkServiceProviders(listNetworkParams)
        await this.updateNetworkServiceProvider(securityGroupProviderId, 'enableSecurityGroupProvider')
        await this.stepAddNetscalerProvider()
      } catch (e) {
        this.messageError = e
        this.processStatus = STATUS_FAILED
        this.setStepStatus(STATUS_FAILED)
      }
    },
    stepComplete () {
      console.log('stepComplete')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.addStep('message.Zone.creation.complete', 'stepComplete')
      this.setStepStatus(STATUS_FINISH)
      this.currentStep++
      this.processStatus = STATUS_FINISH
    },
    async pollJob (jobId) {
      console.log('pollJob', jobId)

      return new Promise(resolve => {
        const asyncJobInterval = setInterval(() => {
          api('queryAsyncJobResult', { jobId }).then(async json => {
            const result = json.queryasyncjobresultresponse
            console.log('jobResult', result)
            if (result.jobstatus === 0) {
              return
            }

            clearInterval(asyncJobInterval)
            resolve(result)
          })
        }, 1000)
      })
    },
    createZone (args) {
      return new Promise((resolve, reject) => {
        let message = ''

        api('createZone', args).then(json => {
          const zone = json.createzoneresponse.zone
          resolve(zone)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    dedicateZone (args) {
      console.log('dedicateZone')
      return new Promise((resolve, reject) => {
        let message = ''

        api('dedicateZone', args).then(json => {
          resolve()
        }).catch(error => {
          message = error.response.headers['x-description']
          resolve(message)
        })
      })
    },
    async createPhysicalNetwork (args) {
      console.log('createPhysicalNetwork')
      return new Promise((resolve, reject) => {
        let message = ''

        api('createPhysicalNetwork', args).then(async json => {
          const jobId = json.createphysicalnetworkresponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
            if (result.jobstatus === 2) {
              message = 'createPhysicalNetwork failed. Error: ' + result.jobresult.errortext
              reject(message)
              return
            }
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    addTrafficType (trafficType) {
      console.log('addTrafficType')
      const getTrafficParams = this.trafficLabelParam(trafficType.toLowerCase())
      let params = {}

      params.trafficType = trafficType
      params.physicalnetworkid = this.stepData.physicalNetworkReturned.id
      params = { ...params, ...getTrafficParams }

      return new Promise((resolve, reject) => {
        let message = ''

        api('addTrafficType', params).then(async json => {
          const jobId = json.addtraffictyperesponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
            if (result.jobstatus === 2) {
              this.setStepStatus(STATUS_FAILED)
              message = 'Failed to add ' + trafficType + ' traffic type to basic zone. Error: ' + result.jobresult.errortext
              reject(message)
              return
            }
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    updatePhysicalNetwork (args) {
      console.log('updatePhysicalNetwork')
      return new Promise((resolve, reject) => {
        let message = ''

        api('updatePhysicalNetwork', args).then(async json => {
          const jobId = json.updatephysicalnetworkresponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
            if (result.jobstatus === 2) {
              message = 'updatePhysicalNetwork failed. Error:' + result.jobresult.errortext
              reject(message)
              return
            }
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    listNetworkServiceProviders (params, type) {
      console.log('listNetworkServiceProviders')
      return new Promise((resolve, reject) => {
        let providerId = null
        let message = ''

        api('listNetworkServiceProviders', params).then(json => {
          const items = json.listnetworkserviceprovidersresponse.networkserviceprovider
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
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    listVirtualRouterElements (virtualRouterProviderId) {
      console.log('listVirtualRouterElements')
      return new Promise((resolve, reject) => {
        let virtualRouterElementId = null
        let message = ''

        api('listVirtualRouterElements', { nspid: virtualRouterProviderId }).then(json => {
          const items = json.listvirtualrouterelementsresponse.virtualrouterelement
          if (items != null && items.length > 0) {
            virtualRouterElementId = items[0].id
          }
          if (virtualRouterElementId === null) {
            message = 'error: listVirtualRouterElements API doesn\'t return Virtual Router Element Id'
            reject(message)
            return
          }
          resolve(virtualRouterElementId)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    configureVirtualRouterElement (virtualRouterElementId) {
      console.log('configureVirtualRouterElement')
      return new Promise((resolve, reject) => {
        let message = ''
        const params = {}
        params.enabled = true
        params.id = virtualRouterElementId

        api('configureVirtualRouterElement', params).then(async json => {
          const jobId = json.configurevirtualrouterelementresponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
            if (result.jobstatus === 2) {
              message = 'configureVirtualRouterElement failed. Error: ' + result.jobresult.errortext
              reject(message)
              return
            }
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    updateNetworkServiceProvider (providerId, type) {
      console.log('updateNetworkServiceProvider')
      return new Promise((resolve, reject) => {
        let message = ''
        const params = {}

        params.id = providerId
        params.state = 'Enabled'

        api('updateNetworkServiceProvider', params).then(async json => {
          const jobId = json.updatenetworkserviceproviderresponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
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
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    listOvsElements (ovsProviderId) {
      console.log('listOvsElements')
      return new Promise((resolve, reject) => {
        let message = ''
        let ovsElementId = null

        api('listOvsElements', { nspid: ovsProviderId }).then(json => {
          const items = json.listovselementsresponse.ovselement
          if (items != null && items.length > 0) {
            ovsElementId = items[0].id
          }
          resolve(ovsElementId)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    configureOvsElement (ovsElementId) {
      console.log('configureOvsElement')
      return new Promise((resolve, reject) => {
        let message = ''

        api('configureOvsElement', { enabled: true, id: ovsElementId }).then(async json => {
          const jobId = json.configureovselementresponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
            if (result.jobstatus === 2) {
              message = 'configureOvsElement failed. Error: ' + result.jobresult.errortext
              reject(message)
              return
            }
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    listInternalLoadBalancerElements (internalLbProviderId) {
      console.log('listInternalLoadBalancerElements')
      return new Promise((resolve, reject) => {
        let internalLbElementId = null
        let message = ''

        api('listInternalLoadBalancerElements', { nspid: internalLbProviderId }).then(json => {
          const items = json.listinternalloadbalancerelementsresponse.internalloadbalancerelement
          if (items != null && items.length > 0) {
            internalLbElementId = items[0].id
          }
          if (internalLbElementId == null) {
            message = 'error: listInternalLoadBalancerElements API doesn\'t return Internal LB Element Id'
            reject(message)
            return
          }
          resolve(internalLbElementId)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    configureInternalLoadBalancerElement (internalLbElementId) {
      console.log('configureInternalLoadBalancerElement')
      return new Promise((resolve, reject) => {
        let message = ''
        api('configureInternalLoadBalancerElement', { enabled: true, id: internalLbElementId }).then(async json => {
          const jobId = json.configureinternalloadbalancerelementresponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
            if (result.jobstatus === 2) {
              message = 'configureVirtualRouterElement failed. Error: ' + result.jobresult.errortext
              reject(message)
              return
            }
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    addNetworkServiceProvider (arg) {
      console.log('addNetworkServiceProvider')
      return new Promise((resolve, reject) => {
        let message = ''

        api('addNetworkServiceProvider', arg).then(async json => {
          const jobId = json.addnetworkserviceproviderresponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
            if (result.jobstatus === 2) {
              message = 'addNetworkServiceProvider&name=Netscaler failed. Error: ' + result.jobresult.errortext
              reject(message)
              return
            }
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    createNetwork (args) {
      console.log('createNetwork')
      return new Promise((resolve, reject) => {
        let message = ''

        api('createNetwork', args).then(json => {
          const returnedGuestNetwork = json.createnetworkresponse.network
          resolve(returnedGuestNetwork)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    createPod (args) {
      console.log('createPod')
      return new Promise((resolve, reject) => {
        let message = ''

        api('createPod', args).then(json => {
          const returnedPod = json.createpodresponse.pod
          resolve(returnedPod)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    createVlanIpRange (args) {
      console.log('createVlanIpRange')
      return new Promise((resolve, reject) => {
        let message = ''

        api('createVlanIpRange', args).then(json => {
          const item = json.createvlaniprangeresponse.vlan
          resolve(item)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    createStorageNetworkIpRange (args) {
      console.log('createStorageNetworkIpRange')
      return new Promise((resolve, reject) => {
        let message = ''

        api('createStorageNetworkIpRange', args).then(async json => {
          const jobId = json.createstoragenetworkiprangeresponse.jobid
          resolve({
            jobid: jobId,
            complete: false
          })
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    addVmwareDc (args) {
      console.log('addVmwareDc')
      return new Promise((resolve, reject) => {
        let message = ''

        api('addVmwareDc', args, 'POST').then(json => {
          const item = json.addvmwaredcresponse.vmwaredc
          resolve(item)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    addCluster (args) {
      console.log('addCluster')
      return new Promise((resolve, reject) => {
        let message = ''

        api('addCluster', args).then(json => {
          const result = json.addclusterresponse.cluster[0]
          resolve(result)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    addHost (args) {
      console.log('addHost')
      return new Promise((resolve, reject) => {
        let message = ''

        api('addHost', args).then(json => {
          const result = json.addhostresponse.host[0]
          resolve(result)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    updateConfiguration (args) {
      console.log('updateConfiguration')
      return new Promise((resolve, reject) => {
        let message = ''

        api('updateConfiguration', args).then(json => {
          resolve()
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    createStoragePool (args) {
      console.log('createStoragePool')
      return new Promise((resolve, reject) => {
        let message = ''

        api('createStoragePool', args).then(json => {
          const result = json.createstoragepoolresponse.storagepool
          resolve(result)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    addImageStore (args) {
      console.log('addImageStore')
      return new Promise((resolve, reject) => {
        let message = ''

        api('addImageStore', args).then(json => {
          const result = json.addimagestoreresponse.secondarystorage
          resolve(result)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    createSecondaryStagingStore (args) {
      console.log('createSecondaryStagingStore')
      return new Promise((resolve, reject) => {
        let message = ''

        api('createSecondaryStagingStore', args).then(json => {
          const result = json.addimagestoreresponse.secondarystorage
          resolve(result)
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
      })
    },
    addNetscalerLoadBalancer (args) {
      console.log('addNetscalerLoadBalancer')
      return new Promise((resolve, reject) => {
        let message = ''

        api('addNetscalerLoadBalancer', args, 'POST').then(async json => {
          const jobId = json.addnetscalerloadbalancerresponse.jobid
          if (jobId) {
            const result = await this.pollJob(jobId)
            if (result.jobstatus === 2) {
              message = 'addNetscalerDevice' + result.jobresult.errortext
              reject(message)
              return
            }
            resolve(result)
          }
        }).catch(error => {
          message = error.response.headers['x-description']
          reject(message)
        })
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

<style scoped lang="less">
  /deep/.step-error {
    color: #f5222d;
    margin-top: 20px;

    /deep/.ant-card-body {
      padding: 15px;
      text-align: justify;
    }
  }
</style>

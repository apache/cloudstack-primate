<template>
  <div>
    <a-steps :current="current" labelPlacement="vertical" :onChange="onChange()">
      <a-step v-for="(item) in steps" :key="item.title" :title="item.title"></a-step>
    </a-steps>
    <div>
      <zone-wizard-zone-type-step
        v-if="current === 0"
        @nextPressed="nextPressed"
        @fieldsChanged="onFieldsChanged"
        :preFillContent="zoneConfig"
      />
      <zone-wizard-zone-details-step
        v-else-if="current === 1"
        @nextPressed="nextPressed"
        @backPressed="backPressed"
        @fieldsChanged="onFieldsChanged"
        :preFillContent="zoneConfig"
      />
      <div v-else>
        {{ steps[current].description }}
      </div>
    </div>
  </div>
</template>
<script>
import ZoneWizardZoneTypeStep from '@views/infra/zone/ZoneWizardZoneTypeStep'
import ZoneWizardZoneDetailsStep from '@views/infra/zone/ZoneWizardZoneDetailsStep'

export default {
  components: {
    ZoneWizardZoneTypeStep,
    ZoneWizardZoneDetailsStep
  },
  data () {
    return {
      current: 0,
      api: 'createZone',
      steps: [
        {
          title: 'Zone Type',
          description: 'Select type of zone basic/advanced.',
          hint: 'This is the type of zone deployement that you want to use. Basic zone: provides a single network where each VM instance is assigned an IP directly from the network. Guest isolation can be provided through layer-3 means such as security groups (IP address source filtering). Advanced zone: For more sophisticated network topologies. This network model provides the most flexibility in defining guest networks and providing custom network offerings such as firewall, VPN, or load balancer support.'
        },
        {
          title: 'Zone details',
          description: 'Populate zone details',
          hint: 'A zone is the largest organizational unit in CloudStack, and it typically corresponds to a single datacenter. Zones provide physical isolation and redundancy. A zone consists of one or more pods (each of which contains hosts and primary storage servers) and a secondary storage server which is shared by all pods in the zone.'
        },
        {
          title: 'Network',
          description: 'Setup network and traffic',
          hint: 'Configure network components and public/guest/management traffic including IP addresses.'
        },
        {
          title: 'Add Resource',
          description: 'Add infrastructure resources',
          hint: 'Add infrastructure resources - pods, clusters, primary/secondary storages.'
        },
        {
          title: 'Launch',
          description: 'Setup network and traffic',
          hint: 'Configure network components and traffic including IP addresses.'
        }
      ],
      zoneConfig: {}
    }
  },
  methods: {
    nextPressed () {
      this.current++
    },
    backPressed (data) {
      this.current--
    },
    done () {
      this.$message.success('Processing complete!')
    },
    onChange () {
      // console.log('Step changed')
    },
    onFieldsChanged (data) {
      console.log(data)
      this.zoneConfig = { ...this.zoneConfig, ...data }
    }
  }
}
</script>
<style scoped>
  .steps-content {
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    vertical-align: 'center';
    padding: 8px;
    padding-top: 16px;
  }

  .steps-action {
    margin-top: 24px;
  }
</style>

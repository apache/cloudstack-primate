<template>
  <div style="width: auto;">
    <a-steps progressDot :current="currentStep" size="small" style="margin-left: 0px; margin-top: 16px;">
      <a-step v-for="step in steps" :key="step.title" :title="step.title" :style="'width:' + 100 / steps.length + '%;'"/>
    </a-steps>
    <static-inputs-form
      v-if="currentStep === 0"
      @nextPressed="nextPressed"
      @backPressed="handleBack"
      @fieldsChanged="fieldsChanged"
      :fields="clusterFields"
      :prefillContent="prefillContent"
      :description="steps[currentStep].description"
    />

    <static-inputs-form
      v-if="currentStep === 1"
      @nextPressed="nextPressed"
      @backPressed="handleBack"
      @fieldsChanged="fieldsChanged"
      :fields="hostFields"
      :prefillContent="prefillContent"
      :description="steps[currentStep].description"
    />

    <static-inputs-form
      v-if="currentStep === 2"
      @nextPressed="nextPressed"
      @backPressed="handleBack"
      @fieldsChanged="fieldsChanged"
      :fields="primaryStorageFields"
      :prefillContent="prefillContent"
      :description="steps[currentStep].description"
    />
  </div>
</template>
<script>
import StaticInputsForm from '@views/infra/zone/StaticInputsForm'

export default {
  components: {
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
      steps: [
        {
          title: 'Cluster',
          description: 'Each pod must contain one or more clusters, and we will add the first cluster now. A cluster provides a way to group hosts. The hosts in a cluster all have identical hardware, run the same hypervisor, are on the same subnet, and access the same shared storage. Each cluster consists of one or more hosts and one or more primary storage servers.'
        },
        {
          title: 'Host',
          description: 'Each cluster must contain at least one host (computer) for guest VMs to run on, and we will add the first host now. For a host to function in CloudStack, you must install hypervisor software on the host, assign an IP address to the host, and ensure the host is connected to the CloudStack management server. Give the hosts DNS or IP address, the user name (usually root) and password, and any labels you use to categorize hosts.'
        },
        {
          title: 'Primary Storage',
          description: 'Each cluster must contain one or more primary storage servers, and we will add the first one now. Primary storage contains the disk volumes for all the VMs running on hosts in the cluster. Use any standards-compliant protocol that is supported by the underlying hypervisor.'
        }
        // {
        //   title: 'Secondary Storage',
        //   description: 'Each zone must have at least one NFS or secondary storage server, and we will add the first one now. Secondary storage stores VM templates, ISO images, and VM disk volume snapshots. This server must be available to all hosts in the zone. Provide the IP address and exported path.'
        // }
      ],
      clusterFields: [
        {
          title: 'Cluster Name',
          key: 'clusterName',
          placeHolder: 'Please enter cluster name',
          required: true
        }
      ],
      hostFields: [
        {
          title: 'Host Name',
          key: 'hostName',
          placeHolder: 'Please enter host name',
          required: true
        },
        {
          title: 'User Name',
          key: 'hostUserName',
          placeHolder: 'Please enter host username',
          required: true
        },
        {
          title: 'Host Password',
          key: 'hostPassword',
          placeHolder: 'Please enter host password',
          required: true
        },
        {
          title: 'Tags',
          key: 'hostTags',
          placeHolder: 'Please enter host tags',
          required: false
        }
      ],
      primaryStorageFields: [
        {
          title: 'Name',
          key: 'primaryStorageName',
          placeHolder: 'Please enter name',
          required: true
        },
        {
          title: 'Scope',
          key: 'primaryStorageScope',
          placeHolder: 'Please enter scope',
          required: false
        },
        {
          title: 'Protocol',
          key: 'primaryStorageProtocol',
          placeHolder: 'Please enter primary sotrage protocol',
          required: true
        },
        {
          title: 'Server',
          key: 'primaryStorageServer',
          placeHolder: 'Please enter primary sotrage server',
          required: true
        },
        {
          title: 'Path',
          key: 'primaryStoragePath',
          placeHolder: 'Please enter primary sotrage path',
          required: true
        },
        {
          title: 'Storage Tags',
          key: 'primaryStorageTags',
          placeHolder: 'Please enter storage tags',
          required: false
        }
      ]
    }
  },
  methods: {
    nextPressed () {
      if (this.currentStep === this.steps.length - 1) {
        this.$emit('nextPressed')
      } else {
        this.currentStep++
      }
    },
    handleBack (e) {
      if (this.currentStep === 0) {
        this.$emit('backPressed')
      } else {
        this.currentStep--
      }
    },
    fieldsChanged (changed) {
      this.$emit('fieldsChanged', changed)
    }
  }
}
</script>
<style scoped>
</style>

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
    <a-card
      class="ant-form-text"
      style="text-align: justify; margin: 10px 0;">
      {{ zoneType !== null ? zoneDescription[zoneType] : 'Please select zone type below.' }}
    </a-card>
    <a-table bordered :dataSource="physicalNetworks" :columns="columns" :pagination="false" style="margin-bottom: 24px;">
      <template slot="name" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
      </template>
      <template slot="isolationMethod" slot-scope="text, record">
        <editable-cell-drop-down :text="text" @change="onCellChange(record.key, 'isolationMethod', $event)" />
      </template>
      <template slot="traffics" slot-scope="traffics, record" class="editable-cell">
        <a-tag
          v-for="traffic in traffics"
          :color="trafficColors[traffic.type]"
          :key="traffic.type"
          style="margin:2px;"
        >
          {{ traffic.type.toUpperCase() }}
          <a-icon type="edit" class="traffic-type-action" @click="editTraffic(record.key, traffic, $event)"/>
          <a-icon type="delete" class="traffic-type-action" @click="deleteTraffic(record.key, traffic, $event)"/>
        </a-tag>
        <a-modal
          title="Edit traffic type"
          :visible="showEditTraffic"
          :closable="true"
          @ok="updateTrafficLabel(trafficInEdit)"
          @cancel="cancelEditTraffic"
          centered
        >
          <a-form :form="form">
            <span class="ant-form-text"> Please specify the traffic label you want associated with this traffic type. </span>
            <a-form-item v-bind="formItemLayout" style="margin-top:16px;" label="XenServer Traffic Label">
              <a-input
                v-decorator="['trafficLabel', {
                  rules: [{
                    required: true,
                    message: 'Please enter traffic label',
                  }]
                }]"
              />
            </a-form-item>
          </a-form>
        </a-modal>
        <div v-if="availableTrafficToAdd !== null && availableTrafficToAdd.length > 0">
          <div v-if="addingTrafficForKey === record.key">
            <a-select
              :defaultValue="trafficLabelSelected"
              @change="val => { trafficLabelSelected = val }"
              style="min-width: 120px;"
            >
              <a-select-option v-for="(traffic, index) in availableTrafficToAdd" :value="traffic" :key="index"> {{ traffic.toUpperCase() }} </a-select-option>
            </a-select>
            <a-icon
              type="check"
              @click="trafficAdded"
            />
          </div>
          <a-tag
            key="addingTraffic"
            style="margin:2px;"
            v-else
            @click="addingTraffic(record.key)"
          >
            <a-icon type="plus" /> Add Traffic
          </a-tag>
        </div>
      </template>
      <template slot="actions" slot-scope="text, record">
        <a-popconfirm
          v-if="physicalNetworks.length > 1"
          title="Delete?"
          @confirm="() => onDelete(record.key)"
        >
          <a-icon type="delete" href="javascript;;" />
        </a-popconfirm>
      </template>
      <template slot="footer" class="editable-add-btn" v-if="isAdvancedZone">
        <a-button
          :disabled="hasUnusedPhysicalNetwork || availableTrafficToAdd.length === 0"
          @click="handleAddPhysicalNetwork">
          Add Physical Network
        </a-button>
      </template>
    </a-table>
    <div class="form-action">
      <a-button class="button-right" @click="handleBack">
        Back
      </a-button>
      <a-button class="button-next" type="primary" @click="handleSubmit">
        Next
      </a-button>
    </div>
    <a-modal
      :visible="showError"
      title="Error!"
      @ok="() => { showError = false }"
      @cancel="() => { showError = false }"
      centered
    >
      <span>Error in configuration! All required traffic types should be added and with multiple physical networks each network should have a label.</span>
    </a-modal>
  </div>
</template>
<script>
import EditableCell from './EditableCell'
import EditableCellDropDown from './EditableCellDropDown'

export default {
  components: {
    EditableCell,
    EditableCellDropDown
  },
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
      formItemLayout: {
        labelCol: { span: 10 },
        wrapperCol: { span: 12 }
      },
      physicalNetworks: [],
      count: 0,
      zoneDescription: {
        Basic: 'When adding a basic zone, you can set up one physical network, which corresponds to a NIC on the hypervisor. The network carries several types of traffic.',
        Advanced: 'When adding an advanced zone, you need to set up one or more physical networks. Each network corresponds to a NIC on the hypervisor. Each physical network can carry one or more types of traffic, with certain restrictions on how they may be combined.'
      },
      hasUnusedPhysicalNetwork: false,
      trafficColors: {
        public: 'orange',
        guest: 'green',
        management: 'geekblue',
        storage: 'red'
      },
      showEditTraffic: false,
      trafficInEdit: null,
      availableTrafficToAdd: ['storage'],
      addingTrafficForKey: '-1',
      trafficLabelSelected: null,
      showError: false
    }
  },
  computed: {
    columns () {
      if (this.isAdvancedZone) {
        return [
          {
            title: 'Network Name',
            dataIndex: 'name',
            width: '30%',
            scopedSlots: { customRender: 'name' }
          },
          {
            title: 'Isolation Method',
            dataIndex: 'isolationMethod',
            scopedSlots: { customRender: 'isolationMethod' }
          },
          {
            title: 'Traffic Types',
            key: 'traffics',
            dataIndex: 'traffics',
            scopedSlots: { customRender: 'traffics' }
          },
          {
            title: '',
            dataIndex: 'actions',
            scopedSlots: { customRender: 'actions' }
          }
        ]
      } else {
        return [
          {
            title: 'Network Name',
            dataIndex: 'name',
            width: '30%',
            scopedSlots: { customRender: 'name' }
          },
          {
            title: 'Isolation Method',
            dataIndex: 'isolationMethod',
            scopedSlots: { customRender: 'isolationMethod' }
          },
          {
            title: 'Traffic Types',
            key: 'traffics',
            dataIndex: 'traffics',
            scopedSlots: { customRender: 'traffics' }
          }
        ]
      }
    },
    isAdvancedZone () {
      return this.zoneType === 'Advanced'
    },
    zoneType () {
      return this.prefillContent.zoneType ? this.prefillContent.zoneType.value : null
    },
    securityGroupsEnabled () {
      return this.isAdvancedZone && (this.prefillContent.securityGroupsEnabled ? this.prefillContent.securityGroupsEnabled.value : false)
    },
    networkOfferingSelected () {
      return this.prefillContent.networkOfferingSelected
    },
    needsPublicTraffic () {
      if (!this.isAdvancedZone) { // Basic zone
        return (this.networkOfferingSelected && (this.networkOfferingSelected.havingEIP || this.networkOfferingSelected.havingELB))
      } else {
        return !this.securityGroupsEnabled
      }
    },
    requiredTrafficTypes () {
      const traffics = ['management', 'guest']
      if (this.needsPublicTraffic) {
        traffics.push('public')
      }
      return traffics
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.physicalNetworks = this.prefillContent.physicalNetworks
    this.hasUnusedPhysicalNetwork = this.getHasUnusedPhysicalNetwork()
    const requiredTrafficTypes = this.requiredTrafficTypes
    if (this.physicalNetworks && this.physicalNetworks.length > 0) {
      this.count = this.physicalNetworks.length
      requiredTrafficTypes.forEach(type => {
        let foundType = false
        this.physicalNetworks.forEach(net => {
          for (const index in net.traffics) {
            const traffic = net.traffics[index]
            if (traffic.type === 'storage') {
              const idx = this.availableTrafficToAdd.indexOf(traffic.type)
              if (idx > -1) this.availableTrafficToAdd.splice(idx, 1)
            }
            if (traffic.type === type) {
              foundType = true
            }
          }
        })
        if (!foundType) this.availableTrafficToAdd.push(type)
      })
    } else {
      const traffics = requiredTrafficTypes.map(item => {
        return { type: item, label: '' }
      })
      this.count = 1
      this.physicalNetworks = [{ key: '0', name: 'Physical Network 1', traffics: traffics }]
    }
    this.emitPhysicalNetworks()
  },
  methods: {
    onCellChange (key, dataIndex, value) {
      const physicalNetworks = [...this.physicalNetworks]
      const target = physicalNetworks.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.physicalNetworks = physicalNetworks
      }
      this.emitPhysicalNetworks()
    },
    onDelete (key) {
      const physicalNetworks = [...this.physicalNetworks]
      this.physicalNetworks = physicalNetworks.filter(item => item.key !== key)
      this.hasUnusedPhysicalNetwork = this.getHasUnusedPhysicalNetwork()
      this.emitPhysicalNetworks()
    },
    handleAddPhysicalNetwork () {
      const { count, physicalNetworks } = this
      const newData = {
        key: count,
        name: `Physical Network ${count + 1}`,
        isolationMethod: 'VLAN',
        traffics: []
      }
      this.physicalNetworks = [...physicalNetworks, newData]
      this.count = count + 1
      this.hasUnusedPhysicalNetwork = this.getHasUnusedPhysicalNetwork()
    },
    isValidSetup () {
      const shouldHaveLabels = this.physicalNetworks.length > 1
      let isValid = true
      this.requiredTrafficTypes.forEach(type => {
        let foundType = false
        this.physicalNetworks.forEach(net => {
          net.traffics.forEach(traffic => {
            if (traffic.type === type) {
              foundType = true
            }
            if (shouldHaveLabels && (!traffic.label || traffic.label.length === 0)) {
              isValid = false
            }
          })
        })
        if (!foundType || !isValid) {
          isValid = false
        }
      })
      return isValid
    },
    handleSubmit (e) {
      if (this.isValidSetup()) {
        this.$emit('nextPressed', this.physicalNetworks)
      } else {
        this.showError = true
      }
    },
    handleBack (e) {
      this.$emit('backPressed')
    },
    addingTraffic (key) {
      this.addingTrafficForKey = key
      this.trafficLabelSelected = this.availableTrafficToAdd[0]
    },
    trafficAdded (trafficType) {
      this.physicalNetworks[this.addingTrafficForKey].traffics.push({
        type: this.trafficLabelSelected.toLowerCase(),
        label: ''
      })
      this.availableTrafficToAdd = this.availableTrafficToAdd.filter(item => item !== this.trafficLabelSelected)
      this.addingTrafficForKey = null
      this.trafficLabelSelected = null
      this.emitPhysicalNetworks()
    },
    editTraffic (key, traffic, $event) {
      this.trafficInEdit = {
        key: key,
        traffic: traffic
      }
      this.showEditTraffic = true
      this.form.setFieldsValue({
        trafficLabel: this.trafficInEdit !== null ? this.trafficInEdit.traffic.label : null
      })
    },
    deleteTraffic (key, traffic, $event) {
      this.physicalNetworks[key].traffics = this.physicalNetworks[key].traffics.filter(tr => {
        return tr.type !== traffic.type
      })
      this.availableTrafficToAdd.push(traffic.type)
      this.hasUnusedPhysicalNetwork = this.getHasUnusedPhysicalNetwork()
      this.emitPhysicalNetworks()
    },
    updateTrafficLabel (trafficInEdit) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.showEditTraffic = false
          trafficInEdit.traffic.label = values.trafficLabel
          this.trafficInEdit = null
        }
      })
      this.emitPhysicalNetworks()
    },
    cancelEditTraffic () {
      this.showEditTraffic = false
      this.trafficInEdit = null
    },
    getHasUnusedPhysicalNetwork () {
      let hasUnused = false
      if (this.physicalNetworks && this.physicalNetworks.length > 0) {
        this.physicalNetworks.forEach(item => {
          if (!item.traffics || item.traffics.length === 0) {
            hasUnused = true
          }
        })
      }
      return hasUnused
    },
    emitPhysicalNetworks () {
      if (this.physicalNetworks) {
        this.$emit('fieldsChanged', { physicalNetworks: this.physicalNetworks })
      }
    }
  }
}
</script>
<style>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .form-action {
    margin-top: 16px;
  }

  .traffic-type-action {
    margin-left: 2px;
    margin-right: 2px;
    padding-left: 1px;
    padding-right: 1px;
  }

  .physical-network-support {
    margin: 10px 0;
  }
</style>

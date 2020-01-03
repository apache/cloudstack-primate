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
  <div class="form-layout">
    <a-form layout="vertical" :form="form">
      <a-form-item :label="$t('url')">
        <a-input
          v-decorator="['url', {
            rules: [{ required: true, message: 'Please enter input' }]
          }]"
          :placeholder="$t('template.url.description')" />
      </a-form-item>

      <a-form-item :label="$t('name')">
        <a-input
          v-decorator="['name', {
            rules: [{ required: true, message: 'Please enter input' }]
          }]"
          :placeholder="$t('template.name.description')" />
      </a-form-item>

      <a-form-item :label="$t('displaytext')">
        <a-input
          v-decorator="['displaytext', {
            rules: [{ required: true, message: 'Please enter input' }]
          }]"
          :placeholder="$t('template.displaytext.description')" />
      </a-form-item>

      <a-form-item
        :label="$t('zoneids')"
        :validate-status="zoneError"
        :help="zoneErrorMessage">
        <a-select
          v-decorator="['zoneids', {
            rules: [
              {
                required: false,
                message: 'Please select option',
                type: 'array'
              }
            ]
          }]"
          :loading="zones.loading"
          mode="multiple"
          :placeholder="$t('template.zoneids.description')"
          @change="handlerSelectZone">
          <a-select-option v-for="opt in zones.opts" :key="opt.name || opt.description">
            {{ opt.name || opt.description }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('hypervisor')">
        <a-select
          v-decorator="['hypervisor', {
            rules: [
              {
                required: false,
                message: 'Please select option'
              }
            ]
          }]"
          :loading="hyperVisor.loading"
          :placeholder="$t('template.hypervisor.description')"
          @change="handlerSelectHyperVisor">
          <a-select-option v-for="(opt, optIndex) in hyperVisor.opts" :key="optIndex">
            {{ opt.name || opt.description }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="hyperKVMShow" :label="$t('directdownload')">
        <a-switch v-decorator="['directdownload']" />
      </a-form-item>

      <a-form-item v-if="hyperKVMShow || hyperVMWShow" :label="$t('rootDiskControllerTypeKVM')">
        <a-select
          v-decorator="['rootDiskControllerTypeKVM', {
            rules: [
              {
                required: false,
                message: 'Please select option'
              }
            ]
          }]"
          :loading="rootDisk.loading"
          :placeholder="$t('template.rootDiskControllerTypeKVM.description')">
          <a-select-option v-for="opt in rootDisk.opts" :key="opt.id">
            {{ opt.name || opt.description }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="hyperXenServerShow" :label="$t('xenserverToolsVersion61plus')">
        <a-switch
          v-decorator="['xenserverToolsVersion61plus',{
            initialValue: xenServerProvider
          }]"
          :checked="xenServerProvider" />
      </a-form-item>

      <a-form-item v-if="hyperVMWShow" :label="$t('nicAdapterType')">
        <a-select
          v-decorator="['nicAdapterType', {
            rules: [
              {
                required: false,
                message: 'Please select option'
              }
            ]
          }]"
          :placeholder="$t('template.nicAdapterType.description')">
          <a-select-option v-for="opt in nicAdapterType.opts" :key="opt.id">
            {{ opt.name || opt.description }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="hyperVMWShow" :label="$t('keyboardType')">
        <a-select
          v-decorator="['keyboardType', {
            rules: [
              {
                required: false,
                message: 'Please select option'
              }
            ]
          }]"
          :placeholder="$t('template.keyboardType.description')">
          <a-select-option v-for="opt in keyboardType.opts" :key="opt.id">
            {{ opt.name || opt.description }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('format')">
        <a-select
          v-decorator="['format', {
            rules: [
              {
                required: false,
                message: 'Please select option'
              }
            ]
          }]"
          :placeholder="$t('template.format.description')">
          <a-select-option v-for="opt in format.opts" :key="opt.id">
            {{ opt.name || opt.description }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('ostypeid')">
        <a-select
          showSearch
          v-decorator="['ostypeid', {
            rules: [
              {
                required: false,
                message: 'Please select option'
              }
            ]
          }]"
          :loading="osTypes.loading"
          :placeholder="$t('template.ostypeid.description')">
          <a-select-option v-for="opt in osTypes.opts" :key="opt.name || opt.description">
            {{ opt.name || opt.description }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('checksum')">
        <a-input
          v-decorator="['checksum', {
            rules: [{ required: false, message: 'Please enter input' }]
          }]"
          :placeholder="$t('template.checksum.description')" />
      </a-form-item>

      <a-form-item :label="$t('isextractable')">
        <a-switch v-decorator="['isextractable']" />
      </a-form-item>

      <a-form-item :label="$t('passwordenabled')">
        <a-switch v-decorator="['passwordenabled']" />
      </a-form-item>

      <a-form-item :label="$t('sshkeyenabled')">
        <a-switch v-decorator="['sshkeyenabled']" />
      </a-form-item>

      <a-form-item :label="$t('isdynamicallyscalable')">
        <a-switch v-decorator="['isdynamicallyscalable']" />
      </a-form-item>

      <a-form-item :label="$t('ispublic')">
        <a-switch v-decorator="['ispublic']" />
      </a-form-item>

      <a-form-item :label="$t('isfeatured')">
        <a-switch v-decorator="['isfeatured']" />
      </a-form-item>

      <a-form-item :label="$t('isrouting')">
        <a-switch v-decorator="['isrouting']" />
      </a-form-item>

      <a-form-item :label="$t('requireshvm')">
        <a-switch
          v-decorator="['requireshvm', {
            initialValue: true
          }]"
          defaultChecked />
      </a-form-item>

      <div :span="24" class="action-button">
        <a-button @click="closeAction">{{ this.$t('Cancel') }}</a-button>
        <a-button :loading="loading" type="primary" @click="handleSubmit">{{ this.$t('OK') }}</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'RegisterTemplate',
  data () {
    return {
      zones: {},
      hyperVisor: {},
      rootDisk: {},
      nicAdapterType: {},
      keyboardType: {},
      format: {},
      osTypes: {},
      xenServerProvider: false,
      hyperKVMShow: false,
      hyperXenServerShow: false,
      hyperVMWShow: false,
      zoneError: '',
      zoneErrorMessage: '',
      loading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.$set(this.zones, 'loading', false)
    this.$set(this.zones, 'opts', [])
    this.$set(this.hyperVisor, 'loading', false)
    this.$set(this.hyperVisor, 'opts', [])
    this.$set(this.rootDisk, 'loading', false)
    this.$set(this.rootDisk, 'opts', [])
    this.$set(this.nicAdapterType, 'loading', false)
    this.$set(this.nicAdapterType, 'opts', [])
    this.$set(this.keyboardType, 'loading', false)
    this.$set(this.keyboardType, 'opts', [])
    this.$set(this.format, 'loading', false)
    this.$set(this.format, 'opts', [])
    this.$set(this.osTypes, 'loading', false)
    this.$set(this.osTypes, 'opts', [])
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchZone()
      this.fetchOsTypes()
      this.fetchXenServerProvider()
    },
    fetchZone () {
      const params = {}
      let listZones = []
      params.listAll = true
      listZones.push({
        id: this.$t('label.all.zone'),
        name: this.$t('label.all.zone')
      })

      this.zones.loading = true
      this.zones.opts = []

      api('listZones', params).then(json => {
        const listZonesResponse = json.listzonesresponse.zone
        listZones = listZones.concat(listZonesResponse)

        this.$set(this.zones, 'opts', listZones)
      }).finally(() => {
        this.zones.loading = false
      })
    },
    fetchHyperVisor (params) {
      this.hyperVisor.loading = true
      let listhyperVisors = this.hyperVisor.opts

      api('listHypervisors', params).then(json => {
        const listResponse = json.listhypervisorsresponse.hypervisor
        listhyperVisors = listhyperVisors.concat(listResponse)

        this.$set(this.hyperVisor, 'opts', listhyperVisors)
      }).finally(() => {
        this.hyperVisor.loading = false
      })
    },
    fetchOsTypes () {
      const params = {}
      params.listAll = true

      this.osTypes.opts = []
      this.osTypes.loading = true

      api('listOsTypes', params).then(json => {
        const listOsTypes = json.listostypesresponse.ostype
        this.$set(this.osTypes, 'opts', listOsTypes)
      }).finally(() => {
        this.osTypes.loading = false
      })
    },
    fetchXenServerProvider () {
      const params = {}
      params.name = 'xenserver.pvdriver.version'

      this.xenServerProvider = true

      api('listConfigurations', params).then(json => {
        if (json.listconfigurationsresponse.configuration !== null && json.listconfigurationsresponse.configuration[0].value !== 'xenserver61') {
          this.xenServerProvider = false
        }
      })
    },
    fetchRootDisk (hyperVisor) {
      const rootDiskKVM = []
      this.rootDisk.opts = []

      if (hyperVisor === 'KVM') {
        rootDiskKVM.push({
          id: '',
          description: ''
        })
        rootDiskKVM.push({
          id: 'ide',
          description: 'ide'
        })
        rootDiskKVM.push({
          id: 'osdefault',
          description: 'osdefault'
        })
        rootDiskKVM.push({
          id: 'scsi',
          description: 'scsi'
        })
        rootDiskKVM.push({
          id: 'virtio',
          description: 'virtio'
        })
      } else if (hyperVisor === 'VMware') {
        rootDiskKVM.push({
          id: '',
          description: ''
        })
        rootDiskKVM.push({
          id: 'scsi',
          description: 'scsi'
        })
        rootDiskKVM.push({
          id: 'ide',
          description: 'ide'
        })
        rootDiskKVM.push({
          id: 'osdefault',
          description: 'osdefault'
        })
        rootDiskKVM.push({
          id: 'pvscsi',
          description: 'pvscsi'
        })
        rootDiskKVM.push({
          id: 'lsilogic',
          description: 'lsilogic'
        })
        rootDiskKVM.push({
          id: 'lsisas1068',
          description: 'lsilogicsas'
        })
        rootDiskKVM.push({
          id: 'buslogic',
          description: 'buslogic'
        })
      }

      this.$set(this.rootDisk, 'opts', rootDiskKVM)
    },
    fetchNicAdapterType () {
      const nicAdapterType = []
      nicAdapterType.push({
        id: '',
        description: ''
      })
      nicAdapterType.push({
        id: 'E1000',
        description: 'E1000'
      })
      nicAdapterType.push({
        id: 'PCNet32',
        description: 'PCNet32'
      })
      nicAdapterType.push({
        id: 'Vmxnet2',
        description: 'Vmxnet2'
      })
      nicAdapterType.push({
        id: 'Vmxnet3',
        description: 'Vmxnet3'
      })

      this.$set(this.nicAdapterType, 'opts', nicAdapterType)
    },
    fetchKeyboardType () {
      const keyboardType = []
      keyboardType.push({
        id: '',
        description: ''
      })
      keyboardType.push({
        id: 'us',
        description: 'label.standard.us.keyboard'
      })
      keyboardType.push({
        id: 'uk',
        description: 'label.uk.keyboard'
      })
      keyboardType.push({
        id: 'fr',
        description: 'label.french.azerty.keyboard'
      })
      keyboardType.push({
        id: 'jp',
        description: 'label.japanese.keyboard'
      })
      keyboardType.push({
        id: 'sc',
        description: 'label.simplified.chinese.keyboard'
      })

      this.$set(this.keyboardType, 'opts', keyboardType)
    },
    fetchFormat (hyperVisor) {
      const format = []

      switch (hyperVisor) {
        case 'Hyperv':
          format.push({
            id: 'VHD',
            description: 'VHD'
          })
          format.push({
            id: 'VHDX',
            description: 'VHDX'
          })
          break
        case 'KVM':
          this.hyperKVMShow = true
          format.push({
            id: 'QCOW2',
            description: 'QCOW2'
          })
          format.push({
            id: 'RAW',
            description: 'RAW'
          })
          format.push({
            id: 'VHD',
            description: 'VHD'
          })
          format.push({
            id: 'VMDK',
            description: 'VMDK'
          })
          break
        case 'XenServer':
          this.hyperXenServerShow = true
          format.push({
            id: 'VHD',
            description: 'VHD'
          })
          break
        case 'VMware':
          this.hyperVMWShow = true
          format.push({
            id: 'OVA',
            description: 'OVA'
          })
          break
        case 'BareMetal':
          format.push({
            id: 'BareMetal',
            description: 'BareMetal'
          })
          break
        case 'Ovm':
          format.push({
            id: 'RAW',
            description: 'RAW'
          })
          break
        case 'LXC':
          format.push({
            id: 'TAR',
            description: 'TAR'
          })
          break
        default:
          break
      }

      this.$set(this.format, 'opts', format)
    },
    handlerSelectZone (value) {
      this.validZone(value)
      this.hyperVisor.opts = []

      if (this.zoneError !== '') {
        return
      }

      this.resetSelect()

      const params = {}
      const allZoneExists = value.filter(zone => zone === this.$t('label.all.zone'))

      if (allZoneExists.length > 0) {
        params.listAll = true

        this.fetchHyperVisor(params)
        return
      }

      for (let i = 0; i < value.length; i++) {
        const zoneSelected = this.zones.opts.filter(zone => zone.name === value[i])

        if (zoneSelected.length > 0) {
          params.zoneid = zoneSelected[0].id
          this.fetchHyperVisor(params)
        }
      }
    },
    handlerSelectHyperVisor (value) {
      const hyperVisor = this.hyperVisor.opts[value].name

      this.hyperXenServerShow = false
      this.hyperVMWShow = false
      this.hyperKVMShow = false

      this.resetSelect()
      this.fetchFormat(hyperVisor)
      this.fetchRootDisk(hyperVisor)
      this.fetchNicAdapterType()
      this.fetchKeyboardType()
    },
    handleSubmit (e) {
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err || this.zoneError !== '') {
          return
        }

        const params = {}

        for (const key in values) {
          const input = values[key]

          if (input === undefined) {
            continue
          }

          if (key === 'zoneids') {
            if (input.length === 1 && input[0] === this.$t('label.all.zone')) {
              params.zoneid = '-1'
              continue
            }

            const zonesSelected = []
            for (const index in input) {
              const name = input[index]
              const zone = this.zones.opts.filter(zone => zone.name === name)
              if (zone && zone[0]) {
                zonesSelected.push(zone[0].id)
              }
            }

            params[key] = zonesSelected.join(',')
          } else if (key === 'ostypeid') {
            const osTypeSelected = this.osTypes.opts.filter(item => item.description === input)
            if (osTypeSelected && osTypeSelected[0]) {
              params[key] = osTypeSelected[0].id
            }
          } else if (key === 'hypervisor') {
            params[key] = this.hyperVisor.opts[input].name
          } else {
            params[key] = input
          }
        }

        this.loading = true

        api('registerTemplate', params).then(json => {
          this.$emit('refresh-data')
          this.$notification.success({
            message: 'Register Template',
            description: 'Sucessfully registered template ' + params.name
          })
        }).catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
          })
        }).finally(() => {
          this.loading = false
          this.closeAction()
        })
      })
    },
    validZone (zones) {
      const allZoneExists = zones.filter(zone => zone === this.$t('label.all.zone'))

      this.zoneError = ''
      this.zoneErrorMessage = ''

      if (allZoneExists.length > 0 && zones.length > 1) {
        this.zoneError = 'error'
        this.zoneErrorMessage = this.$t('label.error.zone.combined')
      }
    },
    closeAction () {
      this.$emit('close-action')
    },
    resetSelect () {
      this.form.setFieldsValue({
        hypervisor: undefined,
        format: undefined,
        rootDiskControllerTypeKVM: undefined,
        nicAdapterType: undefined,
        keyboardType: undefined
      })
    }
  }
}
</script>

<style scoped lang="less">
  .form-layout {
    width: 500px;
  }

  .action-button {
    text-align: right;

    button {
      margin-right: 5px;
    }
  }
</style>

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
    <a-row :gutter="12">
      <a-col :md="24" :lg="17">
        <a-card :bordered="true" :title="this.$t('newInstance')">
          <a-form
            :form="form"
            @submit="handleSubmit"
            layout="vertical"
          >
            <a-form-item :label="this.$t('name')">
              <a-input
                v-decorator="['name']"
                :placeholder="this.$t('vm.name.description')"
              />
            </a-form-item>

            <a-form-item :label="this.$t('zoneid')">
              <a-select
                v-decorator="['zoneid', {
                  rules: [{ required: zoneId.required, message: 'Please select option' }]
                }]"
                :placeholder="this.$t('vm.zone.description')"
              >
                <a-select-option
                  v-for="(opt, optIndex) in zoneId.opts"
                  :key="optIndex"
                  :value="opt.id"
                >
                  {{ opt.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-collapse
              :accordion="true"
              defaultActiveKey="templates"
            >
              <a-collapse-panel :header="this.$t('Templates')" key="templates">
                <template-selection
                  :templates="templateId.opts"
                ></template-selection>
                <disk-size-selection
                  input-decorator="rootdisksize"
                ></disk-size-selection>
              </a-collapse-panel>

              <a-collapse-panel :header="this.$t('ISOs')" key="isos">
                <iso-selection
                  :isos="isos"
                ></iso-selection>
              </a-collapse-panel>
            </a-collapse>

            <compute-selection
              :compute-items="serviceOfferingId.opts"
              :value="serviceOffering ? serviceOffering.id : ''"
              @select-compute-item="($event) => updateComputeOffering($event)"
            ></compute-selection>

            <disk-offering-selection
              :items="diskOfferingId.opts"
              :value="diskOffering ? diskOffering.id : ''"
              @select-disk-offering-item="($event) => updateDiskOffering($event)"
            ></disk-offering-selection>

            <disk-size-selection
              v-if="diskOffering && diskOffering.iscustomized"
              input-decorator="size"
            ></disk-size-selection>

            <div class="card-footer">
              <!-- ToDo extract as component -->
              <a-button @click="() => this.$router.back()">{{ this.$t('cancel') }}</a-button>
              <a-button type="primary" @click="handleSubmit">{{ this.$t('submit') }}</a-button>
            </div>
          </a-form>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="7" v-if="!isMobile()">
        <info-card :resource="vm" :title="this.$t('yourInstance')" >
          <div slot="details" v-if="diskSize">
            <a-icon type="hdd"></a-icon>
            <span style="margin-left: 10px">{{ diskSize }}</span>
          </div>
        </info-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { api } from '@/api'
import store from '@/store'
import _ from 'lodash'
import { mixin, mixinDevice } from '@/utils/mixin.js'

import InfoCard from '@/components/view/InfoCard'
import ComputeSelection from './wizard/ComputeSelection'
import TemplateSelection from './wizard/TemplateSelection'
import DiskOfferingSelection from '@views/compute/wizard/DiskOfferingSelection'
import DiskSizeSelection from '@views/compute/wizard/DiskSizeSelection'
import IsoSelection from '@views/compute/wizard/IsoSelection'

export default {
  name: 'Wizard',
  components: {
    IsoSelection,
    DiskSizeSelection,
    DiskOfferingSelection,
    InfoCard,
    ComputeSelection,
    TemplateSelection
  },
  props: {
    visible: {
      type: Boolean
    }
  },
  mixins: [mixin, mixinDevice],
  data () {
    return {
      vm: {},
      params: [],
      visibleParams: [
        'name',
        'templateid',
        'serviceofferingid',
        'diskofferingid',
        'zoneid',
        'rootdisksize'
      ],
      instanceConfig: [],
      template: {},
      serviceOffering: {},
      diskOffering: {},
      zone: {},
      isos: []
    }
  },
  computed: {
    filteredParams () {
      return this.visibleParams.map((fieldName) => {
        return this.params.find((param) => fieldName === param.name)
      })
    },
    templateId () {
      return this.getParam('templateid')
    },
    serviceOfferingId () {
      return this.getParam('serviceofferingid')
    },
    diskOfferingId () {
      return this.getParam('diskofferingid')
    },
    zoneId () {
      return this.getParam('zoneid')
    },
    diskSize () {
      const rootDiskSize = _.get(this.instanceConfig, 'rootdisksize', 0)
      const customDiskSize = _.get(this.instanceConfig, 'size', 0)
      const diskOfferingDiskSize = _.get(this.diskOffering, 'disksize', 0)
      const dataDiskSize = diskOfferingDiskSize > 0 ? diskOfferingDiskSize : customDiskSize
      const size = []
      if (rootDiskSize > 0) {
        size.push(`${rootDiskSize} GB (Root)`)
      }
      if (dataDiskSize > 0) {
        size.push(`${dataDiskSize} GB (Data)`)
      }
      return size.join(' | ')
    }
  },
  watch: {
    instanceConfig (instanceConfig) {
      this.template = this.templateId.opts.find((option) => option.id === instanceConfig.templateid)
      this.serviceOffering = this.serviceOfferingId.opts.find((option) => option.id === instanceConfig.computeofferingid)
      this.diskOffering = this.diskOfferingId.opts.find((option) => option.id === instanceConfig.diskofferingid)
      this.zone = this.zoneId.opts.find((option) => option.id === instanceConfig.zoneid)

      if (this.zone) {
        this.vm['zoneid'] = this.zone.id
        this.vm['zonename'] = this.zone.name
      }

      if (this.template) {
        this.vm['templateid'] = this.template.id
        this.vm['templatename'] = this.template.displaytext
        this.vm['ostypeid'] = this.template.ostypeid
        this.vm['ostypename'] = this.template.ostypename
      }

      if (this.serviceOffering) {
        this.vm['serviceofferingid'] = this.serviceOffering.id
        this.vm['serviceofferingname'] = this.serviceOffering.displaytext
        this.vm['cpunumber'] = this.serviceOffering.cpunumber
        this.vm['cpuspeed'] = this.serviceOffering.cpuspeed
        this.vm['memory'] = this.serviceOffering.memory
      }

      if (this.diskOffering) {
        this.vm['diskofferingid'] = this.diskOffering.id
        this.vm['diskofferingname'] = this.diskOffering.displaytext
        this.vm['diskofferingsize'] = this.diskOffering.disksize
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      onValuesChange: (props, fields) => {
        this.instanceConfig = { ...this.form.getFieldsValue(), ...fields }
        this.vm = this.instanceConfig
      }
    })
    this.form.getFieldDecorator('computeofferingid', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('diskofferingid', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('isoid', { initialValue: [], preserve: true })
  },
  created () {
    this.params = store.getters.apis[this.$route.name]['params']
    this.filteredParams.forEach((param) => {
      this.fetchOptions(param)
    })
    this.fetchIsos()
    Vue.nextTick().then(() => {
      this.instanceConfig = this.form.getFieldsValue() // ToDo: maybe initialize with some other defaults
    })
  },
  methods: {
    updateComputeOffering (id) {
      this.form.setFieldsValue({
        computeofferingid: id
      })
    },
    updateDiskOffering (id) {
      this.form.setFieldsValue({
        diskofferingid: id
      })
    },
    getParam (paramName) {
      return this.params.find((param) => param.name === paramName)
    },
    getText (option) {
      return _.get(option, 'displaytext', _.get(option, 'name'))
    },
    handleSubmit () {
      console.log('wizard submit')
    },
    fetchOptions (param) {
      const paramName = param.name
      const possibleName = `list${paramName.replace('id', '').toLowerCase()}s`
      let possibleApi
      if (paramName === 'id') {
        possibleApi = this.apiName
      } else {
        possibleApi = _.filter(Object.keys(store.getters.apis), (api) => {
          return api.toLowerCase().startsWith(possibleName)
        })[0]
      }

      if (!possibleApi) {
        return
      }

      param.loading = true
      param.opts = []
      const params = {}
      params.listall = true
      if (possibleApi === 'listTemplates') {
        params.templatefilter = 'executable'
      }
      api(possibleApi, params).then((response) => {
        param.loading = false
        _.map(response, (responseItem, responseKey) => {
          if (!responseKey.includes('response')) {
            return
          }
          _.map(responseItem, (response, key) => {
            if (key === 'count') {
              return
            }
            param.opts = response
            this.$forceUpdate()
          })
        })
      }).catch(function (error) {
        console.log(error.stack)
        param.loading = false
      })
    },
    fetchIsos () {
      api('listIsos', {
        // zoneid: '', // ToDo: filter by selected zone
        isofilter: 'community', // ToDo: Repeat for all other filter
        bootable: true
      }).then((response) => {
        this.isos = _.get(response, 'listisosresponse.iso', [])
      }).catch((reason) => {
        // ToDo: Handle errors
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .card-footer {
    text-align: right;
    margin-top: 2rem;

    button + button {
      margin-left: 8px;
    }
  }

  .ant-list-item-meta-avatar {
    font-size: 1rem;
  }

  .ant-collapse {
    margin: 2rem 0;
  }
</style>

<style lang="less">
  .ant-table-selection-column {
    // Fix for the table header if the row selection use radio buttons instead of checkboxes
    > div:empty {
      width: 16px;
    }
  }
</style>

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
    <a-spin :spinning="loading">
      <a-form
        :form="form"
        @submit="handleSubmit"
        layout="vertical">

        <a-form-item :label="$t('ispublic')" v-show="this.isAdmin()">
          <a-switch v-decorator="['ispublic']" :checked="this.offeringIsPublic" />
        </a-form-item>

        <a-form-item :label="$t('domainid')" v-show="!this.offeringIsPublic">
          <a-select
            mode="multiple"
            v-decorator="['domainid', {
              rules: [
                {
                  required: true,
                  message: 'Please select option'
                }
              ]
            }]"
            showSearch
            optionFilterProp="children"
            :filterOption="(input, option) => {
              return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }"
            :loading="domainLoading"
            :placeholder="this.$t('label.domain')">
            <a-select-option v-for="(opt, optIndex) in domains" :key="optIndex">
              {{ opt.name || opt.description }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('zoneid')">
          <a-select
            mode="multiple"
            v-decorator="['zoneid', {
              rules: [
                {
                  required: true,
                  message: 'Please select option'
                }
              ]
            }]"
            showSearch
            optionFilterProp="children"
            :filterOption="(input, option) => {
              return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }"
            :loading="zoneLoading"
            :placeholder="this.$t('label.zoneid')">
            <a-select-option v-for="(opt, optIndex) in zones" :key="optIndex">
              {{ opt.name || opt.description }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <div :span="24" class="action-button">
          <a-button @click="closeAction">{{ this.$t('Cancel') }}</a-button>
          <a-button :loading="loading" type="primary" @click="handleSubmit">{{ this.$t('OK') }}</a-button>
        </div>

      </a-form>
    </a-spin>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'updateServiceOffering',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formOffering: {},
      offeringIsPublic: false,
      domains: [],
      domainLoading: false,
      zones: [],
      zoneLoading: false,
      loading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.zones = [
      {
        id: '-1',
        name: this.$t('label.all.zone')
      }
    ]
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.setupUserAccess()
      this.fetchOfferingData()
      this.fetchDomainData()
      this.fetchZoneData()
      this.setExistingValues()
      this.updateDomainSelection()
      this.updateZoneSelection()
    },
    isAdmin () {
      return true
      // return ['Admin'].includes(user.roletype)
    },
    onSChange (checked) {
      this.offeringIsPublic = checked
    },
    setupUserAccess () {
      if (this.isAdmin()) {

      }
    },
    fetchOfferingData () {
      const params = {}
      params.id = this.resource.id
      params.isrecursive = true

      api('listServiceOfferings', params).then(json => {
        const offerings = json.listserviceofferingsresponse.serviceoffering
        this.formOffering = offerings[0]
      }).finally(() => {
        console.log(this.formOffering)
      })
    },
    fetchDomainData () {
      const params = {}
      params.listAll = true
      params.details = 'min'

      this.domainLoading = true

      api('listDomains', params).then(json => {
        const listDomains = json.listdomainsresponse.domain
        this.domains = this.domains.concat(listDomains)
      }).finally(() => {
        this.domainLoading = false
      })
    },
    fetchZoneData () {
      const params = {}
      params.listAll = true

      this.zoneLoading = true

      api('listZones', params).then(json => {
        const listZones = json.listzonesresponse.zone
        this.zones = this.zones.concat(listZones)
      }).finally(() => {
        this.zoneLoading = false
      })
    },
    updateDomainSelection () {
      var offeringDomainIds = this.formOffering.domainid
      if (offeringDomainIds) {
        this.offeringIsPublic = false
        offeringDomainIds = offeringDomainIds.indexOf(',') !== -1 ? offeringDomainIds.split(',') : [offeringDomainIds]
        for (var i = 0; i < offeringDomainIds.length; i++) {
        }
      } else {
        if (this.isAdmin()) {
          this.offeringIsPublic = true
        }
      }
    },
    updateZoneSelection () {
      var offeringZoneIds = this.formOffering.zoneid
      if (offeringZoneIds) {
        offeringZoneIds = offeringZoneIds.indexOf(',') !== -1 ? offeringZoneIds.split(',') : [offeringZoneIds]
        for (var j = 0; j < offeringZoneIds.length; j++) {
        }
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }

        // const params = {}
        for (const key in values) {
          const input = values[key]
          if (input === undefined) {
            continue
          }
          console.log(key, input)
        }

        // this.loading = true
        // api('updateServiceOffering', params).then(json => {
        //   this.$emit('refresh-data')
        //   this.$notification.success({
        //     message: this.$t('label.action.update.offering.access'),
        //     description: this.$t('label.action.update.offering.access')
        //   })
        // }).catch(error => {
        //   this.$notification.error({
        //     message: 'Request Failed',
        //     description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
        //   })
        // }).finally(() => {
        //   this.loading = false
        //   this.closeAction()
        // })
      })
    },
    closeAction () {
      this.$emit('close-action')
    }
  }
}
</script>

<style scoped lang="scss">
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

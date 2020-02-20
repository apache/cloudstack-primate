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
  <div :loading="loading">
    <a-form :form="form" @submit="handleSubmit" layout="vertical">
      <a-form-item :label="$t('Name')">
        <a-input
          v-decorator="['name', {
            rules: [{ required: true, message: 'Please enter input' }]
          }]"
          :placeholder="$t('Volume Name')"/>
      </a-form-item>
      <a-form-item :label="$t('Zone')">
        <a-select
          @change="val => fetchDiskOfferings(val)"
          v-decorator="['zoneid', {
            initialValue: zones[0].id,
            rules: [{ required: true, message: 'Please select a zone' }] }]">
          <a-select-option v-for="zone in zones" :key="zone.id" :value="zone.id">
            {{ zone.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('Offering')">
        <a-select
          v-decorator="['diskofferingid', {
            initialValue: selectedDiskOffering,
            rules: [{ required: true, message: 'Please select an option' }]}]"
          :loading="loading"
          :placeholder="$t('Offering Type')"
          @change="val => isCustomDiskOffering = val == customDiskOfferingId"
        >
          <a-select-option
            v-for="(diskOffering, index) in diskOfferings"
            :value="diskOffering.id"
            :key="index"
          >{{ diskOffering.displaytext }}</a-select-option>
        </a-select>
      </a-form-item>
      <span v-if="isCustomDiskOffering">
        <a-form-item :label="$t('Size (GB)')">
          <a-input
            v-decorator="['size', {
              rules: [{ required: true, message: 'Please enter a number' }]}]"
            :placeholder="$t('Enter Size')"/>
        </a-form-item>
      </span>
      <div :span="24" class="action-button">
        <a-button @click="closeModal">{{ $t('Cancel') }}</a-button>
        <a-button :loading="loading" type="primary" @click="handleSubmit">{{ $t('OK') }}</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'CreateVolume',
  data () {
    return {
      zones: [],
      selectedZone: '',
      diskOfferings: [],
      selectedDiskOffering: '',
      customDiskOfferingId: null,
      isCustomDiskOffering: false,
      loading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchDiskOfferings(null)
      this.loading = true
      api('listZones').then(json => {
        this.zones = json.listzonesresponse.zone || []
        this.selectedZone = this.zones[0].id || ''
        this.fetchDiskOfferings(this.selectedZone)
      }).finally(() => {
        this.loading = false
      })
    },
    fetchDiskOfferings (zoneid) {
      this.loading = true
      api('listDiskOfferings', {
        zoneId: zoneid
      }).then(json => {
        this.diskOfferings = json.listdiskofferingsresponse.diskoffering || []
        this.selectedDiskOffering = this.diskOfferings[0].id || ''
        for (var diskOffering of this.diskOfferings) {
          if (diskOffering.name === 'Custom') {
            this.customDiskOfferingId = diskOffering.id
            break
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        api('createVolume', values).then(response => {
          this.$pollJob({
            jobId: response.createvolumeresponse.jobid,
            successMessage: `Successfully created volume`,
            successMethod: () => {
              this.$store.dispatch('AddAsyncJob', {
                title: `Successfully created Volume`,
                jobid: response.createvolumeresponse.jobid,
                description: values.name,
                status: 'progress'
              })
              this.$emit('refresh-data')
            },
            errorMessage: 'Failed to Create volume',
            errorMethod: () => {
              this.$emit('refresh-data')
            },
            loadingMessage: `Volume creation in progress`,
            catchMessage: 'Error encountered while fetching async job result'
          })
        }).catch(error => {
          this.$notification.error({
            message: `Error ${error.response.status}`,
            description: error.response.data.errorresponse.errortext
          })
        }).finally(() => {
          this.loading = false
          this.closeModal()
        })
      })
    },
    closeModal () {
      this.$emit('close-action')
    }
  }
}
</script>

<style lang="less" scoped>
.form-layout {
  width: 80vw;

  @media (min-width: 700px) {
    width: 550px;
  }
}

.action-button {
  text-align: right;

  button {
    margin-right: 5px;
  }
}
</style>

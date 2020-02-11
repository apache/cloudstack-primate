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
    <a-form :form="form" @submit="submitCreateVolume" layout="vertical" class="form">
      <a-form-item class="form__item" :label="$t('Name')">
        <a-input
          class="form__input"
          v-decorator="['name', {
            rules: [{ required: true, message: 'Please enter input' }]
          }]"
          :placeholder="$t('Volume Name')"
        >></a-input>
      </a-form-item>
      <a-form-item class="form__item" :label="$t('Zone')">
        <a-select
          class="form__input"
          @change="val => fetchDiskOfferings(val)"
          v-decorator="['zoneid', {
            rules: [{ required: true, message: 'Please select an option' }]}]"
          :loading="loading"
          :placeholder="$t('Select Zone')"
        >
          <a-select-option
            v-for="(zone, index) in zones"
            :value="zone.id"
            :key="index"
          >{{ zone.name }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item class="form__item" :label="$t('Offering')">
        <a-select
          class="form__input"
          v-decorator="['diskofferingid', {
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
        <a-form-item class="form__item" :label="$t('Size (GB)')">
          <a-input-number
            class="form__input"
            style="width: 100%;"
            v-decorator="['size', {
              rules: [{ required: true, message: 'Please enter a number' }]}]"
            :placeholder="$t('Enter Size')"
          ></a-input-number>
        </a-form-item>
      </span>

      <a-divider />

      <div class="form__footer">
        <a-button @click="closeModal">{{ $t('Cancel') }}</a-button>
        <a-button type="primary" @click="submitCreateVolume">{{ $t('OK') }}</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'CreateVolume',
  components: {},
  inject: ['parentFetchData', 'parentToggleLoading'],
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      zones: [],
      diskOfferings: [],
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
      this.loading = true
      api('listZones')
        .then(json => {
          this.zones = json.listzonesresponse.zone || []
        })
        .finally(() => {
          this.loading = false
        })
      this.fetchDiskOfferings(null)
    },
    fetchDiskOfferings (zoneid) {
      this.loading = true
      api('listDiskOfferings', {
        zoneId: zoneid
      })
        .then(json => {
          this.diskOfferings = json.listdiskofferingsresponse.diskoffering || []
          for (var diskOffering of this.diskOfferings) {
            if (diskOffering.name === 'Custom') {
              this.customDiskOfferingId = diskOffering.id
              break
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitCreateVolume () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.closeModal()
        this.parentToggleLoading()
        api('createVolume', values)
          .then(response => {
            this.$pollJob({
              jobId: response.createvolumeresponse.jobid,
              successMessage: `Successfully created volume`,
              successMethod: () => {
                this.parentFetchData()
                this.parentToggleLoading()
              },
              errorMessage: 'Create volume failed',
              errorMethod: () => {
                this.parentFetchData()
                this.parentToggleLoading()
              },
              loadingMessage: `Creating volume...`,
              catchMessage: 'Error encountered while fetching async job result',
              catchMethod: () => {
                this.parentFetchData()
                this.parentToggleLoading()
              }
            })
          })
          .catch(error => {
            this.$notification.error({
              message: `Error ${error.response.status}`,
              description: error.response.data.errorresponse.errortext
            })
            this.closeModal()
          })
      })
    },
    closeModal () {
      this.$parent.$parent.close()
    },
    closeAction () {
      this.$emit('close-action')
    }
  }
}
</script>

<style lang="less" scoped>
.form {

  width: 400px;

  @media (max-width: 800px) {
    width: 95vw;
  }

  &__input {
    margin-right: 10px;
  }

  &__footer {
      display: flex;
      justify-content: flex-end;
      padding-right: 20px;

      button {
        &:not(:last-child) {
          padding-right: 20px;
        }
      }
    }

  &__item {
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    margin-bottom: 20px;
  }

  &__required {
    margin-right: 5px;
    color: red;
  }

  .error-text {
    display: none;
    color: red;
    font-size: 0.8rem;
  }
}
</style>

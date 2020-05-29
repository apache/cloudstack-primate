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
      <a-form :form="form" @submit="handleSubmit" layout="vertical">
        <a-form-item
          :label="$t('migrate.from')">
          <a-select
            v-decorator="['srcpool', {
              initialValue: selectedStore,
              rules: [
                {
                  required: true,
                  message: 'Please select option',
                }]
            }]"
            :loading="loading"
            @change="val => { selectedStore = val }"
          >
            <a-select-option
              v-for="store in imageStores"
              :key="store.id"
            >{{ store.name || opt.url }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label="$t('migrate.to')">
          <a-select
            v-decorator="['destpools', {
              rules: [
                {
                  required: true,
                  message: 'Please select Image Store(s) to which data is to be migrated to',
                }]
            }]"
            mode="multiple"
            :loading="loading"
          >
            <a-select-option
              v-for="store in imageStores"
              v-if="store.id !== selectedStore"
              :key="store.id"
            >{{ store.name || opt.url }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('migrationPolicy')">
          <a-select
            v-decorator="['migrationtype', {
              initialValue: 'Complete',
              rules: [
                {
                  required: true,
                  message: 'Please select a migration Policy',
                }]
            }]"
            :loading="loading"
          >
            <a-select-option value="Complete">Complete</a-select-option>
            <a-select-option value="Balance">Balance</a-select-option>
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
  name: 'MigrateData',
  inject: ['parentFetchData'],
  data () {
    return {
      imageStores: {},
      loading: false,
      selectedStore: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.fetchImageStores()
  },
  methods: {
    fetchImageStores () {
      this.loading = true
      api('listImageStores').then(json => {
        this.imageStores = json.listimagestoresresponse.imagestore || null
        this.selectedStore = this.imageStores[0].id || ''
        this.loading = false
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const params = {}
        for (const key in values) {
          const input = values[key]
          if (input === undefined) {
            continue
          }
          if (key === 'destpools') {
            params[key] = input.join(',')
          } else {
            params[key] = input
          }
        }

        const title = 'Data Migration'
        api('migrateSecondaryStorageData', params).then(response => {
          const hasJobId = this.checkForAddAsyncJob(response, title)
          if (hasJobId) {
            this.fetchImageStores()
          }
        }).catch(error => {
          // show error
          this.$notification.error({
            message: 'Request Failed',
            description: error.response.headers['x-description']
          })
        }).finally(() => {
          this.closeAction()
        })
      })
    },
    checkForAddAsyncJob (json, title) {
      let hasJobId = false
      for (const obj in json) {
        if (obj.includes('response')) {
          for (const res in json[obj]) {
            if (res === 'jobid') {
              hasJobId = true
              const jobId = json[obj][res]
              this.$store.dispatch('AddAsyncJob', {
                title: title,
                jobid: jobId,
                description: 'imagestore',
                status: 'progress'
              })
            }
          }
        }
      }
      return hasJobId
    },
    closeAction () {
      this.$emit('close-action')
    }
  }
}
</script>
<style lang="scss" scoped>
.form-layout {
  width: 85vw;

  @media (min-width: 1000px) {
    width: 40vw;
  }
}

.action-button {
  text-align: right;

  button {
    margin-right: 5px;
  }
}
</style>

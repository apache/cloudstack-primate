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
      <a-form :form="form" layout="vertical" @submit="handleSubmit">
        <a-form-item>
          <span slot="label">
            {{ $t('label.traffictype') }}
            <a-tooltip :title="apiParams.traffictype.description">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </span>
          <a-select
            allowClear
            :placeholder="apiParams.traffictype.description"
            v-decorator="['traffictype', {
              rules: [{ required: true, message: `${$t('message.error.select')}` }]
            }]"
            @change="onChangeTrafficType">
            <a-select-option
              v-for="traffic in trafficTypes"
              :key="traffic">{{ traffic }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <span slot="label">
            {{ $t('label.isolationmethod') }}
            <a-tooltip :title="apiParams.isolationmethod.description">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </span>
          <a-select
            allowClear
            :placeholder="apiParams.isolationmethod.description"
            v-decorator="['isolationmethod']">
            <a-select-option
              v-for="isolation in isolationmethod"
              :key="isolation">{{ isolation }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div :span="24" class="action-button">
        <a-button @click="closeAction">{{ this.$t('label.cancel') }}</a-button>
        <a-button :loading="loading" type="primary" @click="handleSubmit">{{ this.$t('label.ok') }}</a-button>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { api } from '@api'

export default {
  name: 'AddTrafficType',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      trafficTypes: ['Public', 'Guest', 'Management', 'Storage'],
      isolationmethod: this.fetchIsolation()
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.apiConfig = this.$store.getters.apis.addTrafficType || {}
    this.apiParams = {}
    if (this.apiConfig.params) {
      this.apiConfig.params.forEach(param => {
        this.apiParams[param.name] = param
      })
    }
  },
  methods: {
    fetchIsolation (trafficType) {
      if (trafficType && trafficType === 'Guest') {
        return ['vlan', 'vxlan']
      }
      return ['vlan']
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          physicalnetworkid: this.resource.id,
          traffictype: values.traffictype,
          isolationmethod: values.isolationmethod
        }

        api('addTrafficType', params).then(response => {
          this.$emit('refresh-data')
          this.$notification.success({
            message: this.$t('label.add.traffic.type'),
            description: `${this.$t('message.success.add.traffic.type')}: ${params.traffictype}`
          })
          this.closeAction()
        }).catch(error => {
          this.$notification.error({
            message: this.$t('message.request.failed'),
            description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message,
            duration: 0
          })
        }).finally(() => {
          this.loading = false
        })
      })
    },
    onChangeTrafficType (trafficType) {
      this.form.setFieldsValue({ isolationmethod: undefined })
      this.isolationmethod = this.fetchIsolation(trafficType)
      this.$forceUpdate()
    },
    closeAction () {
      this.$emit('close-action')
    }
  }
}
</script>

<style lang="less" scoped>
.form-layout {
  width: 80vw;
  @media (min-width: 600px) {
    width: 450px;
  }
}
.action-button {
  text-align: right;
  button {
    margin-right: 5px;
  }
}
</style>

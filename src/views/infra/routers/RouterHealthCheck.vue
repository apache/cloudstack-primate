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
  <a-spin :spinning="loading">
    <center>
      <a-button :disabled="!('getRouterHealthCheckResults' in $store.getters.apis)" type="primary" icon="download" style="width: 50%; margin-bottom: 15px" @click="showGetHelathCheck">
        {{ $t('label.action.router.health.checks') }}
      </a-button>
    </center>
    <a-table
      style="overflow-y: auto"
      :columns="columns"
      :dataSource="healthChecks"
      :pagination="false"
      :rowKey="record => record.checkname"
      size="large">
      <template slot="status" slot-scope="record">
        <status class="status" :text="record.success === true ? 'True' : 'False'" displayText />
      </template>
    </a-table>

    <a-modal
      v-if="'getRouterHealthCheckResults' in $store.getters.apis"
      style="top: 20px;"
      :title="$t('label.action.router.health.checks')"
      :visible="showGetHealthChecksForm"
      :closable="true"
      @ok="handleGetHealthChecksSubmit"
      @cancel="onCloseGetHealthChecksForm"
      centered>
      <a-spin :spinning="loading">
        <a-form
          :form="form"
          @submit="handleGetHealthChecksSubmit"
          layout="vertical">
          <a-form-item>
            <span slot="label">
              {{ $t('label.perform.fresh.checks') }}
              <a-tooltip :title="apiParams.performfreshchecks.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-switch
              v-decorator="[$t('performfreshchecks')]"
              :placeholder="apiParams.performfreshchecks.description" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-spin>
</template>

<script>
import { api } from '@/api'
import Status from '@/components/widgets/Status'

export default {
  name: 'RouterHealthCheck',
  components: {
    Status
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      healthChecks: [],
      loading: false,
      columns: [
        {
          title: this.$t('label.router.health.check.name'),
          dataIndex: 'checkname'
        },
        {
          title: this.$t('label.type'),
          dataIndex: 'checktype'
        },
        {
          title: this.$t('label.router.health.check.success'),
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('label.router.health.check.last.updated'),
          dataIndex: 'lastupdated'
        },
        {
          title: this.$t('label.details'),
          dataIndex: 'details'
        }
      ],
      showGetHealthChecksForm: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.apiConfigParams = (this.$store.getters.apis.getRouterHealthCheckResults && this.$store.getters.apis.getRouterHealthCheckResults.params) || []
    this.apiParams = {}
    this.apiConfigParams.forEach(param => {
      this.apiParams[param.name] = param
    })
  },
  watch: {
    resource: function (newItem, oldItem) {
      this.updateResource(newItem)
    }
  },
  mounted () {
    this.updateResource(this.resource)
  },
  methods: {
    updateResource (resource) {
      if (!resource) {
        return
      }
      this.resource = resource
      if (!resource.id) {
        return
      }
      this.getHealthChecks()
    },
    showGetHelathCheck () {
      this.showGetHealthChecksForm = true
    },
    onCloseGetHealthChecksForm () {
      this.showGetHealthChecksForm = false
    },
    handleGetHealthChecksSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.onCloseGetHealthChecksForm()
        this.getHealthChecks(values.performfreshchecks)
      })
    },
    getHealthChecks (performFreshChecks) {
      var params = { routerid: this.resource.id }
      if (performFreshChecks) {
        params.performfreshchecks = performFreshChecks
      }
      this.loading = true
      api('getRouterHealthCheckResults', params).then(json => {
        this.healthChecks = json.getrouterhealthcheckresultsresponse.routerhealthchecks.healthchecks
      }).catch(error => {
        this.$notifyError(error)
      }).finally(f => {
        this.loading = false
      })
    }
  }
}
</script>

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
        <a-form-item :label="$t('label.cluster')">
          <a-select
            v-decorator="['clusterid', {
              rules: [{ required: true }]
            }]"
            showSearch
            optionFilterProp="children"
            :filterOption="(input, option) => {
              return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }"
            :loading="clusterLoading"
            :placeholder="apiParams.clusterid.description"
            @change="val => { this.handleClusterChange(this.clusters[val]) }">
            <a-select-option v-for="(opt, optIndex) in this.clusters" :key="optIndex">
              {{ opt.name || opt.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('label.virtual.machine')">
          <a-select
            v-decorator="['unmanagedinstance', {
              rules: [{ required: true }]
            }]"
            showSearch
            optionFilterProp="children"
            :filterOption="(input, option) => {
              return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }"
            :loading="unmanagedInstanceLoading"
            :placeholder="apiParams.name.description">
            <a-select-option v-for="(opt, optIndex) in this.unmanagedInstances" :key="optIndex">
              {{ opt.name || opt.description }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <div :span="24" class="action-button">
          <a-button @click="closeAction">{{ this.$t('label.cancel') }}</a-button>
          <a-button :loading="loading" type="primary" @click="handleSubmit">{{ this.$t('label.ok') }}</a-button>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'ImportVM',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      clusters: [],
      clusterLoading: false,
      selectedCluster: {},
      unmanagedInstances: [],
      unmanagedInstanceLoading: false,
      selectedUnmanagedInstance: {}
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.apiConfig = this.$store.getters.apis.importUnmanagedInstance || {}
    this.apiParams = {}
    this.apiConfig.params.forEach(param => {
      this.apiParams[param.name] = param
    })
  },
  created () {
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchClusterData()
    },
    isValidValueForKey (obj, key) {
      return key in obj && obj[key] != null
    },
    arrayHasItems (array) {
      return array !== null && array !== undefined && Array.isArray(array) && array.length > 0
    },
    isObjectEmpty (obj) {
      return !(obj !== null && obj !== undefined && Object.keys(obj).length > 0 && obj.constructor === Object)
    },
    fetchClusterData () {
      this.clusters = []
      this.selectedCluster = {}
      this.unmanagedInstances = []
      this.selectedUnmanagedInstance = {}
      this.clusterLoading = true
      api('listClusters', {}).then(json => {
        const listClusters = json.listclustersresponse.cluster
        if (this.arrayHasItems(listClusters)) {
          for (var cluster of listClusters) {
            if (cluster.hypervisortype === 'VMware') {
              this.clusters.push(cluster)
            }
          }
        }
      }).finally(() => {
        this.clusterLoading = false
        if (this.arrayHasItems(this.clusters)) {
          this.form.setFieldsValue({
            clusterid: 0
          })
          this.handleClusterChange(this.clusters[0])
        }
      })
    },
    handleClusterChange (cluster) {
      this.selectedCluster = cluster
      this.fetchUnmanagedInstanceData()
    },
    fetchUnmanagedInstanceData () {
      this.unmanagedInstances = []
      this.selectedUnmanagedInstance = {}
      if (this.isObjectEmpty(this.selectedCluster)) {
        return
      }
      const params = {
        clusterid: this.selectedCluster.id
      }
      this.unmanagedInstanceLoading = true
      api('listUnmanagedInstances', params).then(json => {
        const instanceObjs = json.listunmanagedinstancesresponse.unmanagedinstance
        if (this.arrayHasItems(instanceObjs)) {
          this.unmanagedInstances = this.unmanagedInstances.concat(instanceObjs)
        }
      }).finally(() => {
        this.unmanagedInstanceLoading = false
        if (this.arrayHasItems(this.unmanagedInstances)) {
          this.form.setFieldsValue({
            unmanagedinstance: 0
          })
          this.handleUnmanagedInstanceChange(this.unmanagedInstances[0])
        }
      })
    },
    handleUnmanagedInstanceChange (unmanagedInstance) {
      this.selectedUnmanagedInstance = unmanagedInstance
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          clusterid: this.clusters[values.clusterid].id,
          name: this.unmanagedInstances[values.instance].name
        }
        console.log(params)
        this.$emit('refresh-data')
        this.loading = false
        this.closeAction()
      })
    },
    closeAction () {
      this.$emit('close-action')
    }
  }
}
</script>

<style scoped lang="less">
  .form-layout {
    width: 60vw;

    @media (min-width: 500px) {
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

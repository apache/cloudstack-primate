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
  <div class="row-template-zone">
    <a-row :gutter="12">
      <a-col :md="24" :lg="24">
        <a-table
          size="small"
          style="overflow-y: auto"
          :loading="loading || fetchLoading"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :rowKey="record => record.zoneid">
          <div slot="isready" slot-scope="text, record">
            <span v-if="record.isready">{{ $t('Yes') }}</span>
            <span v-else>{{ $t('No') }}</span>
          </div>

          <template
            slot="action"
            slot-scope="text, record"
            v-if="'copyTemplate' in $store.getters.apis || 'deleteTemplate' in $store.getters.apis">
            <span style="margin-right: 5px">
              <a-button
                v-if="'copyTemplate' in $store.getters.apis"
                type="copy"
                icon="copy"
                shape="circle"
                @click="onShowCopyTemplate(record)" />
            </span>
            <span style="margin-right: 5px">
              <a-button
                v-if="'deleteTemplate' in $store.getters.apis"
                type="danger"
                icon="delete"
                shape="circle"
                @click="onShowConfirmDelete(record)" />
            </span>
          </template>
        </a-table>
        <a-pagination
          class="row-element"
          size="small"
          :current="page"
          :pageSize="pageSize"
          :total="itemCount"
          :showTotal="total => `Total ${total} items`"
          :pageSizeOptions="['10', '20', '40', '80', '100']"
          @change="handleChangePage"
          @showSizeChange="handleChangePageSize"
          showSizeChanger/>
      </a-col>
    </a-row>
    <a-modal
      v-if="'copyTemplate' in $store.getters.apis"
      :title="$t('label.action.copy.template')"
      :visible="showCopyActionForm"
      :closable="true"
      style="top: 20px;"
      @ok="handleCopyTemplateSubmit"
      @cancel="onCloseCopyForm"
      :confirmLoading="copyLoading"
      centered>
      <a-spin :spinning="copyLoading">
        <a-form
          :form="form"
          @submit="handleCopyTemplateSubmit"
          layout="vertical">
          <a-form-item :label="$t('zoneid')">
            <a-select
              id="zone-selection"
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
              :placeholder="apiParams.destzoneids.description">
              <a-select-option v-for="(opt, optIndex) in this.zones" :key="optIndex">
                {{ opt.name || opt.description }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'TemplateZones',
  props: {
    resource: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      columns: [],
      dataSource: [],
      page: 1,
      pageSize: 10,
      itemCount: 0,
      fetchLoading: false,
      showCopyActionForm: false,
      currentRecord: {},
      zones: [],
      zoneLoading: false,
      copyLoading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.apiConfigParams = (this.$store.getters.apis.copyTemplate && this.$store.getters.apis.copyTemplate.params) || []
    this.apiParams = {}
    this.apiConfigParams.forEach(param => {
      this.apiParams[param.name] = param
    })
  },
  created () {
    this.columns = [
      {
        title: this.$t('name'),
        dataIndex: 'zonename',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: this.$t('status'),
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      },
      {
        title: this.$t('isready'),
        dataIndex: 'isready',
        scopedSlots: { customRender: 'isready' }
      },
      {
        title: this.$t('action'),
        dataIndex: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: { customRender: 'action' }
      }
    ]
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    loading (newData, oldData) {
      if (!newData) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData () {
      const params = {}
      params.listAll = true
      params.id = this.resource.id
      params.templatefilter = 'self'
      params.page = this.page
      params.pagesize = this.pageSize

      this.dataSource = []
      this.itemCount = 0
      this.fetchLoading = true

      api('listTemplates', params).then(json => {
        const listTemplates = json.listtemplatesresponse.template
        const count = json.listtemplatesresponse.count

        if (listTemplates) {
          this.dataSource = listTemplates
          this.itemCount = count
        }
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
        })
      }).finally(() => {
        this.fetchLoading = false
      })
    },
    handleChangePage (page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.fetchData()
    },
    handleChangePageSize (currentPage, pageSize) {
      this.page = currentPage
      this.pageSize = pageSize
      this.fetchData()
    },
    onShowConfirmDelete (record) {
      const self = this
      let title = this.$t('deleteconfirm')
      title = title.replace('{name}', 'template ' + record.name + ' for ' + record.zonename)
      this.$confirm({
        title: title,
        okText: 'OK',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk () {
          self.deleteTemplate(record)
        }
      })
    },
    checkForAddAsyncJob (json, title, description) {
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
                description: description,
                status: 'progress'
              })
              break
            }
          }
        }
      }

      return hasJobId
    },
    deleteTemplate (record) {
      const title = this.$t('label.action.delete.template')
      const loading = this.$message.loading(title + 'in progress ' + record.name + ' for ' + record.zonename, 0)
      const params = {}
      params.account = record.zoneid
      params.id = record.id
      api('deleteTemplate', params).then(json => {
        const hasJobId = this.checkForAddAsyncJob(json, title, record.id)
        if (hasJobId) {
          this.fetchData()
        }
      }).catch(error => {
        // show error
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
        })
      }).finally(() => {
        setTimeout(loading, 1000)
      })
    },
    fetchZoneData () {
      this.zones = []
      const params = {}
      params.listAll = true
      this.zoneLoading = true
      api('listZones', params).then(json => {
        var listZones = json.listzonesresponse.zone
        listZones = listZones.filter((zone) => this.currentRecord.zoneid !== zone.id)
        this.zones = this.zones.concat(listZones)
      }).finally(() => {
        this.zoneLoading = false
      })
    },
    onShowCopyTemplate (record) {
      this.currentRecord = record
      this.form.setFieldsValue({
        zoneid: []
      })
      this.fetchZoneData()
      this.showCopyActionForm = true
    },
    onCloseCopyForm () {
      this.currentRecord = {}
      this.showCopyActionForm = false
    },
    handleCopyTemplateSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.copyLoading = true
        const params = {
          id: this.currentRecord.id,
          sourcezoneid: this.currentRecord.zoneid
        }
        var zoneIndexes = values.zoneid
        if (zoneIndexes && zoneIndexes.length > 0) {
          var zoneIds = []
          for (var j = 0; j < zoneIndexes.length; j++) {
            zoneIds = zoneIds.concat(this.zones[zoneIndexes[j]].id)
          }
          params.destzoneids = zoneIds.join()
        }
        api('copyTemplate', params).then(json => {
          this.$message.success('Successfully copied template: ' + this.currentRecord.name)
        }).catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
          })
        }).finally(() => {
          this.$emit('refresh-data')
          this.copyLoading = false
          this.onCloseCopyForm()
          this.fetchData()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.row-element {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>

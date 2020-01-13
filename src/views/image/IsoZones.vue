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
  <div class="row-iso-zone">
    <a-row :gutter="12">
      <a-col :md="24" :lg="24" v-if="!quickView">
        <a-table
          size="small"
          :loading="loading || fetchLoading"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :rowKey="record => record.zoneid || record.id">
          <div slot="isready" slot-scope="text, record">
            <span v-if="record.isready">{{ $t('Yes') }}</span>
            <span v-else>{{ $t('No') }}</span>
          </div>
          <div slot="action" class="action-button" slot-scope="text, record">
            <a-tooltip placement="top">
              <template slot="title">
                {{ $t('quickview') }}
              </template>
              <a-button
                type="default"
                shape="circle"
                icon="eye"
                size="small"
                @click="handleQuickView(record)"/>
            </a-tooltip>
          </div>
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

      <a-col :md="24" :lg="24" v-if="quickView">
        <a-list size="small" :dataSource="detailColumn">
          <div class="close-quickview">
            <a-button @click="() => { this.quickView = false }">{{ $t('close') }}</a-button>
          </div>
          <a-list-item slot="renderItem" slot-scope="item" v-if="item in detail">
            <div>
              <strong>{{ $t(item) }}</strong>
              <br/>
              <div class="list-item-content">
                {{ detail[item] }}
              </div>
            </div>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
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
      detailColumn: [],
      detail: [],
      page: 1,
      pageSize: 20,
      itemCount: 0,
      fetchLoading: false,
      quickView: false
    }
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
        width: 50,
        scopedSlots: { customRender: 'action' }
      }
    ]
    this.detailColumn = ['name', 'id', 'zonename', 'zoneid']
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
      params.isofilter = 'self'
      params.page = this.page
      params.pagesize = this.pageSize

      this.dataSource = []
      this.itemCount = 0
      this.fetchLoading = true

      api('listIsos', params).then(json => {
        const listIsos = json.listisosresponse.iso
        const count = json.listisosresponse.count

        if (listIsos) {
          this.dataSource = listIsos
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
    handleQuickView (record) {
      this.detail = record
      this.quickView = true
    },
    handleDeleteISO (record) {
      const self = this
      let title = this.$t('deleteconfirm')
      title = title.replace('{name}', this.$t('iso'))

      this.$confirm({
        title: title,
        okText: 'OK',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk () {
          self.deleteISO(record)
        }
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
    deleteISO (row) {
      const params = {}
      params.id = row.id
      if (!row.crossZones) {
        params.zoneid = row.zoneid
      }
      const title = this.$t('label.action.delete.ISO')
      const loading = this.$message.loading(title + ' in progress for ' + row.zonename, 0)
      api('deleteIso', params).then(json => {
        const jsonResponse = json.deleteisoresponse
        setTimeout(loading)
        if (jsonResponse.success) {
          this.$message.success('Delete success', 3)
          this.fetchData()
        } else {
          this.$message.error('Delete fail', 3)
        }
      }).catch(error => {
        // hide loading
        setTimeout(loading)
        // show error
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
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

/deep/.ant-table-content {
  overflow: hidden;
}

.action-button button {
  margin-right: 5px;
}

.close-quickview {
  text-align: right;
  margin-top: 12px;
  line-height: 32px;
  height: 32px;
}
</style>

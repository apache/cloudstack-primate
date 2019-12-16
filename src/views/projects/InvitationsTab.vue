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
      <a-col :md="24" :lg="24">
        <a-table
          size="small"
          :loading="loading"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :rowKey="record => record.id || record.account">
          <template slot="state" slot-scope="text">
            <status :text="text ? text : ''" displayText />
          </template>
          <span slot="action" slot-scope="text, record" class="account-button-action">
            <a-tooltip placement="top">
              <template slot="title">
                {{ $t('label.revoke.project.invite') }}
              </template>
              <a-button
                type="danger"
                shape="circle"
                icon="delete"
                size="small"
                @click="onShowConfirmRevoke(record)"/>
            </a-tooltip>
          </span>
        </a-table>
        <a-pagination
          class="row-element"
          size="small"
          :current="page"
          :pageSize="pageSize"
          :total="itemCount"
          :showTotal="total => `Total ${total} items`"
          :pageSizeOptions="['10', '20', '40', '80', '100']"
          @change="changePage"
          @showSizeChange="changePageSize"
          showSizeChanger/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { api } from '@/api'
import Status from '@/components/widgets/Status'

export default {
  name: 'InvitationsTab',
  components: {
    Status
  },
  props: {
    resource: {
      type: Object,
      required: true
    },
    tab: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      columns: [],
      dataSource: [],
      loading: false,
      page: 1,
      pageSize: 10,
      itemCount: 0,
      state: 'Pending'
    }
  },
  created () {
    this.columns = [
      {
        title: this.$t('account'),
        dataIndex: 'account',
        width: '35%',
        scopedSlots: { customRender: 'account' }
      },
      {
        title: this.$t('state'),
        dataIndex: 'state',
        scopedSlots: { customRender: 'state' }
      },
      {
        title: this.$t('action'),
        dataIndex: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: { customRender: 'action' }
      }
    ]

    this.page = 1
    this.pageSize = 10
    this.itemCount = 0
  },
  watch: {
    resource (newData, oldData) {
      if (newData && Object.keys(newData).length > 0) {
        this.fetchData()
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const params = {}
      params.projectId = this.resource.id
      params.state = this.state
      params.page = this.page
      params.pageSize = this.pageSize
      params.listAll = true

      this.loading = true

      api('listProjectInvitations', params).then(json => {
        const listProjectInvitations = json.listprojectinvitationsresponse.projectinvitation
        const itemCount = json.listprojectinvitationsresponse.count

        if (!listProjectInvitations || listProjectInvitations.length === 0) {
          this.dataSource = []
          return
        }

        this.itemCount = itemCount
        this.dataSource = listProjectInvitations
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
        })
      }).finally(() => {
        this.loading = false
      })
    },
    changePage (page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.fetchData()
    },
    changePageSize (currentPage, pageSize) {
      this.page = currentPage
      this.pageSize = pageSize
      this.fetchData()
    },
    onShowConfirmRevoke (record) {
      const self = this
      const title = this.$t('revokeinvitationconfirm')

      this.$confirm({
        title: title,
        okText: 'OK',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk () {
          self.revokeInvitation(record)
        }
      })
    },
    revokeInvitation (record) {
      const title = this.$t('label.revoke.project.invite')
      const loading = this.$message.loading(title + 'in progress for ' + record.account, 0)
      const params = {}

      params.id = record.id

      api('deleteProjectInvitation', params).then(json => {
        const hasJobId = this.checkForAddAsyncJob(json, title, record.account)

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
            }
          }
        }
      }

      return hasJobId
    }
  }
}
</script>

<style scoped>
  /deep/.ant-table-fixed-right {
    z-index: 5;
  }

  .row-element {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .account-button-action button {
    margin-right: 5px;
  }
</style>

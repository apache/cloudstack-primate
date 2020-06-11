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
          :rowKey="record => record.userid ? record.userid: (record.accountid || record.account)"
        >
          <span slot="user" slot-scope="text, record" v-if="record.userid">
            {{ getUserName(record) }}
          </span>
          <span slot="action" slot-scope="text, record" class="account-button-action">
            <a-tooltip placement="top">
              <template v-if="record.userid" slot="title">
                {{ $t('label.make.user.project.owner') }}
              </template>
              <template v-else slot="title">
                {{ $t('label.make.project.owner') }}
              </template>
              <a-button
                v-if="record.role!==owner"
                type="default"
                shape="circle"
                icon="arrow-up"
                size="small"
                @click="promoteAccount(record)" />
            </a-tooltip>
            <a-tooltip placement="top">
              <template v-if="record.userid" slot="title">
                {{ $t('label.demote.project.owner.user') }}
              </template>
              <template v-else slot="title">
                {{ $t('label.demote.project.owner') }}
              </template>
              <a-button
                v-if="record.role === owner"
                type="default"
                shape="circle"
                icon="arrow-down"
                size="small"
                @click="demoteAccount(record)" />
            </a-tooltip>
            <a-tooltip placement="top">
              <template v-if="record.userid" slot="title">
                {{ $t('label.remove.project.user') }}
              </template>
              <template v-else slot="title">
                {{ $t('label.remove.project.account') }}
              </template>
              <a-button
                v-if="!isLoggedInUser(record)"
                type="danger"
                shape="circle"
                icon="delete"
                size="small"
                @click="onShowConfirmDelete(record)"/>
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

export default {
  name: 'AccountsTab',
  props: {
    resource: {
      type: Object,
      required: true
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
      owner: 'Admin',
      role: 'Regular'
    }
  },
  created () {
    this.columns = [
      {
        title: this.$t('label.account'),
        dataIndex: 'account',
        width: '30%',
        scopedSlots: { customRender: 'account' }
      },
      {
        title: this.$t('label.user'),
        dataIndex: 'userid',
        width: '30%',
        scopedSlots: { customRender: 'user' }
      },
      {
        title: this.$t('label.roletype'),
        dataIndex: 'role',
        width: '20%',
        scopedSlots: { customRender: 'role' }
      },
      {
        title: this.$t('label.action'),
        dataIndex: 'action',
        fixed: 'right',
        width: '30%',
        scopedSlots: { customRender: 'action' }
      }
    ]

    this.page = 1
    this.pageSize = 10
    this.itemCount = 0
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    resource (newItem, oldItem) {
      if (!newItem || !newItem.id) {
        return
      }
      this.resource = newItem
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      const params = {}
      params.projectId = this.resource.id
      params.page = this.page
      params.pageSize = this.pageSize

      this.loading = true
      api('listProjectAccounts', params).then(json => {
        const listProjectAccount = json.listprojectaccountsresponse.projectaccount
        const itemCount = json.listprojectaccountsresponse.count
        if (!listProjectAccount || listProjectAccount.length === 0) {
          this.dataSource = []
          return
        }

        this.itemCount = itemCount
        this.dataSource = listProjectAccount
      }).catch(error => {
        this.$notifyError(error)
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
    isLoggedInUser (record) {
      const uname = this.getUserName(record)
      var status = false
      if (record.userid) {
        status = uname !== null && uname === this.$store.getters.loggedInUser
      } else {
        status = record.account === this.$store.getters.userInfo.account
      }
      return status
    },
    getUserName (record) {
      if (record.userid && record.userid !== null) {
        return record.user ? record.user[0].username : record.userid
      }
      return null
    },
    onMakeProjectOwner (record) {
      const title = this.$t('label.make.project.owner')
      const loading = this.$message.loading(title + ' in progress for ' + record.account, 0)
      const params = {}
      params.id = this.resource.id
      params.account = record.account
      this.updateProject(record, params, title, loading)
    },
    promoteAccount (record) {
      var title = this.$t('label.make.project.owner')
      const loading = this.$message.loading(title + ' in progress for ' + record.account, 0)
      const params = {}

      params.id = this.resource.id
      if (record.userid && record.userid !== null) {
        params.userid = record.userid
        params.accountid = record.user[0].accountid
        title = this.$t('label.make.user.project.owner')
      } else {
        params.account = record.account
      }
      params.roletype = this.owner
      params.swapowner = false
      this.updateProject(record, params, title, loading)
    },
    demoteAccount (record) {
      var title = this.$t('label.demote.project.owner')
      const loading = this.$message.loading(title + ' in progress for ' + record.account, 0)
      const params = {}
      if (record.userid && record.userid !== null) {
        params.userid = record.userid
        params.accountid = record.user[0].accountid
        title = this.$t('label.demote.project.owner.user')
      } else {
        params.account = record.account
      }

      params.id = this.resource.id
      params.roletype = 'Regular'
      params.swapowner = false
      this.updateProject(record, params, title, loading)
    },
    updateProject (record, params, title, loading) {
      api('updateProject', params).then(json => {
        const hasJobId = this.checkForAddAsyncJob(json, title, record.account)
        if (hasJobId) {
          this.fetchData()
        }
      }).catch(error => {
        this.$notifyError(error)
      }).finally(() => {
        setTimeout(loading, 1000)
      })
    },
    onShowConfirmDelete (record) {
      const self = this
      let title = this.$t('label.deleteconfirm')
      title = title.replace('{name}', this.$t('label.account'))

      this.$confirm({
        title: title,
        okText: 'OK',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk () {
          self.removeAccount(record)
        }
      })
    },
    removeAccount (record) {
      const title = this.$t('label.remove.project.account')
      const loading = this.$message.loading(title + ' in progress for ' + record.account, 0)
      const params = {}
      params.projectid = this.resource.id
      if (record.userid && record.userid != null) {
        params.userid = record.userid
        this.deleteOperation('deleteUserFromProject', params, record, title, loading)
      } else {
        params.account = record.account
        this.deleteOperation('deleteAccountFromProject', params, record, title, loading)
      }
    },
    deleteOperation (cmdName, params, record, title, loading) {
      api(cmdName, params).then(json => {
        const hasJobId = this.checkForAddAsyncJob(json, title, record.account)
        if (hasJobId) {
          this.fetchData()
        }
      }).catch(error => {
        this.$notifyError(error)
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

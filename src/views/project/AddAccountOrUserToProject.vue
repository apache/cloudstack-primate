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
    <a-tabs class="form-layout">
      <a-tab-pane key="1" :tab="$t('label.action.project.add.account')">
        <a-form
          :form="form"
          @submit="addAccountToProject"
          layout="vertical">
          <a-form-item>
            <span slot="label">
              {{ $t('label.account') }}
              <a-tooltip :title="fetchApiParams('addAccountToProject').account.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-select
              showSearch
              v-decorator="['account']"
              :loading="loading"
              :placeholder="$t('label.account')"
              @change="e => selectedAccount = e"
            >
              <a-select-option v-for="account in accounts" :key="account.name">
                {{ account.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <span slot="label">
              {{ $t('label.email') }}
              <a-tooltip :title="fetchApiParams('addAccountToProject').email.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-input v-decorator="[ 'email']"></a-input>
          </a-form-item>
          <a-form-item>
            <span slot="label">
              {{ $t('label.project.role') }}
              <a-tooltip :title="fetchApiParams('addAccountToProject').projectroleid.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-select
              showSearch
              v-decorator="['projectroleid']"
              :loading="loading"
              :placeholder="$t('label.project.role')"
            >
              <a-select-option v-for="role in projectRoles" :key="role.id">
                {{ role.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <span slot="label">
              {{ $t('label.roletype') }}
              <a-tooltip :title="fetchApiParams('addAccountToProject').roletype.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-select
              showSearch
              v-decorator="['roletype']"
              :placeholder="$t('label.roletype')">
              <a-select-option value="Admin">Admin</a-select-option>
              <a-select-option value="Regular">Regular</a-select-option>
            </a-select>
          </a-form-item>
          <div :span="24" class="action-button">
            <a-button @click="closeAction">{{ this.$t('label.cancel') }}</a-button>
            <a-button type="primary" @click="addAccountToProject" :loading="loading">{{ $t('label.ok') }}</a-button>
          </div>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('label.action.project.add.user')">
        <a-form
          :form="form"
          @submit="addUserToProject"
          layout="vertical">
          <p v-html="$t('message.add.user.to.project')"></p>
          <a-form-item>
            <span slot="label">
              {{ $t('label.user') }}
              <a-tooltip :title="fetchApiParams('addUserToProject').userid.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-select
              showSearch
              v-decorator="['userid', {
                rules: [{ required: true, message: 'Please select option' }]
              }]"
              @change="e => selectedUser = e"
              :loading="loading"
              :placeholder="$t('label.user')"
            >
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.username }} ( {{ user.id }} )
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <span slot="label">
              {{ $t('label.email') }}
              <a-tooltip :title="fetchApiParams('addUserToProject').email.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-input v-decorator="[ 'email']"></a-input>
          </a-form-item>
          <a-form-item>
            <span slot="label">
              {{ $t('label.project.role') }}
              <a-tooltip :title="fetchApiParams('addUserToProject').roletype.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-select
              showSearch
              v-decorator="['projectroleid']"
              :loading="loading"
              :placeholder="$t('label.project.role')"
            >
              <a-select-option v-for="role in projectRoles" :key="role.id">
                {{ role.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <span slot="label">
              {{ $t('label.roletype') }}
              <a-tooltip :title="fetchApiParams('addUserToProject').roletype.description">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </span>
            <a-select
              showSearch
              v-decorator="['roletype']"
              :placeholder="$t('label.roletype')">
              <a-select-option value="Admin">Admin</a-select-option>
              <a-select-option value="Regular">Regular</a-select-option>
            </a-select>
          </a-form-item>
          <div :span="24" class="action-button">
            <a-button @click="closeAction">{{ this.$t('label.cancel') }}</a-button>
            <a-button type="primary" @click="addUserToProject" :loading="loading">{{ $t('label.ok') }}</a-button>
          </div>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { api } from '@/api'
export default {
  name: 'AddAccountOrUserToProject',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      users: [],
      accounts: [],
      projectRoles: [],
      selectedUser: null,
      selectedAccount: null,
      loading: false
    }
  },
  mounted () {
    this.fetchData()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    fetchData () {
      this.fetchUsers()
      this.fetchAccounts()
      this.fetchProjectRoles()
    },
    fetchUsers () {
      this.loading = true
      api('listUsers', { listall: true }).then(response => {
        this.users = response.listusersresponse.user ? response.listusersresponse.user : []
      }).catch(error => {
        this.$notifyError(error)
      }).finally(() => {
        this.loading = false
      })
    },
    fetchAccounts () {
      this.loading = true
      api('listAccounts', {
        domainid: this.resource.domainid
      }).then(response => {
        this.accounts = response.listaccountsresponse.account || []
      }).catch(error => {
        this.$notifyError(error)
      })
    },
    fetchProjectRoles () {
      this.loading = true
      api('listProjectRoles', {
        projectid: this.resource.id
      }).then(response => {
        this.projectRoles = response.listprojectrolesresponse.projectrole || []
      }).catch(error => {
        this.$notifyError(error)
      })
    },
    fetchApiParams (apiCommand) {
      const apiConfig = this.$store.getters.apis[apiCommand]
      const apiParams = {}
      apiConfig.params.forEach(param => {
        apiParams[param.name] = param
      })
      return apiParams
    },
    addAccountToProject (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }

        var params = {}
        params.projectid = this.resource.id
        for (const key in values) {
          const input = values[key]
          if (input === undefined) {
            continue
          }
          params[key] = input
        }
        api('addAccountToProject', params).then(response => {
          this.$pollJob({
            jobId: response.addaccounttoprojectresponse.jobid,
            successMessage: `Successfully added account ${this.selectedAccount} to project`,
            errorMessage: `Failed to add account: ${this.selectedAccount} to project`,
            loadingMessage: `Adding Account: ${this.selectedAccount} to project...`,
            catchMessage: 'Error encountered while fetching async job result'
          })
        }).catch(error => {
          this.$notifyError(error)
        }).finally(() => {
          this.$emit('refresh-data')
          this.loading = false
          this.closeAction()
        })
      })
    },
    addUserToProject (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }

        var params = {}
        params.projectid = this.resource.id
        for (const key in values) {
          const input = values[key]
          if (input === undefined) {
            continue
          }
          params[key] = input
        }
        const user = this.users.filter(user => user.id === this.selectedUser)[0]
        api('addUserToProject', params).then(response => {
          this.$pollJob({
            jobId: response.addusertoprojectresponse.jobid,
            successMessage: `Successfully added user ${user.username} to project`,
            errorMessage: `Failed to add user: ${user.username} to project`,
            loadingMessage: `Adding User ${user.username} to project...`,
            catchMessage: 'Error encountered while fetching async job result'
          })
        }).catch(error => {
          this.$notifyError(error)
        }).finally(() => {
          this.$emit('refresh-data')
          this.loading = false
          this.closeAction()
        })
      })
    },
    closeAction () {
      this.$emit('close-action')
    }
  }
}
</script>
<style lang="scss" scoped>
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

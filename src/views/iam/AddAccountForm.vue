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
    <a-form :form="form" :loading="loading" @submit="handleSubmit" layout="vertical">
      <a-form-item :label="$t('username')">
        <a-input
          v-decorator="['username', {
            rules: [{ required: true, message: 'Please enter username' }]
          }]"/>
      </a-form-item>
      <a-form-item :label="$t('password')">
        <a-input-password
          v-decorator="['password', {
            rules: [{ required: true, message: 'Please enter password' }] }]"
        />
      </a-form-item>
      <a-form-item :label="$t('password-confirm')">
        <a-input-password
          v-decorator="['confirmpassword', {
            rules: [{ required: true, message: 'Please re-enter password' }] }]"
        />
      </a-form-item>
      <a-form-item :label="$t('email')">
        <a-input
          v-decorator="['email', {
            rules: [{ required: true, message: 'Please enter email' }]
          }]"/>
      </a-form-item>
      <a-form-item :label="$t('firstname')">
        <a-input
          v-decorator="['firstname', {
            rules: [{ required: true, message: 'Please enter firstname' }]
          }]"/>
      </a-form-item>
      <a-form-item :label="$t('lastname')">
        <a-input
          v-decorator="['lastname', {
            rules: [{ required: true, message: 'Please enter lastname' }]
          }]"/>
      </a-form-item>
      <a-form-item :label="$t('domain')">
        <a-select
          v-decorator="['domainid', {
            initialValue: selectedDomain,
            rules: [{ required: true, message: 'Please select domain' }] }]">
          <a-select-option v-for="domain in domainsList" :key="domain.id">
            {{ domain.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('account')">
        <a-input v-decorator="['account']"/>
      </a-form-item>
      <a-form-item :label="$t('role')">
        <a-select
          v-decorator="['roleid', {
            initialValue: selectedRole,
            rules: [{ required: true, message: 'Please select domain' }] }]">
          <a-select-option v-for="role in roles" :key="role.id">
            {{ role.name + ' (' + role.type + ')' }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('timezone')">
        <a-select
          showSearch
          v-decorator="['timezone']"
          :loading="loading">
          <a-select-option v-for="opt in timeZoneMap" :key="opt.id">
            {{ opt.name || opt.description }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('networkdomain')">
        <a-input v-decorator="['networkdomain']"/>
      </a-form-item>
      <div v-if="'authorizeSamlSso' in $store.getters.apis">
        <a-form-item>
          <a-checkbox v-decorator="['samlEnable']"> {{ $t('samlEnable') }} </a-checkbox>
        </a-form-item>
        <a-form-item :label="$t('samlEntity')">
          <a-select
            v-decorator="['samlEntity', {
              initialValue: selectedIdp,
            }]">
            <a-select-option v-for="(idp, idx) in idps" :key="idx">
              {{ idp.orgName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="card-footer">
        <a-button @click="handleClose">{{ $t('Close') }}</a-button>
        <a-button :loading="loading" type="primary" @click="handleSubmit">{{ $t('add') }}</a-button>
      </div>
    </a-form>
  </div>
</template>
<script>
import { api } from '@/api'
import { timeZone } from '@/utils/timezone'
import debounce from 'lodash/debounce'

export default {
  name: 'AddAccountForm',
  data () {
    this.fetchTimeZone = debounce(this.fetchTimeZone, 800)
    return {
      loading: false,
      domainsList: [],
      selectedDomain: '',
      roles: [],
      selectedRole: '',
      timeZoneMap: [],
      idps: [],
      selectedIdp: ''
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
      this.fetchDomains()
      this.fetchRoles()
      this.fetchTimeZone()
      if ('listIdps' in this.$store.getters.apis) {
        this.fetchIdps()
      }
    },
    fetchDomains () {
      this.loading = true
      api('listDomains', {
        listAll: true,
        details: 'min'
      }).then(response => {
        this.domainsList = response.listdomainsresponse.domain || []
        if (this.domainsList[0]) {
          this.selectedDomain = this.domainsList[0].id
        }
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext || 'Error'
        })
      }).finally(() => {
        this.loading = false
      })
    },
    fetchRoles () {
      this.loading = true
      api('listRoles').then(response => {
        this.roles = response.listrolesresponse.role || []
        this.selectedRole = this.roles[0].id
      }).finally(() => {
        this.loading = false
      })
    },
    fetchTimeZone (value) {
      this.timeZoneMap = []
      this.loading = true

      timeZone(value).then(json => {
        this.timeZoneMap = json
        this.loading = false
      })
    },
    fetchIdps () {
      this.loading = true
      api('listIdps').then(response => {
        this.idps = response.listidpsresponse.idp || []
        this.selectedIdp = this.idps[0].id || ''
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }

        this.loading = true
        const params = {}
        for (const key in values) {
          const input = values[key]
          if (input === undefined) {
            continue
          }
          if (key === 'samlEnable' || key === 'samlEntity' || key === 'confirmpassword') {
            continue
          }
          params[key] = input
        }

        api('createAccount', params).then(response => {
          this.$emit('refresh-data')
          this.$notification.success({
            message: 'Create Account',
            description: 'Successfully created account ' + params.username
          })
          const users = response.createaccountresponse.account.user
          if (values.samlEnable && users) {
            for (var i = 0; i < users.length; i++) {
              api('authorizeSamlSso', {
                enable: values.samlEnable,
                entityid: values.samlEntity,
                userid: users[i].id
              }).then(response => {
                this.$notification.success({
                  message: this.$t('samlEnable'),
                  description: 'Successfully enabled SAML Authorization'
                })
              }).catch(error => {
                this.$notification.error({
                  message: 'Request Failed',
                  description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message,
                  duration: 0
                })
              }).finally(() => {
                this.loading = false
                this.handleClose()
              })
            }
          }
        }).catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message,
            duration: 0
          })
        }).finally(() => {
          this.loading = false
          this.handleClose()
        })
      })
    },
    handleClose () {
      this.$emit('close-action')
    }
  }
}
</script>
<style lang="scss" scoped>
.card-footer {
  text-align: right;

  button + button {
    margin-left: 8px;
  }
}
</style>

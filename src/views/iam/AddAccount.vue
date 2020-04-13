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
        <a-form-item :label="$t('roleid')">
          <a-select
            v-decorator="['roleid', {
              rules: [{ required: true, message: 'Please select option' }]
            }]"
            showSearch
            optionFilterProp="children"
            :filterOption="(input, option) => {
              return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }"
            :loading="domainLoading"
            :placeholder="apiParams.roleid.description"
            @change="val => { this.handleRoleChange(this.roles[val]) }">
            <a-select-option v-for="(opt, optIndex) in this.roles" :key="optIndex">
              {{ opt.name || opt.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('username')">
          <a-input
            v-decorator="['username', {
              rules: [{ required: true, message: 'Please enter input' }]
            }]"
            :placeholder="apiParams.username.description" />
        </a-form-item>
        <a-row :gutter="12">
          <a-col :md="24" :lg="12">
            <a-form-item :label="$t('password')">
              <a-input-password
                v-decorator="['password', {
                  rules: [{ required: true, message: 'Please enter new password' }]
                }]"
                :placeholder="apiParams.password.description"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="12">
            <a-form-item :label="$t('confirmpassword')">
              <a-input-password
                v-decorator="['confirmpassword', {
                  rules: [
                    {
                      required: true,
                      message: 'Please confirm new password'
                    },
                    {
                      validator: validateTwoPassword
                    }
                  ]
                }]"
                :placeholder="apiParams.password.description"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :label="$t('email')">
          <a-input
            v-decorator="['email', {
              rules: [{ required: true, message: 'Please enter input' }]
            }]"
            :placeholder="apiParams.email.description" />
        </a-form-item>
        <a-row :gutter="12">
          <a-col :md="24" :lg="12">
            <a-form-item :label="$t('firstname')">
              <a-input
                v-decorator="['firstname', {
                  rules: [{ required: true, message: 'Please enter input' }]
                }]"
                :placeholder="apiParams.firstname.description" />
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="12">
            <a-form-item :label="$t('lastname')">
              <a-input
                v-decorator="['lastname', {
                  rules: [{ required: true, message: 'Please enter input' }]
                }]"
                :placeholder="apiParams.lastname.description" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :label="$t('domain')" v-if="this.isAdminOrDomainAdmin()">
          <a-select
            v-decorator="['domainid', {
              rules: [{ required: true, message: 'Please select option' }]
            }]"
            showSearch
            optionFilterProp="children"
            :filterOption="(input, option) => {
              return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }"
            :loading="domainLoading"
            :placeholder="apiParams.domainid.description"
            @change="val => { this.handleDomainChange(this.domains[val]) }">
            <a-select-option v-for="(opt, optIndex) in this.domains" :key="optIndex">
              {{ opt.name || opt.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('accountid')">
          <a-input
            v-decorator="['accountid', {}]"
            :placeholder="apiParams.accountid.description" />
        </a-form-item>
        <a-form-item :label="$t('timezone')">
          <a-select
            showSearch
            v-decorator="['timezone', {}]"
            :loading="timeZoneLoading">
            <a-select-option v-for="opt in timeZoneMap" :key="opt.id">
              {{ opt.name || opt.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('networkdomain')">
          <a-input
            v-decorator="['networkdomain', {}]"
            :placeholder="apiParams.networkdomain.description" />
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
import { timeZone } from '@/utils/timezone'
import debounce from 'lodash/debounce'

export default {
  name: 'AddAccount',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    this.fetchTimeZone = debounce(this.fetchTimeZone, 800)

    return {
      loading: false,
      roleLoading: false,
      roles: [],
      selectedRole: {},
      timeZoneMap: [],
      timeZoneLoading: false,
      domainLoading: false,
      domains: [],
      selectedDomain: {}
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.apiConfig = this.$store.getters.apis.createAccount || {}
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
      this.fetchRoleData()
      this.fetchTimeZone()
      this.fetchDomainData()
    },
    isAdminOrDomainAdmin () {
      return ['Admin', 'DomainAdmin'].includes(this.$store.getters.userInfo.roletype)
    },
    isValidValueForKey (obj, key) {
      return key in obj && obj[key] != null
    },
    validateTwoPassword (rule, value, callback) {
      if (!value || value.length === 0) {
        callback()
      } else if (rule.field === 'confirmpassword') {
        const form = this.form
        const messageConfirm = this.$t('message.validate.equalto')
        const passwordVal = form.getFieldValue('password')
        if (passwordVal && passwordVal !== value) {
          callback(messageConfirm)
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    fetchRoleData () {
      const params = {}
      params.listAll = true
      this.roleLoading = true
      api('listRoles', params).then(json => {
        const listRoles = json.listrolesresponse.role
        this.roles = listRoles.map((role) => {
          return {
            description: role.name + ' (' + role.type + ')',
            id: role.id
          }
        })
      }).finally(() => {
        this.roleLoading = false
        this.form.setFieldsValue({
          roleid: 0
        })
        this.handleRoleChange(this.roles[0])
      })
    },
    handleRoleChange (role) {
      this.selectedRole = role
    },
    fetchTimeZone (value) {
      this.timeZoneMap = []
      this.timeZoneLoading = true

      timeZone(value).then(json => {
        this.timeZoneMap = json
        this.timeZoneLoading = false
      })
    },
    fetchDomainData () {
      const params = {}
      params.listAll = true
      params.details = 'min'
      this.domainLoading = true
      api('listDomains', params).then(json => {
        const listDomains = json.listdomainsresponse.domain
        this.domains = this.domains.concat(listDomains)
      }).finally(() => {
        this.domainLoading = false
        this.form.setFieldsValue({
          domainid: 0
        })
        this.handleDomainChange(this.domains[0])
      })
    },
    handleDomainChange (domain) {
      this.selectedDomain = domain
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          roleid: this.roles[values.roleid].id,
          username: values.username,
          password: values.password,
          email: values.email,
          firstname: values.firstname,
          lastname: values.lastname,
          domainid: this.domains[values.domainid].id
        }
        if (this.isValidValueForKey(values, 'accountid') && values.accountid.length > 0) {
          params.accountid = values.accountid
        }
        if (this.isValidValueForKey(values, 'timezone') && values.timezone.length > 0) {
          params.timezone = values.timezone
        }
        if (this.isValidValueForKey(values, 'networkdomain') && values.networkdomain.length > 0) {
          params.networkdomain = values.networkdomain
        }
        console.log(params)
        api('createAccount', params).then(json => {
          this.$message.success('Successfully created account: ' + values.username)
        }).catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: (error.response && error.response.headers && error.response.headers['x-description']) || error.message
          })
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

<style scoped lang="less">
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

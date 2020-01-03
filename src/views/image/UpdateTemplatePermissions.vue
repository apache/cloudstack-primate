<template>
  <div class="form">
    <div v-if="loading" class="loading">
      <a-icon type="loading" style="color: #1890ff;"></a-icon>
    </div>

    <div class="form__item">
      <p class="form__label">{{ $t('operation') }}</p>
      <a-select v-model="selectedOperation" defaultValue="add">
        <a-select-option :value="$t('Add')">{{ $t('Add') }}</a-select-option>
        <a-select-option :value="$t('Remove')">{{ $t('Remove') }}</a-select-option>
        <a-select-option :value="$t('Reset')">{{ $t('Reset') }}</a-select-option>
      </a-select>
    </div>

    <template v-if="selectedOperation !== 'Reset'">
      <div class="form__item">
        <p class="form__label">
          <span class="required">*</span>
          {{ $t('shareWith') }}
        </p>
        <a-select v-model="selectedShareWith" defaultValue="account">
          <a-select-option :value="$t('account')">{{ $t('account') }}</a-select-option>
          <a-select-option :value="$t('project')">{{ $t('project') }}</a-select-option>
        </a-select>
      </div>

      <template v-if="selectedShareWith === 'Account'">
        <div class="form__item">
          <p class="form__label">
            <span class="required">*</span>
            {{ $t('account') }}
          </p>
          <a-select
            v-model="selectedAccounts"
            mode="multiple"
            style="width: 100%"
            placeholder="Select Accounts">
            <a-select-option v-for="account in accountObjs" :key="account.id">
              {{ account.name }}</a-select-option>
          </a-select>
        </div>
      </template>

      <template v-else>
        <div class="form__item">
          <p class="form__label">
            <span class="required">*</span>
            {{ $t('project') }}
          </p>
          <a-select
            v-model="selectedProjects"
            mode="multiple"
            style="width: 100%"
            placeholder="Select Projects">
            <a-select-option v-for="project in projectObjs" :key="project.id">
              {{ project.name }}</a-select-option>
          </a-select>
        </div>

        <div class="form__item">
          <p class="form__label">
            <span class="required">*</span>
            {{ $t('project') }}
          </p>
          <a-select v-model="selectedProject">
            <a-select-option
              v-for="project in projects"
              :key="project.id"
              :value="project.id"
            >{{ project.name }}</a-select-option>
          </a-select>
          <span v-if="projectError" class="required">{{ $t('required') }}</span>
        </div>
      </template>
    </template>
    <div class="actions">
      <a-button @click="closeModal">
        {{ $t('Cancel') }}
      </a-button>
      <a-button type="primary" @click="submitData">
        {{ $t('OK') }}
      </a-button>
    </div>
  </div>
</template>
<script>
import { api } from '@/api'

export default {
  name: 'UpdateTemplatePermissions',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  inject: ['parentFetchData'],
  data () {
    return {
      value: [],
      role: null,
      projects: [],
      accounts: [],
      accountObjs: [],
      projectObjs: [],
      accountByName: {},
      projectByIds: {},
      accountType: undefined,
      allowUserViewAllDomainAccounts: null,
      selectedOperation: 'Add',
      selectedShareWith: 'Account',
      selectedAccounts: [],
      selectedProjects: [],
      accountError: false,
      projectError: false,
      loading: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      api('listDomains', {
        response: 'json',
        listAll: true,
        details: 'min'
      }).then(response => {
        this.domains = response.listdomainsresponse.domain
        this.selectedDomain = this.domains[0].id
        if (this.selectedShareWith === 'Account') {
          this.fetchAccounts()
        } else {
          this.fetchProjects()
        }
      }).finally(e => {
        this.loading = false
      })
    },
    fetchCapabilities () {
      api('listCapabilities').then(response => {
        this.allowUserViewAllDomainAccounts = response.listcapabilitiesresponse.capability.allowuserviewalldomainaccounts
      }).catch(error => {
        this.$message.error({
          title: 'Error',
          description: error.message
        })
      })
    },
    fetchAccounts () {
      api('listAccounts', {
        response: 'json',
        domainId: this.selectedDomain,
        state: 'Enabled',
        listAll: true
      }).then(response => {
        this.accounts = response.listaccountsresponse.account
      }).then(() => {
        this.accounts.forEach(account => {
          if (account.domainid === this.resource.id && this.selectedOperation === 'Add') {
            console.log('before add = ', account)
            account.hasPermission = false
            console.log('after add =', account)
            this.accountByName[account.name] = {
              id: account.id,
              name: account.name,
              hasPermission: false
            }
          }
        })
      }).then(() => {
        this.fetchTemplatePermissions()
      }).then(() => {
        const that = this
        this.accounts.some(function (e) {
          if (e.name === that.resource.account) {
            that.accountType = e.accounttype
          }
        })
      }).finally(e => {
        this.loading = false
      })
    },
    fetchProjects () {
      api('listProjects', {
        response: 'json',
        domainId: this.selectedDomain,
        state: 'Active',
        details: 'min',
        listAll: true
      }).then(response => {
        this.projects = response.listprojectsresponse.project
        this.projects.forEach(project => {
          if ((project.domainid === this.resource.domainId && this.selectedOperation === 'Add') || (this.selectedOperation === 'Remove')) {
            this.projectByIds[project.id] = {
              id: project.id,
              name: project.name,
              hasPermission: false
            }
          }
        })
      }).finally(e => {
        this.loading = false
      })
      this.fetchTemplatePermissions()
    },
    fetchTemplatePermissions () {
      api('listTemplatePermissions', {
        response: 'json',
        id: this.resource.id
      }).then(response => {
        if (this.selectedShareWith === 'Account') {
          let accountNames = []
          if (Object.prototype.hasOwnProperty.call(response.listtemplatepermissionsresponse.templatepermission, 'account')) {
            accountNames = response.listtemplatepermissionsresponse.templatepermission.account
            const that = this
            accountNames.forEach(function (accountName) {
              if (that.accountByName[accountName]) {
                that.accountByName[accountName].hasPermission = true
              }
            })
            if (this.selectedOperation === 'Add') {
              this.accountObjs = []
              Object.keys(this.accountByName).forEach(account => {
                if (!account.hasPermission) {
                  this.accountObjs.push(account)
                }
              })
            }
            if (this.selectedOperation === 'Remove') {
              this.accountObjs = []
              Object.keys(this.accountByName).forEach(account => {
                if (account.hasPermission) {
                  this.accountObjs.push(account)
                }
              })
            }
          } else {
            this.accountObjs = this.accounts
          }
        } else {
          let projectIds = []
          if (Object.prototype.hasOwnProperty.call(response.listtemplatepermissionsresponse.templatepermission, 'projectids')) {
            projectIds = response.listtemplatepermissionsresponse.templatepermission.projectids
            const that = this
            projectIds.forEach(function (projectId) {
              if (that.projectByIds[projectId]) {
                that.projectByIds[projectId].hasPermission = true
              }
            })
          }
        }
      })
    },
    closeModal () {
      this.$parent.$parent.close()
    },
    submitData () {
      // let variableKey = ''
      // let variableValue = ''
      // if (this.selectedShareWith === 'Account') {
      //   if (!this.selectedAccount) {
      //     this.accountError = true
      //     return
      //   }
      // }
      this.closeModal()
      // api('updateTemplatePermissions',{
      //   response: 'json',
      //   accountNames: this.accountNames,
      // })
    }
  }
}
</script>
<style scoped lang="scss">

  .form {
    display: flex;
    flex-direction: column;
    width: 100%;

    &__item {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: 10px;
    }

    &__label {
      display: flex;
      font-weight: bold;
      margin-bottom: 5px;
    }

  }
  .actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    button {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }

  .required {
    margin-right: 2px;
    color: red;
    font-size: 0.7rem;
  }

  .loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }
</style>

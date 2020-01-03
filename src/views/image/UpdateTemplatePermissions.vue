<template>
  <div class="form">
    <div v-if="loading" class="loading">
      <a-icon type="loading" style="color: #1890ff;"></a-icon>
    </div>

    <div class="form__item">
      <p class="form__label">{{ $t('operation') }}</p>
      <a-select v-model="selectedOperation" defaultValue="Add">
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
          <a-select-option :value="account">{{ $t('account') }}</a-select-option>
          <a-select-option :value="project">{{ $t('project') }}</a-select-option>
        </a-select>
      </div>

      <template v-if="selectedShareWith === 'Account'">
        <div class="form__item">
          <p class="form__label">
            <span class="required">*</span>
            {{ $t('account') }}
          </p>
          <a-select
            :value="accounts.filter(a => (selectedOperation === 'Add' ? !permittedAccounts.includes(a.name) : permittedAccounts.includes(a.name))).map(k => k.name)"
            @change="val => permittedAccounts.push(val)"
            mode="multiple"
            style="width: 100%"
            placeholder="Select Accounts">
            <a-select-option v-for="account in accounts" :key="account.id">
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
      selectedShareWith: this.$t('account'),
      selectedAccounts: [],
      selectedProjects: [],
      accountError: false,
      projectError: false,
      permittedAccounts: [],
      permittedProjects: [],
      loading: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchTemplatePermissions()
      if (this.selectedShareWith === 'Account') {
        this.fetchAccounts()
      } else {
        this.fetchProjects()
      }
      this.allowUserViewAllDomainAccounts = this.$store.getters.features.allowuserviewalldomainaccounts
    },
    fetchAccounts () {
      this.loading = true
      api('listAccounts', {
        listall: true
      }).then(response => {
        this.accounts = response.listaccountsresponse.account
        console.log(this.accounts)
      }).then(() => {
        // FIXME? user is admin vs non-admin?
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
        details: 'min',
        listall: true
      }).then(response => {
        this.projects = response.listprojectsresponse.project
      }).finally(e => {
        this.loading = false
      })
    },
    fetchTemplatePermissions () {
      this.loading = true
      api('listTemplatePermissions', {
        id: this.resource.id
      }).then(response => {
        const permission = response.listtemplatepermissionsresponse.templatepermission
        if (permission && permission.account) {
          this.permittedAccounts = permission.account
        }
        if (permission && permission.projectids) {
          this.permittedProjects = permission.projectids
        }
      }).finally(e => {
        this.loading = false
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
    width: 50vw;

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

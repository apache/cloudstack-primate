<template>
  <div class="form">
    <div v-if="loading" class="loading">
      <a-icon type="loading" style="color: #1890ff;"></a-icon>
    </div>

    <div class="form__item">
      <p class="form__label">{{ $t('operation') }}</p>
      <a-select v-model="selectedOperation" defaultValue="Add" @change="fetchData">
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
        <a-select v-model="selectedShareWith" defaultValue="Account" @change="fetchData">
          <a-select-option :value="$t('account')">{{ $t('account') }}</a-select-option>
          <a-select-option :value="$t('project')">{{ $t('project') }}</a-select-option>
        </a-select>
      </div>

      <template v-if="selectedShareWith === 'Account'">
        <div class="form__item">
          <p class="form__label">
            {{ $t('account') }}
          </p>
          <a-select
            mode="multiple"
            placeholder="Select Accounts"
            :value="selectedAccounts"
            @change="handleChange"
            style="width: 100%">
            <a-select-option v-for="account in accountsList" :key="account.name">
              {{ account.name }}</a-select-option>
          </a-select>
        </div>
      </template>

      <template v-else>
        <div class="form__item">
          <p class="form__label">
            {{ $t('project') }}
          </p>
          <a-select
            mode="multiple"
            placeholder="Select Projects"
            :value="selectedProjects"
            @change="handleChange"
            style="width: 100%">
            <a-select-option v-for="project in projectsList" :key="project.name">
              {{ project.name }}</a-select-option>
          </a-select>
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
      accountType: undefined,
      allowUserViewAllDomainAccounts: null,
      selectedOperation: 'Add',
      selectedShareWith: this.$t('account'),
      accountError: false,
      projectError: false,
      permittedAccounts: [],
      selectedAccounts: [],
      permittedProjects: [],
      selectedProjects: [],
      loading: false
    }
  },
  computed: {
    accountsList () {
      return this.accounts
        .filter(a =>
          this.selectedOperation === 'Add'
            ? !this.permittedAccounts.includes(a.name)
            : this.permittedAccounts.includes(a.name)
        )
    },
    projectsList () {
      console.log('Projects list = ', this.projects
        .filter(p =>
          this.selectedOperation === 'Add'
            ? !this.permittedProjects.includes(p.id)
            : this.permittedProjects.includes(p.id)
        ))
      return this.projects
        .filter(p =>
          this.selectedOperation === 'Add'
            ? !this.permittedProjects.includes(p.id)
            : this.permittedProjects.includes(p.id)
        )
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchTemplatePermissions()
      if (this.selectedShareWith === 'Account') {
        this.selectedAccounts = []
        this.fetchAccounts()
      } else {
        this.selectedProjects = []
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
          console.log('permitted projects == ', this.permittedProjects)
        }
      }).finally(e => {
        this.loading = false
      })
    },
    handleChange (selectedItems) {
      if (this.selectedOperation === 'Add') {
        if (this.selectedShareWith === 'Account') {
          this.selectedAccounts = selectedItems
        } else {
          this.selectedProjects = selectedItems
        }
      } else {
        if (this.selectedShareWith === 'Account') {
          this.selectedAccounts = selectedItems
        } else {
          this.selectedProjects = selectedItems
        }
      }
    },
    closeModal () {
      this.$parent.$parent.close()
    },
    submitData () {
      let variableKey = ''
      let variableValue = ''
      if (this.selectedShareWith === 'Account') {
        variableKey = 'accounts'
        console.log('selected acc == ', this.selectedAccounts)
        variableValue = this.selectedAccounts.map(account => account).join(',')
      } else {
        variableKey = 'projectids'
        console.log('PROJECTS = ', this.selectedProjects)
        variableValue = this.projects.filter(p => this.selectedProjects.includes(p.name)).map(p => p.id).join(',')
        console.log('projects =', variableValue)
      }
      this.loading = true
      api('updateTemplatePermissions', {
        [variableKey]: variableValue,
        id: this.resource.id,
        ispublic: this.resource.isPublic,
        isextractable: this.resource.isExtractable,
        featured: this.resource.featured,
        op: this.selectedOperation.toLowerCase()
      })
        .then(response => {
          this.$notification.success({
            message: 'Successfully updated template permissions'
          })
        })
        .catch(error => {
          this.$notification.error({
            message: 'Failed to update template permissions',
            description: error.response.data.updatetemplatepermissions.errortext
          })
        })
        .finally(e => {
          this.loading = false
          this.closeModal()
          this.parentFetchData()
        })
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

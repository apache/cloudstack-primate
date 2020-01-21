<template>
  <div class="form">
    <div class="form__item" :class="{'error': domainError}">
      <a-spin :spinning="domainsLoading">
        <p class="form__label">{{ $t('domain') }}<span class="required">*</span></p>
        <p class="required required-label">{{ $t('required') }}</p>
        <a-select style="width: 100%" @change="handleChangeDomain" v-model="domainId">
          <a-select-option v-for="(domain, index) in domainsList" :value="domain.id" :key="index">
            {{ domain.name }}
          </a-select-option>
        </a-select>
      </a-spin>
    </div>
    <div class="form__item" v-if="accountsList">
      <p class="form__label">Account</p>
      <a-select style="width: 100%" @change="handleChangeAccount">
        <a-select-option v-for="(account, index) in accountsList" :value="account.name" :key="index">
          {{ account.name }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'DedicateDomain',
  props: {
    error: {
      type: Boolean,
      requried: true
    }
  },
  data () {
    return {
      domainsLoading: false,
      domainId: null,
      accountsList: null,
      domainsList: null,
      domainError: false
    }
  },
  watch: {
    error () {
      this.domainError = this.error
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.domainsLoading = true
      api('listDomains', {
        listAll: true,
        details: 'min'
      }).then(response => {
        this.domainsList = response.listdomainsresponse.domain
        this.domainsLoading = false
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.domainsLoading = false
      })
    },
    fetchAccounts () {
      api('listAccounts', {
        domainid: this.domainId
      }).then(response => {
        this.accountsList = response.listaccountsresponse.account
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
      })
    },
    handleChangeDomain (e) {
      this.$emit('domainChange', e)
      this.domainError = false
      this.fetchAccounts()
    },
    handleChangeAccount (e) {
      this.$emit('accountChange', e)
    }
  }
}
</script>

<style scoped lang="scss">
  .form {
    &__item {
      margin-bottom: 20px;
    }

    &__label {
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

  .required {
    color: #ff0000;
    font-size: 12px;

    &-label {
      display: none;
    }
  }

  .error {
    .required-label {
      display: block;
    }
  }
</style>

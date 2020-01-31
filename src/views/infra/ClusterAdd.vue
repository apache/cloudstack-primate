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
  <a-spin :spinning="loading">
    <div class="form">

      <div class="form__item">
        <div class="form__label"><span class="required">* </span>{{ $t('zonenamelabel') }}</div>
        <a-select v-model="zoneId" @change="fetchPods">
          <a-select-option
            v-for="zone in zonesList"
            :value="zone.id"
            :key="zone.id">
            {{ zone.name }}
          </a-select-option>
        </a-select>
      </div>

      <div class="form__item">
        <div class="form__label">{{ $t('hypervisor') }}</div>
        <a-select v-model="hypervisor" @change="resetAllFields">
          <a-select-option
            v-for="hypervisor in hypervisorsList"
            :value="hypervisor.name"
            :key="hypervisor.name">
            {{ hypervisor.name }}
          </a-select-option>
        </a-select>
      </div>

      <div class="form__item">
        <div class="form__label">{{ $t('podname') }}</div>
        <a-select v-model="podId">
          <a-select-option
            v-for="pod in podsList"
            :value="pod.id"
            :key="pod.id">
            {{ pod.name }}
          </a-select-option>
        </a-select>
      </div>

      <div class="form__item">
        <div class="form__label"><span class="required">* </span>{{ $t('clusternamelabel') }}</div>
        <span class="required required-label" ref="requiredCluster">Required</span>
        <a-input :placeholder="placeholder.clustername" v-model="clustername"></a-input>
      </div>

      <div class="form__item">
        <div class="form__label">{{ $t('isDedicated') }}</div>
        <a-checkbox @change="showDedicated = !showDedicated" />
      </div>

      <template v-if="showDedicated">
        <DedicateDomain
          @domainChange="id => domainId = id"
          @accountChange="id => dedicatedAccount = id"
          :error="domainError" />
      </template>

      <template v-if="hypervisor === 'VMware'">
        <div class="form__item">
          <div class="form__label">{{ $t('vCenterHost') }}</div>
          <a-input v-model="host"></a-input>
        </div>

        <div class="form__item">
          <div class="form__label">{{ $t('vCenterUsername') }}</div>
          <a-input v-model="username"></a-input>
        </div>

        <div class="form__item">
          <div class="form__label">{{ $t('vCenterPassword') }}</div>
          <a-input v-model="password"></a-input>
        </div>

        <div class="form__item">
          <div class="form__label">{{ $t('vCenterDataCenter') }}</div>
          <a-input v-model="dataCenter"></a-input>
        </div>

      </template>

      <a-divider></a-divider>

      <div class="actions">
        <a-button @click="() => this.$parent.$parent.close()">{{ $t('cancel') }}</a-button>
        <a-button @click="handleSubmitForm" type="primary">{{ $t('ok') }}</a-button>
      </div>

    </div>
  </a-spin>
</template>

<script>
import { api } from '@/api'
import DedicateDomain from '../../components/view/DedicateDomain'

export default {
  name: 'ClusterAdd',
  components: {
    DedicateDomain
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  inject: ['parentFetchData', 'parentToggleLoading'],
  data () {
    return {
      loading: false,
      zoneId: null,
      hypervisor: null,
      podId: null,
      clustername: null,
      clustertype: 'CloudManaged',
      username: null,
      password: null,
      url: null,
      host: null,
      dataCenter: null,
      ovm3pool: null,
      ovm3cluster: null,
      ovm3vip: null,
      zonesList: [],
      hypervisorsList: [],
      podsList: [],
      showDedicated: false,
      domainId: null,
      dedicatedAccount: null,
      domainError: false,
      params: [],
      placeholder: {
        clustername: null
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.fetchZones()
      this.fetchHypervisors()
      this.params = this.$store.getters.apis.addCluster.params
      Object.keys(this.placeholder).forEach(item => { this.returnPlaceholder(item) })
    },
    fetchZones () {
      api('listZones').then(response => {
        this.zonesList = response.listzonesresponse.zone
        this.zoneId = this.zonesList[0].id
        this.loading = false
        this.fetchPods()
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.loading = false
      })
    },
    fetchHypervisors () {
      api('listHypervisors').then(response => {
        this.hypervisorsList = response.listhypervisorsresponse.hypervisor
        this.hypervisor = this.hypervisorsList[0].name
        this.loading = false
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.loading = false
      })
    },
    fetchPods () {
      this.loading = true
      api('listPods', {
        zoneid: this.zoneId
      }).then(response => {
        if (response.listpodsresponse.pod) {
          this.podsList = response.listpodsresponse.pod
          this.podId = this.podsList[0].id
        } else {
          this.podsList = []
          this.podId = null
        }
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.loading = false
      })
    },
    handleSubmitForm () {
      if (!this.clustername) {
        this.$refs.requiredCluster.classList.add('required-label--visible')
        return
      }
      this.$refs.requiredCluster.classList.remove('required-label--visible')

      if (this.hypervisor === 'Ovm3') {
        this.ovm3pool = 'on'
        this.ovm3cluster = 'undefined'
        this.ovm3vip = ''
      }

      if (this.hypervisor === 'VMware') {
        this.clustertype = 'ExternalManaged'
        const clusternameVal = this.clustername
        this.url = `http://${this.host}/${this.dataCenter}/${clusternameVal}`
        this.clustername = `${this.host}/${this.dataCenter}/${clusternameVal}`
      }

      this.loading = true
      this.parentToggleLoading()
      api('addCluster', {
        zoneId: this.zoneId,
        hypervisor: this.hypervisor,
        clustertype: this.clustertype,
        podId: this.podId,
        clustername: this.clustername,
        ovm3pool: this.ovm3pool,
        ovm3cluster: this.ovm3cluster,
        ovm3vip: this.ovm3vip,
        username: this.username,
        password: this.password,
        url: this.url
      }).then(response => {
        if (response.addclusterresponse.cluster[0].id) {
          this.dedicateCluster(response.addclusterresponse.cluster[0].id)
        }
        this.loading = false
        this.parentFetchData()
        this.fetchPods()
        this.parentToggleLoading()
        this.$parent.$parent.close()
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.addclusterresponse.errortext
        })
        this.loading = false
        this.parentFetchData()
        this.parentToggleLoading()
        this.$parent.$parent.close()
      })
    },
    dedicateCluster (clusterId) {
      this.loading = true
      api('dedicateCluster', {
        clusterId,
        domainId: this.domainId,
        account: this.dedicatedAccount
      }).then(response => {
        this.$pollJob({
          jobId: response.dedicateclusterresponse.jobid,
          successMessage: `Successfully dedicated cluster`,
          successMethod: () => {
            this.loading = false
            this.$store.dispatch('AddAsyncJob', {
              title: 'Successfully dedicated cluster',
              jobid: response.dedicateclusterresponse.jobid,
              description: `Domain ID: ${this.dedicatedDomainId}`,
              status: 'progress'
            })
          },
          errorMessage: 'Failed to dedicate cluster',
          errorMethod: () => {
            this.loading = false
          },
          loadingMessage: `Dedicating cluster...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.loading = false
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.loading = false
      })
    },
    resetAllFields () {
      this.clustername = null
      this.clustertype = 'CloudManaged'
      this.username = null
      this.password = null
      this.url = null
      this.host = null
      this.dataCenter = null
      this.ovm3pool = null
      this.ovm3cluster = null
      this.ovm3vip = null
    },
    returnPlaceholder (field) {
      this.params.find(i => {
        if (i.name === field) this.placeholder[field] = i.description
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .form {

    &__label {
      margin-bottom: 5px;
      font-weight: bold;
    }

    &__item {
      margin-bottom: 20px;
    }

    .ant-select {
      width: 85vw;

      @media (min-width: 760px) {
        width: 400px;
      }
    }

  }

  .actions {
    display: flex;
    justify-content: flex-end;

    button {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }

  }

  .required {
    color: #ff0000;

    &-label {
      display: none;

      &--visible {
        display: block;
      }

    }

  }
</style>

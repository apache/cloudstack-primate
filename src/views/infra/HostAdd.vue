<template>
  <a-spin :spinning="loading">
    <div class="form">

      <a-popover placement="bottom">
        <template slot="content">
          The zone where you want to add the host
        </template>
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
      </a-popover>

      <a-popover placement="bottom">
        <template slot="content">
          The pod where you want to add the host
        </template>
        <div class="form__item">
          <div class="form__label"><span class="required">* </span>{{ $t('podname') }}</div>
          <a-select v-model="podId" @change="fetchClusters">
            <a-select-option
              v-for="pod in podsList"
              :value="pod.id"
              :key="pod.id">
              {{ pod.name }}
            </a-select-option>
          </a-select>
        </div>
      </a-popover>

      <a-popover placement="bottom">
        <template slot="content">
          The cluster where you want to add the host
        </template>
        <div class="form__item">
          <div class="form__label"><span class="required">* </span>{{ $t('clustername') }}</div>
          <a-select v-model="clusterId">
            <a-select-option
              v-for="cluster in clustersList"
              :value="cluster.id"
              :key="cluster.id">
              {{ cluster.name }}
            </a-select-option>
          </a-select>
        </div>
      </a-popover>

      <a-popover placement="bottom">
        <template slot="content">
          The DNS name or IP address of the host
        </template>
        <div class="form__item">
          <div class="form__label"><span class="required">* </span>{{ $t('hostnamelabel') }}</div>
          <span class="required required-label" ref="requiredCluster">Required</span>
          <a-input v-model="hostname"></a-input>
        </div>
      </a-popover>

      <a-popover placement="bottom">
        <template slot="content">
          Usually root
        </template>
        <div class="form__item">
          <div class="form__label"><span class="required">* </span>{{ $t('username') }}</div>
          <span class="required required-label" ref="requiredCluster">Required</span>
          <a-input v-model="username"></a-input>
        </div>
      </a-popover>

      <a-popover placement="bottom">
        <template slot="content">
          The password for the user named in Username. The password was set during the hypervisor installation on the
          host.
        </template>
        <div class="form__item">
          <div class="form__label"><span class="required">* </span>{{ $t('password') }}</div>
          <span class="required required-label" ref="requiredCluster">Required</span>
          <a-input v-model="password"></a-input>
        </div>
      </a-popover>

      <div class="form__item">
        <div class="form__label">{{ $t('hostTags') }}</div>
        <a-select
          mode="tags"
          placeholder="Type in part of a host tag"
          v-model="selectedTags"
        >
          <a-select-option v-for="tag in hostTagsList" :key="tag.name">{{ tag.name }}</a-select-option>
        </a-select>
      </div>

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

export default {
  name: 'HostAdd',
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
      podId: null,
      clusterId: null,
      hostname: null,
      username: null,
      password: null,
      selectedTags: [],
      zonesList: [],
      clustersList: [],
      podsList: [],
      hostTagsList: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.fetchZones()
      this.fetchHostTags()
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
          this.podId = ''
        }
        this.fetchClusters()
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.podsList = []
        this.podId = ''
        this.loading = false
      })
    },
    fetchClusters () {
      this.loading = true
      api('listClusters', {
        podid: this.podId
      }).then(response => {
        if (response.listclustersresponse.cluster) {
          this.clustersList = response.listclustersresponse.cluster
          this.clusterId = this.clustersList[0].id
        } else {
          this.clustersList = []
          this.clusterId = null
        }
        this.loading = false
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.listclustersresponse.errortext
        })
        this.clustersList = []
        this.clusterId = null
        this.loading = false
      })
    },
    fetchHostTags () {
      this.loading = true
      api('listHostTags').then(response => {
        if (response.listhosttagsresponse.hosttag) {
          this.hostTagsList = response.listhosttagsresponse.hosttag
        } else {
          this.hostTagsList = []
        }
        this.loading = false
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.listhosttagsresponse.errortext
        })
        this.hostTagsList = []
        this.loading = false
      })
    },
    handleSubmitForm () {

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

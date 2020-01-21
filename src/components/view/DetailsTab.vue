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
    <a-list
      size="small"
      :dataSource="$route.meta.details">
      <a-list-item slot="renderItem" slot-scope="item" v-if="item in resource">
        <div>
          <strong>{{ $t(item) }}</strong>
          <br/>
          <div>
            {{ resource[item] }}
          </div>
        </div>
      </a-list-item>
      <div v-if="dedicatedSectionActive">
        <a-list-item v-if="dedicatedDomainId">
          <div>
            <div style="margin-bottom: 10px;">
              <strong>{{ $t('dedicated') }}</strong>
              <div>Yes</div>
            </div>
            <div>
              <strong>{{ $t('domainid') }}</strong>
              <div>{{ dedicatedDomainId }}</div>
            </div>
            <a-button style="margin-top: 10px;" type="danger" @click="handleRelease">
              {{ releaseButtonLabel }}
            </a-button>
          </div>
        </a-list-item>
        <a-list-item v-else>
          <div>
            <strong>{{ $t('dedicated') }}</strong>
            <div>No</div>
            <a-button type="primary" style="margin-top: 10px;" @click="handleOpenDedicatedModal">
              {{ dedicatedButtonLabel }}
            </a-button>
          </div>
        </a-list-item>
      </div>

    </a-list>

    <a-modal
      v-if="dedicatedSectionActive"
      v-model="dedicatedDomainModal"
      :title="dedicatedModalLabel"
      @ok="handleDedicateForm">
      <DedicateDomain
        @domainChange="id => domainId = id"
        @accountChange="id => dedicatedAccount = id"
        :error="domainError" />
    </a-modal>
  </div>

</template>

<script>
import { api } from '@/api'
import DedicateDomain from './DedicateDomain'

export default {
  name: 'DetailsTab',
  components: {
    DedicateDomain
  },
  props: {
    resource: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  inject: ['parentFetchData', 'parentToggleLoading'],
  data () {
    return {
      dedicatedDomainId: null,
      dedicatedDomainModal: false,
      domainId: null,
      dedicatedAccount: null,
      dedicatedButtonLabel: 'Dedicate',
      releaseButtonLabel: 'Release',
      dedicatedModalLabel: 'Dedicate',
      dedicatedSectionActive: false,
      domainError: false
    }
  },
  mounted () {
    if (this.$route.meta.name === 'zone') {
      this.dedicatedSectionActive = true
      this.fetchDedicatedZones()
      this.releaseButtonLabel = this.$t('label.release.dedicated.zone')
      this.dedicatedButtonLabel = this.$t('label.dedicate.zone')
      this.dedicatedModalLabel = this.$t('label.dedicate.zone')
    }
    if (this.$route.meta.name === 'pod') {
      this.dedicatedSectionActive = true
      this.fetchDedicatedPods()
      this.releaseButtonLabel = this.$t('label.release.dedicated.pod')
      this.dedicatedButtonLabel = this.$t('label.dedicate.pod')
      this.dedicatedModalLabel = this.$t('label.dedicate.pod')
    }
    if (this.$route.meta.name === 'cluster') {
      this.dedicatedSectionActive = true
      this.fetchDedicatedClusters()
      this.releaseButtonLabel = this.$t('label.release.dedicated.cluster')
      this.dedicatedButtonLabel = this.$t('label.dedicate.cluster')
      this.dedicatedModalLabel = this.$t('label.dedicate.cluster')
    }
    if (this.$route.meta.name === 'host') {
      this.dedicatedSectionActive = true
      this.fetchDedicatedHosts()
      this.releaseButtonLabel = this.$t('label.release.dedicated.host')
      this.dedicatedButtonLabel = this.$t('label.dedicate.host')
      this.dedicatedModalLabel = this.$t('label.dedicate.host')
    }
  },
  methods: {
    fetchDedicatedZones () {
      this.parentToggleLoading()
      api('listDedicatedZones', {
        zoneid: this.resource.id
      }).then(response => {
        if (response.listdedicatedzonesresponse.dedicatedzone &&
          response.listdedicatedzonesresponse.dedicatedzone.length > 0) {
          this.dedicatedDomainId = response.listdedicatedzonesresponse.dedicatedzone[0].domainid
        }
        this.parentFetchData()
        this.parentToggleLoading()
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.parentFetchData()
        this.parentToggleLoading()
      })
    },
    fetchDedicatedPods () {
      this.parentToggleLoading()
      api('listDedicatedPods', {
        podid: this.resource.id
      }).then(response => {
        if (response.listdedicatedpodsresponse.dedicatedpod &&
          response.listdedicatedpodsresponse.dedicatedpod.length > 0) {
          this.dedicatedDomainId = response.listdedicatedpodsresponse.dedicatedpod[0].domainid
        }
        this.parentFetchData()
        this.parentToggleLoading()
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.parentFetchData()
        this.parentToggleLoading()
      })
    },
    fetchDedicatedClusters () {
      this.parentToggleLoading()
      api('listDedicatedClusters', {
        clusterid: this.resource.id
      }).then(response => {
        if (response.listdedicatedclustersresponse.dedicatedcluster &&
          response.listdedicatedclustersresponse.dedicatedcluster.length > 0) {
          this.dedicatedDomainId = response.listdedicatedclustersresponse.dedicatedcluster[0].domainid
        }
        this.parentFetchData()
        this.parentToggleLoading()
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.parentFetchData()
        this.parentToggleLoading()
      })
    },
    fetchDedicatedHosts () {
      this.parentToggleLoading()
      api('listDedicatedHosts', {
        hostid: this.resource.id
      }).then(response => {
        if (response.listdedicatedhostsresponse.dedicatedhost &&
          response.listdedicatedhostsresponse.dedicatedhost.length > 0) {
          this.dedicatedDomainId = response.listdedicatedhostsresponse.dedicatedhost[0].domainid
        }
        this.parentFetchData()
        this.parentToggleLoading()
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.parentFetchData()
        this.parentToggleLoading()
      })
    },
    dedicateZone () {
      if (!this.domainId) {
        this.domainError = true
        return
      }
      this.parentToggleLoading()
      api('dedicateZone', {
        zoneId: this.resource.id,
        domainId: this.domainId,
        account: this.dedicatedAccount
      }).then(response => {
        this.$pollJob({
          jobId: response.dedicatezoneresponse.jobid,
          successMessage: `Successfully dedicated zone`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainId = this.domainId
            this.dedicatedDomainModal = false
          },
          errorMessage: 'Failed to dedicate zone',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainModal = false
          },
          loadingMessage: `Dedicating zone...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainModal = false
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.dedicatedDomainModal = false
      })
    },
    dedicatePod () {
      if (!this.domainId) {
        this.domainError = true
        return
      }
      this.parentToggleLoading()
      api('dedicatePod', {
        podId: this.resource.id,
        domainId: this.domainId,
        account: this.dedicatedAccount
      }).then(response => {
        this.$pollJob({
          jobId: response.dedicatepodresponse.jobid,
          successMessage: `Successfully dedicated pod`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainId = this.domainId
            this.dedicatedDomainModal = false
          },
          errorMessage: 'Failed to dedicate pod',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainModal = false
          },
          loadingMessage: `Dedicating pod...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainModal = false
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.dedicatedDomainModal = false
      })
    },
    dedicateCluster () {
      if (!this.domainId) {
        this.domainError = true
        return
      }
      this.parentToggleLoading()
      api('dedicateCluster', {
        clusterId: this.resource.id,
        domainId: this.domainId,
        account: this.dedicatedAccount
      }).then(response => {
        this.$pollJob({
          jobId: response.dedicateclusterresponse.jobid,
          successMessage: `Successfully dedicated cluster`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainId = this.domainId
            this.dedicatedDomainModal = false
          },
          errorMessage: 'Failed to dedicate cluster',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainModal = false
          },
          loadingMessage: `Dedicating cluster...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainModal = false
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.dedicatedDomainModal = false
      })
    },
    dedicateHost () {
      if (!this.domainId) {
        this.domainError = true
        return
      }
      this.parentToggleLoading()
      api('dedicateHost', {
        hostId: this.resource.id,
        domainId: this.domainId,
        account: this.dedicatedAccount
      }).then(response => {
        this.$pollJob({
          jobId: response.dedicatehostresponse.jobid,
          successMessage: `Successfully dedicated host`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainId = this.domainId
            this.dedicatedDomainModal = false
          },
          errorMessage: 'Failed to dedicate host',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainModal = false
          },
          loadingMessage: `Dedicating host...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainModal = false
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.dedicatedDomainModal = false
      })
    },
    releaseDedidcatedZone () {
      this.parentToggleLoading()
      api('releaseDedicatedZone', {
        zoneid: this.resource.id
      }).then(response => {
        this.$pollJob({
          jobId: response.releasededicatedzoneresponse.jobid,
          successMessage: `Successfully released dedicated zone`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainId = null
          },
          errorMessage: 'Failed to release dedicated zone',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          loadingMessage: `Releasing dedicated zone...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
      })
    },
    releaseDedidcatedPod () {
      this.parentToggleLoading()
      api('releaseDedicatedPod', {
        podid: this.resource.id
      }).then(response => {
        this.$pollJob({
          jobId: response.releasededicatedpodresponse.jobid,
          successMessage: `Successfully released dedicated pod`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainId = null
          },
          errorMessage: 'Failed to release dedicated pod',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          loadingMessage: `Releasing dedicated pod...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
      })
    },
    releaseDedidcatedCluster () {
      this.parentToggleLoading()
      api('releaseDedicatedCluster', {
        clusterid: this.resource.id
      }).then(response => {
        this.$pollJob({
          jobId: response.releasededicatedclusterresponse.jobid,
          successMessage: `Successfully released dedicated cluster`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainId = null
          },
          errorMessage: 'Failed to release dedicated cluster',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          loadingMessage: `Releasing dedicated cluster...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
      })
    },
    releaseDedidcatedHost () {
      this.parentToggleLoading()
      api('releaseDedicatedHost', {
        hostid: this.resource.id
      }).then(response => {
        this.$pollJob({
          jobId: response.releasededicatedhostresponse.jobid,
          successMessage: `Successfully released dedicated host`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
            this.dedicatedDomainId = null
          },
          errorMessage: 'Failed to release dedicated host',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          loadingMessage: `Releasing dedicated host...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
      })
    },
    handleOpenDedicatedModal () {
      this.dedicatedDomainModal = true
    },
    handleDedicateForm () {
      if (this.$route.meta.name === 'zone') {
        this.dedicateZone()
      }
      if (this.$route.meta.name === 'pod') {
        this.dedicatePod()
      }
      if (this.$route.meta.name === 'cluster') {
        this.dedicateCluster()
      }
      if (this.$route.meta.name === 'host') {
        this.dedicateHost()
      }
    },
    handleRelease () {
      if (this.$route.meta.name === 'zone') {
        this.releaseDedidcatedZone()
      }
      if (this.$route.meta.name === 'pod') {
        this.releaseDedidcatedPod()
      }
      if (this.$route.meta.name === 'cluster') {
        this.releaseDedidcatedCluster()
      }
      if (this.$route.meta.name === 'host') {
        this.releaseDedidcatedHost()
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>

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
  <a-spin :spinning="componentLoading">
    <a-button
      type="primary"
      style="margin-bottom: 20px;"
      @click="handleOpenAddIpRangeModal">
      {{ $t('label.add.ip.range') }}
    </a-button>

    <a-list class="list" itemLayout="vertical">
      <a-list-item v-for="item in items" :key="item.id">
        <div class="list__item">
          <div class="list__data">
            <div class="list__col">
              <div class="list__label">{{ $t('podId') }}</div>
              <div>{{ returnPodName(item.podid) }}</div>
            </div>
            <div class="list__col">
              <div class="list__label">{{ $t('gateway') }}</div>
              <div>{{ item.gateway }}</div>
            </div>
            <div class="list__col">
              <div class="list__label">{{ $t('netmask') }}</div>
              <div>{{ item.netmask }}</div>
            </div>
            <div class="list__col">
              <div class="list__label">{{ $t('vlan') }}</div>
              <div>{{ item.vlan }}</div>
            </div>
            <div class="list__col">
              <div class="list__label">{{ $t('startip') }}</div>
              <div>{{ item.startip }}</div>
            </div>
            <div class="list__col">
              <div class="list__label">{{ $t('endip') }}</div>
              <div>{{ item.endip }}</div>
            </div>
          </div>
          <div slot="actions" class="actions">
            <a-popover placement="bottom">
              <template slot="content">{{ $t('label.remove.ip.range') }}</template>
              <a-button
                icon="delete"
                shape="round"
                type="danger"
                @click="handleDeleteIpRange(item.id)"></a-button>
            </a-popover>
          </div>
        </div>
      </a-list-item>
    </a-list>

    <a-modal v-model="addIpRangeModal" :title="$t('label.add.ip.range')" @ok="handleAddIpRange">
      <a-form
        :form="form"
        @submit="handleAddIpRange"
        layout="vertical"
        class="form"
      >
        <a-form-item :label="$t('podId')" class="form__item">
          <a-select
            v-decorator="['pod', {
              rules: [{ required: true, message: 'Required' }]
            }]"
          >
            <a-select-option v-for="pod in pods" :key="pod.id" :value="pod.id">{{ pod.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('gateway')" class="form__item">
          <a-input
            v-decorator="['gateway', { rules: [{ required: true, message: 'Required' }] }]">
          </a-input>
        </a-form-item>
        <a-form-item :label="$t('netmask')" class="form__item">
          <a-input
            v-decorator="['netmask', { rules: [{ required: true, message: 'Required' }] }]">
          </a-input>
        </a-form-item>
        <a-form-item :label="$t('vlan')" class="form__item">
          <a-input
            v-decorator="['vlan']">
          </a-input>
        </a-form-item>
        <a-form-item :label="$t('startip')" class="form__item">
          <a-input
            v-decorator="['startip', { rules: [{ required: true, message: 'Required' }] }]">
          </a-input>
        </a-form-item>
        <a-form-item :label="$t('endip')" class="form__item">
          <a-input
            v-decorator="['endip', { rules: [{ required: true, message: 'Required' }] }]">
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>

  </a-spin>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'IpRangesTabStorage',
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
  data () {
    return {
      componentLoading: false,
      items: [],
      pods: [],
      domains: [],
      domainsLoading: false,
      addIpRangeModal: false,
      defaultSelectedPod: null
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    resource (newData, oldData) {
      if (!newData && this.resource.id) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData () {
      this.fetchPods()
      this.componentLoading = true
      api('listStorageNetworkIpRange', {
        zoneid: this.resource.zoneid
      }).then(response => {
        this.items = response.liststoragenetworkiprangeresponse.storagenetworkiprange ? response.liststoragenetworkiprangeresponse.storagenetworkiprange : []
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.liststoragenetworkiprangeresponse
            ? error.response.data.liststoragenetworkiprangeresponse.errortext : error.response.data.errorresponse.errortext
        })
      }).finally(() => {
        this.componentLoading = false
      })
    },
    fetchPods () {
      this.componentLoading = true
      api('listPods', {
        zoneid: this.resource.zoneid
      }).then(response => {
        this.pods = response.listpodsresponse.pod ? response.listpodsresponse.pod : []
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.listpodsresponse
            ? error.response.data.listpodsresponse.errortext : error.response.data.errorresponse.errortext
        })
      }).finally(() => {
        this.componentLoading = false
      })
    },
    returnPodName (id) {
      const match = this.pods.find(i => i.id === id)
      return match ? match.name : null
    },
    handleOpenAddIpRangeModal () {
      this.addIpRangeModal = true
      setTimeout(() => {
        if (this.items.length > 0) {
          this.form.setFieldsValue({
            pod: this.pods[0].id
          })
        }
      }, 200)
    },
    handleDeleteIpRange (id) {
      this.componentLoading = true
      api('deleteStorageNetworkIpRange', { id }).then(response => {
        this.$store.dispatch('AddAsyncJob', {
          title: `Successfully removed IP Range`,
          jobid: response.deletestoragenetworkiprangeresponse.jobid,
          status: 'progress'
        })
        this.$pollJob({
          jobId: response.deletestoragenetworkiprangeresponse.jobid,
          successMethod: () => {
            this.componentLoading = false
            this.fetchData()
          },
          errorMessage: 'Removing failed',
          errorMethod: () => {
            this.componentLoading = false
            this.fetchData()
          },
          loadingMessage: `Removing IP Range...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.componentLoading = false
            this.fetchData()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.deletestoragenetworkiprangeresponse
            ? error.response.data.deletestoragenetworkiprangeresponse.errortext : error.response.data.errorresponse.errortext
        })
        this.componentLoading = false
        this.fetchData()
      })
    },
    handleAddIpRange (e) {
      this.form.validateFields((error, values) => {
        if (error) return

        this.componentLoading = true
        this.addIpRangeModal = false
        api('createStorageNetworkIpRange', {
          podid: values.pod,
          zoneid: this.resource.zoneid,
          gateway: values.gateway,
          netmask: values.netmask,
          startip: values.startip,
          endip: values.endip,
          vlan: values.vlan || null
        }).then(response => {
          this.$store.dispatch('AddAsyncJob', {
            title: `Successfully added IP Range`,
            jobid: response.createstoragenetworkiprangeresponse.jobid,
            status: 'progress'
          })
          this.$pollJob({
            jobId: response.createstoragenetworkiprangeresponse.jobid,
            successMethod: () => {
              this.componentLoading = false
              this.fetchData()
            },
            errorMessage: 'Adding failed',
            errorMethod: () => {
              this.componentLoading = false
              this.fetchData()
            },
            loadingMessage: `Adding IP Range...`,
            catchMessage: 'Error encountered while fetching async job result',
            catchMethod: () => {
              this.componentLoading = false
              this.fetchData()
            }
          })
        }).catch(error => {
          this.$notification.error({
            message: `Error ${error.response.status}`,
            description: error.response.data.createstoragenetworkiprangeresponse
              ? error.response.data.createstoragenetworkiprangeresponse.errortext : error.response.data.errorresponse.errortext
          })
        }).finally(() => {
          this.componentLoading = false
          this.fetchData()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list {
    &__item {
      display: flex;
    }

    &__data {
      display: flex;
      flex-wrap: wrap;
    }

    &__col {
      flex-basis: calc((100% / 3) - 20px);
      margin-right: 20px;
      margin-bottom: 10px;
    }

    &__label {
      font-weight: bold;
    }
  }

  .ant-list-item {
    padding-top: 0;
    padding-bottom: 0;

    &:not(:first-child) {
      padding-top: 20px;
    }

    &:not(:last-child) {
      padding-bottom: 20px;
    }
  }

  .actions {
    button {
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }

  .ant-select {
    width: 100%;
  }

  .form {
    .actions {
      display: flex;
      justify-content: flex-end;

      button {
        &:not(:last-child) {
          margin-right: 10px;
        }
      }

    }

    &__item {
      font-weight: bold;
    }
  }
</style>

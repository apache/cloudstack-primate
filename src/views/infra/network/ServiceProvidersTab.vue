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
  <a-spin :spinning="fetchLoading">
    <!-- TODO: implement support for config drive, vpc router, ilbvm, virtual router -->
    <a-tabs :tabPosition="device === 'mobile' ? 'top' : 'left'" :animated="false">
      <a-tab-pane v-for="nsp in Object.values(nsps).sort(sortFunc)" :key="nsp.name">
        <span slot="tab">
          {{ nsp.name }}
          <status :text="nsp.state" style="margin-bottom: 6px; margin-left: 6px" />
        </span>
        <!-- <router-link :to="{ path: '/nsp/' + nsp.id + '?name=' + nsp.name + '&physicalnetworkid=' + resource.id }">{{ nsp.name }} </router-link> -->
        <a-list size="small" :dataSource="details">
          <a-list-item
            slot="renderItem"
            slot-scope="item"
            v-if="item in nsp && nsp[item].length"
          >
            <div>
              <strong>{{ $t(item) }}</strong>
              <br />
              <div>
                <status :text="nsp.state" v-if="item === 'state'" style="margin-bottom: 6px" />
                {{ Array.isArray(nsp[item]) ? nsp[item].join(", ") : nsp[item] }}
              </div>
            </div>
          </a-list-item>
        </a-list>
        <a-button
          v-if="nsp.id"
          type="primary"
          style="margin-top: 10px; margin-bottom: 10px;"
          @click="toggleServiceProvider(nsp)"
        >{{ toggleState(nsp.state).slice(0, -1) }}</a-button>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
import Vue from 'vue'
import { api } from '@/api'
import { mixinDevice } from '@/utils/mixin.js'
import Status from '@/components/widgets/Status'

export default {
  name: 'ServiceProvidersTab',
  components: {
    Status
  },
  mixins: [mixinDevice],
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
      nsps: {},
      details: ['name', 'id', 'state', 'servicelist'],
      hardcodedNsps: ['PaloAlto', 'Ovs', 'Netscaler', 'VirtualRouter', 'NiciraNvp', 'BigSwitchBcf', 'BaremetalDhcpProvider',
        'BaremetalPxeProvider', 'Opendaylight', 'F5BigIp', 'JuniperSRX', 'SecurityGroupProvider', 'BrocadeVcs', 'GloboDns', 'ConfigDrive',
        'InternalLbVm', 'VpcVirtualRouter'],
      fetchLoading: false
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    loading (newData, oldData) {
      if (!newData && this.resource.id) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData () {
      this.fetchServiceProvider()
      for (var nsp of this.hardcodedNsps) {
        this.fetchServiceProvider(nsp)
      }
    },
    fetchServiceProvider (name) {
      this.fetchLoading = true
      api('listNetworkServiceProviders', { physicalnetworkid: this.resource.id, name: name })
        .then(json => {
          var data = json.listnetworkserviceprovidersresponse.networkserviceprovider || []
          if (data.length) {
            for (var key in data) {
              Vue.set(this.nsps, data[key].name, data[key])
            }
          } else {
            this.nsps[name] = {
              name: name,
              state: 'Disabled'
            }
          }
        })
        .catch(error => {
          this.$notification.error({
            message: 'Request Failed',
            description: error
          })
        })
        .finally(() => {
          this.fetchLoading = false
        })
    },
    sortFunc (a, b) {
      if (a.state === b.state) {
        return a.name > b.name
      }
      return a.state < b.state
    },
    toggleState (state) {
      return state === 'Enabled' ? 'Disabled' : 'Enabled'
    },
    toggleServiceProvider (nsp) {
      api('updateNetworkServiceProvider', {
        id: nsp.id,
        state: this.toggleState(nsp.state)
      })
        .then(response => {
          this.$pollJob({
            jobId: response.updatenetworkserviceproviderresponse.jobid,
            successMessage: 'Successfully updated ' + nsp.name,
            successMethod: () => {
              this.fetchData()
            },
            errorMessage: 'Updating ' + nsp.name + ' failed',
            errorMethod: () => {
              this.fetchData()
            },
            loadingMessage: 'Updating ' + nsp.name + '...',
            catchMessage: 'Error encountered while fetching async job result',
            catchMethod: () => {
              this.fetchData()
            }
          })
        })
        .catch(error => {
          this.$notification.error({
            message: `Error ${error}`,
            description: error
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

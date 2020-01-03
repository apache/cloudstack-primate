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
    <p>Please confirm that you want Remote Access VPN enabled for this IP address.</p>

    <a-divider></a-divider>

    <div class="actions">
      <a-button @click="() => this.$parent.$parent.close()">Cancel</a-button>
      <a-button type="primary" @click="handleCreateVpn">Yes</a-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  inject: ['parentFetchData', 'parentToggleLoading'],
  methods: {
    handleCreateVpn () {
      this.parentToggleLoading()
      this.$parent.$parent.close()
      api('createRemoteAccessVpn', {
        publicipid: this.resource.id,
        domainid: this.resource.domainid,
        account: this.resource.account
      }).then(response => {
        this.$pollJob({
          jobId: response.createremoteaccessvpnresponse.jobid,
          successMethod: result => {
            const res = result.jobresult.remoteaccessvpn
            this.$notification.success({
              message: 'Status',
              description:
                `Your Remote Access VPN is currently enabled and can be accessed via the IP ${res.publicip}. Your IPSec pre-shared key is ${res.presharedkey}`,
              duration: 0
            })
            this.parentFetchData()
            this.parentToggleLoading()
          },
          errorMessage: 'Failed to enable VPN',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          loadingMessage: `Enabling VPN...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.createremoteaccessvpnresponse
            ? error.response.data.createremoteaccessvpnresponse.errortext : error.response.data.errorresponse.errortext
        })
        this.parentFetchData()
        this.parentToggleLoading()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .actions {
    display: flex;
    justify-content: flex-end;

    button {
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
</style>

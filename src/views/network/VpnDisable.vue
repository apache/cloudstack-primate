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
    <p>Are you sure you want to disable VPN?</p>

    <a-divider></a-divider>

    <div class="actions">
      <a-button @click="() => this.$parent.$parent.close()">Cancel</a-button>
      <a-button type="primary" @click="handleDisableVpn">Yes</a-button>
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
    handleDisableVpn () {
      this.parentToggleLoading()
      this.$parent.$parent.close()
      api('deleteRemoteAccessVpn', {
        publicipid: this.resource.id,
        domainid: this.resource.domainid
      }).then(response => {
        this.$pollJob({
          jobId: response.deleteremoteaccessvpnresponse.jobid,
          successMessage: 'Successfully disabled VPN',
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          errorMessage: 'Failed to disable VPN',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          loadingMessage: `Disabling VPN...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.deleteremoteaccessvpnresponse
            ? error.response.data.deleteremoteaccessvpnresponse.errortext : error.response.data.errorresponse.errortext
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

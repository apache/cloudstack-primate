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
  <div v-if="remoteAccessVpn">
    <div>
      <p>Your Remote Access VPN is currently enabled and can be accessed via the IP {{ remoteAccessVpn.publicip }}</p>
      <p>Your IPSec pre-shared key is {{ remoteAccessVpn.presharedkey }}</p>
      <p>Note: VPN users are now accessed by changing views at the networks tab.</p>
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
  data () {
    return {
      remoteAccessVpn: null
    }
  },
  inject: ['parentFetchData', 'parentToggleLoading'],
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.parentToggleLoading()
      api('listRemoteAccessVpns', {
        publicipid: this.resource.id,
        listAll: true
      }).then(response => {
        this.remoteAccessVpn = response.listremoteaccessvpnsresponse.remoteaccessvpn
          ? response.listremoteaccessvpnsresponse.remoteaccessvpn[0] : null
      }).catch(error => {
        console.log(error)
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
      })
        .finally(() => {
          this.parentToggleLoading()
        })
    }
  }
}
</script>

<style scoped>
</style>

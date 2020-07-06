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
  <DetailsTab :resource="resource" />
</template>
<script>
import DetailsTab from '@/components/view/DetailsTab'
import { api } from '@/api'
export default {
  name: 'ProjectDetailsTab',
  components: {
    DetailsTab
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  watch: {
    resource (newItem, oldItem) {
      if (!newItem || !newItem.id) {
        return
      }
      this.resource = newItem
      this.fetchProjectAccounts()
    }
  },
  methods: {
    fetchProjectAccounts () {
      api('listProjectAccounts', { projectid: this.resource.id }).then(json => {
        var listProjectAccount = json.listprojectaccountsresponse.projectaccount || []
        this.$set(this.resource, 'users', listProjectAccount)
        listProjectAccount = listProjectAccount.filter(account => {
          return (((account.userid && account.userid === this.$store.getters.userInfo.id) ||
          account.account === this.$store.getters.userInfo.account) &&
          account.role === 'Admin')
        })
        var isLoggedInUser = false
        if (listProjectAccount.length > 0) {
          isLoggedInUser = true
        }
        this.$set(this.resource, 'isLoggedInUser', isLoggedInUser)
      }).catch(error => {
        this.$notifyError(error)
      })
    }
  }
}
</script>

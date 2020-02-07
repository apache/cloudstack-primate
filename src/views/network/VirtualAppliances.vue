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
  <a-table
    class="table"
    size="small"
    :columns="columns"
    :dataSource="routers"
    :rowKey="item => item.id"
    :pagination="true"
  >
    <template slot="name" slot-scope="text,item">
      <router-link :to="{ path: '/router/' + item.id }" >{{ text }}</router-link>
    </template>
    <template slot="type" slot-scope="text, item">
      <span v-if="item.vpcid"> VPC </span>
      <span v-if="item.projectid"> Project </span>
      <span v-else> System </span>
    </template>
    <template slot="status" slot-scope="text, item">
      <status class="status" :text="item.state"/> <span> {{ item.state }} </span>
    </template>
    <template slot="requiresupgrade" slot-scope="text, item">
      <span v-if="item.requiresupagrade === true"> Yes </span>
      <span v-else> No </span>
    </template>
  </a-table>
</template>
<script>
import { api } from '@/api'
import Status from '@/components/widgets/Status'

export default {
  name: 'VpcRouterTab',
  components: {
    Status
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
  data () {
    return {
      routers: [],
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('ip'),
          dataIndex: 'publicip'
        },
        {
          title: 'Type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: this.$t('network'),
          dataIndex: 'guestnetworkname'
        },
        {
          title: this.$t('account'),
          dataIndex: 'account'
        },
        {
          title: this.$t('status'),
          dataIndex: 'state',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('requiresupgrade'),
          dataIndex: 'requiresupgrade',
          scopedSlots: { customRender: 'requiresupgrade' }
        }
      ]
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchLoading = true
      api('listRouters', { networkid: this.resource.id, listAll: true }).then(json => {
        this.routers = json.listroutersresponse.router
        console.log('router = ', this.routers)
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
        })
      }).finally(() => {
        this.fetchLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.status {
  margin-top: -5px;

  &--end {
    margin-left: 5px;
  }
}
</style>

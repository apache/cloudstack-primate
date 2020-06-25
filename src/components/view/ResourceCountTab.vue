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
  <a-spin :spinning="formLoading">
    <a-list
      size="small"
      :dataSource="resourceCountData"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <div>
          <strong>
            {{ $t('label.' + String(item).toLowerCase() + '.count') }}
          </strong>
          <br/>
          <br/>
          <div>
            Current Usage: {{ domainData[item + 'total'] }} / {{ domainData[item + 'limit'] < 0 ? 'Unlimited' : domainData[item + 'limit'] }}
          </div>
          <div>
            Available: {{ domainData[item + 'available'] < 0 ? 'Unlimited' : domainData[item + 'available'] }}
          </div>
        </div>
      </a-list-item>
    </a-list>
  </a-spin>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'ResourceCountTab',
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
      formLoading: false,
      domainData: {
        type: Object,
        required: false
      },
      resourceCountData: ['vm', 'cpu', 'memory', 'primarystorage', 'ip',
        'volume', 'secondarystorage', 'snapshot',
        'template', 'network', 'vpc', 'project']
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    resource (newData, oldData) {
      if (!newData || !newData.id) {
        return
      }
      this.resource = newData
      this.fetchData()
    }
  },
  methods: {
    getParams () {
      const params = {}
      if (this.$route.meta.name === 'account') {
        params.account = this.resource.name
        params.id = this.resource.domainid
      } else if (this.$route.meta.name === 'domain') {
        params.id = this.resource.id
      } else { // project
        params.projectid = this.resource.id
      }
      return params
    },
    fetchData () {
      const params = this.getParams()
      try {
        this.formLoading = true
        this.listDomains(params)
        this.formLoading = false
      } catch (e) {
        this.$notification.error({
          message: 'Request Failed',
          description: e
        })
        this.formLoading = false
      }
    },
    listDomains (params) {
      api('listDomains', params).then(json => {
        const domains = json.listdomainsresponse.domain || []
        this.domainData = domains[0] || {}
      }).catch(error => {
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description'],
          duration: 0
        })

        if ([401, 405].includes(error.response.status)) {
          this.$router.push({ path: '/exception/403' })
        }

        if ([430, 431, 432].includes(error.response.status)) {
          this.$router.push({ path: '/exception/404' })
        }

        if ([530, 531, 532, 533, 534, 535, 536, 537].includes(error.response.status)) {
          this.$router.push({ path: '/exception/500' })
        }
      }).finally(f => {
        this.loading = false
      })
    }
  }
}
</script>

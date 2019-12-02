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
    <a-spin :spinning="currentLoading">
      <detail-settings
        :items="dataSetting"
        :loading="currentLoading"
      >
      </detail-settings>
    </a-spin>
  </div>
</template>

<script>
import DetailSettings from '@/components/view/DetailSettings'
import { api } from '@/api'

export default {
  name: 'TemplateDomainSettings',
  components: {
    DetailSettings
  },
  props: {
    resource: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    tab: {
      type: String,
      default: function () {
        return 'details'
      }
    }
  },
  data () {
    return {
      dataSetting: [],
      oldResource: [],
      currentLoading: false
    }
  },
  mounted () {
    this.fetchSetting()
  },
  watch: {
    items: function () {
      this.dataSetting = this.items
    },
    resource: function () {
      if (this.tab === 'settings') {
        this.fetchSetting()
      }
    },
    tab: function () {
      if (this.tab === 'settings') {
        this.fetchSetting()
      }
    },
    loading: function () {
      this.currentLoading = this.loading
    }
  },
  methods: {
    fetchSetting () {
      if (this.oldResource.key === this.resource.key) {
        return
      }
      this.oldResource = this.resource
      const params = {
        listAll: true,
        domainid: this.resource.key
      }
      this.currentLoading = true
      api('listConfigurations', params).then(json => {
        this.dataSetting = json.listconfigurationsresponse.configuration
      }).catch(error => {
        // handle error
        this.$notification.error({
          message: 'Request Failed',
          description: error.response.headers['x-description']
        })
        if (error.response.status === 431) {
          this.$router.push({ path: '/exception/404' })
        }
      }).finally(f => {
        this.currentLoading = false
      })
    }
  }
}
</script>

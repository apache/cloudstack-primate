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
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import enUS from 'ant-design-vue/lib/locale-provider/en_US'
import { AppDeviceEnquire } from '@/utils/mixin'
import configUtils from '@/utils/configUtil'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: enUS,
      configs: {}
    }
  },
  mounted () {
    this.fetchConfig()
  },
  methods: {
    async fetchConfig () {
      const loading = this.$message.loading(this.$t('message.fetch.configuration'), 0)
      const config = await configUtils.fetchConfig()
      const storeConfig = this.$store.getters.configs
      this.configs = Object.assign({}, config, storeConfig)
      setTimeout(loading)
      await this.$store.dispatch('ToggleConfig', this.configs)
      await this.applyTheme()
    },
    async applyTheme () {
      await configUtils.changeTheme(this.configs.theme)
      this.$message.success(this.$t('message.apply.theme.success'))
    }
  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>

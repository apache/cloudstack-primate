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
  <a-list :dataSource="hosts" itemLayout="vertical" class="list" :loading="loading">
    <div slot="header" class="list__header">
      <a-input-search
        placeholder="Search"
        v-model="searchQuery"
        @search="fetchData" />
    </div>
    <a-list-item
      slot="renderItem"
      slot-scope="host, index"
      class="host-item"
      :class="{ 'host-item--selected' : selectedIndex === index }"
    >
      <div class="host-item__row">
        <div class="host-item__value">
          <span class="host-item__title">Title</span>
          {{ host.name }}
        </div>
        <div class="host-item__value">
          <span class="host-item__title">Suitability</span>
          <a-icon
            class="host-item__suitability-icon"
            type="check-circle"
            theme="twoTone"
            twoToneColor="#52c41a"
            v-if="host.suitableformigration" />
          <a-icon
            class="host-item__suitability-icon"
            type="close-circle"
            theme="twoTone"
            twoToneColor="#f5222d"
            v-else />
        </div>
      </div>
      <div class="host-item__row">
        <div class="host-item__value host-item__value--full">
          <span class="host-item__title">CPU Utilized</span>
          {{ host.cpuused }}
        </div>
        <div class="host-item__value">
          <span class="host-item__title">Memory Used</span>
          {{ host.memoryused | byteToGigabyte }} GB
        </div>
      </div>
      <a-radio @click="selectedIndex = index" :checked="selectedIndex === index" :disabled="!host.suitableformigration">
        Select
      </a-radio>
    </a-list-item>
    <div slot="footer" class="list__footer">
      <a-button type="primary" :disabled="selectedIndex === null" @click="submitForm">
        Ok
      </a-button>
    </div>
  </a-list>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'VMMigrateWizard',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      hosts: [],
      selectedIndex: null,
      searchQuery: ''
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      api('findHostsForMigration', {
        VirtualMachineId: this.resource.id,
        keyword: this.searchQuery
      }).then(response => {
        this.hosts = response.findhostsformigrationresponse.host
        this.loading = false
      }).catch(error => {
        console.error(error)
        this.$message.error('Failed to load hosts.')
      })
    },
    submitForm () {
      this.loading = true
      api('migrateVirtualMachine', {
        hostid: this.hosts[this.selectedIndex].id,
        virtualmachineid: this.resource.id
      }).then(response => {
        this.pollActionCompletion(response.migratevirtualmachineresponse.jobid)
      }).catch(error => {
        console.error(error)
        this.$message.error('Failed to migrate host.')
      })
    },
    pollActionCompletion (jobId) {
      api('queryAsyncJobResult', { jobId }).then(json => {
        const result = json.queryasyncjobresultresponse

        if (result.jobstatus === 1) {
          this.$message.success(`Migration completed successfully for ${this.resource.name}`)
          this.$parent.$parent.close()
        } else if (result.jobstatus === 2) {
          this.$message.error(`Migration failed for ${this.resource.name}`)
          this.fetchData()
        } else if (result.jobstatus === 0) {
          this.$message
            .loading(`Migration in progress for ${this.resource.name}`, 3)
            .then(() => this.pollActionCompletion(jobId))
        }
      }).catch(e => {
        console.log('Error encountered while fetching async job result' + e)
      })
    }
  },
  filters: {
    byteToGigabyte: value => {
      if (!value) return ''
      value = value / Math.pow(10, 9)
      return value.toFixed(2)
    }
  }
}
</script>

<style scoped lang="scss">

  .list {
    max-height: 90vh;
    overflow: scroll;
    margin: -24px;

    @media (min-width: 760px) {
      max-height: 50vh;
    }

    &__header,
    &__footer {
      padding-left: 20px;
      padding-right: 20px;
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
    }

  }

  .host-item {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-right: 20px;
    padding-bottom: 0;
    padding-left: 20px;

    &--selected {
      background-color: #e6f7ff;
    }

    &__row {
      display: flex;
      flex-direction: column;
      width: 100%;

      @media (min-width: 760px) {
        flex-direction: row;
      }

    }

    &__value {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex: 1;
      margin-bottom: 10px;
    }

    &__title {
      font-weight: bold;
    }

    &__suitability-icon {
      margin-top: 5px;
    }

  }
</style>

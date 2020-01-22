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
  <div class="form-layout">
    <a-spin :spinning="loading">
      <a-form :form="form" layout="vertical">
        <a-form-item :label="$t('scope')">
          <a-select v-decorator="['scope']" initialValue="Cluster" @change="val => { this.scope = val }">
            <a-select-option :value="$t('clusterid')"> {{ $t('clusterid') }} </a-select-option>
            <a-select-option :value="$t('zonewide')"> {{ $t('zonewide') }} </a-select-option>
          </a-select>
        </a-form-item>
        <div v-if="this.scope === 'Cluster'">
          <a-form-item :label="$t('zoneid')">
            <a-select
              v-decorator="['zone', { initialValue: this.zoneSelected, rules: [{ required: true, message: 'required'}] }]"
              @change="val => this.zoneSelected = val">
              <a-select-option :value="zone.id" v-for="(zone) in zones" :key="zone.id">
                {{ zone.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('podId')">
            <a-select
              v-decorator="['pod', { initialValue: this.podSelected, rules: [{ required: true, message: 'required'}] }]"
              @change="val => this.podSelected = val">
              <a-select-option :value="pod.id" v-for="(pod) in pods" :key="pod.id">
                {{ pod.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('clusterId')">
            <a-select
              v-decorator="['cluster', { initialValue: this.clusterSelected, rules: [{ required: true, message: 'required'}] }]"
              @change="val => this.clusterSelected = val">
              <a-select-option :value="cluster.id" v-for="(cluster) in clusters" :key="cluster.id">
                {{ cluster.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('name')">
            <a-input v-decorator="['name', { rules: [{ required: true, message: 'required' }] }]"/>
          </a-form-item>
        </div>
        <a-form-item :label="$t('protocol')">
          <a-select
            v-decorator="['protocol', { initialValue: this.protocols[0], rules: [{ required: true, message: 'required'}] }]"
            @change="val => this.protocolSelected = val">
            <a-select-option :value="protocol" v-for="(protocol,idx) in protocols" :key="idx">
              {{ protocol }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <div v-if="protocolSelected === 'nfs'">
          <a-form-item :label="$t('server')">
            <a-input v-decorator="['server', { rules: [{ required: true, message: 'required' }] }]" />
          </a-form-item>
          <a-form-item :label="$t('path')">
            <a-input v-decorator="['path', { rules: [{ required: true, message: 'required' }] }]" />
          </a-form-item>
        </div>
        <a-form-item :label="$t('providername')">
          <a-select
            v-decorator="['provider', { initialValue: 'SolidFire', rules: [{ required: true, message: 'required'}] }]">
            <a-select-option :value="provider" v-for="(provider,idx) in providers" :key="idx">
              {{ provider }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('isManaged')">
          <a-checkbox-group v-decorator="['managed']" >
            <a-checkbox value="ismanaged"></a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item :label="$t('capacityBytes')">
          <a-input v-decorator="['capacityBytes', { rules: [{ required: true, message: 'required' }] }]" />
        </a-form-item>
        <a-form-item :label="$t('capacityIops')">
          <a-input v-decorator="['capacityIops', { rules: [{ required: true, message: 'required' }] }]" />
        </a-form-item>
        <a-form-item :label="$t('url')">
          <a-input v-decorator="['url', { rules: [{ required: true, message: 'required' }] }]" />
        </a-form-item>
        <a-form-item :label="$t('storageTags')">
          <div>
            <template v-for="(tag, idx) in storagetags">
              <a-tag :key="idx" :closable="true" :afterClose="() => handleClose(tag)">
                {{ tag }}
              </a-tag>
            </template>
            <a-input
              v-if="inputVisible"
              ref="input"
              type="text"
              size="small"
              :style="{ width: 'auto' }"
              :value="tagInput"
              @change="handleInputChange"
              @blur="handleInputConfirm"
              @keyup.enter="handleInputConfirm"
            />
            <a-tag v-else @click="showTag" style="background: #fff; borderStyle: dashed;">
              <a-icon type="plus" /> New Tag
            </a-tag>
          </div>
        </a-form-item>
      </a-form>
      <div class="actions">
        <a-button @click="closeModal">{{ $t('Cancel') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('OK') }}</a-button>
      </div>
    </a-spin>
  </div>
</template>
<script>
import { api } from '@/api'
export default {
  name: 'AddPrimaryStorage',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      protocols: ['nfs', 'SharedMountPoint', 'RBD', 'CLVM', 'Gluster', 'custom'],
      providers: ['SolidFire', 'SolidFireShared', 'DefaultPrimary', 'Datera', 'CloudByte'],
      scope: 'Cluster',
      zones: [],
      pods: [],
      clusters: [],
      storagetags: [],
      zoneId: '',
      zoneSelected: '',
      podSelected: '',
      clusterSelected: '',
      protocolSelected: 'nfs',
      size: 'default',
      inputVisible: false,
      tagInput: '',
      loading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.getInfraData()
      this.listStorageTags()
      // this.listStorageProviders()
      // this.listHosts()
    },
    getInfraData () {
      api('listZones').then(json => {
        if (json && json.listzonesresponse && json.listzonesresponse.zone) {
          this.zones = json.listzonesresponse.zone
          if (this.zones.length > 0) {
            this.zoneSelected = this.zones[0].id
          }
        }
      }).then(() => {
        api('listPods', {
          zoneid: this.zoneSelected
        }).then(json => {
          if (json && json.listpodsresponse && json.listpodsresponse.pod) {
            this.pods = json.listpodsresponse.pod
            if (this.pods.length > 0) {
              this.podSelected = this.pods[0].id
            }
          }
        }).then(() => {
          console.log('pod id = ', this.podSelected)
          api('listClusters', {
            podid: this.podSelected
          }).then(json => {
            if (json && json.listclustersresponse && json.listclustersresponse.cluster) {
              this.clusters = json.listclustersresponse.cluster
              if (this.clusters.length > 0) {
                this.clusterSelected = this.clusters[0].id
              }
            }
          })
        })
      })
    },
    listStorageTags () {
      api('listStorageTags').then(json => {
        if (json && json.liststoragetagsresponse && json.liststoragetagsresponse.storagetag) {
          var storagetags = json.liststoragetagsresponse.storagetag
          for (var i = 0; i < storagetags.length; i++) {
            this.storagetags.push(storagetags[i].name)
          }
        }
      })
    },
    handleClose (removedTag) {
      const tags = this.storagetags.filter(tag => tag !== removedTag)
      console.log(tags)
      this.storagetags = tags
    },
    showTag () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },
    handleInputChange (e) {
      this.tagInput = e.target.value
    },
    handleInputConfirm () {
      const tagInput = this.tagInput
      if (tagInput && this.storagetags.indexOf(tagInput) === -1) {
        this.storagetags.push(tagInput)
      }
      this.inputVisible = false
      this.tagInput = ''
    },
    closeModal () {
      this.$parent.$parent.close()
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log('values = ', values)
        console.log('zone id = ', this.zoneSelected)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.form-layout {
  width: 80vw;
  @media (min-width: 1000px) {
    width: 35vw;
  }
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  button {
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>

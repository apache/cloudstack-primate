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
    <div v-show="!showAddDetail">
      <a-button type="dashed" style="width: 100%" icon="plus" @click="showAddDetail = true">Add Setting</a-button>
    </div>
    <div v-show="showAddDetail">
      <a-input placeholder="Name"/>
      <a-input placeholder="Value"/>
      <a-button type="dashed" style="width: 50%" icon="close" @click="showAddDetail = false">Cancel</a-button>
      <a-button type="primary" style="width: 50%" icon="plus" @click="addDetail">Add Setting</a-button>
    </div>
    <a-list size="large">
      <a-list-item :key="index" v-for="(item, index) in details">
        <a-list-item-meta>
          <span slot="title">{{ item.name }}</span>
          <span slot="description" style="word-break: break-all">
            <span v-if="item.edit" style="display: flex">
              <a-input :value="item.value" @change="e => handleInputChange(e, index)" />
              <a-button shape="circle" size="small" @click="updateDetail(item)" style="margin: 2px">
                <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="font-size: 24px"/>
              </a-button>
              <a-button shape="circle" size="small" @click="hideEditDetail(index)" style="margin: 2px">
                <a-icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" style="font-size: 24px"/>
              </a-button>
            </span>
            <span v-else>{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <div slot="actions">
          <a-button shape="circle" @click="showEditDetail(index)">
            <a-icon type="edit" />
          </a-button>
        </div>
        <div slot="actions">
          <a-popconfirm
            title="Delete setting?"
            @confirm="deleteDetail(item)"
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <a-button shape="circle">
              <a-icon type="delete" theme="twoTone" twoToneColor="#f5222d" />
            </a-button>
          </a-popconfirm>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  name: 'DetailSettings',
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
      details: [],
      showAddDetail: false
    }
  },
  mounted () {
    this.details = Object.keys(this.resource.details).map(k => {
      return { name: k, value: this.resource.details[k] }
    })
    this.details.forEach(function (detail, index) {
      detail.edit = false
    })
  },
  methods: {
    showEditDetail (index) {
      this.details[index].edit = true
      this.details[index].originalValue = this.details[index].value
      this.$set(this.details, index, this.details[index])
    },
    hideEditDetail (index) {
      this.details[index].edit = false
      this.details[index].value = this.details[index].originalValue
      this.$set(this.details, index, this.details[index])
    },
    handleInputChange (e, index) {
      this.details[index].value = e.target.value
      this.$set(this.details, index, this.details[index])
    },
    addDetail () {
      console.log('adding detail')
    },
    updateDetail (item) {
      console.log(item)
    },
    deleteDetail (item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>
</style>

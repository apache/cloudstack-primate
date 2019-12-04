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
  <a-tooltip placement="bottom">
    <template slot="title">
      Delete role
    </template>
    <a-popconfirm
      title="Delete Role?"
      @confirm="handleDelete"
    >
      <a-button type="danger">
        <a-icon
          type="loading"
          v-if="deleteLoading"
        />
        <a-icon
          type="delete"
          v-else
        />
      </a-button>
    </a-popconfirm>
  </a-tooltip>
</template>

<script>
export default {
  name: 'RoleDelete',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      deleteLoading: false
    }
  },
  methods: {
    handleDelete () {
      this.deleteLoading = true
      this.$emit('delete', this)
    }
  }
}
</script>

<style
  scoped
  lang="scss"
>
  .anticon-delete {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

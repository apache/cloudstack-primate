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
    <a-table
      size="small"
      class="row-list-data"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :rowKey="record => record.id || record.name"
      :pagination="false"
      :scroll="{ y: '60vh' }"/>
    <a-pagination
      size="small"
      class="row-pagination"
      :current="page"
      :pageSize="pageSize"
      :total="itemCount"
      :showTotal="total => `Total ${total} items`"
      :pageSizeOptions="['10', '20', '40', '80', '100']"
      @change="changePage"
      @showSizeChange="changePageSize"
      showSizeChanger
      showQuickJumper />
  </div>
</template>

<script>
export default {
  name: 'ListDevice',
  props: {
    columns: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: () => 1
    },
    pageSize: {
      type: Number,
      default: () => 10
    },
    itemCount: {
      type: Number,
      default: () => 0
    }
  },
  inject: ['providerChangePage'],
  methods: {
    changePage (page, pageSize) {
      this.providerChangePage(page, pageSize)
    },
    changePageSize (currentPage, pageSize) {
      this.providerChangePage(currentPage, pageSize)
    }
  }
}
</script>

<style scoped lang="less">
.row-pagination {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
}
</style>

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
    <a-list
      size="small"
      itemLayout="vertical"
      :dataSource="resource.nic"
      class="list"
      :loading="loading"
    >
      <a-list-item slot="renderItem" slot-scope="item" class="list-item">
        <a-list-item-meta>
          <div slot="avatar">
            <a-avatar slot="avatar">
              <a-icon type="wifi" />
            </a-avatar>
          </div>
          <div slot="title" class="title">
            NIC
            <div class="title__details">
              <div class="tags">
                <a-tag v-if="item.isdefault">
                  {{ $t('label.default') }}
                </a-tag>
                <a-tag v-if="item.type">
                  {{ item.type }}
                </a-tag>
                <a-tag v-if="item.broadcasturi">
                  {{ item.broadcasturi }}
                </a-tag>
                <a-tag v-if="item.isolationuri">
                  {{ item.isolationuri }}
                </a-tag>
              </div>
            </div>
          </div>
        </a-list-item-meta>
        <div>
          <a-divider class="divider-small" />
          <div class="attribute" v-if="item.type">
            <div class="label">{{ $t('label.type') }}</div>
            <div>{{ item.type }}</div>
          </div>
          <div class="attribute" v-if="item.traffictype">
            <div class="label">{{ $t('label.traffictype') }}</div>
            <div>{{ item.traffictype }}</div>
          </div>
          <div class="attribute" v-if="item.networkname">
            <div class="label">{{ $t('label.network.name') }}</div>
            <div>{{ item.networkname }}</div>
          </div>
          <div class="attribute">
            <div class="label">{{ $t('label.macaddress') }}</div>
            <div>{{ item.macaddress }}</div>
          </div>
          <div class="attribute" v-if="item.ipaddress">
            <div class="label">{{ $t('label.ipaddress') }}</div>
            <div>{{ item.ipaddress }}</div>
          </div>
          <div class="attribute" v-if="item.secondaryip && item.secondaryip.length > 0 && item.type !== 'L2'">
            <div class="label">{{ $t('label.secondaryips') }}</div>
            <div>{{ item.secondaryip.map(x => x.ipaddress).join(', ') }}</div>
          </div>
          <div class="attribute" v-if="item.netmask">
            <div class="label">{{ $t('label.netmask') }}</div>
            <div>{{ item.netmask }}</div>
          </div>
          <div class="attribute" v-if="item.gateway">
            <div class="label">{{ $t('label.gateway') }}</div>
            <div>{{ item.gateway }}</div>
          </div>
          <div class="attribute" v-if="item.networkid">
            <div class="label">{{ $t('label.guestnetworkid') }}</div>
            <div>{{ item.networkid }}</div>
          </div>
          <div class="attribute">
            <div class="label">{{ $t('label.id') }}</div>
            <div><a-icon type="barcode"/> {{ item.id }}</div>
          </div>
        </div>
      </a-list-item>
    </a-list>

  </div>
</template>

<script>

export default {
  name: 'RouterNics',
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
  inject: ['parentFetchData'],
  data () {
    return {
    }
  },
  created () {
    if (!('nic' in this.resource)) {
      this.parentFetchData()
    }
  },
  watch: {
    resource: function (newItem, oldItem) {
      if (!('nic' in this.resource)) {
        this.parentFetchData()
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .page-header-wrapper-grid-content-main {
    width: 100%;
    height: 100%;
    min-height: 100%;
    transition: 0.3s;
    .vm-detail {
      .svg-inline--fa {
        margin-left: -1px;
        margin-right: 8px;
      }
      span {
        margin-left: 10px;
      }
      margin-bottom: 8px;
    }
  }

  .list {
    margin-top: 20px;

    &__item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      @media (min-width: 760px) {
        flex-direction: row;
        align-items: center;
      }
    }
  }

  .modal-form {
    display: flex;
    flex-direction: column;

    &__label {
      margin-top: 20px;
      margin-bottom: 5px;
      font-weight: bold;

      &--no-margin {
        margin-top: 0;
      }
    }
  }

  .label {
    font-weight: bold;
  }

  .attribute {
    margin-bottom: 10px;
  }

  .ant-tag {
    padding: 4px 10px;
    height: auto;
  }

  .title {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    a {
      margin-right: 30px;
      margin-bottom: 10px;
    }

    .ant-tag {
      margin-bottom: 10px;
    }

    &__details {
      display: flex;
    }

    .tags {
      margin-left: 10px;
    }

  }

  .ant-list-item-meta-title {
    margin-bottom: -10px;
  }

  .divider-small {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .list-item {

    &:not(:first-child) {
      padding-top: 25px;
    }

  }
</style>

<style scoped>
.wide-modal {
  min-width: 50vw;
}

/deep/ .ant-list-item {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>

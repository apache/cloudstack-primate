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
  <a-icon v-if="loadingTable" type="loading" class="main-loading-spinner"></a-icon>
  <div v-else>
    <div v-if="updateTable" class="loading-overlay">
      <a-icon type="loading" />
    </div>
    <div
      class="rules-list ant-list ant-list-bordered"
      :class="{'rules-list--overflow-hidden' : updateTable}" >

      <div class="rules-table-item ant-list-item">
        <div class="rules-table__col rules-table__col--grab"></div>
        <div class="rules-table__col rules-table__col--rule rules-table__col--new">
          <a-p-i-auto-complete
            @selectedRecord="onRuleSelect"
            :error="newRuleSelectError"
            :data="$store.getters.apis"
            :defaultValue="newRoleSelectedRule"
          />
        </div>
        <div class="rules-table__col rules-table__col--permission">
          <permission-editable
            :defaultValue="newRoleSelectedPermission"
            @change="onPermissionChange(null, $event)" />
        </div>
        <div class="rules-table__col rules-table__col--description">
          <a-input v-model="newRoleDescription" placeholder="Description"></a-input>
        </div>
        <div class="rules-table__col rules-table__col--actions">
          <a-tooltip
            placement="bottom">
            <template slot="title">
              Save new Rule
            </template>
            <a-button
              icon="plus"
              type="primary"
              shape="circle"
              @click="onRuleSave"
            >
            </a-button>
          </a-tooltip>
        </div>
      </div>

      <draggable
        v-model="rules"
        @change="changeOrder"
        handle=".drag-handle"
        animation="200"
        ghostClass="drag-ghost">
        <transition-group type="transition">
          <div
            v-for="(record, index) in rules"
            :key="`item-${index}`"
            class="rules-table-item ant-list-item">
            <div class="rules-table__col rules-table__col--grab drag-handle">
              <a-icon type="drag"></a-icon>
            </div>
            <div class="rules-table__col rules-table__col--rule">
              {{ record.rule }}
            </div>
            <div class="rules-table__col rules-table__col--permission">
              <permission-editable
                :defaultValue="record.permission"
                @change="onPermissionChange(record, $event)" />
            </div>
            <div class="rules-table__col rules-table__col--description">
              <template v-if="record.description">
                {{ record.description }}
              </template>
              <div v-else class="no-description">
                No description entered.
              </div>
            </div>
            <div class="rules-table__col rules-table__col--actions">
              <rule-delete
                :record="record"
                @delete="onRuleDelete(record.id)" />
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import draggable from 'vuedraggable'
import PermissionEditable from './PermissionEditable'
import RuleDelete from './RuleDelete'
import APIAutoComplete from './APIAutoComplete'

export default {
  name: 'RolePermissionTab',
  components: {
    APIAutoComplete,
    RuleDelete,
    PermissionEditable,
    draggable
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loadingTable: true,
      updateTable: false,
      rules: null,
      newRoleSelectedRule: '',
      newRoleSelectedPermission: 'allow',
      newRoleDescription: '',
      newRuleSelectError: false,
      drag: false
    }
  },
  mounted () {
    this.loadAllRules()
  },
  watch: {
    resource: function () {
      this.loadAllRules(() => {
        this.resetNewFields()
      })
    }
  },
  methods: {
    changeOrder () {
      api('updateRolePermission', {}, 'POST', {
        roleid: this.resource.id,
        ruleorder: this.rules.map(rule => rule.id)
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loadAllRules()
      })
    },
    resetNewFields () {
      this.newRoleSelectedRule = ''
      this.newRoleSelectedPermission = 'allow'
      this.newRoleDescription = ''
      this.newRuleSelectError = false
    },
    loadAllRules (callback = null) {
      if (!this.resource.id) return
      api('listRolePermissions', { roleid: this.resource.id }).then(response => {
        this.rules = response.listrolepermissionsresponse.rolepermission
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loadingTable = false
        this.updateTable = false
        if (callback) callback()
      })
    },
    onRuleDelete (key) {
      this.updateTable = true
      api('deleteRolePermission', { id: key }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loadAllRules()
      })
    },
    onPermissionChange (record, value) {
      this.newRoleSelectedPermission = value

      if (!record) return

      this.updateTable = true
      api('updateRolePermission', {
        roleid: this.resource.id,
        ruleid: record.id,
        permission: value
      }).then(() => {
        this.loadAllRules()
      }).catch(error => {
        console.error(error)
      })
    },
    onRuleSelect (value) {
      this.newRoleSelectedRule = value
    },
    onRuleSave () {
      if (!this.newRoleSelectedRule) {
        this.newRuleSelectError = true
        return
      }

      this.updateTable = true
      api('createRolePermission', {
        rule: this.newRoleSelectedRule,
        permission: this.newRoleSelectedPermission,
        description: this.newRoleDescription,
        roleid: this.resource.id
      }).then(() => {
        this.resetNewFields()
        this.loadAllRules()
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }
  .role-add-btn {
    margin-bottom: 15px;
  }
  .new-role-controls {
    display: flex;

    button {
      &:not(:last-child) {
        margin-right: 5px;
      }
    }

  }

  .rules-list {
    max-height: 600px;
    overflow: scroll;

    &--overflow-hidden {
      overflow: hidden;
    }

  }

  .rules-table {

    &-item {
      position: relative;
      display: flex;
      align-items: stretch;
      padding: 0;
      flex-wrap: wrap;

      @media (min-width: 760px) {
        flex-wrap: nowrap;
        padding-right: 25px;
      }

    }

    &__col {
      display: flex;
      align-items: center;
      padding: 15px;

      @media (min-width: 760px) {
        padding: 15px 0;

        &:not(:first-child) {
          padding-left: 20px;
        }

        &:not(:last-child) {
          border-right: 1px solid #e8e8e8;
          padding-right: 20px;
        }
      }

      &--grab {
        position: absolute;
        top: 4px;
        left: 0;
        width: 100%;

        @media (min-width: 760px) {
          position: relative;
          top: auto;
          width: 35px;
          padding-left: 25px;
          justify-content: center;
        }

      }

      &--rule,
      &--description {
        word-break: break-all;
        flex: 1;
        width: 100%;

        @media (min-width: 760px) {
          width: auto;
        }

      }

      &--rule {
        padding-left: 60px;
        background-color: rgba(#e6f7ff, 0.7);

        @media (min-width: 760px) {
          padding-left: 0;
          background: none;
        }

      }

      &--permission {
        justify-content: center;
        width: 100%;

        .ant-select {
          width: 100%;
        }

        @media (min-width: 760px) {
          width: auto;

          .ant-select {
            width: auto;
          }

        }

      }

      &--actions {
        max-width: 60px;
        width: 100%;
        padding-right: 0;

        @media (min-width: 760px) {
          width: auto;
          max-width: 70px;
          padding-right: 15px;
        }

      }

      &--new {
        padding-left: 15px;
        background-color: transparent;

        div {
          width: 100%;
        }

      }

    }

  }

  .no-description {
    opacity: 0.4;
    font-size: 0.7rem;

    @media (min-width: 760px) {
      display: none;
    }

  }

  .drag-handle {
    cursor: pointer;
  }

  .drag-ghost {
    opacity: 0.5;
    background: #f0f2f5;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: #39A7DE;
    background-color: rgba(#fff, 0.8);
  }
</style>

<style lang="scss">
  .rules-table__col--new {
    .ant-select {
      width: 100%;
    }
  }
</style>

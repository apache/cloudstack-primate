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
  <a-list
    v-else
    bordered
    itemLayout="horizontal"
    :dataSource="rules"
    :pagination="pagination"
    :loading="updateTable">
    <a-list-item
      draggable="true"
      @dragstart="dragStart(record)"
      @dragleave="dragEnd(record)"
      slot="renderItem"
      slot-scope="record"
      class="rules-table-item">
      <div class="rules-table__col rules-table__col--grab">
        <a-icon type="drag" style="cursor: grab;"></a-icon>
      </div>
      <div class="rules-table__col rules-table__col--rule">
        <a-p-i-auto-complete
          v-if="record.editable"
          @selectedRecord="onRuleSelect"
          :error="newRuleSelectError"
          :data="$store.getters.apis"
        />
        <template v-else>
          {{ record.rule }}
        </template>
      </div>
      <div class="rules-table__col rules-table__col--permission">
        <permission-editable
          :defaultValue="record.permission"
          @change="onPermissionChange(record, $event)" />
      </div>
      <div class="rules-table__col rules-table__col--description">
        <a-input v-if="record.editable" v-model="record.description" placeholder="Optional Description"></a-input>
        <template v-else>
          {{ record.description }}
        </template>
      </div>
      <div class="rules-table__col rules-table__col--actions">
        <role-save v-if="record.editable" :record="record" @save="onRuleSave(record)" />
        <rule-delete
          :record="record"
          v-else
          @delete="onRuleDelete(record.id)" />
      </div>
    </a-list-item>
  </a-list>
</template>

<script>
import { api } from '@/api'
import draggable from 'vuedraggable'
import PermissionEditable from './PermissionEditable'
import RuleDelete from './RuleDelete'
import APIAutoComplete from './APIAutoComplete'
import RoleSave from './RoleSave'

export default {
  name: 'RolePermissionTab',
  components: {
    RoleSave,
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
      pagination: {
        pageSize: 10
      },
      newRoleSelectedRule: '',
      newRoleSelectedPermission: 'allow',
      newRuleSelectError: false,
      dragStartIndex: '',
      dragEndIndex: ''
    }
  },
  computed: {
    roleids: function () {
      const arr = []
      this.rules.slice(1).forEach(item => arr.push(item.id))
      return arr
    }
  },
  mounted () {
    this.loadAllRules(() => this.onRuleAdd())
  },
  watch: {
    resource: function () {
      this.loadingTable = true
      this.loadAllRules(() => this.onRuleAdd())
    }
  },
  methods: {
    dragStart (record) {
      this.dragStartIndex = this.roleids.findIndex(item => item === record.id)
    },
    dragEnd (record) {
      this.dragEndIndex = this.roleids.findIndex(item => item === record.id)
      if (this.dragEndIndex === this.dragStartIndex) return
      this.updateRulesOrder()
    },
    updateRulesOrder () {
      [this.roleids[this.dragEndIndex], this.roleids[this.dragStartIndex]] = [this.roleids[this.dragStartIndex],
        this.roleids[this.dragEndIndex]]

      api('updateRolePermission', {}, 'POST', {
        roleid: this.resource.id,
        ruleorder: this.roleids
      }).then(response => {
        console.log(response)
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loadAllRules(() => {
          this.onRuleAdd()
        })
      })
    },
    loadAllRules (callback = null) {
      api('listRolePermissions', { id: this.resource.id }).then(response => {
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
        this.loadAllRules(() => {
          this.onRuleAdd()
        })
      })
    },
    onRuleAdd () {
      this.rules = [
        {
          description: '',
          id: '',
          roleid: '',
          rolename: '',
          rule: '',
          permission: 'allow',
          editable: true
        },
        ...this.rules
      ]
    },
    onPermissionChange (record, value) {
      this.newRoleSelectedPermission = value

      if (record.editable) {
        record.permission = this.newRoleSelectedPermission
        return
      }

      this.updateTable = true
      api('updateRolePermission', {
        roleid: this.resource.id,
        ruleid: record.id,
        permission: value
      }).then(() => {
        this.loadAllRules(() => {
          this.onRuleAdd()
        })
      }).catch(error => {
        console.error(error)
      })
    },
    onRuleSelect (value) {
      this.newRoleSelectedRule = value
    },
    onRuleSave (record) {
      if (!this.newRoleSelectedRule) {
        this.newRuleSelectError = true
        return
      }

      this.updateTable = true
      api('createRolePermission', {
        rule: this.newRoleSelectedRule,
        permission: this.newRoleSelectedPermission,
        description: record.description,
        roleid: this.resource.id
      }).then(() => {
        this.loadAllRules(() => {
          this.onRuleAdd()
        })
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

  .rules-table {

    &-item {
      padding-top: 0;
      padding-bottom: 0;
    }

    &__col {
      display: flex;
      align-items: center;
      padding-top: 15px;
      padding-bottom: 15px;

      &:not(:first-child) {
        padding-left: 20px;
      }

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
        padding-right: 20px;
      }

      &--grab {
        justify-content: center;
      }

      &--rule {
        width: 400px;
        flex: 1;
      }

      &--permission {
        width: 120px;
        justify-content: center;
      }

      &--description {
        min-width: 200px;
        max-width: 250px;
        flex: 1;
      }

      &--actions {
        max-width: 70px;
      }

    }

  }
</style>

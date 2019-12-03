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
  <a-icon v-if="loading" type="loading" class="main-loading-spinner"></a-icon>
  <div v-else>
    <a-button
      type="primary"
      icon="plus"
      class="role-add-btn"
      @click="onRoleAdd"
      :disabled="newRoleButtonDisabled">
      Add Role
    </a-button>
    <a-table bordered :dataSource="roles" :columns="columns" rowKey="id" :components="customComponents">
      <template slot="draggable">
        <a-icon type="drag" style="cursor: grab;"></a-icon>
      </template>

      <template slot="rule" slot-scope="text, record">
        <role-auto-complete
          v-if="record.editable"
          @selectedRecord="onRuleSelect"
          :error="newRuleSelectError"
        />
        <template v-else>
          {{ text }}
        </template>
      </template>

      <template slot="permission" slot-scope="text, record">
        <permission-editable
          :defaultValue="text"
          @change="onPermissionChange(record, $event)" />
      </template>

      <template slot="description" slot-scope="text, record">
        <a-input v-if="record.editable" v-model="newRoleDescription"></a-input>
        <template v-else>
          {{ text }}
        </template>
      </template>

      <template slot="actions" slot-scope="text, record">
        <div v-if="record.editable" class="new-role-controls">
          <role-save :record="record" @save="onRuleSave(record)" />
          <a-button @click="onCancelNew(record)" type="danger"><a-icon type="close"/></a-button>
        </div>
        <role-delete
          v-else
          :record="record"
          @delete="onPermissionDelete(record.id, $event)" />
      </template>
    </a-table>
  </div>
</template>

<script>
import { api } from '@/api'
// import draggable from 'vuedraggable'
import PermissionEditable from './PermissionEditable'
import RoleDelete from './RoleDelete'
import DraggableRow from './DraggableRow'
import RoleAutoComplete from './RoleAutoComplete'
import RoleSave from './RoleSave'

export default {
  name: 'RolePermissionTab',
  components: {
    RoleSave,
    RoleAutoComplete,
    RoleDelete,
    PermissionEditable,
    DraggableRow
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      roles: null,
      customComponents: {
        body: {
          row: this.row
        }
      },
      columns: [
        {
          title: '',
          dataIndex: null,
          key: 'draggable',
          scopedSlots: { customRender: 'draggable' }
        },
        {
          title: 'Rule',
          dataIndex: 'rule',
          key: 'rule',
          sorter: (a, b) => a.rule.localeCompare(b.rule),
          sortDirections: ['descend', 'ascend'],
          scopedSlots: { customRender: 'rule' }
        },
        {
          title: 'Permission',
          dataIndex: 'permission',
          key: 'permission',
          sorter: (a, b) => a.permission.localeCompare(b.permission),
          sortDirections: ['descend', 'ascend'],
          scopedSlots: { customRender: 'permission' }
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          sorter: (a, b) => {
            const aVal = a.description ? a.description : ''
            const bVal = b.description ? b.description : ''

            return aVal.localeCompare(bVal)
          },
          sortDirections: ['descend', 'ascend'],
          scopedSlots: { customRender: 'description' }
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ],
      newRoleButtonDisabled: false,
      newRoleSelectedRule: '',
      newRoleSelectedPermission: 'allow',
      newRoleDescription: '',
      newRuleSelectError: false
    }
  },
  mounted () {
    this.loadAllRoles()
  },
  methods: {
    loadAllRoles (callback = null) {
      api('listRolePermissions', { id: this.resource.id }).then(response => {
        this.roles = response.listrolepermissionsresponse.rolepermission
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loading = false
        if (callback) callback()
      })
    },
    onPermissionDelete (key, component) {
      api('deleteRolePermission', { id: key }).catch(error => {
        console.error(error)
      }).finally(() => {
        component.deleteLoading = false
        this.loadAllRoles()
      })
    },
    onRoleAdd () {
      this.newRoleButtonDisabled = true
      this.roles = [
        {
          description: '',
          id: '',
          roleid: '',
          rolename: '',
          rule: '',
          permission: 'allow',
          editable: true
        },
        ...this.roles
      ]
    },
    onCancelNew (record) {
      this.loadAllRoles(() => {
        record.editable = false
        this.newRoleButtonDisabled = false
        this.newRuleSelectError = false
        this.newRoleSelectedRule = ''
        this.newRoleDescription = ''
      })
    },
    onPermissionChange (record, value) {
      this.newRoleSelectedPermission = value

      api('updateRolePermission', {
        roleid: this.resource.id,
        ruleid: record.id,
        permission: value
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
      api('createRolePermission', {
        rule: this.newRoleSelectedRule,
        permission: this.newRoleSelectedPermission,
        description: this.newRoleDescription,
        roleid: this.resource.id
      }).then(() => {
        record.editable = false
        this.loadAllRoles()
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.newRoleButtonDisabled = false
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
</style>

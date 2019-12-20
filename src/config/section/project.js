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

export default {
  name: 'project',
  title: 'Projects',
  icon: 'project',
  permission: ['listProjects'],
  resourceType: 'Project',
  columns: ['name', 'state', 'displaytext', 'account', 'domain'],
  details: ['name', 'id', 'displaytext', 'projectaccountname', 'vmtotal', 'cputotal', 'memorytotal', 'volumetotal', 'iptotal', 'vpctotal', 'templatetotal', 'primarystoragetotal', 'account', 'domain'],
  tabs: [
    {
      name: 'details',
      component: () => import('@/components/view/DetailsTab.vue')
    },
    {
      name: 'accounts',
      show: (record, route, user) => { return record.account === user.account || ['Admin', 'DomainAdmin'].includes(user.roletype) },
      component: () => import('@/views/projects/AccountsTab.vue')
    },
    {
      name: 'resources',
      permission: ['updateResourceLimit'],
      args: ['network', 'volume', 'public_ip', 'template', 'user_vm', 'snapshot', 'vpc', 'cpu', 'memory', 'primary_storage', 'secondary_storage'],
      show: (record, route, user) => { return ['Admin'].includes(user.roletype) },
      component: () => import('@/views/projects/ResourcesTab.vue')
    }
  ],
  actions: [
    {
      api: 'createProject',
      icon: 'plus',
      label: 'New Project',
      listView: true,
      args: ['name', 'displaytext']
    },
    {
      api: 'updateProjectInvitation',
      icon: 'key',
      label: 'label.enter.token',
      listView: true,
      args: ['projectid', 'token'],
      mapping: {
        projectid: {
          input: true
        }
      }
    },
    {
      api: 'listProjectInvitations',
      icon: 'team',
      label: 'label.project.invitation',
      listView: true,
      popup: true,
      showBadge: true,
      badgeNum: 0,
      param: {
        state: 'Pending'
      },
      component: () => import('@/views/projects/InvitationsTemplate.vue')
    },
    {
      api: 'updateProject',
      icon: 'edit',
      label: 'Edit Project',
      dataView: true,
      args: ['displaytext']
    },
    {
      api: 'activateProject',
      icon: 'play-circle',
      label: 'Activate Project',
      dataView: true,
      show: (record) => { return record.state === 'Suspended' }
    },
    {
      api: 'suspendProject',
      icon: 'pause-circle',
      label: 'Suspend Project',
      dataView: true,
      show: (record) => { return record.state !== 'Suspended' }
    },
    {
      api: 'addAccountToProject',
      icon: 'user-add',
      label: 'Add Account to Project',
      dataView: true,
      args: ['projectid', 'account', 'email'],
      show: (record, user) => { return record.account === user.account || ['Admin', 'DomainAdmin'].includes(user.roletype) },
      mapping: {
        projectid: {
          value: (record) => { return record.id }
        }
      }
    },
    {
      api: 'deleteProject',
      icon: 'delete',
      label: 'Delete Project',
      dataView: true
    }
  ]
}

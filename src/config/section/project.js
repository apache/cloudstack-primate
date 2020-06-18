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

import store from '@/store'

export default {
  name: 'project',
  title: 'label.projects',
  icon: 'project',
  permission: ['listProjects'],
  resourceType: 'Project',
  columns: ['name', 'state', 'displaytext', 'account', 'domain'],
  details: ['name', 'id', 'displaytext', 'projectaccountname', 'vmtotal', 'cputotal', 'memorytotal', 'volumetotal', 'iptotal', 'vpctotal', 'templatetotal', 'primarystoragetotal', 'vmlimit', 'iplimit', 'volumelimit', 'snapshotlimit', 'templatelimit', 'vpclimit', 'cpulimit', 'memorylimit', 'networklimit', 'primarystoragelimit', 'secondarystoragelimit', 'account', 'domain'],
  related: [{
    name: 'projectrolepermissions',
    title: 'label.project.role.premissions',
    param: 'projectid'
  }],
  tabs: [
    {
      name: 'details',
      component: () => import('@/components/view/DetailsTab.vue')
    },
    {
      name: 'accounts',
      component: () => import('@/views/project/AccountsTab.vue'),
      projectAccountFilter: projectAccount => {
        return (['Admin', 'DomainAdmin'].includes(store.getters.userInfo.roletype) ||
        projectAccount && projectAccount.role === 'Admin')
      }
    },
    {
      name: 'project.roles',
      component: () => import('@/views/project/iam/ProjectRoleTab.vue'),
      projectAccountFilter: projectAccount => {
        return (['Admin', 'DomainAdmin'].includes(store.getters.userInfo.roletype) ||
        projectAccount && projectAccount.role === 'Admin')
      }
    },
    {
      name: 'limits',
      show: (record, route, user) => { return ['Admin'].includes(user.roletype) },
      component: () => import('@/components/view/ResourceLimitTab.vue')
    }
  ],
  actions: [
    {
      api: 'createProject',
      icon: 'plus',
      label: 'label.new.project',
      listView: true,
      args: ['name', 'displaytext']
    },
    {
      api: 'updateProjectInvitation',
      icon: 'key',
      label: 'label.enter.token',
      listView: true,
      popup: true,
      component: () => import('@/views/project/InvitationTokenTemplate.vue')
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
      component: () => import('@/views/project/InvitationsTemplate.vue')
    },
    {
      api: 'updateProject',
      icon: 'edit',
      label: 'label.edit.project.details',
      dataView: true,
      args: ['displaytext']
    },
    {
      api: 'activateProject',
      icon: 'play-circle',
      label: 'label.activate.project',
      message: 'message.activate.project',
      dataView: true,
      show: (record) => { return record.state === 'Suspended' }
    },
    {
      api: 'suspendProject',
      icon: 'pause-circle',
      label: 'label.suspend.project',
      message: 'message.suspend.project',
      dataView: true,
      show: (record) => { return record.state !== 'Suspended' }
    },
    {
      api: 'addAccountToProject',
      icon: 'user-add',
      label: 'label.action.project.add.account',
      dataView: true,
      popup: true,
      component: () => import('@/views/project/AddAccountOrUserToProject.vue')
    },
    {
      api: 'deleteProject',
      icon: 'delete',
      label: 'label.delete.project',
      message: 'message.delete.project',
      dataView: true
    }
  ]
}

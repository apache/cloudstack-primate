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
  name: 'iam',
  title: 'Identity and Access',
  icon: 'solution',
  permission: ['listAccounts', 'listUsers', 'listDomains', 'listRoles'],
  children: [
    {
      name: 'accountuser',
      title: 'Users',
      icon: 'user',
      permission: ['listUsers'],
      columns: ['username', 'state', 'firstname', 'lastname', 'email', 'account', 'domain'],
      details: ['username', 'id', 'firstname', 'lastname', 'email', 'usersource', 'timezone', 'rolename', 'roletype', 'account', 'domain', 'created'],
      actions: [
        {
          api: 'createUser',
          icon: 'plus',
          label: 'label.add.user',
          listView: true,
          args: ['username', 'password', 'password', 'email', 'firstname', 'lastname', 'timezone', 'account', 'domainid']
        },
        {
          api: 'updateUser',
          icon: 'edit',
          label: 'label.edit',
          dataView: true,
          args: ['username', 'email', 'firstname', 'lastname', 'timezone']
        },
        {
          api: 'updateUser',
          icon: 'key',
          label: 'label.action.change.password',
          dataView: true,
          popup: true,
          component: () => import('@/views/iam/ChangeUserPassword.vue')
        },
        {
          api: 'registerUserKeys',
          icon: 'file-protect',
          label: 'label.action.generate.keys',
          dataView: true
        },
        {
          api: 'enableUser',
          icon: 'play-circle',
          label: 'label.action.enable.user',
          dataView: true,
          show: (record) => { return record.state === 'disabled' }
        },
        {
          api: 'disableUser',
          icon: 'pause-circle',
          label: 'label.action.disable.user',
          dataView: true,
          show: (record) => { return record.state === 'enabled' }
        },
        {
          api: 'deleteUser',
          icon: 'delete',
          label: 'label.action.delete.user',
          dataView: true
        }
      ]
    },
    {
      name: 'account',
      title: 'Accounts',
      icon: 'team',
      permission: ['listAccounts'],
      columns: ['name', 'state', 'rolename', 'roletype', 'domain'],
      details: ['name', 'id', 'rolename', 'roletype', 'domain', 'networkdomain', 'iptotal', 'vmtotal', 'volumetotal', 'receivedbytes', 'sentbytes', 'vmlimit', 'iplimit', 'volumelimit', 'snapshotlimit', 'templatelimit', 'vpclimit', 'cpulimit', 'memorylimit', 'networklimit', 'primarystoragelimit', 'secondarystoragelimit'],
      related: [{
        name: 'accountuser',
        title: 'Users',
        param: 'account'
      }],
      tabs: [
        {
          name: 'details',
          component: () => import('@/components/view/DetailsTab.vue')
        },
        {
          name: 'certificate',
          component: () => import('@/views/iam/SSLCertificateTab.vue')
        },
        {
          name: 'limits',
          show: (record, route, user) => { return ['Admin'].includes(user.roletype) },
          component: () => import('@/components/view/ResourceLimitTab.vue')
        },
        {
          name: 'Settings',
          component: () => import('@/components/view/SettingsTab.vue'),
          show: (record, route, user) => { return ['Admin'].includes(user.roletype) }
        }
      ],
      actions: [
        {
          api: 'createAccount',
          icon: 'plus',
          label: 'label.add.account',
          listView: true,
          args: ['username', 'password', 'password', 'email', 'firstname', 'lastname', 'domainid', 'account', 'roleid', 'timezone', 'networkdomain']
        },
        {
          api: 'ldapCreateAccount',
          icon: 'user-add',
          label: 'label.add.ldap.account',
          listView: true,
          popup: true,
          show: (record, store) => {
            return store.isLdapEnabled
          },
          component: () => import('@/views/iam/AddLdapAccount.vue')
        },
        {
          api: 'updateAccount',
          icon: 'edit',
          label: 'Update Account',
          dataView: true,
          args: ['newname', 'account', 'domainid', 'networkdomain'],
          mapping: {
            account: {
              value: (record) => { return record.name }
            },
            domainid: {
              value: (record) => { return record.domainid }
            }
          }
        },
        {
          api: 'updateResourceCount',
          icon: 'sync',
          label: 'Update Resource Count',
          dataView: true,
          args: ['account', 'domainid'],
          mapping: {
            account: {
              value: (record) => { return record.name }
            },
            domainid: {
              value: (record) => { return record.domainid }
            }
          }
        },
        {
          api: 'enableAccount',
          icon: 'play-circle',
          label: 'Enable Account',
          dataView: true,
          show: (record) => { return record.state === 'disabled' || record.state === 'locked' },
          params: { lock: 'false' }
        },
        {
          api: 'disableAccount',
          icon: 'pause-circle',
          label: 'Disable Account',
          dataView: true,
          show: (record) => { return record.state === 'enabled' },
          args: ['lock'],
          mapping: {
            lock: {
              value: (record) => { return false }
            }
          }
        },
        {
          api: 'disableAccount',
          icon: 'lock',
          label: 'Lock account',
          dataView: true,
          show: (record) => { return record.state === 'enabled' },
          args: ['lock'],
          mapping: {
            lock: {
              value: (record) => { return true }
            }
          }
        },
        {
          api: 'uploadSslCert',
          icon: 'safety-certificate',
          label: 'Add certificate',
          dataView: true,
          args: ['name', 'certificate', 'privatekey', 'certchain', 'password', 'account', 'domainid'],
          show: (record) => { return record.state === 'enabled' },
          mapping: {
            account: {
              value: (record) => { return record.name }
            },
            domainid: {
              value: (record) => { return record.domainid }
            }
          }
        },
        {
          api: 'deleteAccount',
          icon: 'delete',
          label: 'Delete account',
          dataView: true,
          hidden: (record) => { return record.name === 'admin' }
        }
      ]
    },
    {
      name: 'domain',
      title: 'Domains',
      icon: 'block',
      permission: ['listDomains', 'listDomainChildren'],
      resourceType: 'Domain',
      columns: ['name', 'state', 'path', 'parentdomainname', 'level'],
      details: ['name', 'id', 'path', 'parentdomainname', 'level', 'networkdomain', 'iptotal', 'vmtotal', 'volumetotal', 'vmlimit', 'iplimit', 'volumelimit', 'snapshotlimit', 'templatelimit', 'vpclimit', 'cpulimit', 'memorylimit', 'networklimit', 'primarystoragelimit', 'secondarystoragelimit'],
      related: [{
        name: 'account',
        title: 'Accounts',
        param: 'domainid'
      }],
      tabs: [
        {
          name: 'Domain',
          component: () => import('@/components/view/InfoCard.vue'),
          show: (record, route) => { return route.path === '/domain' }
        },
        {
          name: 'details',
          component: () => import('@/components/view/DetailsTab.vue')
        },
        {
          name: 'limits',
          show: (record, route, user) => { return ['Admin'].includes(user.roletype) },
          component: () => import('@/components/view/ResourceLimitTab.vue')
        },
        {
          name: 'Settings',
          component: () => import('@/components/view/SettingsTab.vue'),
          show: (record, route, user) => { return ['Admin'].includes(user.roletype) }
        }
      ],
      treeView: true,
      actions: [
        {
          api: 'createDomain',
          icon: 'plus',
          label: 'label.add.domain',
          listView: true,
          dataView: true,
          args: ['parentdomainid', 'name', 'networkdomain', 'domainid'],
          mapping: {
            parentdomainid: {
              value: (record) => { return record.id }
            }
          }
        },
        {
          api: 'updateDomain',
          icon: 'edit',
          label: 'label.action.edit.domain',
          listView: true,
          dataView: true,
          args: ['name', 'networkdomain']
        },
        {
          api: 'updateResourceCount',
          icon: 'sync',
          label: 'label.action.update.resource.count',
          listView: true,
          dataView: true,
          args: ['domainid'],
          mapping: {
            domainid: {
              value: (record) => { return record.id }
            }
          }
        },
        {
          api: 'linkDomainToLdap',
          icon: 'link',
          label: 'Link Domain to LDAP Group/OU',
          listView: true,
          dataView: true,
          args: ['type', 'domainid', 'name', 'accounttype', 'admin'],
          mapping: {
            type: {
              options: ['GROUP', 'OU']
            },
            accounttype: {
              options: ['0', '2']
            },
            domainid: {
              value: (record) => { return record.id }
            }
          }
        },
        {
          api: 'deleteDomain',
          icon: 'delete',
          label: 'label.delete.domain',
          listView: true,
          dataView: true,
          show: (record) => { return record.level !== 0 },
          args: ['cleanup']
        }
      ]
    },
    {
      name: 'role',
      title: 'Roles',
      icon: 'idcard',
      permission: ['listRoles', 'createRole'],
      columns: ['name', 'type', 'description'],
      details: ['name', 'id', 'type', 'description'],
      tabs: [{
        name: 'details',
        component: () => import('@/components/view/DetailsTab.vue')
      }, {
        name: 'Rules',
        component: () => import('@/views/iam/RolePermissionTab.vue')
      }],
      actions: [
        {
          api: 'createRole',
          icon: 'plus',
          label: 'Create Role',
          listView: true,
          args: ['name', 'description', 'type'],
          mapping: {
            type: {
              options: ['Admin', 'DomainAdmin', 'User']
            }
          }
        },
        {
          api: 'updateRole',
          icon: 'edit',
          label: 'Edit Role',
          dataView: true,
          args: ['name', 'description', 'type'],
          mapping: {
            type: {
              options: ['Admin', 'DomainAdmin', 'User']
            }
          }
        },
        {
          api: 'deleteRole',
          icon: 'delete',
          label: 'label.delete.role',
          dataView: true
        }
      ]
    }
  ]
}

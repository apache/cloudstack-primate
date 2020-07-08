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
  name: 'offering',
  title: 'label.menu.service.offerings',
  icon: 'shopping',
  permission: ['listServiceOfferings', 'listDiskOfferings', 'listDomains'],
  children: [
    {
      name: 'computeoffering',
      title: 'label.compute.offerings',
      docHelp: 'adminguide/service_offerings.html#compute-and-disk-service-offerings',
      icon: 'cloud',
      permission: ['listServiceOfferings', 'listDomains'],
      params: { isrecursive: 'true' },
      columns: ['name', 'displaytext', 'cpunumber', 'cpuspeed', 'memory', 'tags', 'domain', 'zone', 'order'],
      details: ['name', 'id', 'displaytext', 'offerha', 'provisioningtype', 'storagetype', 'iscustomized', 'limitcpuuse', 'cpunumber', 'cpuspeed', 'memory', 'tags', 'domain', 'zone', 'created'],
      related: [{
        name: 'vm',
        title: 'label.instances',
        param: 'serviceofferingid'
      }],
      actions: [{
        api: 'createServiceOffering',
        icon: 'plus',
        label: 'label.add.compute.offering',
        docHelp: 'adminguide/service_offerings.html#creating-a-new-compute-offering',
        listView: true,
        popup: true,
        component: () => import('@/views/offering/AddComputeOffering.vue')
      }, {
        api: 'updateServiceOffering',
        icon: 'edit',
        label: 'label.edit',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true,
        args: ['name', 'displaytext']
      }, {
        api: 'updateServiceOffering',
        icon: 'lock',
        label: 'label.action.update.offering.access',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true,
        popup: true,
        component: () => import('@/views/offering/UpdateOfferingAccess.vue')
      }, {
        api: 'deleteServiceOffering',
        icon: 'delete',
        label: 'label.action.delete.service.offering',
        message: 'message.action.delete.service.offering',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true
      }]
    },
    {
      name: 'systemoffering',
      title: 'label.system.offerings',
      icon: 'setting',
      docHelp: 'adminguide/service_offerings.html#system-service-offerings',
      permission: ['listServiceOfferings', 'listInfrastructure'],
      params: { issystem: 'true', isrecursive: 'true' },
      columns: ['name', 'systemvmtype', 'cpunumber', 'cpuspeed', 'memory', 'storagetype', 'tags', 'order'],
      details: ['name', 'id', 'displaytext', 'systemvmtype', 'provisioningtype', 'storagetype', 'iscustomized', 'limitcpuuse', 'cpunumber', 'cpuspeed', 'memory', 'tags', 'domain', 'zone', 'created'],
      actions: [{
        api: 'createServiceOffering',
        icon: 'plus',
        label: 'label.add.system.service.offering',
        docHelp: 'adminguide/service_offerings.html#creating-a-new-system-service-offering',
        listView: true,
        params: { issystem: 'true' },
        popup: true,
        component: () => import('@/views/offering/AddComputeOffering.vue')
      }, {
        api: 'updateServiceOffering',
        icon: 'edit',
        label: 'label.edit',
        dataView: true,
        params: { issystem: 'true' },
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        args: ['name', 'displaytext']
      }, {
        api: 'deleteServiceOffering',
        icon: 'delete',
        label: 'label.action.delete.system.service.offering',
        message: 'message.action.delete.system.service.offering',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true,
        params: { issystem: 'true' }
      }]
    },
    {
      name: 'diskoffering',
      title: 'label.disk.offerings',
      icon: 'hdd',
      docHelp: 'adminguide/service_offerings.html#compute-and-disk-service-offerings',
      permission: ['listDiskOfferings', 'listDomains'],
      params: { isrecursive: 'true' },
      columns: ['name', 'displaytext', 'disksize', 'tags', 'domain', 'zone', 'order'],
      details: ['name', 'id', 'displaytext', 'disksize', 'provisioningtype', 'storagetype', 'iscustomized', 'tags', 'domain', 'zone', 'created'],
      related: [{
        name: 'volume',
        title: 'label.volumes',
        param: 'diskofferingid'
      }],
      actions: [{
        api: 'createDiskOffering',
        icon: 'plus',
        label: 'label.add.disk.offering',
        docHelp: 'adminguide/service_offerings.html#creating-a-new-disk-offering',
        listView: true,
        popup: true,
        component: () => import('@/views/offering/AddDiskOffering.vue')
      }, {
        api: 'updateDiskOffering',
        icon: 'edit',
        label: 'label.edit',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true,
        args: ['name', 'displaytext']
      }, {
        api: 'updateDiskOffering',
        icon: 'lock',
        label: 'label.action.update.offering.access',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true,
        popup: true,
        component: () => import('@/views/offering/UpdateOfferingAccess.vue')
      }, {
        api: 'deleteDiskOffering',
        icon: 'delete',
        label: 'label.action.delete.disk.offering',
        message: 'message.action.delete.disk.offering',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true
      }]
    },
    {
      name: 'backupoffering',
      title: 'label.backup.offerings',
      icon: 'cloud-upload',
      docHelp: 'adminguide/virtual_machines.html#backup-offerings',
      permission: ['listBackupOfferings', 'listInfrastructure'],
      columns: ['name', 'description', 'zoneid'],
      details: ['name', 'id', 'description', 'externalid', 'zone', 'created'],
      actions: [{
        api: 'importBackupOffering',
        icon: 'plus',
        label: 'label.import.backup.offering',
        docHelp: 'adminguide/virtual_machines.html#importing-backup-offerings',
        listView: true,
        popup: true,
        component: () => import('@/views/offering/ImportBackupOffering.vue')
      }, {
        api: 'deleteBackupOffering',
        icon: 'delete',
        label: 'label.action.delete.backup.offering',
        message: 'message.action.delete.backup.offering',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true
      }]
    },
    {
      name: 'networkoffering',
      title: 'label.network.offerings',
      icon: 'wifi',
      docHelp: 'adminguide/networking.html#network-offerings',
      permission: ['listNetworkOfferings', 'listInfrastructure'],
      params: { isrecursive: 'true' },
      columns: ['name', 'state', 'guestiptype', 'traffictype', 'networkrate', 'tags', 'domain', 'zone', 'order'],
      details: ['name', 'id', 'displaytext', 'guestiptype', 'traffictype', 'networkrate', 'ispersistent', 'egressdefaultpolicy', 'availability', 'conservemode', 'specifyvlan', 'specifyipranges', 'supportspublicaccess', 'supportsstrechedl2subnet', 'tags', 'service', 'domain', 'zone'],
      actions: [{
        api: 'createNetworkOffering',
        icon: 'plus',
        label: 'label.add.network.offering',
        docHelp: 'adminguide/networking.html#creating-a-new-network-offering',
        listView: true,
        popup: true,
        component: () => import('@/views/offering/AddNetworkOffering.vue')
      }, {
        api: 'updateNetworkOffering',
        icon: 'edit',
        label: 'label.edit',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true,
        args: ['name', 'displaytext', 'availability'],
        mapping: {
          availability: {
            options: ['Optional', 'Required']
          }
        }
      }, {
        api: 'updateNetworkOffering',
        icon: 'play-circle',
        label: 'label.enable.network.offering',
        message: 'message.confirm.enable.network.offering',
        dataView: true,
        show: (record) => { return record.state === 'Disabled' },
        args: ['state'],
        mapping: {
          state: {
            value: (record) => { return 'Enabled' }
          }
        }
      }, {
        api: 'updateNetworkOffering',
        icon: 'pause-circle',
        label: 'label.disable.network.offering',
        message: 'message.confirm.disable.network.offering',
        dataView: true,
        show: (record) => { return record.state === 'Enabled' },
        args: ['state'],
        mapping: {
          state: {
            value: (record) => { return 'Disabled' }
          }
        }
      }, {
        api: 'updateNetworkOffering',
        icon: 'lock',
        label: 'label.action.update.offering.access',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true,
        popup: true,
        component: () => import('@/views/offering/UpdateOfferingAccess.vue')
      }, {
        api: 'deleteNetworkOffering',
        icon: 'delete',
        label: 'label.remove.network.offering',
        message: 'message.confirm.remove.network.offering',
        docHelp: 'adminguide/service_offerings.html#modifying-or-deleting-a-service-offering',
        dataView: true
      }]
    },
    {
      name: 'vpcoffering',
      title: 'label.vpc.offerings',
      icon: 'deployment-unit',
      permission: ['listVPCOfferings', 'listInfrastructure'],
      params: { isrecursive: 'true' },
      resourceType: 'VpcOffering',
      columns: ['name', 'state', 'displaytext', 'domain', 'zone', 'order'],
      details: ['name', 'id', 'displaytext', 'distributedvpcrouter', 'tags', 'service', 'domain', 'zone', 'created'],
      related: [{
        name: 'vpc',
        title: 'label.vpc',
        param: 'vpcofferingid'
      }],
      actions: [{
        api: 'createVPCOffering',
        icon: 'plus',
        label: 'label.add.vpc.offering',
        listView: true,
        popup: true,
        component: () => import('@/views/offering/AddVpcOffering.vue')
      }, {
        api: 'updateVPCOffering',
        icon: 'edit',
        label: 'label.edit',
        dataView: true,
        args: ['name', 'displaytext']
      }, {
        api: 'updateVPCOffering',
        icon: 'play-circle',
        label: 'label.enable.vpc.offering',
        message: 'message.confirm.enable.vpc.offering',
        dataView: true,
        show: (record) => { return record.state === 'Disabled' },
        args: ['state'],
        mapping: {
          state: {
            value: (record) => { return 'Enabled' }
          }
        }
      }, {
        api: 'updateVPCOffering',
        icon: 'pause-circle',
        label: 'label.disable.vpc.offering',
        message: 'message.confirm.disable.vpc.offering',
        dataView: true,
        show: (record) => { return record.state === 'Enabled' },
        args: ['state'],
        mapping: {
          state: {
            value: (record) => { return 'Disabled' }
          }
        }
      }, {
        api: 'updateVPCOffering',
        icon: 'lock',
        label: 'label.action.update.offering.access',
        dataView: true,
        popup: true,
        component: () => import('@/views/offering/UpdateOfferingAccess.vue')
      }, {
        api: 'deleteVPCOffering',
        icon: 'delete',
        label: 'label.remove.vpc.offering',
        message: 'message.confirm.remove.vpc.offering',
        dataView: true
      }]
    }
  ]
}

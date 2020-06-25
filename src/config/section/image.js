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

import kubernetes from '@/assets/icons/kubernetes.svg?inline'

export default {
  name: 'image',
  title: 'label.images',
  icon: 'picture',
  docHelp: 'adminguide/templates.html',
  children: [
    {
      name: 'template',
      title: 'label.templates',
      icon: 'save',
      permission: ['listTemplates'],
      params: { templatefilter: 'self', showunique: 'true' },
      resourceType: 'Template',
      filters: ['self', 'shared', 'featured', 'community'],
      columns: ['name', 'ostypename', 'status', 'hypervisor', 'account', 'domain', 'order'],
      details: ['name', 'id', 'displaytext', 'checksum', 'hypervisor', 'format', 'ostypename', 'size', 'isready', 'passwordenabled', 'directdownload', 'isextractable', 'isdynamicallyscalable', 'ispublic', 'isfeatured', 'crosszones', 'type', 'account', 'domain', 'created'],
      searchFilters: ['name', 'zoneid', 'tags'],
      related: [{
        name: 'vm',
        title: 'label.instances',
        param: 'templateid'
      }],
      tabs: [{
        name: 'details',
        component: () => import('@/components/view/DetailsTab.vue')
      }, {
        name: 'zones',
        component: () => import('@/views/image/TemplateZones.vue')
      }, {
        name: 'settings',
        component: () => import('@/components/view/DetailSettings')
      }],
      actions: [
        {
          api: 'registerTemplate',
          icon: 'plus',
          label: 'label.action.register.template',
          docHelp: 'adminguide/templates.html#uploading-templates-from-a-remote-http-server',
          listView: true,
          popup: true,
          component: () => import('@/views/image/RegisterOrUploadTemplate.vue')
        },
        {
          api: 'registerTemplate',
          icon: 'cloud-upload',
          label: 'label.upload.template.from.local',
          docHelp: 'adminguide/templates.html#uploading-templates-and-isos-from-a-local-computer',
          listView: true,
          popup: true,
          component: () => import('@/views/image/RegisterOrUploadTemplate.vue')
        },
        {
          api: 'updateTemplate',
          icon: 'edit',
          label: 'label.edit',
          dataView: true,
          args: ['name', 'displaytext', 'passwordenabled', 'sshkeyenabled', 'ostypeid', 'isdynamicallyscalable', 'isrouting']
        },
        {
          api: 'extractTemplate',
          icon: 'cloud-download',
          label: 'label.action.download.template',
          message: 'message.action.download.template',
          docHelp: 'adminguide/templates.html#exporting-templates',
          dataView: true,
          show: (record) => { return record && record.isextractable },
          args: ['zoneid', 'mode'],
          mapping: {
            zoneid: {
              value: (record) => { return record.zoneid }
            },
            mode: {
              value: (record) => { return 'HTTP_DOWNLOAD' }
            }
          },
          response: (result) => { return `Please click <a href="${result.template.url}" target="_blank">${result.template.url}</a> to download.` }
        },
        {
          api: 'updateTemplatePermissions',
          icon: 'reconciliation',
          label: 'label.action.share.template',
          docHelp: 'adminguide/templates.html#sharing-templates-with-other-accounts-projects',
          dataView: true,
          popup: true,
          show: (record, store) => { return (['Admin', 'DomainAdmin'].includes(store.userInfo.roletype) && (record.domainid === store.userInfo.domainid && record.account === store.userInfo.account) || record.templatetype !== 'BUILTIN') },
          component: () => import('@/views/image/UpdateTemplateIsoPermissions')
        }
      ]
    },
    {
      name: 'iso',
      title: 'label.isos',
      icon: 'usb',
      docHelp: 'adminguide/templates.html#working-with-isos',
      permission: ['listIsos'],
      params: { isofilter: 'self', showunique: 'true' },
      resourceType: 'ISO',
      filters: ['self', 'shared', 'featured', 'community'],
      columns: ['name', 'ostypename', 'account', 'domain'],
      details: ['name', 'id', 'displaytext', 'checksum', 'ostypename', 'size', 'bootable', 'isready', 'directdownload', 'isextractable', 'ispublic', 'isfeatured', 'crosszones', 'account', 'domain', 'created'],
      searchFilters: ['name', 'zoneid', 'tags'],
      related: [{
        name: 'vm',
        title: 'label.instances',
        param: 'isoid'
      }],
      tabs: [{
        name: 'details',
        component: () => import('@/components/view/DetailsTab.vue')
      }, {
        name: 'zones',
        component: () => import('@/views/image/IsoZones.vue')
      }],
      actions: [
        {
          api: 'registerIso',
          icon: 'plus',
          label: 'label.action.register.iso',
          docHelp: 'adminguide/templates.html#id10',
          listView: true,
          popup: true,
          component: () => import('@/views/image/RegisterOrUploadIso.vue')
        },
        {
          api: 'registerIso',
          icon: 'cloud-upload',
          label: 'label.upload.iso.from.local',
          docHelp: 'adminguide/templates.html#id10',
          listView: true,
          popup: true,
          component: () => import('@/views/image/RegisterOrUploadIso.vue')
        },
        {
          api: 'updateIso',
          icon: 'edit',
          label: 'label.edit',
          dataView: true,
          args: ['name', 'displaytext', 'bootable', 'ostypeid', 'isdynamicallyscalable', 'isrouting']
        },
        {
          api: 'extractIso',
          icon: 'cloud-download',
          label: 'label.action.download.iso',
          message: 'message.action.download.iso',
          docHelp: 'adminguide/templates.html#exporting-templates',
          dataView: true,
          show: (record) => { return record && record.isextractable },
          args: ['zoneid', 'mode'],
          mapping: {
            zoneid: {
              value: (record) => { return record.zoneid }
            },
            mode: {
              value: (record) => { return 'HTTP_DOWNLOAD' }
            }
          },
          response: (result) => { return `Please click <a href="${result.iso.url}" target="_blank">${result.iso.url}</a> to download.` }
        },
        {
          api: 'updateIsoPermissions',
          icon: 'reconciliation',
          label: 'label.action.edit.iso',
          docHelp: 'adminguide/templates.html#sharing-templates-with-other-accounts-projects',
          dataView: true,
          args: ['op', 'accounts', 'projectids'],
          popup: true,
          show: (record, store) => { return (['Admin', 'DomainAdmin'].includes(store.userInfo.roletype) && (record.domainid === store.userInfo.domainid && record.account === store.userInfo.account) || record.templatetype !== 'BUILTIN') },
          component: () => import('@/views/image/UpdateTemplateIsoPermissions')
        }
      ]
    },
    {
      name: 'kubernetesiso',
      title: 'label.kubernetes.isos',
      icon: kubernetes,
      permission: ['listKubernetesSupportedVersions'],
      columns: ['name', 'state', 'semanticversion', 'isostate', 'mincpunumber', 'minmemory', 'zonename'],
      details: ['name', 'semanticversion', 'zoneid', 'zonename', 'isoid', 'isoname', 'isostate', 'mincpunumber', 'minmemory', 'supportsha', 'state'],
      actions: [
        {
          api: 'addKubernetesSupportedVersion',
          icon: 'plus',
          label: 'label.kubernetes.version.add',
          listView: true,
          popup: true,
          component: () => import('@/views/image/AddKubernetesSupportedVersion.vue')
        },
        {
          api: 'updateKubernetesSupportedVersion',
          icon: 'edit',
          label: 'label.kubernetes.version.update',
          dataView: true,
          popup: true,
          component: () => import('@/views/image/UpdateKubernetesSupportedVersion.vue')
        },
        {
          api: 'deleteKubernetesSupportedVersion',
          icon: 'delete',
          label: 'label.kubernetes.version.delete',
          dataView: true
        }
      ]
    }
  ]
}

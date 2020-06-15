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
  name: 'pod',
  title: 'label.pods',
  icon: 'appstore',
  permission: ['listPods'],
  columns: ['name', 'allocationstate', 'gateway', 'netmask', 'zonename'],
  details: ['name', 'id', 'allocationstate', 'netmask', 'gateway', 'zonename'],
  related: [{
    name: 'cluster',
    title: 'label.clusters',
    param: 'podid'
  }, {
    name: 'host',
    title: 'label.hosts',
    param: 'podid'
  }],
  actions: [
    {
      api: 'createPod',
      icon: 'plus',
      label: 'label.add.pod',
      listView: true,
      popup: true,
      component: () => import('@/views/infra/PodAdd.vue')
    },
    {
      api: 'updatePod',
      icon: 'edit',
      label: 'label.edit',
      dataView: true,
      args: ['name', 'netmask', 'gateway']
    },
    {
      api: 'updatePod',
      icon: 'play-circle',
      label: 'label.action.enable.pod',
      message: 'message.action.enable.pod',
      dataView: true,
      show: (record) => { return record.allocationstate === 'Disabled' },
      args: ['allocationstate'],
      mapping: {
        allocationstate: {
          value: (record) => 'Enabled'
        }
      }
    },
    {
      api: 'updatePod',
      icon: 'pause-circle',
      label: 'label.action.disable.pod',
      message: 'message.action.disable.pod',
      dataView: true,
      show: (record) => { return record.allocationstate === 'Enabled' },
      args: ['allocationstate'],
      mapping: {
        allocationstate: {
          value: (record) => 'Disabled'
        }
      }
    },
    {
      api: 'deletePod',
      icon: 'delete',
      label: 'label.action.delete.pod',
      message: 'message.action.delete.pod',
      dataView: true
    }
  ]
}

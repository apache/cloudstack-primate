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
  <a-tooltip placement="bottom" :title="getHelperText(text)">
    <a-badge style="display: inline-flex" :title="text" :status="getBadgeStatus(text)" :text="getText()" />
  </a-tooltip>
</template>

<script>

export default {
  name: 'Status',
  props: {
    text: {
      type: String,
      required: true
    },
    displayText: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getText () {
      if (this.displayText && this.text) {
        return this.text.charAt(0).toUpperCase() + this.text.slice(1)
      }
      return ''
    },
    getBadgeStatus (state) {
      var status = 'default'
      switch (state) {
        case 'Active':
        case 'BackedUp':
        case 'Completed':
        case 'Connected':
        case 'Download Complete':
        case 'Enabled':
        case 'Implemented':
        case 'Ready':
        case 'Running':
        case 'Setup':
        case 'Started':
        case 'Successfully Installed':
        case 'True':
        case 'Up':
        case 'enabled':
          status = 'success'
          break
        case 'Alert':
        case 'Declined':
        case 'Disabled':
        case 'Disconnected':
        case 'Down':
        case 'Error':
        case 'False':
        case 'Stopped':
          status = 'error'
          break
        case 'Migrating':
        case 'Scaling':
        case 'Scheduled':
        case 'Starting':
        case 'Stopping':
        case 'Upgrading':
          status = 'processing'
          break
        case 'Allocated':
          if (this.$route.path.startsWith('/publicip')) {
            status = 'success'
          } else {
            status = 'warning'
          }
          break
        case 'Created':
        case 'Maintenance':
        case 'Pending':
          status = 'warning'
          break
      }
      return status
    },
    getHelperText (state) {
      if (this.$route.path.includes('/vmsnapshot')) {
        return this.getVMSnapshotHelperText(state)
      }
      if (this.$route.path.includes('/vm')) {
        return this.getVMHelperText(state)
      }
      if (this.$route.path.includes('/volume')) {
        return this.getVolumeHelperText(state)
      }
      if (this.$route.path.includes('/guestnetwork')) {
        return this.getGuestNetworkHelperText(state)
      }
      if (this.$route.path.includes('/publicip')) {
        return this.getPublicIPHelperText(state)
      }
      // Nothing for snapshots, vpcs, gateways, vnpnconn, vpnuser, kubectl, event, project, account, infra. They're all self explanatory
      return state
    },
    getVMHelperText (state) {
      switch (state) {
        case 'Starting': return 'VM is being started.  At this state, you should find host id filled which means it\'s being started on that host.'
        case 'Running': return 'VM is running.  host id has the host that it is running on.'
        case 'Stopping': return 'VM is being stopped.  host id has the host that it is being stopped on.'
        case 'Stopped': return 'VM is stopped.  host id should be null.'
        case 'Destroyed': return 'VM is marked for destroy.'
        case 'Expunging': return 'VM is being   expunged.'
        case 'Migrating': return 'VM is being migrated.  host id holds to from host'
        case 'Error': return 'VM is in error'
        case 'Unknown': return 'VM state is unknown.'
        case 'Shutdown': return 'VM state is shutdown from inside'
        default: return state
      }
    },
    getVolumeHelperText (state) {
      switch (state) {
        case 'Allocated': return 'The volume is allocated but has not been created yet.'
        case 'Creating': return 'The volume is being created.  getPoolId() should reflect the pool where it is being created.'
        case 'Ready': return 'The volume is ready to be used.'
        case 'Migrating': return 'The volume is migrating to other storage pool'
        case 'Snapshotting': return 'There is a snapshot created on this volume, not backed up to secondary storage yet'
        case 'RevertSnapshotting': return 'There is a snapshot created on this volume, the volume is being reverting from snapshot'
        case 'Resizing': return 'The volume is being resized'
        case 'Expunging': return 'The volume is being expunging'
        case 'Expunged': return 'The volume has been expunged'
        case 'Destroy': return 'The volume is destroyed, and can\'t be recovered.'
        case 'Destroying': return 'The volume is destroying, and can\'t be recovered.'
        case 'UploadOp': return 'The volume upload operation is in progress or in short the volume is on secondary storage'
        case 'Copying': return 'Volume is copying from image store to primary, in case it\'s an uploaded volume'
        case 'Uploaded': return 'Volume is uploaded'
        case 'NotUploaded': return 'The volume entry is just created in DB, not yet uploaded'
        case 'UploadInProgress': return 'Volume upload is in progress'
        case 'UploadError': return 'Volume upload encountered some error'
        case 'UploadAbandoned': return 'Volume upload is abandoned since the upload was never initiated within a specificed time'
        case 'Attaching': return 'The volume is attaching to a VM from Ready state.'
        default: return state
      }
    },
    getVMSnapshotHelperText (state) {
      switch (state) {
        case 'Allocated': return 'The VM snapshot is allocated but has not been created yet.'
        case 'Creating': return 'The VM snapshot is being created.'
        case 'Ready': return 'The VM snapshot is ready to be used.'
        case 'Reverting': return 'The VM snapshot is being used to revert'
        case 'Expunging': return 'The volume is being expunging'
        case 'Removed': return 'The volume is destroyed, and can\'t be recovered'
        case 'Error': return 'The volume is in error state, and can\'t be recovered'
        default: return state
      }
    },
    getGuestNetworkHelperText (state) {
      switch (state) {
        case 'Allocated': return 'Indicates the network configuration is in allocated but not setup'
        case 'Setup': return 'Indicates the network configuration is setup'
        case 'Implementing': return 'Indicates the network configuration is being implemented'
        case 'Implemented': return 'Indicates the network configuration is in use'
        case 'Shutdown': return 'Indicates the network configuration is being destroyed'
        case 'Destroy': return 'Indicates that the network is destroyed'
        default: return state
      }
    },
    getPublicIPHelperText (state) {
      switch (state) {
        case 'Allocating': return 'The IP Address is being propagated to other network elements and is not ready for use yet.'
        case 'Allocated': return 'The IP address is in used.'
        case 'Releasing': return 'The IP address is being released for other network elements and is not ready for allocation.'
        case 'Free': return 'The IP address is ready to be allocated.'
        default: return state
      }
    }
  }
}
</script>

<style scoped>
/deep/ .ant-badge-status-dot {
  width: 12px;
  height: 12px;
  margin-top: 5px;
}
</style>

<template>
  <div class="migrate-volume-container">

    <div class="modal-form">
      <p class="modal-form__label">{{ $t('storagePool') }}</p>
      <a-select v-model="selectedStoragePool" style="width: 100%;">
        <a-select-option v-for="(storagePool, index) in storagePools" :value="storagePool.id" :key="index">
          {{ storagePool.name }}
        </a-select-option>
      </a-select>
      <template v-if="this.resource.virtualmachineid">
        <p class="modal-form__label" @click="replaceDiskOffering = !replaceDiskOffering" style="cursor:pointer;">
          {{ $t('useNewDiskOffering') }}
        </p>
        <a-checkbox v-model="replaceDiskOffering" />

        <template v-if="replaceDiskOffering">
          <p class="modal-form__label">{{ $t('newDiskOffering') }}</p>
          <a-select v-model="selectedDiskOffering" style="width: 100%;">
            <a-select-option v-for="(diskOffering, index) in diskOfferings" :value="diskOffering.id" :key="index">
              {{ diskOffering.displaytext }}
            </a-select-option>
          </a-select>
        </template>

      </template>
    </div>

    <a-divider />

    <div class="actions">
      <a-button @click="closeModal">
        Cancel
      </a-button>
      <a-button type="primary" @click="submitMigrateVolume">
        Ok
      </a-button>
    </div>

  </div>
</template>

<script>
import { api } from '@/api'

export default {
  name: 'MigrateVolume',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  inject: ['parentFetchData', 'parentToggleLoading'],
  data () {
    return {
      storagePools: [],
      selectedStoragePool: null,
      diskOfferings: [],
      replaceDiskOffering: !!this.resource.virtualmachineid,
      selectedDiskOffering: null
    }
  },
  created () {
    this.fetchStoragePools()
    this.resource.virtualmachineid && this.fetchDiskOfferings()
  },
  methods: {
    fetchStoragePools () {
      api('listStoragePools', {
        zoneid: this.resource.zoneid
      }).then(response => {
        this.storagePools = response.liststoragepoolsresponse.storagepool
        this.selectedStoragePool = this.storagePools[0].id
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.closeModal()
      })
    },
    fetchDiskOfferings () {
      api('listDiskOfferings', {
        listall: true
      }).then(response => {
        this.diskOfferings = response.listdiskofferingsresponse.diskoffering
        this.selectedDiskOffering = this.diskOfferings[0].id
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.closeModal()
      })
    },
    closeModal () {
      this.$parent.$parent.close()
    },
    submitMigrateVolume () {
      this.closeModal()
      this.parentToggleLoading()
      api('migrateVolume', {
        livemigrate: this.resource.vmstate === 'Running',
        storageid: this.selectedStoragePool,
        volumeid: this.resource.id,
        newdiskofferingid: this.replaceDiskOffering ? this.selectedDiskOffering : null
      }).then(response => {
        this.queryAsyncJobResult({
          jobId: response.migratevolumeresponse.jobid,
          successMessage: `Successfully migrated volume`,
          successMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          errorMessage: 'Migrating volume failed',
          errorMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          },
          loadingMessage: `Migrating volume...`,
          catchMessage: 'Error encountered while fetching async job result',
          catchMethod: () => {
            this.parentFetchData()
            this.parentToggleLoading()
          }
        })
      }).catch(error => {
        this.$notification.error({
          message: `Error ${error.response.status}`,
          description: error.response.data.errorresponse.errortext
        })
        this.closeModal()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .migrate-volume-container {
    width: 95vw;
    max-width: 100%;

    @media (min-width: 760px) {
      width: 65vw;
    }

  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;

    button {

      &:not(:last-child) {
        margin-right: 10px;
      }

    }

  }

  .modal-form {
    margin-top: -20px;

    &__label {
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 5px;
    }

  }
</style>

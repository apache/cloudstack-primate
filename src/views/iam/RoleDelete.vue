<template>
  <a-tooltip placement="bottom">
    <template slot="title">
      Delete role
    </template>
    <a-popconfirm
      title="Delete Role?"
      @confirm="handleDelete"
    >
      <a-button type="danger">
        <a-icon
          type="loading"
          v-if="deleteLoading"
        />
        <a-icon
          type="delete"
          v-else
        />
      </a-button>
    </a-popconfirm>
  </a-tooltip>
</template>

<script>
export default {
  name: 'RoleDelete',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      deleteLoading: false
    }
  },
  methods: {
    handleDelete () {
      this.deleteLoading = true
      this.$emit('delete', this)
    }
  }
}
</script>

<style
  scoped
  lang="scss"
>
  .anticon-delete {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<template>
  <a-form-item>
    <a-radio-group
      v-for="(os, osIndex) in osList"
      :key="osIndex"
      class="radio-group"
      v-decorator="[inputDecorator, {
        rules: [{ required: true, message: 'Please select option' }]
      }]"
    >
      <a-radio
        class="radio-group__radio"
        :value="os.id"
      >
        {{ os.displaytext }}&nbsp;
        <a-tag
          :visible="os.ispublic && !os.isfeatured"
          color="blue"
        >{{ $t('isPublic') }}</a-tag>
        <a-tag
          :visible="os.isfeatured"
          color="green"
        >{{ $t('isFeatured') }}</a-tag>
        <a-tag
          :visible="isSelf(os)"
          color="orange"
        >{{ $t('isSelf') }}</a-tag>
        <a-tag
          :visible="isShared(os)"
          color="cyan"
        >{{ $t('isShared') }}</a-tag>
      </a-radio>
    </a-radio-group>
  </a-form-item>
</template>

<script>
import store from '@/store'

export default {
  name: 'TemplateIsoRadioGroup',
  props: {
    osList: {
      type: Array,
      default: () => []
    },
    inputDecorator: {
      type: String,
      default: ''
    }
  },
  methods: {
    isShared (item) {
      return !item.ispublic && (item.account !== store.getters.userInfo.account)
    },
    isSelf (item) {
      return !item.ispublic && (item.account === store.getters.userInfo.account)
    }
  }
}
</script>

<style lang="less" scoped>
  .radio-group {
    display: block;

    &__radio {
      margin: 0.5rem 0;
    }
  }

  .ant-tag {
    margin-left: 0.4rem;
  }
</style>

<template>
  <div class="r-FormDialog">
    <m-dialog
      ref="m-dialog"
      :width="width"
      :title="title"
      :cf-loading="cfLoading"
      :gen-ctx="genCtx"
      :before-confirm="runConfirm"
      :after-close="() => $refs.form.resetFields()"
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: labelSpan }"
        :wrapper-col="{ span: 24 - labelSpan }"
      >
        <slot :form="form"></slot>
      </a-form-model>
    </m-dialog>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import MDialog from '@/components/MDialog.vue'
import cloneDeep from 'lodash/cloneDeep'
import { MDialogRet } from '@/models/MDialog'

export default Vue.extend({
  name: 'FormDialog',
  components: {
    MDialog,
  },

  props: {
    // 表单标题
    title: {
      type: String,
      required: true,
    },

    // 表单的宽度
    width: {
      type: String,
      required: true,
    },

    // 表单数据
    form: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },

    // 对于 form 的校验规则
    rules: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },

    // 字段名的宽度
    labelSpan: {
      type: Number,
      required: true,
    },

    // 确认业务逻辑
    confirmBusiness: {
      type: Function as PropType<() => Promise<void>>,
      default: () => {},
    },
  },

  data() {
    return {
      cfLoading: false,
    }
  },

  methods: {
    open(): Promise<MDialogRet> {
      return (this.$refs['m-dialog'] as any).open()
    },

    genCtx() {
      return cloneDeep(this.form)
    },

    async runConfirm() {
      await (this.$refs.form as any).validate()
      try {
        this.cfLoading = true
        await this.confirmBusiness!() // 依赖 typescript: ~4.4.4 否则断言不成功
      } finally {
        this.cfLoading = false
      }
    },
  },
})
</script>

<style scoped lang="scss">
.r-FormDialog {

}
</style>

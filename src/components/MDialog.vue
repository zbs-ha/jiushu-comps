<template>
  <div class="r-MDialog">
    <a-modal
      :width="width"
      :title="title"
      :visible="visible"
      :confirm-loading="cfLoading"
      :keyboard="false"
      :maskClosable="false"
      :afterClose="afterClose"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <slot></slot>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { MDialogCtx, MDialogRet } from '@/models/MDialog'

export default Vue.extend({
  name: 'MDialog',

  props: {
    // 标题
    title: {
      type: String,
      required: true,
    },

    // 对话框宽度
    width: {
      type: String,
      default: '520px',
    },

    // 确认按钮，转圈圈
    cfLoading: {
      type: Boolean,
      default: false,
    },

    // 设置业务上下文
    genCtx: {
      type: Function as PropType<() => any>,
      default: () => {},
    },

    // 确认前调用，预期就准备关闭
    beforeConfirm: {
      type: Function as PropType<() => Promise<void>>,
      default: () => {},
    },

    // 取消前调用，预期就准备关闭
    beforeCancel: {
      type: Function as PropType<() => Promise<void>>,
      default: () => {},
    },

    // 关闭前调用，预期就关闭
    beforeClose: {
      type: Function as PropType<() => Promise<void>>,
      default: () => {},
    },

    // 关闭后执行的逻辑
    afterClose: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
  },

  data() {
    return {
      visible: false,

      dlgMgr: Promise.resolve({}),
      dlgMgrResolve: (ctx: MDialogCtx) => {
        console.warn('dlgMgrResolve, ctx is', ctx)
      },
    }
  },

  methods: {
    // 打开对话框，关闭后返回"上下文对象"
    open(): Promise<MDialogRet> {
      this.visible = true
      this.dlgMgr = new Promise((resolve) => {
        this.dlgMgrResolve = resolve
      })

      return this.dlgMgr
    },

    close(closeType: MDialogCtx['closeType']) {
      this.visible = false
      this.dlgMgrResolve({
        ...this.genCtx!(),
        closeType,
      })
    },

    async handleOk() {
      await this.beforeConfirm!()
      await this.beforeClose!()
      this.close('confirm')
    },

    handleCancel() {
      this.beforeCancel!()
      this.close('cancel')
    },
  },
})
</script>

<style scoped lang="scss">
.r-MDialog {

}
</style>

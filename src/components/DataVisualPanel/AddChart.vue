<template>
  <div class="r-AddChart">
    <form-dialog
      ref="form-dialog"
      title="新增图表"
      :label-span="4"
      :form="form"
      :rules="rules"
      width="550px"
    >
      <template v-slot:default="{ form }">
        <!-- 图表名称 -->
        <a-form-model-item label="图表名称" prop="chartName">
          <a-input v-model="form.chartName" placeholder="请输入图表名称"/>
        </a-form-model-item>

        <!-- 图表类型 -->
        <a-form-model-item label="图表类型" prop="chartType">
          <a-select v-model="form.chartType" placeholder="请选择图表类型">
            <a-select-option
              v-for="c in charts"
              :key="c.value"
              :value="c.value"
            >
              {{ c.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <!-- 数据源 -->
        <a-form-model-item label="数据源" prop="dataSourceName">
          <a-select v-model="form.dataSourceName" placeholder="请选择数据源">
            <template v-for="ds in dataSourceList">
              <a-select-option
                :key="ds.name"
                :value="ds.name"
              >
                {{ ds.label }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-model-item>

        <!-- 折线图、柱状图 -->
        <template v-if="form.chartType === 'chart-line' || form.chartType === 'chart-bar'">
          <a-form-model-item label="X 轴字段" prop="xFieldPath">
            <a-cascader
              :options="recordFieldsList"
              :load-data="loadData"
              @change="(v) => form.xFieldPath = v"
              placeholder="请选择字段"
            />
          </a-form-model-item>

          <a-form-model-item label="Y 轴字段" prop="yFieldPath">
            <a-cascader
              :options="recordFieldsList"
              :load-data="loadData"
              @change="(v) => form.yFieldPath = v"
              placeholder="请选择字段"
            />
          </a-form-model-item>
        </template>

        <!-- 饼图 -->
        <template v-if="form.chartType === 'chart-pie'">
          <a-form-model-item label="细分字段" prop="subdivideFieldPath">
            <a-cascader
              :options="recordFieldsList"
              :load-data="loadData"
              @change="(v) => form.subdivideFieldPath = v"
              placeholder="请选择字段"
            />
          </a-form-model-item>

          <a-form-model-item label="角度字段" prop="angleFieldPath">
            <a-cascader
              :options="recordFieldsList"
              :load-data="loadData"
              @change="(v) => form.angleFieldPath = v"
              placeholder="请选择字段"
            />
          </a-form-model-item>
        </template>

        <!-- 表格 -->
        <template v-if="form.chartType === 'chart-table'">
          <template v-for="(fieldForm, idx) in form.tableHeaders">
            <a-form-model-item
              :key="fieldForm.id"
              label="表头字段"
              :prop="`tableHeaders[${idx}].fieldPath`"
            >
              <div class="inline-flex w-full gap-4">
                <a-cascader
                  :options="recordFieldsList"
                  :load-data="loadData"
                  @change="(v) => fieldForm.fieldPath = v"
                  placeholder="请选择字段"
                />

                <div class="flex gap-2">
                  <a-button
                    icon="plus"
                    @click="addField()"
                    v-if="idx === form.tableHeaders.length - 1 "
                  />
                  <a-button
                    icon="minus"
                    @click="delField(fieldForm)"
                    v-if=" form.tableHeaders.length >= 2"
                  />
                </div>
              </div>

            </a-form-model-item>
          </template>
        </template>
      </template>
    </form-dialog>
  </div>
</template>

<script lang="ts">
import {
  find, findIndex, isObject, keys, last, uniqueId,
} from 'lodash-es'

import Vue, { PropType } from 'vue'
import FormDialog from '@/components/FormDialog.vue'
import { DVChartType, DvDataSource } from '@/models/DataVisualPanel'
import { MDialogRet } from '@/models/MDialog'
import { AddChartForm, TableFieldForm } from '@/models/AddChart'

type Data = Record<string, any> & {
  charts: Array<{
    label: string
    value: DVChartType
  }>

  form: AddChartForm
}

type FieldNode = {
  label: string
  value: string,
  isLeaf: boolean
}

const genID = () => uniqueId('field_')

export default Vue.extend({
  name: 'AddChart',
  components: {
    FormDialog,
  },

  props: {
    dataSourceList: {
      type: Array as PropType<DvDataSource[]>,
      required: true,
    },
  },

  data(): Data {
    return {
      charts: [
        {
          label: '表格',
          value: 'chart-table',
        },
        {
          label: '折线图',
          value: 'chart-line',
        },
        {
          label: '柱状图',
          value: 'chart-bar',
        },
        {
          label: '饼图',
          value: 'chart-pie',
        },
      ],

      form: {
        chartName: '',
        chartType: '' as DVChartType,
        dataSourceName: '' as DvDataSource['name'],

        xFieldPath: [],
        yFieldPath: [],

        subdivideFieldPath: [],
        angleFieldPath: [],

        tableHeaders: [{
          id: genID(),
          fieldPath: [],
          fieldName: '',
        }],
      },

      // 集合中对象，的顶层字段
      recordFieldsList: [],
    }
  },

  computed: {
    rules(): Record<string, any> {
      const _rules: Record<string, any> = {
        chartName: {
          required: true,
          message: '图表名称不能为空',
          trigger: 'blur',
        },
        chartType: {
          required: true,
          message: '图表类型不能为空',
          trigger: 'blur',
        },
        dataSourceName: {
          required: true,
          message: '数据源不能为空',
          trigger: 'blur',
        },
      }

      const { chartType } = this.form

      if (chartType === 'chart-line' || chartType === 'chart-bar') {
        _rules.xFieldPath = [{
          type: 'array',
          required: true,
          message: 'X 轴字段不能为空',
          trigger: 'change',
        }]
        _rules.yFieldPath = [
          {
            type: 'array',
            required: true,
            message: 'Y 轴字段不能为空',
            trigger: 'change',
          },
        ]
      }

      if (chartType === 'chart-pie') {
        _rules.subdivideFieldPath = [{
          type: 'array',
          required: true,
          message: '细分字段不能为空',
          trigger: 'change',
        }]
        _rules.angleFieldPath = [
          {
            type: 'array',
            required: true,
            message: '角度字段不能为空',
            trigger: 'change',
          },
        ]
      }

      // 为表格生成规则
      for (let idx = 0; idx < this.form.tableHeaders.length; idx++) {
        _rules[`tableHeaders[${idx}].fieldPath`] = [{
          type: 'array',
          required: true,
          message: '表头字段不能为空',
          trigger: 'change',
        }]
      }

      return _rules
    },

    // 当前选中的数据源
    curDataSource(): DvDataSource | undefined {
      return find(this.dataSourceList, { name: this.form.dataSourceName })
    },
  },

  watch: {
    curDataSource(v2: DvDataSource) {
      // 没选择数据源，或数据源里没有数据
      if (!v2 || v2.list.length === 0) {
        return
      }

      this.recordFieldsList = this.objRootFields(v2.list[0])
    },
  },

  methods: {
    objRootFields(o: any): FieldNode[] {
      return keys(o)
        .map((k) => {
          const isLeaf = !isObject(o[k])
          return {
            label: k,
            value: k,
            isLeaf,
            valObj: o[k],
          }
        })
    },

    loadData(selectedOptions: any) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.children = this.objRootFields(targetOption.valObj)
      this.recordFieldsList = [...this.recordFieldsList]
    },

    // 返回 form 对象
    async open(): Promise<AddChartForm> {
      const {
        closeType,
        ...form
      }: MDialogRet = await (this.$refs['form-dialog'] as any).open()
      if (closeType !== 'confirm') {
        throw new Error('AddChart, user canceled')
      }

      return this.fixedFieldNames(form as AddChartForm)
    },

    addField() {
      this.form.tableHeaders.push({
        id: genID(),
        fieldPath: [],
        fieldName: '',
      })
    },

    delField(fieldForm: TableFieldForm) {
      const idx = findIndex(this.form.tableHeaders, { id: fieldForm.id })
      this.form.tableHeaders.splice(idx, 1)
    },

    fixedFieldNames(form: AddChartForm): AddChartForm {
      // 暂时仅表格的维度有 fieldName 名称
      form.tableHeaders.forEach((h) => {
        h.fieldName = last(h.fieldPath)!
      })
      return form
    },
  },
})
</script>

<style scoped lang="scss">
.r-AddChart {

}
</style>

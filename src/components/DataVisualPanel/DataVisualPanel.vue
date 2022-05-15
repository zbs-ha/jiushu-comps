<template>
  <a-config-provider :locale="locale">
    <div class="r-DataVisualPanel p-3 h-full flex flex-col gap-3">
      <div class="flex-none flex gap-3">
        <a-button type="primary" class="mr-auto" @click="addChart">新增图表</a-button>
        <a-button @click="save" :loading="saveLoading">保存</a-button>
        <a-button type="danger" @click="quit">关闭</a-button>
      </div>

      <div class="flex-1 border border-solid border-gray-300 rounded overflow-y-auto bg-gray-200">
        <grid-layout
          :layout="chartsLayout"
          :col-num="GridColsCnt"
          :row-height="GridRowHeight"
        >
          <template v-for="chart in panelCharts">
            <grid-item class="touch-none"
                       :x="chart.layout.x"
                       :y="chart.layout.y"
                       :w="chart.layout.w"
                       :h="chart.layout.h"
                       :i="chart.layout.i"
                       :key="chart.layout.i"
            >
              <!-- 图表容器 -->
              <div class="h-full bg-white">
                <chart-wrap :chart="chart"/>
              </div>
            </grid-item>
          </template>
        </grid-layout>
      </div>

      <!-- 依赖的组件们 -->
      <add-chart ref="add-chart" :data-source-list="dataSourceList"/>
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import {
  DVChartData,
  DVChartDataCfg,
  DVChartLayout,
  DvCtx, DvDataSource,
  PanelData,
} from '@/models/DataVisualPanel'
import find from 'lodash/find'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import Vue, { PropType } from 'vue'
import { v4 as uuid } from 'uuid'
import VueGridLayout from 'vue-grid-layout'
import AddChart from '@/components/DataVisualPanel/AddChart.vue'
import ChartWrap from '@/components/DataVisualPanel/ChartPreset/ChartWrap.vue'

// @ts-ignore
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { AddChartForm } from '@/models/AddChart'
import {
  ChartHeightRows, ChartWidthCols, GridColsCnt, GridRowHeight,
} from './Constants'

type DATA = {
  dataSourceList: DvDataSource[],
  panelLoading: boolean,
  locale: any,

  dataSourceListReady: Promise<void>
  dataSourceListResolve: ()=> void
  dataSourceListReject: ()=> void
} & PanelData & Record<string, any>

export default Vue.extend({
  name: 'DataVisualPanel',
  components: {
    ChartWrap,
    AddChart,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },

  props: {
    // 加载面板数据
    onFetchPanel: {
      type: Function as PropType<() => Promise<{ panel?: PanelData }>>,
      required: true,
    },

    // 保存面板数据
    onSavePanel: {
      type: Function as PropType<(data: { panel: PanelData }) => Promise<void>>,
      required: true,
    },

    // 获取数据源
    onFetchSourceList: {
      type: Function as PropType<() => Promise<DvDataSource[]>>,
      required: true,
    },
  },

  data(): DATA {
    return {
      panelCharts: [],

      dataSourceList: [],
      panelLoading: false,
      locale: zhCN,

      saveLoading: false,

      GridRowHeight,
      GridColsCnt,

      // 等待首次加载完毕
      dataSourceListReady: Promise.resolve(),
      dataSourceListResolve: () => {},
      dataSourceListReject: () => {},
    }
  },

  // 在组件中共享状态、能力
  provide() {
    return {
      getDvCtx: (): DvCtx => ({
        panelCharts: this.panelCharts,
        genChartData: this.genChartData,
      }),
    }
  },

  computed: {
    // grid-layout 组件会直接修改源数据
    chartsLayout(): DVChartLayout[] {
      return this.panelCharts.map((c) => c.layout)
    },
  },

  methods: {
    quit() {
      this.$confirm({
        title: '警告',
        content: '确定离开吗？未保存的数据就丢失！',
        onOk: () => {
          this.$emit('quit-panel')
        },
      })
    },

    async save() {
      const panel = {
        panelCharts: this.panelCharts,
      }

      try {
        this.saveLoading = true
        await this.onSavePanel({ panel })
        this.$message.success('保存成功')
      } finally {
        this.saveLoading = false
      }
    },

    // 添加一个图表项
    async addChart() {
      const addForm: AddChartForm = await (this.$refs['add-chart'] as any).open()

      const type = addForm.chartType
      const layout = this.chartDefaultLayout()

      let dataCfg: DVChartDataCfg
      if (type === 'chart-table') {
        dataCfg = {
          type,
          dataSourceName: addForm.dataSourceName,
          headers: addForm.tableHeaders,
        }
      } else if (type === 'chart-line' || type === 'chart-bar') {
        dataCfg = {
          type,
          dataSourceName: addForm.dataSourceName,
          xFieldPath: addForm.xFieldPath,
          yFieldPath: addForm.yFieldPath,
        }
      } else if (type === 'chart-pie') {
        dataCfg = {
          type,
          dataSourceName: addForm.dataSourceName,
          subdivideFieldPath: addForm.subdivideFieldPath,
          angleFieldPath: addForm.angleFieldPath,
        }
      } else {
        dataCfg = {} as DVChartDataCfg
      }

      this.panelCharts.push({
        layout,
        type,
        dataCfg,
        ident: layout.i,
        name: addForm.chartName,
      })
    },

    // 图表默认的布局
    chartDefaultLayout(): DVChartLayout {
      const sorted = sortBy(this.chartsLayout, 'y').reverse()
      const lastItem = sorted[0] ?? { y: 0, h: 1 }

      return {
        x: 0,
        y: lastItem.y + (lastItem.h - 1),
        w: ChartWidthCols,
        h: ChartHeightRows,
        i: uuid(),
      }
    },

    // 生成指定图表数据
    async genChartData(dataCfg: DVChartDataCfg, refresh?: boolean): Promise<DVChartData> {
      await this.dataSourceListReady

      if (refresh) {
        await this.fetchDataSource()
      }

      if (this.dataSourceList.length === 0) {
        return []
      }

      const dataSource = find(this.dataSourceList, { name: dataCfg.dataSourceName }) as DvDataSource

      // 折线、柱状数据
      if (dataCfg.type === 'chart-line' || dataCfg.type === 'chart-bar') {
        return dataSource.list.map((o) => ({
          x: get(o, dataCfg.xFieldPath.join('.')),
          y: get(o, dataCfg.yFieldPath.join('.')),
        }))
      }

      // 饼图数据
      if (dataCfg.type === 'chart-pie') {
        return dataSource.list.map((o) => ({
          subdivide: get(o, dataCfg.subdivideFieldPath.join('.')),
          angle: get(o, dataCfg.angleFieldPath.join('.')),
        }))
      }

      // 表格数据
      if (dataCfg.type === 'chart-table') {
        return dataSource.list.map((o) => {
          const oo: Record<string, any> = {}

          for (const field of dataCfg.headers) {
            oo[field.fieldName] = get(o, field.fieldPath.join('.'))
          }

          return oo
        })
      }

      return []
    },

    // 获取数据源列表
    async fetchDataSource() {
      this.dataSourceList = await this.onFetchSourceList()
      this.dataSourceListResolve()
    },

    // 获取面板数据
    async fetchPanelData() {
      const defaultPanel = {
        panelCharts: [],
      }

      let { panel } = await this.onFetchPanel()
      panel ??= defaultPanel

      this.panelCharts = panel.panelCharts
    },

    async loadInitData() {
      try {
        this.panelLoading = true
        await this.fetchPanelData()
        await this.fetchDataSource()
      } finally {
        this.panelLoading = false
      }
    },
  },

  created() {
    this.dataSourceListReady = new Promise((resolve, reject) => {
      this.dataSourceListResolve = resolve
      this.dataSourceListReject = reject
    })
  },

  mounted() {
    this.loadInitData()
  },
})
</script>

<style scoped lang="scss">
.r-DataVisualPanel {

}
</style>

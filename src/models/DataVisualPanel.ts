import { EChartsOption } from 'echarts'

export type DVChartEcCfg = EChartsOption

export type DVChartType = 'chart-pie' | 'chart-line' | 'chart-bar' | 'chart-table'

export type FieldPath = string[]

// 基本数据配置
type DVChartDataCfgCommon = {
  type: DVChartType
  dataSourceName: string
}

// 表格图数据配置
export interface DVChartDataCfgTable extends DVChartDataCfgCommon {
  type: 'chart-table'
  headers: Array<{
    id: string
    fieldPath: FieldPath
    fieldName: string
  }>
}

// 折线图数据配置
export interface DVChartDataCfgLine extends DVChartDataCfgCommon {
  type: 'chart-line'
  xFieldPath: FieldPath
  yFieldPath: FieldPath
}

// 柱状图数据配置
export interface DVChartDataCfgBar extends DVChartDataCfgCommon {
  type: 'chart-bar'
  xFieldPath: FieldPath
  yFieldPath: FieldPath
}

// 柄图图数据配置
export interface DVChartDataCfgPie extends DVChartDataCfgCommon {
  type: 'chart-pie'
  subdivideFieldPath: FieldPath
  angleFieldPath: FieldPath
}

// 渲染图表的数据
export type DVChartDataTable = Array<Record<string, string>>
export type DVChartDataLine = Array<{ x: string, y: number }>
export type DVChartDataBar = Array<{ x: string, y: number }>
export type DVChartDataPie = Array<{ subdivide: string, angle: number }>

// 图表布局数据
export type DVChartLayout = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

// 图表数据配置
export type DVChartDataCfg =
  DVChartDataCfgTable
  | DVChartDataCfgLine
  | DVChartDataCfgBar
  | DVChartDataCfgPie

// 渲染图表的数据
export type DVChartData =
  DVChartDataTable
  | DVChartDataLine
  | DVChartDataBar
  | DVChartDataPie

// 图表详细数据
export type PanelChart = {
  ident: string
  name: string
  type: DVChartType
  layout: DVChartLayout
  dataCfg: DVChartDataCfg
}

// 上下文数据
export type DvCtx = {
  panelCharts: PanelChart[]
  genChartData: (dataCfg: DVChartDataCfg, refresh?: boolean) => Promise<DVChartData>
}

// 面板相关数据
export type PanelData = {
  panelCharts: PanelChart[]
}

export type DvDataSourceType = 'model' | 'api'

export type DvDataSource = {
  label: string
  name: DvDataSourceType
  list: Record<string, any>[]
}

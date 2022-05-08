import {
  DVChartDataCfgTable,
  DVChartType,
  DvDataSourceType,
  FieldPath,
} from '@/models/DataVisualPanel'

export type TableFieldForm = DVChartDataCfgTable['headers'][number]

export type AddChartForm = {
  chartName: string
  chartType: DVChartType
  dataSourceName: DvDataSourceType

  xFieldPath: FieldPath
  yFieldPath: FieldPath

  subdivideFieldPath: FieldPath
  angleFieldPath: FieldPath

  tableHeaders: TableFieldForm[]
}

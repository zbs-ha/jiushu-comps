import { EChartsOption } from 'echarts'
import genBaseCfg from './BaseCfg'

type Item = {
  name: string
  value: number
}

export default (items: Item[]): EChartsOption => ({
  ...genBaseCfg(),
  xAxis: {
    type: 'category',
    data: items.map((item) => item.name),
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar',
      barWidth: 50,
      data: items.map((item) => item.value),
    },
  ],
})

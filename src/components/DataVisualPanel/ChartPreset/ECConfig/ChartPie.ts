import { EChartsOption } from 'echarts'
import genBaseCfg from './BaseCfg'

type Item = {
  name: string
  value: number
}

export default (items: Item[]): EChartsOption => ({
  ...genBaseCfg(),
  series: [
    {
      type: 'pie',
      label: {
        show: false,
        position: 'center',
      },
      radius: '50%',
      data: items,
    },
  ],
})

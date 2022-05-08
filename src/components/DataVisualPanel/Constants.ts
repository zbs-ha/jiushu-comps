// ！注意：必须都是整数

// 网格间隙
const GridMargin = [10, 10]

// 网格的列数
const GridColsCnt = 60

// 图表的高度
const ChartHeight = 310

// 网格行的高度
const GridRowHeight = 10

// 图表高占用的行数
const ChartHeightRows = (ChartHeight + GridMargin[1]) / (GridRowHeight + GridMargin[1])

// 图表宽占用的列数
const ChartWidthCols = GridColsCnt / 2

const calcChartHeight = (rows: number): number => rows * GridRowHeight + (rows - 1) * GridMargin[1]

export {
  calcChartHeight,
  GridRowHeight,
  GridColsCnt,
  ChartHeightRows,
  ChartWidthCols,
}

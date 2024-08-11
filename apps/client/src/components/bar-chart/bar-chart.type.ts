export type BarChartComponentProps<
  T extends Record<string, string | number>,
  K extends keyof T & string,
> = {
  chartData: T[];
  dataLabelKey: K;
  dataValueKey: K;
};

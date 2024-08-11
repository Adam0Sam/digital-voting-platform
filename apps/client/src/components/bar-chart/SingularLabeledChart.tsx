import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChartComponentProps } from './bar-chart.type';
import { cn } from '@/lib/utils';

export function SingularLabeledBarChart<
  T extends Record<string, string | number>,
  K extends keyof T & string,
>({
  chartData,
  dataLabelKey,
  dataValueKey,
  selectedCells,
  className,
}: BarChartComponentProps<T, K> & {
  className?: string;
  selectedCells?: string[];
}) {
  const chartConfig = {
    [dataValueKey]: {
      label: dataValueKey,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 30,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dataLabelKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => value}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey={dataValueKey} radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
          {chartData.map(entry => {
            const isInactive =
              selectedCells &&
              selectedCells.length > 0 &&
              !selectedCells.includes(entry[dataLabelKey] as string);

            return (
              <Cell
                key={entry[dataLabelKey] as string}
                className={cn('fill-primary transition-opacity', {
                  'opacity-50': isInactive,
                })}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

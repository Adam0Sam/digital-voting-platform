import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function SingularLabeledBarChart<
  T extends Record<string, string | number>,
  K extends keyof T & string,
>({
  chartData,
  dataLabelKey,
  dataValueKey,
  label,
  description,
}: {
  chartData: T[];
  dataLabelKey: K;
  dataValueKey: K;
  label?: string;
  descrption?: string;
}) {
  const chartConfig = {
    [dataValueKey]: {
      label: dataValueKey,
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label ?? 'Bar Chart'}</CardTitle>
        <CardDescription>{description ?? ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey={dataValueKey}
              fill={`var(--color-${dataValueKey})`}
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

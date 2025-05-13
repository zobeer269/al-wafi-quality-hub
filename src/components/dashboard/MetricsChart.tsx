
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MetricsChartProps {
  title: string;
  subtitle?: string;
  type: 'area' | 'bar' | 'pie';
  data: any[];
  dataKeys: {
    x: string;
    y: string | string[];
  };
  colors?: string[];
}

const defaultColors = ['#0A6ED1', '#5CB85C', '#F0AD4E', '#D9534F', '#5BC0DE'];

const MetricsChart: React.FC<MetricsChartProps> = ({
  title,
  subtitle,
  type,
  data,
  dataKeys,
  colors = defaultColors,
}) => {
  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKeys.x} />
              <YAxis />
              <Tooltip />
              {Array.isArray(dataKeys.y) ? (
                dataKeys.y.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    fill={colors[index % colors.length]}
                    stroke={colors[index % colors.length]}
                  />
                ))
              ) : (
                <Area
                  type="monotone"
                  dataKey={dataKeys.y}
                  stroke={colors[0]}
                  fill={colors[0]}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKeys.x} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Array.isArray(dataKeys.y) ? (
                dataKeys.y.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index % colors.length]}
                  />
                ))
              ) : (
                <Bar dataKey={dataKeys.y} fill={colors[0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey={dataKeys.y as string}
                nameKey={dataKeys.x}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </CardHeader>
      <CardContent className="pt-0">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default MetricsChart;

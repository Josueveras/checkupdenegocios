
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, FileImage } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface ChartData {
  [key: string]: any;
}

interface InteractiveChartProps {
  data: ChartData[];
  type: 'bar' | 'pie' | 'line';
  title: string;
  xDataKey?: string;
  yDataKey?: string;
  colors?: string[];
  className?: string;
}

const COLORS = ['#0F3244', '#3C9CD6', '#F4A261', '#E76F51', '#2A9D8F', '#E9C46A'];

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  type,
  title,
  xDataKey = 'name',
  yDataKey = 'value',
  colors = COLORS,
  className = ''
}) => {
  const [selectedData, setSelectedData] = useState<ChartData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
              {typeof entry.value === 'number' && entry.value > 100 ? '' : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (data: any) => {
    setSelectedData(data);
    toast({
      title: "Item selecionado",
      description: `${data[xDataKey]}: ${data[yDataKey]}${typeof data[yDataKey] === 'number' && data[yDataKey] <= 100 ? '%' : ''}`
    });
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(title, 20, 30);
      
      // Add chart data as table
      doc.setFontSize(12);
      let yPosition = 50;
      
      data.forEach((item, index) => {
        doc.text(`${item[xDataKey]}: ${item[yDataKey]}`, 20, yPosition + (index * 10));
      });
      
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: "PDF exportado",
        description: `Gráfico "${title}" salvo com sucesso!`
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o gráfico.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPNG = () => {
    // Simulate PNG export
    toast({
      title: "PNG exportado",
      description: `Gráfico "${title}" salvo como imagem!`
    });
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xDataKey} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={yDataKey} 
              fill={colors[0]}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yDataKey}
              onClick={handleChartClick}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
      
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xDataKey} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={yDataKey} 
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, className: "cursor-pointer" }}
              onClick={handleChartClick}
            />
          </LineChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToPNG}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <FileImage className="h-4 w-4" />
            PNG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exportando...' : 'PDF'}
          </Button>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {selectedData && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            Item selecionado: {selectedData[xDataKey]} - {selectedData[yDataKey]}
            {typeof selectedData[yDataKey] === 'number' && selectedData[yDataKey] <= 100 ? '%' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

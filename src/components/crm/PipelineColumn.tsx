
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { getLeadStatusColor, formatCurrency } from '@/utils/leadHelpers';

interface PipelineColumnProps {
  id: string;
  title: string;
  count: number;
  totalValue: number;
  status: Lead['status'];
  children: React.ReactNode;
}

export function PipelineColumn({ 
  id, 
  title, 
  count, 
  totalValue, 
  status, 
  children 
}: PipelineColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const statusColor = getLeadStatusColor(status);

  return (
    <div className="flex-shrink-0 w-52 sm:w-60 lg:w-64">
      <Card className={`h-full ${isOver ? 'ring-2 ring-petrol/50' : ''}`}>
        <CardHeader className="pb-2 px-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium truncate">{title}</CardTitle>
            <Badge className={statusColor}>
              {count}
            </Badge>
          </div>
          {totalValue > 0 && (
            <p className="text-xs text-green-600 font-medium">
              {formatCurrency(totalValue)}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0 px-3">
          <div
            ref={setNodeRef}
            className="space-y-2 min-h-[350px] max-h-[350px] overflow-y-auto"
          >
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

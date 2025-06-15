import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { useDiagnosticOperations } from '@/hooks/useDiagnosticOperations';

interface DiagnosticCardProps {
  diagnostic: any;
  onView: (diagnostic: any) => void;
  onEdit: (diagnosticId: string) => void;
}

export const DiagnosticCard = ({ diagnostic, onView, onEdit }: DiagnosticCardProps) => {
  const { 
    deleteDiagnostic, 
    handleGenerateAndDownloadPDF, 
    handleScheduleCalendar 
  } = useDiagnosticOperations();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (score >= 40) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      "Avançado": "bg-green-100 text-green-800 border-green-200",
      "Intermediário": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Emergente": "bg-orange-100 text-orange-800 border-orange-200",
      "Iniciante": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[level as keyof typeof colors] || colors["Iniciante"];
  };

  const getStatusBadge = (status: string) => {
    return status === "concluido" 
      ? "bg-blue-100 text-blue-800 border-blue-200" 
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const empresa = diagnostic.empresas;

  return (
    <TooltipProvider>
      <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Informações do Cliente - Esquerda */}
            <div className="flex-1 space-y-4">
              {/* Nome da empresa e status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h3 className="font-semibold text-xl text-gray-900">
                  {empresa?.nome || 'Empresa não informada'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`border ${getStatusBadge(diagnostic.status)}`}>
                    {diagnostic.status === 'concluido' ? 'Concluído' : 'Pendente'}
                  </Badge>
                  <Badge className={`border ${getLevelBadge(diagnostic.nivel)}`}>
                    {diagnostic.nivel}
                  </Badge>
                </div>
              </div>

              {/* Dados do cliente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Cliente:</span>
                    <span className="text-gray-900">{empresa?.cliente_nome || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">E-mail:</span>
                    <span className="text-gray-900">{empresa?.cliente_email || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">WhatsApp:</span>
                    <span className="text-gray-900">{empresa?.cliente_telefone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Data:</span>
                    <span className="text-gray-900">{new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score e Ações - Direita */}
            <div className="flex flex-col items-center gap-4 lg:min-w-[200px]">
              {/* Score em destaque */}
              <div className={`px-6 py-4 rounded-xl border-2 ${getScoreColor(diagnostic.score_total)}`}>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {diagnostic.score_total}%
                  </div>
                  <div className="text-sm font-medium mt-1">
                    Score Geral
                  </div>
                </div>
              </div>

              {/* Botões de ação com ícones */}
              <div className="flex gap-2 flex-wrap justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGenerateAndDownloadPDF(diagnostic)}
                      className="h-10 w-10 hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Baixar PDF</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onView(diagnostic)}
                      className="h-10 w-10 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visualizar</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(diagnostic.id)}
                      className="h-10 w-10 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleScheduleCalendar(diagnostic)}
                      className="h-10 w-10 hover:bg-green-50 text-blue-600 border-blue-200"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Agendar reunião</p>
                  </TooltipContent>
                </Tooltip>

                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 hover:bg-red-50 text-red-600 border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Excluir diagnóstico</p>
                    </TooltipContent>
                  </Tooltip>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este diagnóstico? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteDiagnostic.mutate({ id: diagnostic.id })}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

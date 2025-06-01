import { useState } from 'react';
import StrategicMonthlyTracking from '@/components/acompanhamento/StrategicMonthlyTracking';
import HistoricalCheckups from '@/components/acompanhamento/HistoricalCheckups';
import ConsolidatedEvolution from '@/components/acompanhamento/ConsolidatedEvolution';
import StrategicSummary from '@/components/acompanhamento/StrategicSummary';
import DiagnosticTimeline from '@/components/acompanhamento/DiagnosticTimeline';
import DiagnosticComparison from '@/components/acompanhamento/DiagnosticComparison';
import CompanySelector from '@/components/acompanhamento/CompanySelector';
import ActionPanel from '@/components/acompanhamento/ActionPanel';

const Acompanhamento = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDiagnostics, setSelectedDiagnostics] = useState<string[]>([]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Acompanhamento</h1>
        <p className="text-gray-600 mt-1">Monitore a evolução das empresas ao longo do tempo</p>
      </div>

      {/* Strategic Monthly Tracking */}
      <StrategicMonthlyTracking />

      {/* Consolidated Evolution Table */}
      <ConsolidatedEvolution />

      {/* Company Selector */}
      <CompanySelector 
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />

      {/* Historical Check-ups */}
      <HistoricalCheckups selectedCompany={selectedCompany} />

      {/* Strategic Summary */}
      <StrategicSummary />

      {/* Existing diagnostic tracking components */}
      {/* Timeline */}
      <DiagnosticTimeline 
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        selectedDiagnostics={selectedDiagnostics}
        setSelectedDiagnostics={setSelectedDiagnostics}
      />

      {/* Comparison */}
      <DiagnosticComparison selectedDiagnostics={selectedDiagnostics} />

      {/* Action Panel */}
      <ActionPanel 
        selectedDiagnostics={selectedDiagnostics}
        setSelectedDiagnostics={setSelectedDiagnostics}
      />
    </div>
  );
};

export default Acompanhamento;

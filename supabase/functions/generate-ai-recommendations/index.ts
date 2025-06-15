
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { diagnosticData } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `
Você é um consultor empresarial especializado em diagnósticos organizacionais. Com base nos dados do diagnóstico abaixo, gere recomendações práticas e específicas para melhorar a empresa.

DADOS DO DIAGNÓSTICO:
- Empresa: ${diagnosticData.companyName}
- Setor: ${diagnosticData.sector}
- Funcionários: ${diagnosticData.employees}
- Faturamento: ${diagnosticData.revenue}
- Score Geral: ${diagnosticData.overallScore}%
- Nível: ${diagnosticData.level}

SCORES POR CATEGORIA:
${Object.entries(diagnosticData.categoryScores).map(([cat, score]) => `- ${cat}: ${score}%`).join('\n')}

PONTOS FORTES ATUAIS:
${diagnosticData.strongPoints?.map(point => `- ${point}`).join('\n') || 'Nenhum identificado'}

PONTOS DE ATENÇÃO:
${diagnosticData.attentionPoints?.map(point => `- ${point}`).join('\n') || 'Nenhum identificado'}

INSTRUÇÕES:
1. Analise os dados fornecidos considerando o contexto específico da empresa
2. Gere recomendações práticas e acionáveis para cada categoria com score abaixo de 80%
3. Sugira ferramentas, estratégias e próximos passos concretos
4. Considere o setor de atuação e tamanho da empresa
5. Priorize ações de maior impacto primeiro

FORMATO DE RESPOSTA:
Retorne um JSON com a seguinte estrutura:
{
  "recommendations": {
    "categoria": ["recomendação 1", "recomendação 2", "recomendação 3"]
  },
  "priorityActions": ["ação prioritária 1", "ação prioritária 2", "ação prioritária 3"],
  "nextSteps": "Descrição dos próximos passos recomendados",
  "estimatedTimeframe": "Prazo estimado para implementação",
  "estimatedInvestment": "Estimativa de investimento necessário"
}
`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um consultor empresarial experiente especializado em diagnósticos organizacionais. Suas respostas devem ser práticas, específicas e acionáveis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Tentar fazer parse do JSON retornado pela IA
    let recommendations
    try {
      recommendations = JSON.parse(aiResponse)
    } catch (parseError) {
      // Se não conseguir fazer parse, criar estrutura padrão
      recommendations = {
        recommendations: { "Geral": [aiResponse] },
        priorityActions: [],
        nextSteps: aiResponse,
        estimatedTimeframe: "A definir",
        estimatedInvestment: "A definir"
      }
    }

    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error generating AI recommendations:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

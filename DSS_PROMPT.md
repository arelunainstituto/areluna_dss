# DSS — Decision Support System | Instituto AreLuna

## Prompt de Implementação Completo

---

## 1. CONTEXTO E OBJETIVO

Constrói uma aplicação **Decision Support System (DSS)** para o Instituto AreLuna — uma clínica de medicina dentária avançada e estética que opera em Portugal (Porto e Lisboa) e Brasil, com foco em procedimentos como transplante capilar, facetas dentárias, implantes, alinhadores e estética facial.

A aplicação tem 3 módulos sequenciais:

1. **Módulo de Extração** — Coleta dados brutos do Zoho CRM via COQL e API REST, armazena no Supabase.
2. **Módulo de Processamento** — Calcula métricas derivadas (secundárias) a partir dos dados históricos armazenados.
3. **Módulo de Visualização** — Dashboard web com Chart.js para exibição dos KPIs em tempo real.

**Stack:**
- Backend: **Node.js** (TypeScript preferencial)
- Base de dados: **Supabase** (PostgreSQL)
- Frontend: **HTML/CSS/JS + Chart.js** (pode ser React se preferir, mas Chart.js é obrigatório para gráficos)
- Fonte de dados: **Zoho CRM** (via COQL + REST API)
- Scheduler: **node-cron** para agendamento de coletas

---

## 2. ARQUITETURA DA APLICAÇÃO

```
┌──────────────────────────────────────────────────────────────────┐
│                        DSS AreLuna                               │
│                                                                  │
│  ┌─────────────┐    ┌──────────────────┐    ┌────────────────┐  │
│  │  ZOHO CRM   │───▶│  MÓDULO 1        │───▶│  SUPABASE      │  │
│  │  (COQL API) │    │  Extração        │    │  (PostgreSQL)  │  │
│  └─────────────┘    │  node-cron jobs   │    └───────┬────────┘  │
│                     └──────────────────┘            │            │
│                                                      │            │
│                     ┌──────────────────┐            │            │
│                     │  MÓDULO 2        │◀───────────┘            │
│                     │  Processamento   │                         │
│                     │  Métricas sec.   │─────────┐               │
│                     └──────────────────┘         │               │
│                                                   │               │
│                     ┌──────────────────┐         │               │
│                     │  MÓDULO 3        │◀────────┘               │
│                     │  Dashboard       │                         │
│                     │  Chart.js        │                         │
│                     └──────────────────┘                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. ESTRUTURA REAL DO ZOHO CRM

### 3.1 Módulo Leads — Campos relevantes

| Campo API | Label | Tipo |
|-----------|-------|------|
| `Lead_Source` | Lead Source | picklist |
| `Lead_Status` | Lead Status | picklist |
| `Interesses` | Interesses | picklist |
| `Unidade_Atendimento` | Unidade Atendimento | picklist |
| `Doutor_Respons_vel` | Doutor Responsável | picklist |
| `Owner` | Lead Owner | ownerlookup |
| `Created_Time` | Created Time | datetime |
| `Modified_Time` | Modified Time | datetime |
| `Last_Activity_Time` | Last Activity Time | datetime |
| `Agendamento_Video` | Agendamento Video | datetime |
| `Cost_per_Click` | Cost per Click | currency |
| `Cost_per_Conversion` | Cost per Conversion | currency |
| `Ad_Campaign_Name` | Ad Campaign Name | text |
| `AdGroup_Name` | AdGroup Name | text |
| `Paciente_ativo_ou_inativo` | Paciente ativo ou inativo | picklist |
| `Country` | Country | text |
| `City` | City | text |
| `Em_que_pa_s_voc_mora` | Em que país você mora? | text |
| `PA_S_ALTERNATIVO` | PAÍS ALTERNATIVO | text |
| `SDR` (não existe em Leads — usar `Owner`) | — | — |
| `Data_da_primeira_convers_o` | Data da primeira conversão | date |
| `Converted__s` | Is Converted | boolean |
| `Converted_Date_Time` | Converted Date Time | datetime |
| `Lead_Conversion_Time` | Lead Conversion Time | integer |

**Valores de `Lead_Source`:**
`Meta ADS`, `Google AdWords`, `LP - D`, `Landing Page`, `Instagram DM`, `Whatsapp`, `WHATSAPP - Admin do Zoho`, `Walk in`, `Receção`, `Repescagem RD`, `Parceiro`, `Referência externa`, `Referência de funcionário`, `Daniel Dias MKT`, `Eventos`, `Portoral`, `Google`, `Loja Online`, `Online Store`, `Feira de comércio`, `Venda por telefone`, `Alias de e-mail de venda`, `Parceiro de seminário`, `Seminário interno`, `Download da Internet`

**Valores de `Lead_Status`:**
`1a Tentativa de contato`, `2a Tentativa de contato`, `3a Tentativa de contato`, `Em conversação`, `Pré-Qualificação`, `Qualificado`, `Não qualificado`, `Video Chamada Agendada`, `Video Chamada Confirmada`, `Não compareceu a vídeo`, `Avaliação Agendada`, `Consulta de Avaliação`, `Nova Oportunidade`, `Tarefas em Aberto`, `Despedida`, `Perdido para concorrência`, `Não tem interesse`, `Informação Incorretas`, `Frio – Facetas`, `Frios – Implante capilar`, `Mornos – Implante capilar`, `Quentes – Implante capilar`, `Quentes – Facetas`, `Rd Station`, `Paciente Areluna`, `Blacklist`

**Valores de `Interesses`:**
`Alinhadores`, `Cirurgia Plástica`, `Cursos`, `Estética Facial`, `Facetas`, `Formações`, `Implantes Dentários`, `Transplante Capilar`, `Tratamentos Dentários`

**Valores de `Unidade_Atendimento`:**
`Porto - Palacio Cristal`, `Porto - Marques`, `Lisboa`, `Brasil`

### 3.2 Módulo Deals — Campos relevantes

| Campo API | Label | Tipo |
|-----------|-------|------|
| `Amount` | Amount | currency |
| `Stage` | Stage | picklist |
| `Pipeline` | Pipeline | picklist |
| `Lead_Source` | Lead Source | picklist |
| `Interesses` | Interesses | picklist |
| `Unidade_Atendimento` | Unidade Atendimento | picklist |
| `Doutor_Respons_vel` | Doutor Responsável | picklist |
| `Owner` | Potential Owner | ownerlookup |
| `Contact_Name` | Contact Name | lookup |
| `Created_Time` | Created Time | datetime |
| `Modified_Time` | Modified Time | datetime |
| `Closing_Date` | Closing Date | date |
| `Probability` | Probability | integer |
| `Expected_Revenue` | Expected Revenue | currency |
| `Sales_Cycle_Duration` | Sales Cycle Duration | integer |
| `Valor_de_Entrada` | Valor de Entrada | currency |
| `Valor_da_Parcela` | Valor da Parcela | currency |
| `Quantidade_de_Parcelas` | Quantidade de Parcelas | picklist |
| `Saldo_Restante` | Saldo Restante | currency |
| `Forma_de_Pagamento` | Forma de Pagamento | picklist |
| `M_todo_de_Pagamento` | Método de Pagamento | picklist |
| `Status_Contrato` | Status Contrato | picklist |
| `Reason_For_Loss__s` | Reason For Loss | picklist |
| `Produtos_de_Interesse` | Produtos de Interesse | subform |
| `Total_Geral` | Total Geral | formula |
| `Desconto_Total` | Desconto | formula |
| `Sub_total` | Sub-total | formula |
| `Valor_Total_da_Venda` | Valor Total da Venda | formula |
| `Data_da_Primeira_Presta_o` | Data da Primeira Prestação | date |
| `Data_de_In_cio` | Data de Início | date |
| `SDR` | SDR | picklist |
| `Agendamento_Video` | Agendamento Video | datetime |
| `Cost_per_Click` | Cost per Click | currency |
| `Cost_per_Conversion` | Cost per Conversion | currency |
| `Ad_Campaign_Name` | Ad Campaign Name | text |
| `Lead_Conversion_Time` | Lead Conversion Time | integer |

**Valores de `Stage`:**
*Pipeline SDR:* `Novas Oportunidades`, `Tentativa Contato`, `Agendar Video`, `Video Chamada`, `Marcou avaliaçao`, `Follow-up leads frios`, `Follow-up leads fechados`, `Lead Morno`, `Sem_interesse`
*Pipeline VENDAS:* `Qualificação`, `É necessária análise`, `Proposta de valor`, `Negociação/Revisão`, `Procedimento Fechado`, `Procedimento Fechado.`, `Ganho fechado`, `Perda fechada`, `Perda fechada para a concorrência`, `Perda Fechada Adiada`, `Follow-up Negócios`, `Em ajuste`

**Valores de `Pipeline`:** `SDR - Instituto AreLuna`, `VENDAS`

**Valores de `Reason_For_Loss__s`:**
`Acompanhamentos perdidos`, `Alvo errado`, `Cliente não qualificado`, `Concorrência`, `Desfasamento de expectativas`, `Falta de resposta`, `Interesse futuro`, `Outro`, `Preço`

**Valores de `Forma_de_Pagamento`:** `Pronto Pagamento`, `Venda Parcelada`

**Valores de `M_todo_de_Pagamento`:** `Débito Direto`, `MB Way`, `Multibanco`, `Numerário`, `Pronto Pagamento`, `Stripe`, `Transferência Bancária`

**Valores de `SDR`:** `Wellen Novato`

**Doutores:**
`Dr. Leonardo Costa Saraiva de Oliveira - OMD 11846`, `Dr. Marcos Kawasaki - OMD 75498`, `Dr. Gerson Guerreiro`, `Dra. Ana Vitória Marques - OMD 15209`, `Dra. Aline Luiza Marodin - OMD 12330`, `Dra. Carla Salvi - OMD 15214`, `Dr. Roberto Almeida - OMD 12227`, `Dra. Yara Campos - OMD 15666`, `Dra. Arethuza Carolina Brochado Luna - OMD 11845`, `Dra. Daiane Andrade - OMD 12681`, `Dra. Patricia Tatsch - OM 47868`, `Dra. Pethine Dalsasso - OMD 12228`, `Dra Thais da Silva Perlingeiro - OMD 69564`, `Dra. Sara Ribeiro - OMD 8560`

---

## 4. CLASSIFICAÇÃO DE MÉTRICAS

### CRITÉRIO DE CLASSIFICAÇÃO

- **PRIMÁRIA (P):** Pode ser calculada com uma ou mais queries COQL ao Zoho CRM no momento da execução. Os dados estão disponíveis instantaneamente.
- **SECUNDÁRIA (S):** Exige acumulação histórica de dados no Supabase ao longo do tempo para ser calculável. Depende de métricas primárias coletadas e armazenadas previamente.

---

### 4.1 Dashboard Executivo (CEO & Financeiro)

| # | KPI | Tipo | Justificação |
|---|-----|------|-------------|
| E1 | Receita Total Fechada (Won) | P | Query direta a Deals com Stage = won, soma de Amount |
| E2 | Valor de Entrada Real (Cash-in) | P | Query direta a Deals, soma de Valor_de_Entrada |
| E3 | Ticket Médio por Procedimento | P | Soma de Amount / Contagem de Deals, agrupado por Interesses |
| E4 | Pipeline Ponderado (Forecast) | P | Amount * Probability para deals em aberto |
| E5 | Receita por Unidade | P | Amount agrupado por Unidade_Atendimento |
| E6 | Saldo em Aberto (Inadimplência) | P | Soma de Saldo_Restante onde Saldo_Restante > 0 |
| E7 | Receita por Mês (Evolução) | S | Requer armazenar receita diária e agregar por mês |
| E8 | Tendência de Receita (Regressão) | S | Requer série temporal de pelo menos 30 dias |
| E9 | Variação MoM (Month-over-Month) | S | Compara mês atual com anterior, requer histórico |

### 4.2 Dashboard Comercial (Vendas & SDRs)

| # | KPI | Tipo | Justificação |
|---|-----|------|-------------|
| C1 | Taxa de Conversão Global | P | Deals Won / Total Deals |
| C2 | Taxa de Conversão por Vendedor | P | Won / Total por Owner |
| C3 | Taxa de Comparecimento (Show Rate) | P | Leads com Status "Video Chamada Confirmada" vs "Não compareceu a vídeo" |
| C4 | Negócios por Estágio (Funil) | P | Contagem de Deals por Stage |
| C5 | Deals Abertos por Vendedor | P | Deals em pipeline aberto, agrupado por Owner |
| C6 | Motivos de Perda | P | Deals perdidos agrupados por Reason_For_Loss__s |
| C7 | Duração Média do Ciclo de Vendas | P | Média de Sales_Cycle_Duration dos Won |
| C8 | Speed to Lead (Tempo 1o Contato) | S | Requer registar Created_Time vs timestamp do 1o contato (Call/Note) — COQL não cruza módulos |
| C9 | Negócios Estagnados | S | Requer snapshots do Stage ao longo do tempo para detectar deals parados >X dias no mesmo estágio |
| C10 | Eficiência de SDR | P | Deals no pipeline SDR convertidos para pipeline VENDAS, por SDR |
| C11 | Evolução da Taxa de Conversão | S | Comparação semanal/mensal, requer série histórica |

### 4.3 Dashboard de Marketing (Aquisição)

| # | KPI | Tipo | Justificação |
|---|-----|------|-------------|
| M1 | Total de Leads (Hoje / Semana / Mês) | P | Contagem de Leads por Created_Time |
| M2 | Leads por Canal (Lead_Source) | P | Contagem agrupada por Lead_Source |
| M3 | Leads por Interesse | P | Contagem agrupada por Interesses |
| M4 | Leads por Unidade | P | Contagem agrupada por Unidade_Atendimento |
| M5 | Leads por País/Cidade | P | Contagem agrupada por Country / Em_que_pa_s_voc_mora |
| M6 | Custo por Lead (CPL) | P | Média de Cost_per_Conversion por Lead_Source |
| M7 | Qualidade do Lead por Canal | P | Proporção de Status qualificantes vs não-qualificantes por Lead_Source |
| M8 | ROI por Campanha | P | Cruzar Ad_Campaign_Name de Deals Won com Amount (limitado, pois Deals herdam o campo) |
| M9 | Média Diária de Leads | S | Requer série histórica de contagens diárias |
| M10 | Desvio Padrão de Entrada de Leads | S | Requer pelo menos 30 pontos de dados diários |
| M11 | Tendência de Leads (Regressão Linear) | S | Requer série temporal contínua |
| M12 | Moda / Mediana de Leads Diários | S | Requer acumulação de dados diários |
| M13 | Sazonalidade de Leads | S | Requer dados de pelo menos 3 meses |
| M14 | Taxa de Repescagem | P | Leads com Lead_Source = "Repescagem RD" que foram convertidos |

### 4.4 Dashboard Operacional & Médico

| # | KPI | Tipo | Justificação |
|---|-----|------|-------------|
| O1 | Vendas por Doutor | P | Deals Won agrupados por Doutor_Respons_vel, soma de Amount |
| O2 | Quantidade de Deals por Doutor | P | Contagem de Deals por Doutor_Respons_vel |
| O3 | Ticket Médio por Doutor | P | Amount médio por Doutor_Respons_vel |
| O4 | Distribuição por Produto/Interesse | P | Deals agrupados por Interesses |

### 4.5 Alertas Vermelhos (Monitoramento Crítico)

| # | Alerta | Tipo | Justificação |
|---|--------|------|-------------|
| A1 | Leads sem contacto > 2h | P | Leads criados hoje com Lead_Status = "1a Tentativa de contato" e Created_Time > 2h |
| A2 | Vídeos Agendados Hoje | P | Leads/Deals com Agendamento_Video = hoje |
| A3 | Contratos Pendentes | P | Deals com Status_Contrato = "Não gerado" e Stage = won |
| A4 | Deals Sem Pagamento de Entrada | P | Deals Won onde Valor_de_Entrada = 0 ou null |

---

## 5. QUERIES COQL (MÓDULO 1 — EXTRAÇÃO)

> **NOTA IMPORTANTE SOBRE COQL:**
> COQL (CRM Object Query Language) tem limitações significativas:
> - Não suporta GROUP BY, COUNT, SUM, AVG nativos
> - Não suporta JOINs entre módulos
> - Não suporta subqueries
> - Retorna linhas individuais (máx. 200 por página, paginável com `page`)
> - O backend Node.js deve fazer TODA a agregação em memória após receber os registos
> - Formato: `SELECT campo1, campo2 FROM Modulo WHERE condições LIMIT 200 OFFSET 0`
> - Suporta: `=`, `!=`, `>`, `<`, `>=`, `<=`, `like`, `in`, `not in`, `between`, `is null`, `is not null`
> - Operadores lógicos: `and`, `or`
> - Ordenação: `ORDER BY campo ASC/DESC`

### 5.1 Queries para Leads

```sql
-- Q-L1: Leads criados hoje (para contagem diária)
SELECT id, Lead_Source, Lead_Status, Interesses, Unidade_Atendimento,
       Owner, Created_Time, Country, Em_que_pa_s_voc_mora, City,
       Cost_per_Conversion, Ad_Campaign_Name
FROM Leads
WHERE Created_Time = today
ORDER BY Created_Time DESC
LIMIT 200

-- Q-L2: Leads criados nos últimos 7 dias
SELECT id, Lead_Source, Lead_Status, Interesses, Unidade_Atendimento,
       Owner, Created_Time, Country, Cost_per_Conversion, Ad_Campaign_Name
FROM Leads
WHERE Created_Time between 'YYYY-MM-DDT00:00:00+00:00' and 'YYYY-MM-DDT23:59:59+00:00'
ORDER BY Created_Time DESC
LIMIT 200

-- Q-L3: Leads criados no mês corrente
SELECT id, Lead_Source, Lead_Status, Interesses, Unidade_Atendimento,
       Owner, Created_Time, Cost_per_Conversion, Ad_Campaign_Name
FROM Leads
WHERE Created_Time between 'YYYY-MM-01T00:00:00+00:00' and 'YYYY-MM-DDT23:59:59+00:00'
ORDER BY Created_Time DESC
LIMIT 200

-- Q-L4: Leads qualificados vs não-qualificados (qualidade por canal)
SELECT id, Lead_Source, Lead_Status, Interesses
FROM Leads
WHERE Lead_Status in ('Qualificado', 'Não qualificado', 'Video Chamada Confirmada',
      'Avaliação Agendada', 'Consulta de Avaliação', 'Não tem interesse',
      'Informação Incorretas', 'Blacklist')
  AND Created_Time between 'YYYY-MM-01T00:00:00+00:00' and 'YYYY-MM-DDT23:59:59+00:00'
ORDER BY Created_Time DESC
LIMIT 200

-- Q-L5: Leads com vídeo agendado hoje (Alerta A2)
SELECT id, First_Name, Last_Name, Lead_Status, Owner, Agendamento_Video
FROM Leads
WHERE Agendamento_Video between 'YYYY-MM-DDT00:00:00+00:00' and 'YYYY-MM-DDT23:59:59+00:00'
ORDER BY Agendamento_Video ASC
LIMIT 200

-- Q-L6: Leads "virgens" com mais de 2h (Alerta A1)
-- NOTA: Substituir dinamicamente o timestamp de 2h atrás
SELECT id, First_Name, Last_Name, Lead_Source, Owner, Created_Time
FROM Leads
WHERE Lead_Status = '1a Tentativa de contato'
  AND Created_Time between 'YYYY-MM-DDT00:00:00+00:00' and 'TIMESTAMP_2H_ATRAS'
ORDER BY Created_Time ASC
LIMIT 200

-- Q-L7: Show Rate (comparecimento a vídeo)
SELECT id, Lead_Status
FROM Leads
WHERE Lead_Status in ('Video Chamada Confirmada', 'Não compareceu a vídeo',
      'Video Chamada Agendada')
  AND Modified_Time between 'YYYY-MM-01T00:00:00+00:00' and 'YYYY-MM-DDT23:59:59+00:00'
LIMIT 200

-- Q-L8: Leads de repescagem convertidos
SELECT id, Lead_Source, Converted__s, Created_Time
FROM Leads
WHERE Lead_Source = 'Repescagem RD'
ORDER BY Created_Time DESC
LIMIT 200

-- Q-L9: Leads convertidos (para medir eficiência)
SELECT id, Lead_Source, Owner, Lead_Conversion_Time, Converted_Date_Time,
       Created_Time, Interesses, Unidade_Atendimento
FROM Leads
WHERE Converted__s = true
  AND Converted_Date_Time between 'YYYY-MM-01T00:00:00+00:00' and 'YYYY-MM-DDT23:59:59+00:00'
ORDER BY Converted_Date_Time DESC
LIMIT 200
```

### 5.2 Queries para Deals

```sql
-- Q-D1: Deals ganhos (receita total e ticket médio)
SELECT id, Amount, Interesses, Unidade_Atendimento, Doutor_Respons_vel,
       Owner, Closing_Date, Valor_de_Entrada, Saldo_Restante,
       Forma_de_Pagamento, Quantidade_de_Parcelas, Lead_Source,
       Ad_Campaign_Name, Cost_per_Conversion, Sales_Cycle_Duration, SDR
FROM Deals
WHERE Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
ORDER BY Closing_Date DESC
LIMIT 200

-- Q-D2: Deals ganhos no mês corrente
SELECT id, Amount, Interesses, Unidade_Atendimento, Doutor_Respons_vel,
       Owner, Closing_Date, Valor_de_Entrada, Saldo_Restante,
       Lead_Source, Sales_Cycle_Duration, SDR
FROM Deals
WHERE Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
  AND Closing_Date between 'YYYY-MM-01' and 'YYYY-MM-DD'
ORDER BY Closing_Date DESC
LIMIT 200

-- Q-D3: Todos os deals em pipeline aberto (funil + forecast)
SELECT id, Deal_Name, Amount, Stage, Pipeline, Probability, Owner,
       Interesses, Unidade_Atendimento, Created_Time, Modified_Time
FROM Deals
WHERE Stage not in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.',
      'Perda fechada', 'Perda fechada para a concorrência', 'Perda Fechada Adiada',
      'Sem interesse', 'Sem_interesse')
ORDER BY Modified_Time DESC
LIMIT 200

-- Q-D4: Deals perdidos (motivos de perda)
SELECT id, Amount, Stage, Reason_For_Loss__s, Owner, Interesses,
       Unidade_Atendimento, Lead_Source, Closing_Date
FROM Deals
WHERE Stage in ('Perda fechada', 'Perda fechada para a concorrência', 'Perda Fechada Adiada')
  AND Closing_Date between 'YYYY-MM-01' and 'YYYY-MM-DD'
ORDER BY Closing_Date DESC
LIMIT 200

-- Q-D5: Saldo em aberto (inadimplência)
SELECT id, Deal_Name, Amount, Saldo_Restante, Valor_de_Entrada,
       Quantidade_de_Parcelas, Owner, Closing_Date
FROM Deals
WHERE Saldo_Restante > 0
  AND Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
ORDER BY Saldo_Restante DESC
LIMIT 200

-- Q-D6: Forecast ponderado (pipeline value)
SELECT id, Amount, Probability, Stage, Pipeline, Owner, Interesses
FROM Deals
WHERE Pipeline = 'VENDAS'
  AND Stage not in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.',
      'Perda fechada', 'Perda fechada para a concorrência', 'Perda Fechada Adiada')
LIMIT 200

-- Q-D7: Deals por pipeline SDR (eficiência SDR)
SELECT id, Deal_Name, Stage, Owner, SDR, Created_Time, Modified_Time, Pipeline
FROM Deals
WHERE Pipeline = 'SDR - Instituto AreLuna'
ORDER BY Modified_Time DESC
LIMIT 200

-- Q-D8: Contratos pendentes (Alerta A3)
SELECT id, Deal_Name, Status_Contrato, Owner, Closing_Date, Amount
FROM Deals
WHERE Status_Contrato = 'Não gerado'
  AND Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
ORDER BY Closing_Date DESC
LIMIT 200

-- Q-D9: Deals sem entrada (Alerta A4)
SELECT id, Deal_Name, Amount, Valor_de_Entrada, Owner, Closing_Date
FROM Deals
WHERE Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
  AND (Valor_de_Entrada is null or Valor_de_Entrada = 0)
ORDER BY Closing_Date DESC
LIMIT 200

-- Q-D10: Todos os deals do mês (para cálculo de conversão)
SELECT id, Stage, Owner, Pipeline, Created_Time, Closing_Date
FROM Deals
WHERE Created_Time between 'YYYY-MM-01T00:00:00+00:00' and 'YYYY-MM-DDT23:59:59+00:00'
ORDER BY Created_Time DESC
LIMIT 200
```

### 5.3 Notas sobre Paginação

```javascript
// Todas as queries precisam de paginação. Exemplo de implementação:
async function fetchAllRecords(coqlQuery, baseOffset = 0) {
  const PAGE_SIZE = 200;
  let allRecords = [];
  let offset = baseOffset;
  let hasMore = true;

  while (hasMore) {
    const query = `${coqlQuery} LIMIT ${PAGE_SIZE} OFFSET ${offset}`;
    const response = await zohoCoqlRequest(query);
    const records = response.data || [];
    allRecords = allRecords.concat(records);

    if (records.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      offset += PAGE_SIZE;
    }
  }

  return allRecords;
}
```

---

## 6. SCHEMA DO SUPABASE

### 6.1 Tabelas de Dados Brutos (Snapshots Diários)

```sql
-- Snapshot diário de contagens de leads
CREATE TABLE daily_lead_snapshot (
  id BIGSERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_leads INTEGER NOT NULL DEFAULT 0,
  leads_by_source JSONB NOT NULL DEFAULT '{}',
  -- Ex: {"Meta ADS": 12, "Google AdWords": 5, "LP - D": 8}
  leads_by_interest JSONB NOT NULL DEFAULT '{}',
  leads_by_unit JSONB NOT NULL DEFAULT '{}',
  leads_by_status JSONB NOT NULL DEFAULT '{}',
  leads_by_country JSONB NOT NULL DEFAULT '{}',
  avg_cost_per_conversion NUMERIC(10,2),
  converted_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(snapshot_date)
);

-- Snapshot diário de deals
CREATE TABLE daily_deal_snapshot (
  id BIGSERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  -- Deals ganhos
  won_count INTEGER NOT NULL DEFAULT 0,
  won_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  won_entrada NUMERIC(12,2) NOT NULL DEFAULT 0,
  won_by_interest JSONB NOT NULL DEFAULT '{}',
  won_by_unit JSONB NOT NULL DEFAULT '{}',
  won_by_doctor JSONB NOT NULL DEFAULT '{}',
  won_by_owner JSONB NOT NULL DEFAULT '{}',
  won_by_source JSONB NOT NULL DEFAULT '{}',
  -- Deals perdidos
  lost_count INTEGER NOT NULL DEFAULT 0,
  lost_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  lost_reasons JSONB NOT NULL DEFAULT '{}',
  -- Pipeline
  pipeline_open_count INTEGER NOT NULL DEFAULT 0,
  pipeline_open_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  pipeline_weighted NUMERIC(12,2) NOT NULL DEFAULT 0,
  pipeline_by_stage JSONB NOT NULL DEFAULT '{}',
  -- Ciclo de vendas
  avg_sales_cycle_days NUMERIC(6,1),
  -- Inadimplência
  total_saldo_restante NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(snapshot_date)
);

-- Snapshot diário de show rate
CREATE TABLE daily_showrate_snapshot (
  id BIGSERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  videos_agendados INTEGER NOT NULL DEFAULT 0,
  videos_confirmados INTEGER NOT NULL DEFAULT 0,
  nao_compareceu INTEGER NOT NULL DEFAULT 0,
  show_rate NUMERIC(5,2),  -- percentual
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(snapshot_date)
);

-- Snapshot de conversão por vendedor
CREATE TABLE daily_conversion_snapshot (
  id BIGSERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  owner_name VARCHAR(255) NOT NULL,
  total_deals INTEGER NOT NULL DEFAULT 0,
  won_deals INTEGER NOT NULL DEFAULT 0,
  lost_deals INTEGER NOT NULL DEFAULT 0,
  won_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  conversion_rate NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(snapshot_date, owner_name)
);

-- Log de alertas
CREATE TABLE alert_log (
  id BIGSERIAL PRIMARY KEY,
  alert_type VARCHAR(50) NOT NULL, -- 'lead_virgin', 'video_today', 'contract_pending', 'no_entrada'
  record_id VARCHAR(50),
  record_name VARCHAR(255),
  details JSONB,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Métricas calculadas (secundárias)
CREATE TABLE computed_metrics (
  id BIGSERIAL PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC(14,4),
  metric_metadata JSONB, -- dados adicionais (ex: breakdown por canal)
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(metric_name, period_start, period_end)
);
```

### 6.2 Índices

```sql
CREATE INDEX idx_lead_snap_date ON daily_lead_snapshot(snapshot_date DESC);
CREATE INDEX idx_deal_snap_date ON daily_deal_snapshot(snapshot_date DESC);
CREATE INDEX idx_showrate_date ON daily_showrate_snapshot(snapshot_date DESC);
CREATE INDEX idx_conversion_date ON daily_conversion_snapshot(snapshot_date DESC);
CREATE INDEX idx_alert_type ON alert_log(alert_type, resolved);
CREATE INDEX idx_computed_metric ON computed_metrics(metric_name, period_start DESC);
```

---

## 7. QUERIES SUPABASE (MÓDULO 2 — MÉTRICAS SECUNDÁRIAS)

```sql
-- S1: Média diária de leads (últimos 30 dias)
SELECT AVG(total_leads)::NUMERIC(10,2) AS avg_daily_leads
FROM daily_lead_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '30 days';

-- S2: Mediana de leads diários (últimos 30 dias)
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_leads) AS median_daily_leads
FROM daily_lead_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '30 days';

-- S3: Moda de leads diários (últimos 30 dias)
SELECT total_leads AS mode_daily_leads, COUNT(*) AS frequency
FROM daily_lead_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY total_leads
ORDER BY frequency DESC
LIMIT 1;

-- S4: Desvio padrão de leads diários (últimos 30 dias)
SELECT STDDEV(total_leads)::NUMERIC(10,2) AS stddev_daily_leads
FROM daily_lead_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '30 days';

-- S5: Dados para regressão linear (leads ao longo do tempo)
-- O backend calcula a regressão; esta query fornece os pontos
SELECT snapshot_date,
       EXTRACT(EPOCH FROM snapshot_date - MIN(snapshot_date) OVER())::INTEGER / 86400 AS day_index,
       total_leads
FROM daily_lead_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY snapshot_date ASC;

-- S6: Regressão linear nativa do PostgreSQL (coeficientes)
SELECT
  REGR_SLOPE(total_leads, day_index) AS slope,
  REGR_INTERCEPT(total_leads, day_index) AS intercept,
  REGR_R2(total_leads, day_index) AS r_squared
FROM (
  SELECT total_leads,
         EXTRACT(EPOCH FROM snapshot_date - MIN(snapshot_date) OVER())::INTEGER / 86400 AS day_index
  FROM daily_lead_snapshot
  WHERE snapshot_date >= CURRENT_DATE - INTERVAL '90 days'
) AS regression_data;

-- S7: Variação Month-over-Month de receita
WITH monthly AS (
  SELECT DATE_TRUNC('month', snapshot_date) AS month,
         SUM(won_amount) AS revenue
  FROM daily_deal_snapshot
  GROUP BY DATE_TRUNC('month', snapshot_date)
  ORDER BY month DESC
  LIMIT 2
)
SELECT
  (SELECT revenue FROM monthly ORDER BY month DESC LIMIT 1) AS current_month,
  (SELECT revenue FROM monthly ORDER BY month DESC OFFSET 1 LIMIT 1) AS previous_month,
  CASE
    WHEN (SELECT revenue FROM monthly ORDER BY month DESC OFFSET 1 LIMIT 1) > 0
    THEN (
      ((SELECT revenue FROM monthly ORDER BY month DESC LIMIT 1) -
       (SELECT revenue FROM monthly ORDER BY month DESC OFFSET 1 LIMIT 1)) /
      (SELECT revenue FROM monthly ORDER BY month DESC OFFSET 1 LIMIT 1) * 100
    )::NUMERIC(6,2)
    ELSE NULL
  END AS mom_variation_pct;

-- S8: Evolução da taxa de conversão (semanal)
SELECT DATE_TRUNC('week', snapshot_date) AS week,
       SUM(won_deals)::NUMERIC / NULLIF(SUM(total_deals), 0) * 100 AS weekly_conversion_rate
FROM daily_conversion_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', snapshot_date)
ORDER BY week DESC;

-- S9: Evolução de leads por canal (semanal, para detectar tendências)
SELECT snapshot_date, leads_by_source
FROM daily_lead_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY snapshot_date ASC;
-- NOTA: o backend deve extrair do JSONB e montar as séries por canal

-- S10: Sazonalidade — leads por dia da semana
SELECT EXTRACT(DOW FROM snapshot_date) AS day_of_week,
       AVG(total_leads)::NUMERIC(10,2) AS avg_leads,
       STDDEV(total_leads)::NUMERIC(10,2) AS stddev_leads
FROM daily_lead_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY EXTRACT(DOW FROM snapshot_date)
ORDER BY day_of_week;

-- S11: Média móvel de receita (7 dias)
SELECT snapshot_date, won_amount,
       AVG(won_amount) OVER (ORDER BY snapshot_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d
FROM daily_deal_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '60 days'
ORDER BY snapshot_date ASC;

-- S12: Evolução do show rate
SELECT snapshot_date, show_rate
FROM daily_showrate_snapshot
WHERE snapshot_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY snapshot_date ASC;
```

---

## 8. PLANO DE IMPLEMENTAÇÃO

### Fase 1 — Infraestrutura (Semana 1)

**1.1 Setup do Projeto**
```
dss-areluna/
├── src/
│   ├── config/
│   │   ├── supabase.ts          # Cliente Supabase
│   │   ├── zoho.ts              # Cliente Zoho (OAuth + COQL)
│   │   └── env.ts               # Variáveis de ambiente
│   ├── extractors/
│   │   ├── leadExtractor.ts     # Executa queries Q-L1 a Q-L9
│   │   └── dealExtractor.ts     # Executa queries Q-D1 a Q-D10
│   ├── processors/
│   │   ├── snapshotBuilder.ts   # Agrega dados brutos em snapshots
│   │   ├── alertChecker.ts      # Verifica condições de alerta
│   │   └── metricsComputer.ts   # Calcula métricas secundárias (S1-S12)
│   ├── api/
│   │   ├── routes/
│   │   │   ├── dashboard.ts     # Endpoints para cada dashboard
│   │   │   ├── alerts.ts        # Endpoints de alertas
│   │   │   └── metrics.ts       # Endpoints de métricas calculadas
│   │   └── server.ts            # Express server
│   ├── scheduler/
│   │   └── jobs.ts              # node-cron scheduling
│   └── utils/
│       ├── coqlPaginator.ts     # Função de paginação COQL
│       ├── dateHelpers.ts       # Funções de datas dinâmicas
│       └── aggregator.ts        # Funções de agregação em memória
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── dashboard.css
│   ├── js/
│   │   ├── app.js               # Inicialização + fetch de dados
│   │   ├── charts/
│   │   │   ├── executive.js     # Gráficos do dashboard executivo
│   │   │   ├── commercial.js    # Gráficos do dashboard comercial
│   │   │   ├── marketing.js     # Gráficos do dashboard marketing
│   │   │   └── operational.js   # Gráficos do dashboard operacional
│   │   ├── alerts.js            # Componente de alertas
│   │   └── utils.js             # Formatação de números, datas, etc.
│   └── lib/
│       └── chart.min.js         # Chart.js
├── .env
├── package.json
└── tsconfig.json
```

**1.2 Variáveis de Ambiente (.env)**
```env
# Zoho CRM
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_API_DOMAIN=https://www.zohoapis.eu
ZOHO_ACCOUNTS_DOMAIN=https://accounts.zoho.eu

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# App
PORT=3000
NODE_ENV=production
TIMEZONE=Europe/Lisbon
```

**1.3 Dependências**
```json
{
  "dependencies": {
    "express": "^4.18",
    "cors": "^2.8",
    "node-cron": "^3.0",
    "axios": "^1.6",
    "@supabase/supabase-js": "^2.39",
    "dayjs": "^1.11",
    "dotenv": "^16.3"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "ts-node": "^10.9",
    "@types/node": "^20",
    "@types/express": "^4",
    "@types/cors": "^2",
    "nodemon": "^3.0"
  }
}
```

### Fase 2 — Módulo de Extração (Semana 1-2)

**Implementar:**
1. Cliente Zoho com gestão automática de OAuth (refresh token → access token)
2. Função `coqlQuery(query: string)` com paginação automática
3. `leadExtractor.ts` — executa Q-L1 a Q-L9, retorna arrays tipados
4. `dealExtractor.ts` — executa Q-D1 a Q-D10, retorna arrays tipados
5. `snapshotBuilder.ts` — recebe dados brutos e produz os snapshots para inserir no Supabase

**Scheduler (node-cron):**
```
- A cada 15 min: Alertas (A1-A4)
- Diariamente às 23:55 (Europe/Lisbon): Snapshot completo (Leads + Deals + ShowRate + Conversão)
- Semanalmente (domingo 23:59): Cálculo de métricas secundárias
```

### Fase 3 — Módulo de Processamento (Semana 2-3)

**Implementar:**
1. `metricsComputer.ts` — executa queries S1 a S12 no Supabase
2. Armazena resultados na tabela `computed_metrics`
3. Função de regressão linear (pode usar a nativa do PostgreSQL ou implementar em JS para flexibilidade)
4. `alertChecker.ts` — verifica condições de alerta e insere na tabela `alert_log`

### Fase 4 — API REST (Semana 3)

**Endpoints:**

```
GET /api/dashboard/executive
  → Retorna: E1-E6 (primárias em tempo real) + E7-E9 (secundárias do Supabase)

GET /api/dashboard/commercial
  → Retorna: C1-C7, C10 (primárias) + C8, C9, C11 (secundárias)

GET /api/dashboard/marketing
  → Retorna: M1-M8, M14 (primárias) + M9-M13 (secundárias)

GET /api/dashboard/operational
  → Retorna: O1-O4 (todas primárias)

GET /api/alerts/active
  → Retorna: Alertas A1-A4 ativos

GET /api/metrics/:metricName
  → Retorna: Série temporal de uma métrica específica

GET /api/metrics/stats
  → Retorna: Média, mediana, moda, desvio padrão de leads
```

**Estratégia de cache:**
- Métricas primárias: cache de 5 minutos (Redis ou in-memory)
- Métricas secundárias: cache de 1 hora (já estão no Supabase)
- Alertas: sem cache (tempo real)

### Fase 5 — Dashboard Frontend (Semana 3-4)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  [🔴 ALERTAS]  Leads virgens: 3 | Vídeos hoje: 5      │
│                Contratos pend.: 2 | Sem entrada: 1      │
├─────────────────────────────────────────────────────────┤
│  [TAB: Executivo | Comercial | Marketing | Operacional] │
├────────────────────────┬────────────────────────────────┤
│  KPI Cards (números)   │  Gráfico Principal             │
│  ┌──────┐ ┌──────┐    │  (Chart.js)                    │
│  │ €125K│ │ €45K │    │                                │
│  │Receita│ │Entrada│   │  [Line/Bar/Doughnut]           │
│  └──────┘ └──────┘    │                                │
│  ┌──────┐ ┌──────┐    │                                │
│  │  85  │ │ 68%  │    │                                │
│  │Deals │ │Conv. │    │                                │
│  └──────┘ └──────┘    │                                │
├────────────────────────┼────────────────────────────────┤
│  Gráfico Secundário 1  │  Gráfico Secundário 2          │
│  (ex: Leads por Canal) │  (ex: Funil de Vendas)         │
├────────────────────────┴────────────────────────────────┤
│  Tabela de Detalhes (opcional)                          │
└─────────────────────────────────────────────────────────┘
```

**Gráficos Chart.js por Dashboard:**

**Executivo:**
- Line Chart: Receita diária / mensal (com média móvel)
- Doughnut: Receita por Unidade
- Bar: Receita por Procedimento (Interesses)
- KPI Cards: Receita total, Entrada real, Ticket médio, Forecast, Saldo aberto

**Comercial:**
- Horizontal Bar: Conversão por Vendedor
- Funnel (stacked bar): Deals por Stage
- Line: Evolução da taxa de conversão (semanal)
- KPI Cards: Conversão global, Show rate, Ciclo médio, Deals abertos

**Marketing:**
- Bar: Leads por Canal (Lead_Source)
- Line: Tendência de leads diários (com regressão linear sobreposta)
- Doughnut: Leads por Interesse
- Radar: Qualidade por Canal (% qualificados)
- KPI Cards: Leads hoje, semana, mês, CPL médio, desvio padrão

**Operacional:**
- Horizontal Bar: Vendas por Doutor (€)
- Bar: Quantidade de deals por Doutor
- Doughnut: Distribuição por Produto

**Auto-refresh:** A cada 5 minutos o frontend faz polling da API.

---

## 9. CONSIDERAÇÕES TÉCNICAS

### 9.1 Autenticação Zoho

A app usa OAuth 2.0 com refresh token. O fluxo:
1. O refresh token gera um access token (válido 1 hora)
2. O backend armazena o access token em memória com timestamp
3. Antes de cada request, verifica se faltam <5 min para expirar → renova
4. Endpoint COQL: `POST https://www.zohoapis.eu/crm/v7/coql`
5. Header: `Authorization: Zoho-oauthtoken {access_token}`
6. Body: `{ "select_query": "SELECT ... FROM ..." }`

### 9.2 Limitações COQL a Ter em Conta

1. **Máximo 200 registos por query** — implementar paginação automática
2. **Sem funções de agregação** — toda a contagem, soma, média é feita no backend
3. **Sem JOINs** — dados de Leads e Deals são queries separadas
4. **Campos de lookup retornam objeto** — `Owner` retorna `{name, id}`, não string
5. **Campos de fórmula podem ser null** — validar antes de somar
6. **Rate limit Zoho API** — 10K requests/dia (Enterprise). Implementar backoff.

### 9.3 Tratamento de Dados

1. **Deduplicação de stages:** Existem duplicados no CRM (ex: "Procedimento Fechado" vs "Procedimento Fechado."). Tratar como equivalentes no backend.
2. **Pipeline duplo:** Deals passam do pipeline SDR para VENDAS. A conversão SDR mede-se pela passagem entre pipelines.
3. **Owner como objeto:** Ao agrupar por Owner, usar `Owner.name` como chave.
4. **Campos monetários:** Amount, Valor_de_Entrada, Saldo_Restante são currency — tratar como float, arredondar a 2 casas.
5. **Timezone:** Todos os timestamps devem ser normalizados para Europe/Lisbon.

### 9.4 Resiliência

1. Se o Zoho estiver indisponível, o scheduler logga o erro e tenta novamente no próximo ciclo
2. Os snapshots no Supabase usam UPSERT (ON CONFLICT) para evitar duplicados
3. O dashboard mostra "Última atualização: HH:MM" para o utilizador saber a frescura dos dados

---

## 10. RESUMO DE ENTREGÁVEIS

| Entregável | Descrição |
|-----------|-----------|
| Backend Node.js | Servidor Express com extractors, processors, scheduler e API REST |
| Schema Supabase | Todas as tabelas, índices e migrations |
| Frontend Dashboard | 4 dashboards + painel de alertas, usando Chart.js |
| Documentação | README com setup, variáveis de ambiente e como executar |
| Ficheiro .env.example | Template de variáveis de ambiente |

---

## 11. PRIORIDADES DE IMPLEMENTAÇÃO

1. **Sprint 1 (MVP):** Extração de leads + deals → Snapshot diário → Dashboard Marketing (M1-M8) + Alertas (A1-A4)
2. **Sprint 2:** Dashboard Executivo (E1-E6) + Comercial (C1-C7) + Operacional (O1-O4)
3. **Sprint 3:** Métricas secundárias (S1-S12) + Gráficos de tendência + Regressão linear
4. **Sprint 4:** Polish, auto-refresh, responsividade, otimização de queries

---

*Prompt gerado com base na estrutura real do Zoho CRM do Instituto AreLuna, validado contra os módulos Leads (130 campos) e Deals (103 campos) via API.*

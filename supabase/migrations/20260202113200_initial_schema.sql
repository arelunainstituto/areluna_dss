-- Snapshot diário de contagens de leads
CREATE TABLE daily_lead_snapshot (
  id BIGSERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_leads INTEGER NOT NULL DEFAULT 0,
  leads_by_source JSONB NOT NULL DEFAULT '{}',
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

-- Indices
CREATE INDEX idx_lead_snap_date ON daily_lead_snapshot(snapshot_date DESC);
CREATE INDEX idx_deal_snap_date ON daily_deal_snapshot(snapshot_date DESC);
CREATE INDEX idx_showrate_date ON daily_showrate_snapshot(snapshot_date DESC);
CREATE INDEX idx_conversion_date ON daily_conversion_snapshot(snapshot_date DESC);
CREATE INDEX idx_alert_type ON alert_log(alert_type, resolved);
CREATE INDEX idx_computed_metric ON computed_metrics(metric_name, period_start DESC);

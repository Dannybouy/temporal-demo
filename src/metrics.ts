import { Registry, Counter, Histogram } from 'prom-client';
import express from 'express';

export const register = new Registry();

export const workflowExecutions = new Counter({
  name: 'temporal_workflow_executions_total',
  help: 'Total number of workflow executions',
  labelNames: ['status'],
  registers: [register],
});

export const workflowRetries = new Counter({
  name: 'temporal_workflow_retries_total',
  help: 'Total number of activity retries',
  labelNames: ['activity'],
  registers: [register],
});

export const workflowDuration = new Histogram({
  name: 'temporal_workflow_duration_seconds',
  help: 'Workflow execution duration in seconds',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

const app = express();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.METRICS_PORT || 9090;

app.listen(PORT, () => {
  console.log(`Metrics server running on http://localhost:${PORT}/metrics`);
});
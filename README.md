# Temporal Workflow Assessment - Data Processing Pipeline

A demonstration of a robust data processing workflow using Temporal with automatic retries, Prometheus monitoring, and Kubernetes deployment capabilities.

## Project Overview

This project implements a three-step data processing workflow:
1. **Fetch Data**: Retrieves data from JSONPlaceholder API
2. **Transform Data**: Processes and enriches the data
3. **Save Data**: Stores the result in memory

**Key Features**:
- ✅ Automatic retry on failure (demonstrates failure on first attempt)
- ✅ Prometheus metrics for observability
- ✅ Kubernetes-ready deployment manifests
- ✅ Clean separation of concerns

---

## Architecture


---

## Quick Start

### Prerequisites
- Node.js 18+
- Temporal CLI installed
- Docker (optional, for K8s deployment)

### Installation
```bash
# Clone repository
git clone <your-repo>
cd temporal-workflow-assessment

# Install dependencies
npm install

# Start Temporal server
temporal server start-dev
```

### Running Locally
```bash
# Terminal 1: Start worker (includes metrics server)
npm run worker

# Terminal 2: Execute workflow
npm run client
```

### View Results

- **Temporal UI**: http://localhost:8233
- **Prometheus Metrics**: http://localhost:9090/metrics

---

## 📊 Demo Results

### Workflow Execution

[INSERT SCREENSHOT: Temporal UI showing workflow with retry]

### Retry Behavior

The workflow demonstrates automatic retry:
1. First attempt: API call fails (simulated)
2. Temporal automatically retries
3. Second attempt: Success

[INSERT SCREENSHOT: Worker logs showing retry]

### Metrics
```bash
$ curl http://localhost:9090/metrics

# HELP temporal_workflow_executions_total Total number of workflow executions
# TYPE temporal_workflow_executions_total counter
temporal_workflow_executions_total{status="success"} 5
temporal_workflow_executions_total{status="failed"} 0

# HELP temporal_workflow_retries_total Total number of activity retries
# TYPE temporal_workflow_retries_total counter
temporal_workflow_retries_total{activity="fetchData"} 5

# HELP temporal_workflow_duration_seconds Workflow execution duration
# TYPE temporal_workflow_duration_seconds histogram
temporal_workflow_duration_seconds_bucket{le="0.5"} 0
temporal_workflow_duration_seconds_bucket{le="1"} 3
temporal_workflow_duration_seconds_bucket{le="2"} 5
```

[INSERT SCREENSHOT: Metrics output]

---

## 🐳 Kubernetes Deployment

### Prerequisites
- Docker Desktop with Kubernetes enabled
- kubectl installed

### Deploy
```bash
# Build Docker image
docker build -t temporal-worker:latest .

# Apply Kubernetes manifests
kubectl apply -f kubernetes/

# Verify deployment
kubectl get pods -n temporal-demo
kubectl get services -n temporal-demo
```

### Access Metrics in K8s
```bash
# Port forward to metrics service
kubectl port-forward -n temporal-demo svc/temporal-worker-metrics 9090:9090

# Access metrics
curl http://localhost:9090/metrics
```

---

## 📁 Project Structure
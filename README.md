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
- ✅ Type Safety: Full TypeScript implementation

---

## Architecture Design
![Architectural Design](/public/Temporal_Arch_design.png "Temporal Arch Design")

## Quick Start

### Prerequisites
- Node.js 18+
- Temporal CLI installed
- Docker: docker build
- Minikube: for K8s deployment
- kubectl: Command-line tool

### Installation Commands
```bash
# Windows - Use WSL2 or download from GitHub releases
# https://github.com/temporalio/cli/releases

# Verify installations
temporal --version
node --version
npm --version
```
#### Step 1: Clone and setup
```bash
# Clone repository
git clone https://github.com/Dannybouy/temporal-demo
cd temporal-demo

# Install dependencies
npm install

# Start Temporal server
npm run build
```
#### Step 2: Start Temporal Server
```bash
# In Terminal 1 - Start Temporal
temporal server start-dev

# This starts:
# - Temporal Server on localhost:7233
# - Web UI on http://localhost:8233

# Wait for this message: Temporal server is running
```

#### Step 3: Start Worker and Execute Workflow
```bash
# Terminal 1: Start worker (includes metrics server)
npm run start

# Terminal 2: Execute workflow
npm run workflow
```


#### Step 4: View Results

1. **Temporal UI**: http://localhost:8233
    - Click "Workflows tab"
    - Find your workflow by ID
    - View execution history and retry events

2. **Prometheus Metrics**: http://localhost:9090/metrics

3. Health Check: http://localhost:9090/health
    - Verify worker is healthy
---

## 📊 Demo Results

### Workflow Execution

![workflow image 1](/public/workflow-1.png "Workflow image")

### Retry Behavior

The workflow demonstrates automatic retry:
1. First attempt: API call fails (simulated)
2. Temporal automatically retries
3. Second attempt: Success

#### Retries Images
![retry image 1](/public/retry-1.png "Retry image failure")
![retry image 2](/public/retry-2.png "Retry image Success")

### Metrics
```bash
$ curl http://localhost:9090/metrics

# HELP temporal_workflow_executions_total Total number of workflow executions
# TYPE temporal_workflow_executions_total counter

# HELP temporal_workflow_retries_total Total number of activity retries
# TYPE temporal_workflow_retries_total counter
temporal_workflow_retries_total{activity="fetchData"} 1

# HELP temporal_workflow_duration_seconds Workflow execution duration
# TYPE temporal_workflow_duration_seconds histogram
temporal_workflow_duration_seconds_bucket{le="0.5"} 0
temporal_workflow_duration_seconds_bucket{le="1"} 0
temporal_workflow_duration_seconds_bucket{le="2"} 0
```

![metrics image 1](/public/metrics.png "Metrics image")

---

## Kubernetes Deployment (Minikube)

### Prerequisites
- Minikube installed and running
- kubectl configured

### Deploy
```bash
# Start Minikube
minikube start

# Build image in Minikube
eval $(minikube docker-env)
docker build -t temporal-worker:latest .

# Deploy
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/deployment-minikube.yaml
kubectl apply -f kubernetes/service.yaml

# Check status
kubectl get pods -n temporal-demo

# Access metrics
kubectl port-forward -n temporal-demo svc/temporal-worker-metrics 9090:9090
# Then access: http://localhost:9090/metrics
```

### Cleanup
```bash
kubectl delete namespace temporal-demo
minikube stop
```
![Deployment image 1](/public/deployment.png "Deployment image")
---

## 📁 Project Structure

├── src/
│   ├── activities.ts      # Three activities: fetch, transform, save
│   ├── workflow.ts        # Workflow orchestration
│   ├── worker.ts          # Worker process
│   ├── client.ts          # Workflow starter
│   └── metrics.ts         # Prometheus metrics server
├── kubernetes/
│   ├── namespace.yaml     # K8s namespace
│   ├── deployment.yaml    # Worker deployment
│   └── service.yaml       # Metrics service
├── Dockerfile             # Container image
├── package.json
└── README.md

---

## 🔍 Key Implementation Details

### Retry Configuration
```typescript
const { fetchData, transformData, saveData } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});
```

### Simulated Failure
```typescript
export async function fetchData(): Promise<any[]> {
  attemptCount++;
  console.log(`Fetch attempt #${attemptCount}`);

  // Simulate failure on first attempt
  if (attemptCount % 2 === 1) {
    console.log('fetchData Simulating failure...');
    throw new Error('API temporarily unavailable (simulated failure)');
  }

  // Simulate successful data fetching
  console.log('fetchData Simulating success...');
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');

  return response.data;
}
```

### Metrics Tracked

- **temporal_workflow_executions_total**: Total workflows (labeled by status)
- **temporal_workflow_retries_total**: Total retries (labeled by activity)
- **temporal_workflow_duration_seconds**: Workflow duration histogram

---

## Testing

Run a complete test:
```bash
# Start worker in background
npm run start &

# Execute workflow 5 times
for i in {1..5}; do
  npm run workflow
  sleep 2
done

# Check metrics
curl http://localhost:9090/metrics | grep temporal
```

Expected output:
- 5 successful workflows
- 1 retries on fetchData activity

---

## What I Learned

- Temporal's approach to building durable workflows
- How to implement retry policies for fault tolerance
- Exposing application metrics with Prometheus
- Deploying stateful applications to Kubernetes
- Balancing between local development and production deployment

---

## Production Considerations

For production deployment, consider:
- External Temporal cluster (not dev server)
- Persistent storage for workflow history
- Multiple worker replicas for high availability
- Grafana dashboards for metric visualization
- Proper secrets management for API keys
- Resource limits and autoscaling policies

---

## 📚 References

- [Temporal Documentation](https://docs.temporal.io)
- [Temporal TypeScript SDK](https://docs.temporal.io/dev-guide/typescript)
- [Prometheus Client for Node.js](https://github.com/sideralis/prom-client)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)

---



## 👤 Author

- Name: Daniel Okpara   
- Email: danielokpara29@gmail.com
- Github: www.github.com/dannybouy
- LinkedIn: www.linkedin.com/in/daniel-okpara

---

**Assessment Submitted**: October 19, 2025
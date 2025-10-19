import { Client, Connection } from '@temporalio/client';
import { nanoid } from 'nanoid';
import { workflowDuration, workflowExecutions } from './metrics';
import { dataProcessingWorkflow } from './workflows';

async function run() {
  // Connect to the default Server location
  const connection = await Connection.connect({ address: 'localhost:7233' });

  const client = new Client({
    connection,
  });
  const workflowId = 'data-processing-workflow-' + nanoid();

  // Start a workflow execution
  console.log('Starting workflow with ID:', workflowId);
  const endTimer = workflowDuration.startTimer();

  try {
    const handle = await client.workflow.start(dataProcessingWorkflow, {
      taskQueue: 'data-processing-queue',
      workflowId,
    });

    console.log(`Workflow started: ${handle.workflowId}`);

    const result = await handle.result();

    endTimer();
    workflowExecutions.inc({ status: 'successful' });

    console.log('Workflow completed successfully with result:', result);
  } catch (error) {
    endTimer();
    workflowExecutions.inc({ status: 'failed' });
    console.error('Workflow failed:', error);
    throw error;
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

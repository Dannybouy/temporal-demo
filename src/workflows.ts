import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';
import { workflowDuration, workflowExecutions } from './metrics';

const { fetchData, transformData, saveData } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function dataProcessingWorkflow(): Promise<string> {
  workflowExecutions.inc({ status: 'started' }); // Optional: Track starts
  const endTimer = workflowDuration.startTimer();
  try {
    // Step 1: Fetch Data
    const data = await fetchData();
    console.log('Data fetched successfully:', data);

    // Step 2: Transform Data
    const transformed = await transformData(data);
    console.log('Data transformed successfully:', transformed);

    // Step 3: Save Data
    const result = await saveData(transformed);
    console.log('Workflow completed:', result);

    workflowExecutions.inc({ status: 'success' });
    endTimer();
    return result;
  } catch (error) {
    workflowExecutions.inc({ status: 'failed' });
    endTimer();
    throw error;
  }
}

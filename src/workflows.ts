import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { fetchData, transformData, saveData } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '1s',
    maximumInterval: '10s',
    backoffCoefficient: 2,
    maximumAttempts: 3,
  },
});

/** A workflow that simply calls an activity */
export async function dataProcessingWorkflow(): Promise<string> {
  console.log('Workflow started');
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

    return result;
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
}

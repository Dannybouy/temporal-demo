import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { fetchData, transformData, saveData } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '1 second',
    maximumInterval: '10 seconds',
    backoffCoefficient: 2,
    maximumAttempts: 3,
  },
});

/** A workflow that simply calls an activity */
export async function dataProcessingWorkflow(): Promise<string> {
  console.log('Workflow started');

  // Step 1: Fetch Data
  const rawData = await fetchData();
  console.log('Data fetched successfully:', rawData);

  // Step 2: Transform Data
  const transformedData = await transformData(rawData);
  console.log('Data transformed successfully:', transformedData);

  // Step 3: Save Data
  const savedResult = await saveData(transformedData);
  console.log('Workflow completed:', savedResult);

  return savedResult;
}

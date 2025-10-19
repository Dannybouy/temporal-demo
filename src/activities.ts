import axios from 'axios';

let attemptCount = 0;
const dataStore: any[] = [];

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

export async function transformData(data: any): Promise<any> {
  console.log('Transforming data...');

  return {
    ...data,
    processedAt: new Date().toISOString(),
    title: data.title?.toUpperCase(),
    metadata: {
      transformed: true,
      originaLength: data.title?.length || 0,
      workflowVersion: '1.0.0',
    },
  };
}

export async function saveData(data: any): Promise<string> {
  console.log('Saving data...');
  dataStore.push(data);

  const result = `Data saved successfully. Total records: ${dataStore.length}`;
  console.log(result);
  return result;
}

export function getStoredData() {
  return dataStore;
}

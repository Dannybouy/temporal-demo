import {
  ActivityExecuteInput,
  ActivityInterceptors,
  NativeConnection,
  Worker,
} from '@temporalio/worker';
import * as activities from './activities';
import './metrics';
import { workflowRetries } from './metrics';

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  });

  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'data-processing-queue',
    workflowsPath: require.resolve('./workflows'),
    activities,
    interceptors: {
      activity: [
        (): ActivityInterceptors => ({
          inbound: {
            async execute(input: ActivityExecuteInput, next) {
              try {
                return await next(input);
              } catch (error) {
                // Increment retry metric on failure
                workflowRetries.inc();
                throw error;
              }
            },
          },
        }),
      ],
    },
  });

  console.log('Worker started, listening on data-processing-queue');
  await worker.run();
}

run().catch((err) => {
  console.error('Worker error:', err);
  process.exit(1);
});

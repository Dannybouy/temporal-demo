import { ActivityExecuteInput, ActivityInterceptors, NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
import './metrics';
import { workflowRetries } from './metrics';

async function run() {
  const connection = await NativeConnection.connect({
    address: '192.168.49.2:7233',
  });

  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'data-processing-queue',
    workflowsPath: require.resolve('./workflows'),
    activities,
    interceptors: {
      activity: [
        (ctx): ActivityInterceptors => ({
          inbound: {
            async execute(input: ActivityExecuteInput, next): Promise<unknown> {
              try {
                return await next(input);
              } catch (error) {
                workflowRetries.inc({ activity: ctx.info.activityType });
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

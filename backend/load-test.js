import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/public/companies'; // Adjust if needed
const CONCURRENT_REQUESTS_LOW = 10;
const CONCURRENT_REQUESTS_HIGH = 100;

async function runLoadTest(concurrentRequests) {
    console.log(`Starting load test with ${concurrentRequests} concurrent requests...`);
    const startTime = Date.now();
    const promises = [];

    for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
            axios.get(BASE_URL)
                .then(() => ({ status: 'success' }))
                .catch(err => ({ status: 'failed', error: err.message }))
        );
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const successCount = results.filter(r => r.status === 'success').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    console.log(`Load test completed in ${duration}ms`);
    console.log(`Success: ${successCount}`);
    console.log(`Failure: ${failureCount}`);
    console.log(`Average time per request: ${duration / concurrentRequests}ms`);
    console.log('-----------------------------------');
}

async function main() {
    try {
        console.log('=== LOAD TEST START ===');
        await runLoadTest(CONCURRENT_REQUESTS_LOW);

        // Wait a bit before high load
        await new Promise(resolve => setTimeout(resolve, 2000));

        await runLoadTest(CONCURRENT_REQUESTS_HIGH);
        console.log('=== LOAD TEST END ===');
    } catch (error) {
        console.error('Load test failed:', error);
    }
}

main();

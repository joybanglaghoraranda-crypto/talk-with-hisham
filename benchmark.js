const { performance } = require('perf_hooks');

const NUM_POSTS = 30;
const COMMENTS_PER_POST = 1000;

// Mock data representing what comes over the wire
const oldWireData = [];
for (let i = 0; i < NUM_POSTS; i++) {
    for (let j = 0; j < COMMENTS_PER_POST; j++) {
        oldWireData.push({ post_id: `post_${i}` });
    }
}

const newWireData = [];
for (let i = 0; i < NUM_POSTS; i++) {
    newWireData.push({ post_id: `post_${i}`, comment_count: COMMENTS_PER_POST });
}

console.log(`--- BENCHMARK: 30 Posts, ${COMMENTS_PER_POST} Comments/Post ---`);

// Old way processing
const startOld = performance.now();
const oldCounts = {};
oldWireData.forEach(c => {
    oldCounts[c.post_id] = (oldCounts[c.post_id] || 0) + 1;
});
const endOld = performance.now();

// New way processing
const startNew = performance.now();
const newCounts = {};
newWireData.forEach(c => {
    newCounts[c.post_id] = Number(c.comment_count);
});
const endNew = performance.now();

const oldSize = JSON.stringify(oldWireData).length;
const newSize = JSON.stringify(newWireData).length;

console.log(`Old processing time: ${(endOld - startOld).toFixed(4)} ms`);
console.log(`New processing time: ${(endNew - startNew).toFixed(4)} ms`);
console.log(`Processing speedup: ${((endOld - startOld) / (endNew - startNew)).toFixed(2)}x`);

console.log(`Old payload size: ${oldSize} bytes`);
console.log(`New payload size: ${newSize} bytes`);
console.log(`Network payload reduction: ${((oldSize - newSize) / oldSize * 100).toFixed(2)}%`);

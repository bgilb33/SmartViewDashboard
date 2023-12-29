

// Function to subscribe to topics
function subscribeToTopics(topics) {
    const promises = [];
  
    for (let i = 0; i < topics.length; i++) {
      const promise = new Promise((resolve) => {
        client.subscribe([topics[i]], () => {
          console.log(`Subscribe to topic '${topics[i]}'`);
          resolve();
        });
      });
  
      promises.push(promise);
    }
  
    return Promise.all(promises);
}

module.exports = subscribeToTopics;

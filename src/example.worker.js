console.log('Worker script loaded');

self.onmessage = (event) => {
  console.log(event.data);

  setTimeout(() => {
    self.postMessage('pong');
  }, 3000);
};

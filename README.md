bitcoin-tx-graph-visualizer
===========================

Visualize bitcoin transactions using d3.js

Below graph is generated with data found in `/example/transaction.json`.

![Bitcoin transactions visualized](https://rawgithub.com/weilu/bitcoin-tx-graph-visualizer/master/example/transactions.svg)

See `example` for sample usage. To run the example:

```bash
git clone https://github.com/weilu/bitcoin-tx-graph-visualizer.git
cd bitcoin-tx-graph-visualizer

npm install
npm install -g browserify

cd example
browserify index.js > bundle.js
open index.html
```


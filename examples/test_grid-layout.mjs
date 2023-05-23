import { Container, Node } from '../src/layout/GridLayout/index.js'

const container = new Container({ // containerOptions
    width: 500,
    height: 500
  });
  [
    { width: 100, height: 100 },
    { width: 100, height: 100 }
  ].forEach(item => {
    const node = new Node(item); // nodeOptions
    container.appendChild(node);
  });
  container.calculateLayout();
  const result = container.getAllComputedLayout();
  console.log(JSON.stringify(result, null, 2))

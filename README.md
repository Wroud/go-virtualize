# go-virtualize
Virtualize big data for React

# Install
```sh
npm i go-virtualize
```
```sh
yarn add go-virtualize
```

# Usage

```js
import { Virtualize, VirtualizedComponentProps } from "go-virtualize";

function Row({ column, row, children, key }: VirtualizedComponentProps) {
  return (
    <div key={key} className="row">
      {children}
    </div>
  );
}

function Column({ column, row, key }: VirtualizedComponentProps) {
  return (
    <div key={key} className="column">
      {column}, {row}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Virtualize
        style={{ width: "100%", height: "100%", backgroundColor: "#ccc" }}
        rows={100000}
        columns={10000}
        row={Row}
        column={Column}
        avgHeight={30}
        avgWidth={200}
      />
    </div>
  );
}
```
[Live](https://codesandbox.io/s/hungry-fermi-42hvu)

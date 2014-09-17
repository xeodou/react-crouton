# React-Crouton

> A message component for reactjs

live demo coming soon

## Getting Started

Install via [npm](http://npmjs.org/grs)

```shell
   npm i react-crouton --save-dev
```

## Usage

```Javascript
var Crouton = require('react-crouton')

<Crouton
    buttons={this.state.crouton.buttons}
    onDismiss={this.state.crouton.onDismiss}
    hidden={this.state.crouton.hidden}
    timeout={this.state.crouton.timeout}
    autoMiss={this.state.crouton.autoMiss}
    message={this.state.crouton.message}
    type={this.state.crouton.type} />

```

### Event
* `error` If some thing will emit an error event.
* `size` If get the right package info will emit a size event describe the size of the package.


## License

MIT

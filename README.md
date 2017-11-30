# react-disposable-modal
React-disposable-modal is a reactive API for building modal components in React.

[![npm version](https://img.shields.io/npm/v/react-disposable-modal.svg?style=flat-square)](https://www.npmjs.org/package/react-disposable-modal)

## Motivation
You want to build a modal in React, but don't want that modal to be
inserted in the DOM immediately where the Modal is rendered, instead you
want it to be appended to `document.body`.

Modals have are inherently an asyncronous ui component. A modal is
displayed, at some point in the future an action is taken from within
the modal, and then it is closed. React-disposable-modal provides a
reactive API for handling that asyncronous behavior.

## Setup
yarn add react-disposable-modal

## Usage

There are two ways to use react-dispoable-modal: an imperative and
declarative API:

### 1. Imperative Usage

`createCancelableModal(ModalComponent, props)` - Takes two parameters, a
custom modal component and optional parameters to pass to the modal.

`ModalComponent` will be rendered with three extra props:
`onNext` - Use to pass data to the subscription that invoked the modal. Can be called multiple times.
`onError` - Use to pass an error to the subscription that invoked the modal.
`onCompleted` - Use to close the modal.

#### Example:

```js
import { createCancelableModal } from "react-disposable-modal";
import React from "react";

class Modal extends React.Component {
  render() {
    return (
      <div>
        <div className="screen" />
        <div className="modal">
          <h1>My modal for {this.props.name}</h1>
          <button onClick={this.props.onCompleted}>Cancel</button>
          <button
            onClick={() => (
              this.props.onNext("I did it!"), this.props.onCompleted()
            )}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.showModal}>Show Modal</button>
      </div>
    );
  }
  showModal() {
    const subscription = createCancelableModal(Modal, {
      name: "you",
    }).subscribe(data => {
      data === "I did it!";
    });

    subscription.dispose(); // force the modal closed
  }
}
```

### 2. Declarative Usage
Anything put inside the `Modal` component will be appended to `document.body`.

#### Example:

```js
import { Modal } from "react-disposable-modal";
import React from "react";

class App extends React.Component {
  state = { showModal: false };

  render() {
    return (
      <div>
        <button onClick={() => this.setState({ showModal: true })}>
          Show Modal
        </button>
        {this.showModal && (
          <Modal>
            <div>
              <div className="screen" />
              <div className="modal">
                <h1>My modal for you</h1>
                <button onClick={() => this.setState({ showModal: false })}>
                  Cancel
                </button>
                <button onClick={() => this.setState({ showModal: false })}>
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
```

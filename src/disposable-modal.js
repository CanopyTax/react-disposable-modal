import React from "react";
import ReactDOM from "react-dom";
import Cancelable from "react-disposable-decorator";
import mountComponent from "disposable-component";

@Cancelable
class _Modal extends React.Component {
  componentDidMount() {
    if(!ReactDOM.createPortal) {
      //only <React16 needs to do this
      const children = this.props.children;
  
      this.props.cancelWhenUnmounted(
        createCancelableModal(function Portal() {
          return children;
        }, this.props).subscribe(() => {})
      );
    }
  }

  render() {
    if(!ReactDOM.createPortal) return null; // for <React16
    const el = document.createElement('div')
    document.body.appendChild(el)
    return ReactDOM.createPortal(this.props.children, el)
  }
}

export const Modal = Cancelable(_Modal);

export function createCancelableModal(El, props = {}) {
  let el;

  return mountComponent(
    (onNext, onCompleted, onError) => {
      el = document.createElement("div");
      document.body.appendChild(el);

      const renderer = ReactDOM.createPortal || ReactDOM.render
      renderer(
        <El
          {...props}
          onCompleted={onCompleted}
          onNext={onNext}
          onError={onError}
        />,
        el
      );
    },
    () => {
      ReactDOM.unmountComponentAtNode(el);
      el.parentNode.removeChild(el);
    }
  );
}

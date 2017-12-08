import React from "react";
import ReactDOM from "react-dom";
import Cancelable from "react-disposable-decorator";
import mountComponent from "disposable-component";

// stateless functional components were not working correctly, so I had to make a very thin component to get state/prop changes to propagate correctly to children components 
class _Portal extends React.Component {
  render() {
    return (
      <span>
        {this.props.children}
      </span>
    )
  }
}

class _Modal extends React.Component {
  componentDidMount() {
    // renderPortal() if < React16 for inital render
    if(!ReactDOM.createPortal) this.renderPortal()
  }

  componentDidUpdate() {
    // renderPortal() if < React16 so that state/prop changes are reflected in the DOM    
    if(!ReactDOM.createPortal) this.renderPortal()
  }

  renderPortal() {
    if(!this.parentContainer) {
      // we need to keep a reference to the parent DOM node for future times when this function is called
      this.parentContainer = document.createElement("div");
      document.body.appendChild(this.parentContainer);
    }

    this.props.cancelWhenUnmounted(
      createCancelableModal(_Portal, this.props, this.parentContainer).subscribe(() => {})
    );
  }

  render() {
    if(!ReactDOM.createPortal) return null;
    
    if(!this.parentContainer) {
      // we need to keep a reference to the parent DOM node for future times when this function is called      
      this.parentContainer = document.createElement("div")
      document.body.appendChild(this.parentContainer)
    }
    return ReactDOM.createPortal(this.props.children, this.parentContainer)
  }
}

export const Modal = Cancelable(_Modal);

export function createCancelableModal(El, props = {}, parent = null) {
  return mountComponent(
    (onNext, onCompleted, onError) => {
      if(!parent) {
        parent = document.createElement("div");
        document.body.appendChild(parent);
      }
      ReactDOM.render(
        <El
          {...props}
          onCompleted={onCompleted}
          onNext={onNext}
          onError={onError}
        />,
        parent
      );
    },
    () => {
      ReactDOM.unmountComponentAtNode(parent);

      // React15 calls this multiple times, so while it's safe to do the above function, we have to check parent.parentNode or it crashes
      if(parent.parentNode) parent.parentNode.removeChild(parent);
    }
  );
}
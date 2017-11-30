import React from 'react';
import ReactDOM from 'react-dom';
import Cancelable from 'react-disposable-decorator';
import mountComponent from 'disposable-component';

class _Modal extends React.Component {
  componentDidMount() {
    const children = this.props.children;

    this.cancelWhenUnmounted(createCancelableModal(function Portal() {
      return children;
    }, this.props));
  }

  render() {
    return null;
  }
}

export const Modal = Cancelable(_Modal);

export function createCancelableModal(El, props = {}) {
  let el;

  return mountComponent((onNext, onCompleted, onError) => {
		el = document.createElement("div");
		document.body.appendChild(el);

		ReactDOM.render(
			<El {...props} close={onCompleted} onNext={onNext} />,
			el
		);
  }, () => {
		ReactDOM.unmountComponentAtNode(el);
		el.parentNode.removeChild(el);
  })
}

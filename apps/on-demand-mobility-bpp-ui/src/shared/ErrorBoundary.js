import React from "react";
import { ErrorBlocks } from "./constant";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorBlock: this.getRandomBlock(ErrorBlocks),
    });
    // You can also log error messages to an error reporting service here
  }

  getRandomBlock = (ErrorBlocks) => {
    let number = Math.random() * (ErrorBlocks.length - 1);
    return ErrorBlocks[Math.round(number)];
  };

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="row justify-content-center max-vh-100">
              <div className="col-sm-5">
                <img
                  src={this.state.errorBlock.ImgUrl}
                  className="w-100"
                  alt=""
                />
              </div>
              <div className="col-sm-5 d-flex align-items-center">
                <div className="text-center text-lg-start">
                  <h1 className="mb-3">{this.state.errorBlock.Title}</h1>
                  <h5 className="mb-4">{this.state.errorBlock.SubTitle}</h5>
                  <p className="mb-1">in the meantime, you can...</p>
                  <p>
                    If you need immediate help from our team! please mail us.
                  </p>
                  <h6 className="mb-4">Thanks for your patience!</h6>
                  <a href="/" className="btn btn-primary">
                    Take me home
                  </a>
                  <details
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                  >
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;

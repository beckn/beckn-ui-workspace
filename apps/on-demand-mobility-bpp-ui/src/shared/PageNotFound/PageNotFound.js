import { useState } from "react";
import { ErrorBlocks404 } from "../constant";

const PageNotFound = (props) => {
  const getRandomBlock = (ErrorBlocks404) => {
    let number = Math.random() * (ErrorBlocks404.length - 1);
    return ErrorBlocks404[Math.round(number)];
  };

  const [errorBlock] = useState(getRandomBlock(ErrorBlocks404));

  return (
    <div className="error-boundary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-5">
            <img src={errorBlock.ImgUrl} className="w-100" alt="" />
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <div>
              <h1 className="mb-3">{errorBlock.Title}</h1>
              <h5 className="mb-4">{errorBlock.SubTitle}</h5>
              <h6 className="mb-4">Thanks for your patience!</h6>
              <a href="/" className="btn btn-primary">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageNotFoundPropTypes = {
  // always use prop types!
};

PageNotFound.propTypes = PageNotFoundPropTypes;

export default PageNotFound;

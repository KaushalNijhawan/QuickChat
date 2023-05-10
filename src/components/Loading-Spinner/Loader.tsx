import React from 'react';
import { Spinner } from 'react-bootstrap';
import "./Loader.css";

interface FullPageLoaderProps {
  show: boolean;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ show  }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="full-page-loader">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default FullPageLoader;
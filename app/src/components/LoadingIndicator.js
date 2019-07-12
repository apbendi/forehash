import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingIndicator = _props => {
    return (
        <div className="text-center mt-4">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    );
}

export default LoadingIndicator

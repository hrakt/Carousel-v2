import React from 'react';
import PropTypes from 'prop-types';

import Error from 'components/ui/Error';

const ErrorPage = ({ statusCode }) => <Error statusCode={statusCode} />;

ErrorPage.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return {
        statusCode,
    };
};

ErrorPage.propTypes = {
    statusCode: PropTypes.number,
};

export default ErrorPage;

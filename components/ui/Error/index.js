import React from 'react';
import PropTypes from 'prop-types';

import styles from './Error.scss';

const Error = ({ statusCode }) => {
    return (
        <main className={styles.error}>
            {statusCode ? `${statusCode}` : '500'}
        </main>
    );
};

Error.propTypes = {
    statusCode: PropTypes.number,
};

export default Error;

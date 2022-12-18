import React from 'react';
import { Link } from 'react-router-dom';
import styles from './custom404.module.scss';

const Custom404 = () => {
    return (
        <div className={styles.root}>
            <h1>404</h1>
            <h2>Page not found</h2>
            <Link to={'/'}>Back to home</Link>
        </div>
    );
};

export default Custom404;

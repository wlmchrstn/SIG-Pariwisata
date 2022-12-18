import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/landing/landing';
import LocationPage from '../pages/location/location';
import Custom404 from '../pages/custom404/custom404';

const Router = () => {
    return (
        <Routes>
            <Route path={'/'} element={<LandingPage />} />
            <Route path={'/location'} element={<LocationPage />} />
            <Route path={'*'} element={<Custom404 />} />
        </Routes>
    );
};

export default Router;

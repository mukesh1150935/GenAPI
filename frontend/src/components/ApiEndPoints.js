import React from 'react';

const ApiEndpoints = ({ apiName }) => {
    const baseURL = 'http://localhost:5000/api';

    const endpoints = [
        { method: 'GET', url: `${baseURL}/${apiName}` },
        { method: 'GET', url: `${baseURL}/${apiName}/:id` },
        { method: 'GET', url: `${baseURL}/${apiName}?fieldName=fieldValue` },
        { method: 'POST', url: `${baseURL}/${apiName}` },
        { method: 'PUT', url: `${baseURL}/${apiName}/:id` },
        { method: 'DELETE', url: `${baseURL}/${apiName}/:id` },
    ];

    return (
        <div>
            <h3>API Endpoints for {apiName}</h3>
            <ul>
                {endpoints.map((endpoint, index) => (
                    <li key={index}>
                        <strong>{endpoint.method}:</strong> {endpoint.url}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ApiEndpoints;

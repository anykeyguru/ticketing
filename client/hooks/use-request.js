import axios from 'axios';
import { useState } from 'react';


export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {

        // Some cofig
        const instance = axios.create({
            baseURL: "/"
        });

        // Request
        try {
            setErrors(null);
            const response = await instance[method](url, body);
            if (onSuccess) {
                onSuccess(response.data)
            }
            return response.data

        } catch (err) {
            // Set error result
            setErrors(
                <div className="alert alert-warning" role="alert">
                    <h4>Fields errors</h4>
                    <ul className="my-0">
                        {
                            err.response.data.errors.map(error => (
                                <li key={error.field}>
                                    Field: {error.field} <br />
                                    Error: {error.message}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors }
}
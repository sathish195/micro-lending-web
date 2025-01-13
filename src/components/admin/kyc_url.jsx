import React, { useState } from 'react';
import Joi from 'joi'; // Make sure you have installed Joi using `npm install joi`
import toast from 'react-hot-toast';
import { backEndCallObj } from '../../services/mainServiceFile';

function Kyc_url() {
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Joi validation schema
    const schema = Joi.object({
        return_url: Joi.string().uri({ scheme: ['http', 'https'] }).required().min(10).label("kyc Return Url").max(50).messages({
            'string.uri': 'URL must start with http:// or https://',
            'string.empty': 'URL is required',
            'string.min': 'URL must be at least 10 characters long',
            'string.max': 'URL must be at most 50 characters long'
        })
    });

    // Validate function
    const validate = (data) => {
        const { error } = schema.validate(data, { abortEarly: false });
        if (!error) return null;

        const validationErrors = {};
        for (let item of error.details)
            validationErrors[item.path[0]] = item.message;
        return validationErrors;
    };

    // Handle URL change
    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrl(newUrl);

        const validationErrors = validate({ return_url: newUrl });
        setErrors(validationErrors || {});
    };

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validate({ return_url: url });
        setErrors(validationErrors || {});
        if (validationErrors) return;

        setLoading(true);

        try {
            const response = await backEndCallObj("/admin/admin_status", { return_url: url });
            // console.log('API Response:', response);
            toast.success("URL submitted successfully!");
            setUrl("")
        } catch (ex) {
            console.error('API Error:', ex);
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-details-container container mt-3">
            <h5 className="mb-4">GENERATE KYC RETURN URL</h5>
            <div className="row justify-content-center">
                <div className="col-sm-10 col-md-10 col-lg-10 col-xl-10">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="kycUrl" className="mb-3">ENTER KYC RETURN URL:</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.return_url ? 'is-invalid' : ''}`}
                                        id="kycUrl"
                                        placeholder="http://example.com"
                                        value={url}
                                        onChange={handleUrlChange}
                                    />
                                    {errors.return_url && (
                                        <div className="invalid-feedback">
                                            {errors.return_url}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <div className="alert alert-danger" role="alert">
                                        <strong>NOTE:</strong> Please enter a valid URL starting with "http://" or "https://". The URL should be between 10 and 50 characters long.
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Kyc_url;

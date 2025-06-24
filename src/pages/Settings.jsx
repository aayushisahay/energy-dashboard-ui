/* import React, { useState } from 'react';

const Settings = () => {
  const [formData, setFormData] = useState({
    siteName: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting site:", formData);
      setSubmitStatus('Submitted successfully!');
      setFormData({
        siteName: '',
        address: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: ''
      });
    } catch (err) {
      console.error(err);
      setSubmitStatus('Submission failed.');
    }
  };

  return (
/*     <div className="main-content">
  <h2>Add New Site</h2>
  <form onSubmit={handleSubmit}>
    {/* your inputs and button }
  </form>
</div> 
    <div className="main-content card p-4 mb-4" style={{ maxWidth: '600px' }}>
      <h4 className="mb-3">Add New Site</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Site Name</label>
          <input
            type="text"
            className="form-control"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Person</label>
          <input
            type="text"
            className="form-control"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Email</label>
          <input
            type="email"
            className="form-control"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Phone</label>
          <input
            type="text"
            className="form-control"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        {submitStatus && <p className="mt-2 text-success">{submitStatus}</p>}
      </form>
    </div>
  );
};

export default Settings; */

import React from 'react';
import SiteForm from '../components/SiteForm'; // adjust path if needed

const Settings = () => {
  return (
    <div className="main-content">
      <SiteForm />
    </div>
  );
};

export default Settings;
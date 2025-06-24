/* import React, { useEffect, useState } from 'react';
import { getSingleSite, updateSite } from '../services/api'; 

const SiteForm = () => {
  const [formData, setFormData] = useState({
    siteID: '',
    siteName: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const site = await getSingleSite();
        setFormData(site);
        setOriginalData(site);
      } catch (err) {
        console.error('Failed to fetch site:', err);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes (PUT)
  const handleSave = async () => {
    try {
      await updateSite(formData.siteID, formData);
      setEditMode(false);
      setOriginalData(formData); // Update backup
    } catch (err) {
      console.error('Failed to update site:', err);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(originalData); // Restore original data
    setEditMode(false);
  };

  return (
    <div className="site-form">
      <h2>Site Settings</h2>

      <form>
        <label>Site ID</label>
        <input type="text" name="siteID" value={formData.siteID} disabled />

        <label>Site Name</label>
        <input
          type="text"
          name="siteName"
          value={formData.siteName}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Contact Person</label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Contact Email</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Contact Phone</label>
        <input
          type="tel"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          disabled={!editMode}
        />

        <div className="form-buttons">
          {editMode ? (
            <>
              <button type="button" onClick={handleSave}>Save</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <button type="button" onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SiteForm; */

import React, { useEffect, useState } from 'react';
import { getSingleSite, updateSite } from '../services/api';

const SiteForm = () => {
  const [formData, setFormData] = useState({
    siteId: '',
    siteName: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState({
    siteId: '',
    siteName: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const site = await getSingleSite();
        console.log(site,'<==== site');
        setFormData(()=>site);
        setOriginalData(()=>site);
      } catch (err) {
        console.error('Failed to fetch site:', err);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes (PUT)
  const handleSave = async () => {
    try {
      await updateSite(formData.siteID, formData);
      setEditMode(false);
      setOriginalData(formData);
      setStatusMessage('Changes saved successfully.');
    } catch (err) {
      console.error('Failed to update site:', err);
      setStatusMessage('Failed to save changes.');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(originalData);
    setEditMode(false);
    setStatusMessage('Edits canceled.');
  };

  return (
    <div className="main-content card p-4 mb-4" style={{ maxWidth: '600px' }}>
      <h4 className="mb-3">Site Details</h4>
      <form>
        <div className="mb-3">
          <label className="form-label">Site ID</label>
          <input type="text" className="form-control" name="siteID" value={formData.siteID} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">Site Name</label>
          <input
            type="text"
            className="form-control"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            disabled={!editMode}
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
            disabled={!editMode}
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
            disabled={!editMode}
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
            disabled={!editMode}
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
            disabled={!editMode}
          />
        </div>

        <div className="d-flex gap-2">
          {editMode ? (
            <>
              <button type="button" className="btn btn-success" onClick={handleSave}>Save</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>

        {statusMessage && <p className="mt-3 text-info">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default SiteForm;
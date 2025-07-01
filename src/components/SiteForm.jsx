import React, { useEffect, useState } from 'react';
import { getSingleSite, updateSite, createSite } from '../services/api';

const SiteForm = () => {
  const [formData, setFormData] = useState({
    siteID: '',
    siteName: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [siteExists, setSiteExists] = useState(false); // flag to disable Add after 1 entry

  // Fetch existing site on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const site = await getSingleSite();
        if (site?.siteID) {
          setFormData(site);
          setOriginalData(site);
          setSiteExists(true);
        }
      } catch (err) {
        console.error('No site found. You may add a new one.', err);
        setSiteExists(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSite(formData.siteID, formData);
      setOriginalData(formData);
      setEditMode(false);
      setStatusMessage('Changes saved successfully.');
    } catch (err) {
      console.error('Failed to update site:', err);
      const msg = err.response?.data?.message || 'Failed to save changes.';
      setStatusMessage(msg);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setEditMode(false);
    setStatusMessage('Edits canceled.');
  };

  const handleAdd = async () => {
  try {
    console.log("Sending data to createSite API:", formData);
    const newSite = await createSite(formData);
    console.log("API Response:", newSite);
    setFormData(newSite);
    setOriginalData(newSite);
    setSiteExists(true);
    setStatusMessage('Site added successfully.');
  } catch (err) {
    console.error('Failed to add site:', err);
    const msg = err.response?.data?.message || 'Failed to add site.';
    setStatusMessage(msg);
  }
};

  return (
    <div className="main-content card p-4 mb-4" style={{ maxWidth: '600px' }}>
      <h4 className="mb-3">Site Settings</h4>

      <form>
        <div className="mb-3">
          <label className="form-label">Site Name</label>
          <input
            type="text"
            className="form-control"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            disabled={siteExists && !editMode}
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
            disabled={siteExists && !editMode}
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
            disabled={siteExists && !editMode}
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
            disabled={siteExists && !editMode}
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
            disabled={siteExists && !editMode}
          />
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleAdd}
            disabled={siteExists}
          >
            Add
          </button>

          {siteExists && (
            editMode ? (
              <>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
            )
          )}
        </div>

        {statusMessage && <p className="mt-3 text-info">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default SiteForm;
import React, { useEffect, useState } from 'react';
import { getSingleSite, createSite, updateSite, deleteSite } from '../services/api';

const SiteForm = () => {
  const [formData, setFormData] = useState({
    siteId: '',
    siteName: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [originalData, setOriginalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [siteExists, setSiteExists] = useState(false);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const site = await getSingleSite();
        const mappedSite = {
          siteId: site.siteId || site.siteID || site.id,
          siteName: site.siteName || '',
          address: site.address || '',
          contactPerson: site.contactPerson || '',
          contactEmail: site.contactEmail || '',
          contactPhone: site.contactPhone || ''
        };

        setFormData(mappedSite);
        setOriginalData(mappedSite);
        setSiteExists(true);
      } catch (err) {
        console.error('No site found:', err);
        setSiteExists(false);
      }
    };

    fetchSite();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      const { siteId, ...siteData } = formData; 
      siteData.createdAt = new Date().toISOString();
      const created = await createSite(siteData);

      const newSiteId = created.siteId || created.siteID || created.id;
      if (!newSiteId) throw new Error("Site ID missing in response");

      const updated = { ...created, siteId: newSiteId };

      setFormData(updated);
      setOriginalData(updated);
      setSiteExists(true);
      setStatusMessage('Site added successfully.');
    } catch (err) {
      console.error('Add error:', err);
      const msg = err.response?.data?.message || 'Failed to add site.';
      setStatusMessage(msg);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.siteId) {
        setStatusMessage("Cannot update: site ID missing.");
        return;
      }
      await updateSite(formData.siteId, formData);
      setOriginalData(formData);
      setEditMode(false);
      setStatusMessage('Changes saved successfully.');
    } catch (err) {
      console.error('Update error:', err);
      const msg = err.response?.data?.message || 'Failed to save changes.';
      setStatusMessage(msg);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setEditMode(false);
    setStatusMessage('Changes canceled.');
  };

  const handleDelete = async () => {
    try {
      await deleteSite(formData.siteId);
      setFormData({
        siteId: '',
        siteName: '',
        address: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: ''
      });
      setOriginalData(null);
      setEditMode(false);
      setSiteExists(false);
      setStatusMessage('Site deleted.');
    } catch (err) {
      console.error('Delete error:', err);
      const msg = err.response?.data?.message || 'Failed to delete site.';
      setStatusMessage(msg);
    }
  };

  return (
    <div className="main-content card p-4 mb-4" style={{ maxWidth: '600px' }}>
      <h4 className="mb-3">Site Settings</h4>

      <form>
        {/* Show Site ID only when site exists */}
        {siteExists && (
          <div className="mb-3">
            <label className="form-label">Site ID</label>
            <input type="text" className="form-control" value={formData.siteId} disabled />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Site Name</label>
          <input
            type="text"
            className="form-control"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            disabled={!editMode && siteExists}
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
            disabled={!editMode && siteExists}
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
            disabled={!editMode && siteExists}
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
            disabled={!editMode && siteExists}
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
            disabled={!editMode && siteExists}
          />
        </div>

        <div className="d-flex gap-2">
          {!siteExists && (
            <button type="button" className="btn btn-success" onClick={handleAdd}>Add</button>
          )}

          {siteExists && editMode && (
            <>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </>
          )}

          {siteExists && !editMode && (
            <button type="button" className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>

        {statusMessage && <p className="mt-3 text-info">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default SiteForm;

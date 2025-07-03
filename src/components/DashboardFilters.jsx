import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TreeSelect, Select } from 'antd';
import 'antd/dist/reset.css';

// Helper to build hierarchical tree structure
export const buildTreeData = (spaces) => {
  const idToNodeMap = {};
  const tree = [];

  spaces.forEach(space => {
    idToNodeMap[space.spaceId] = {
      title: space.spaceName,
      value: space.spaceId.toString(),
      key: space.spaceId.toString(),
      children: []
    };
  });

  spaces.forEach(space => {
    const node = idToNodeMap[space.spaceId];
    if (space.parentSpaceId && idToNodeMap[space.parentSpaceId]) {
      idToNodeMap[space.parentSpaceId].children.push(node);
    } else {
      tree.push(node);
    }
  });

  const sortTree = (nodes) => {
    nodes.sort((a, b) => a.title.localeCompare(b.title));
    nodes.forEach(node => {
      if (node.children?.length) sortTree(node.children);
    });
  };

  sortTree(tree);
  return tree;
};

// Space Selector Dropdown
export const SpaceSelector = ({ treeData, selectedValues, onChange }) => {
  const handleClear = () => onChange([]);

  const filterTree = (input, treeNode) =>
    treeNode?.title?.toLowerCase().includes(input.toLowerCase());

  const renderDropdown = (menu) => (
    <>
      {menu}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 8,
          borderTop: '1px solid #f0f0f0',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onClick={handleClear}
      >
        🗑 Clear All
      </div>
    </>
  );

  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Select Spaces:</label>
      <TreeSelect
        treeData={treeData}
        value={selectedValues}
        onChange={onChange}
        multiple
        treeCheckable
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
        placeholder="Please select"
        style={{ width: '100%' }}
        allowClear
        showSearch
        filterTreeNode={filterTree}
        dropdownRender={renderDropdown}
      />
    </div>
  );
};

// Time Range + Custom Picker + Granularity
export const TimeRangeSelector = ({
  timeRange, setTimeRange,
  startDate, setStartDate,
  endDate, setEndDate,
  granularity, setGranularity
}) => {
  const isCustomRange = timeRange === 'custom';

  const MIN_DATE = new Date('2023-06-01T00:00:00');
  const MAX_DATE = new Date('2025-05-31T23:59:59');

  const generateTimeOptions = (selectedDate) => {
    const times = [];
    const base = new Date(selectedDate);
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i <= (23 * 60 + 45); i += 15) {
      times.push(new Date(base.getTime() + i * 60000));
    }
    const lastMinute = new Date(base);
    lastMinute.setHours(23, 59, 0, 0);
    times.push(lastMinute);
    return times;
  };

  const startTimes = generateTimeOptions(startDate || new Date());
  const endTimes = generateTimeOptions(endDate || new Date());

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label fw-bold">Time Range:</label>
          <select
            className="form-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Start Date & Time:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && endDate < date) setEndDate(date);
            }}
            showTimeSelect
            timeIntervals={15}
            includeTimes={startTimes}
            dateFormat="dd/MM/yy HH:mm"
            className="form-control"
            disabled={!isCustomRange}
            minDate={MIN_DATE}
            maxDate={MAX_DATE}
            showYearDropdown
            scrollableYearDropdown
            timeCaption="Time"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">End Date & Time:</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            showTimeSelect
            timeIntervals={15}
            includeTimes={endTimes}
            dateFormat="dd/MM/yy HH:mm"
            className="form-control"
            disabled={!isCustomRange}
            minDate={startDate || MIN_DATE}
            maxDate={MAX_DATE}
            showYearDropdown
            scrollableYearDropdown
            timeCaption="Time"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Granularity:</label>
        <Select
          value={granularity}
          onChange={setGranularity}
          style={{ width: 200 }}
          options={[
            { label: 'Hourly', value: 'hourly' },
            { label: 'Daily', value: 'daily' },
            { label: 'Monthly', value: 'monthly' }
          ]}
        />
      </div>
    </>
  );
};

const DashboardFilters = ({
  treeData,
  selectedValues,
  setSelectedValues,
  timeRange,
  setTimeRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  granularity,
  setGranularity
}) => (
  <div className="card mb-4 shadow-sm">
    <div className="card-body">
      <h5 className="card-title fw-bold mb-3">Filters</h5>
      <SpaceSelector
        treeData={treeData}
        selectedValues={selectedValues}
        onChange={setSelectedValues}
      />
      <TimeRangeSelector
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        granularity={granularity}
        setGranularity={setGranularity}
      />
    </div>
  </div>
);

export default DashboardFilters;
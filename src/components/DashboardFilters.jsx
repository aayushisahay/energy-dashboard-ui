import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TreeSelect } from 'antd';
import 'antd/dist/reset.css';

// Helper function to build tree structure from flat space data
export const buildTreeData = (spaces) => {
    const idToNodeMap = {};
    const tree = [];

    for (const space of spaces) {
        idToNodeMap[space.spaceId] = {
            title: space.spaceName,
            value: space.spaceId.toString(),
            key: space.spaceId.toString(),
            children: []
        };
    }

    for (const space of spaces) {
        const node = idToNodeMap[space.spaceId];
        if (space.parentSpaceId && idToNodeMap[space.parentSpaceId]) {
            idToNodeMap[space.parentSpaceId].children.push(node);
        } else {
            tree.push(node);
        }
    }

    const sortTree = (nodes) => {
        nodes.sort((a, b) => a.title.localeCompare(b.title));
        for (const node of nodes) {
            if (node.children?.length) {
                sortTree(node.children);
            }
        }
    };
    sortTree(tree);
    return tree;
};

// Space selector dropdown
export const SpaceSelector = ({ treeData, selectedValues, onChange }) => (
    <div className="mb-3">
        <label className="form-label">Select Spaces:</label>
        <TreeSelect
            treeData={treeData}
            value={selectedValues.map(String)}
            onChange={onChange}
            multiple
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder="Please select"
            style={{ width: '100%' }}
            allowClear
        />
    </div>
);

/* // Time Filter and manual Date Picker
export const TimeRangeSelector = ({ timeRange, setTimeRange, startDate, setStartDate, endDate, setEndDate }) => (
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
                onChange={setStartDate}
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
            />
        </div>

        <div className="col-md-4">
            <label className="form-label fw-bold">End Date & Time:</label>
            <DatePicker
                selected={endDate}
                onChange={setEndDate}
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
            />
        </div>
    </div>
); */
// Time Filter and manual Date Picker
export const TimeRangeSelector = ({
    timeRange, setTimeRange,
    startDate, setStartDate,
    endDate, setEndDate
}) => {
    const isCustomRange = timeRange === 'custom';

    const minSelectableDate = new Date('2023-06-01T00:00:00');
    const maxSelectableDate = new Date('2025-05-31T23:59:59');

    // Generate time options based on selected date
    const generateTimeOptions = (selectedDate) => {
        const times = [];
        const baseDate = new Date(selectedDate);
        baseDate.setHours(0, 0, 0, 0);
        for (let i = 0; i <= (23 * 60 + 45); i += 15) {
            times.push(new Date(baseDate.getTime() + i * 60000));
        }
        const lastMinute = new Date(baseDate);
        lastMinute.setHours(23, 59, 0, 0);
        times.push(lastMinute);
        return times;
    };

    const startTimeOptions = generateTimeOptions(startDate || new Date());
    const endTimeOptions = generateTimeOptions(endDate || new Date());

    return (
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
                        if (endDate < date) {
                            setEndDate(date);
                        }
                    }}
                    showTimeSelect
                    timeIntervals={15}
                    includeTimes={startTimeOptions}
                    dateFormat="dd/MM/yy HH:mm"
                    className="form-control"
                    disabled={!isCustomRange}
                    minDate={minSelectableDate}
                    maxDate={maxSelectableDate}
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
                    includeTimes={endTimeOptions}
                    dateFormat="dd/MM/yy HH:mm"
                    className="form-control"
                    disabled={!isCustomRange}
                    minDate={startDate || minSelectableDate}
                    maxDate={maxSelectableDate}
                    showYearDropdown
                    scrollableYearDropdown
                    timeCaption="Time"
                />
            </div>
        </div>
    );
};
// ✅ Default wrapper component to use in Dashboard.jsx
/* const DashboardFilters = ({
    treeData,
    selectedValues,
    setSelectedValues,
    timeRange,
    setTimeRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => (
    <>
    
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
        />
    </>
     */
    const DashboardFilters = ({
    treeData,
    selectedValues,
    setSelectedValues,
    timeRange,
    setTimeRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    const cardStyle = {
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
    };

    return (
        <div style={cardStyle}>
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
            />
        </div>
    );
};


export default DashboardFilters;
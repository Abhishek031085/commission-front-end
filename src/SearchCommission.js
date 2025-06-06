import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

const SearchCommission = () => {
  const [filters, setFilters] = useState({ month: '', policyType: '', segment: '' });
  const [dropdowns, setDropdowns] = useState({ months: [], policyTypes: [], segments: [] });
  const [results, setResults] = useState([]);

  // Load months
  useEffect(() => {
    axios.get(`${API}/api/months`).then(res =>
      setDropdowns(prev => ({ ...prev, months: res.data.map(item => item.month) }))
    );
  }, []);

  // Load policy types when month changes
  useEffect(() => {
    if (!filters.month) return;
    axios.get(`${API}/api/policy_types?month=${filters.month}`).then(res =>
      setDropdowns(prev => ({ ...prev, policyTypes: res.data.map(item => item.policy_type) }))
    );
    setFilters(f => ({ ...f, policyType: '', segment: '' }));
    setDropdowns(prev => ({ ...prev, segments: [] }));
  }, [filters.month]);

  // Load segments when policy type changes
  useEffect(() => {
    if (!filters.month || !filters.policyType) return;
    axios
      .get(`${API}/api/segments?month=${filters.month}&policyType=${filters.policyType}`)
      .then(res => setDropdowns(prev => ({ ...prev, segments: res.data })));
    setFilters(f => ({ ...f, segment: '' }));
  }, [filters.policyType]);

  const handleChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = () => {
    axios.post(`${API}/api/search`, filters).then(res => setResults(res.data));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Search Commission Grid</h2>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <select className="form-select" name="month" onChange={handleChange} value={filters.month}>
            <option value="">Select Month</option>
            {dropdowns.months.map((m, i) => <option key={i} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="col-md-4 mb-2">
          <select className="form-select" name="policyType" onChange={handleChange} value={filters.policyType}>
            <option value="">Select Policy Type</option>
            {dropdowns.policyTypes.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="col-md-4 mb-2">
          <select className="form-select" name="segment" onChange={handleChange} value={filters.segment}>
            <option value="">Select Segment</option>
            {dropdowns.segments.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <button className="btn btn-success" onClick={handleSearch}>Search</button>
      </div>

      {results.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>State</th>
                <th>Segment</th>
                <th>Insurance Co</th>
                <th>Policy Type</th>
                <th>Rate</th>
                <th>Fuel</th>
                <th>Month</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  <td>{row.state}</td>
                  <td>{row.vehicle_type}</td>
                  <td>{row.company}</td>
                  <td>{row.policy_type}</td>
                  <td><strong>{row.rate}</strong></td>
                  <td>{row.fuel}</td>
                  <td>{row.month}</td>
                  <td>{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchCommission;

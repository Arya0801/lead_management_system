import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { buildFilterQuery } from "../utils/filters";

const LeadsList = () => {
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    email_contains: "",
    company_contains: "",
    city_contains: "",
    status_in: "",
    source_in: "",
    score_gt: "",
    score_lt: "",
    created_at_before: "",
    created_at_after: "",
    last_activity_at_before: "",
    last_activity_at_after: "",
    is_qualified: "",
  });

  // Ref for AG Grid
  const gridRef = useRef();

  const fetchLeads = async (page = 1, appliedFilters = filters) => {
    const query = buildFilterQuery({ ...appliedFilters, page, limit: pagination.limit });
    const res = await api.get(`/leads?${query}`);
    setRowData(res.data.data);
    setPagination({
      page: res.data.page,
      limit: res.data.limit,
      totalPages: res.data.totalPages,
    });
  };

  useEffect(() => {
    fetchLeads(1);
  }, []);

  const deleteLead = async (id) => {
    if (window.confirm("Delete this lead?")) {
      await api.delete(`/leads/${id}`);
      fetchLeads(pagination.page);
    }
  };

  const columns = [
    { headerName: "First Name", field: "first_name" },
    { headerName: "Last Name", field: "last_name" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Company", field: "company" },
    { headerName: "Status", field: "status" },
    { headerName: "Source", field: "source" },
    { headerName: "Score", field: "score" },
    { headerName: "Qualified", field: "is_qualified" },
    {
    headerName: "Created At",
    field: "created_at",
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    headerName: "Last Activity",
    field: "last_activity_at",
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },

 
    {
      headerName: "Actions",
      field: "id",
      cellRenderer: (params) => (
        <div className="space-x-2">
          <Link
            to={`/leads/edit/${params.data._id}`}
            className="text-purple-600 hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={() => deleteLead(params.data._id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    fetchLeads(1, filters);
  };

  const resetFilters = () => {
    const cleared = Object.fromEntries(Object.keys(filters).map((k) => [k, ""]));
    setFilters(cleared);
    fetchLeads(1, cleared);
  };

  const exportCSV = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  // const exportExcel = () => {
  //   if (gridRef.current.api.exportDataAsExcel) {
  //     gridRef.current.api.exportDataAsExcel();
  //   } else {
  //     alert("Excel export requires AG Grid Enterprise. Use CSV instead.");
  //   }
  // };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Leads
        </h2>
        <Link
          to="/leads/new"
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          + Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* String filters */}
          <input
            type="text"
            placeholder="Email contains..."
            name="email_contains"
            value={filters.email_contains}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Company contains..."
            name="company_contains"
            value={filters.company_contains}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="City contains..."
            name="city_contains"
            value={filters.city_contains}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {/* Enum filters */}
          <select
            name="status_in"
            value={filters.status_in}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="">-- Status --</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>
          <select
            name="source_in"
            value={filters.source_in}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="">-- Source --</option>
            <option value="website">Website</option>
            <option value="facebook_ads">Facebook Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="referral">Referral</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>

          {/* Numeric filters */}
          <input
            type="number"
            placeholder="Score >="
            name="score_gt"
            value={filters.score_gt}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Score <="
            name="score_lt"
            value={filters.score_lt}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

         {/* Date filters with placeholders */}
<input
  type={filters.created_at_before ? "date" : "text"}
  placeholder="Created Before"
  name="created_at_before"
  value={filters.created_at_before}
  onChange={handleChange}
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => !e.target.value && (e.target.type = "text")}
  className="border rounded px-3 py-2"
/>

<input
  type={filters.created_at_after ? "date" : "text"}
  placeholder="Created After"
  name="created_at_after"
  value={filters.created_at_after}
  onChange={handleChange}
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => !e.target.value && (e.target.type = "text")}
  className="border rounded px-3 py-2"
/>

<input
  type={filters.last_activity_at_before ? "date" : "text"}
  placeholder="Last Activity Before"
  name="last_activity_at_before"
  value={filters.last_activity_at_before}
  onChange={handleChange}
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => !e.target.value && (e.target.type = "text")}
  className="border rounded px-3 py-2"
/>

<input
  type={filters.last_activity_at_after ? "date" : "text"}
  placeholder="Last Activity After"
  name="last_activity_at_after"
  value={filters.last_activity_at_after}
  onChange={handleChange}
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => !e.target.value && (e.target.type = "text")}
  className="border rounded px-3 py-2"
/>


          {/* Boolean filter */}
          <select
            name="is_qualified"
            value={filters.is_qualified}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="">-- Qualified? --</option>
            <option value="true">Qualified</option>
            <option value="false">Not Qualified</option>
          </select>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition"
        >
          Export CSV
        </button>
        {/* <button
          onClick={exportExcel}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition"
        >
          Export Excel
        </button> */}
      </div>

      {/* Table */}
      <div className="ag-theme-alpine rounded shadow" style={{ height: 400, width: "100%" }}>
        <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columns} pagination={false} />
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          disabled={pagination.page <= 1}
          onClick={() => fetchLeads(pagination.page - 1, filters)}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => fetchLeads(pagination.page + 1, filters)}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeadsList;

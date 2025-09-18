import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    is_qualified: false,
  });

  const hiddenFields = ["_id", "id", "created_at", "updated_at", "last_activity_at", "__v"];


  const sources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];
  const statuses = ["new", "contacted", "qualified", "lost", "won"];

  useEffect(() => {
    if (id) {
      api.get(`/leads/${id}`).then((res) => setForm(res.data.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await api.put(`/leads/${id}`, form);
    } else {
      await api.post("/leads", form);
    }
    navigate("/leads");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {id ? "Edit Lead" : "Create Lead"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Object.keys(form)
          .filter((key) => !hiddenFields.includes(key))
          .map((key) => (
            <div key={key} className="flex flex-col">
              <label
                htmlFor={key}
                className="capitalize text-gray-700 mb-2 font-medium"
              >
                {key.replace("_", " ")}
              </label>

              {key === "source" ? (
                <select
                  name={key}
                  id={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {sources.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              ) : key === "status" ? (
                <select
                  name={key}
                  id={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              ) : typeof form[key] === "boolean" ? (
                <input
                  type="checkbox"
                  name={key}
                  id={key}
                  checked={form[key]}
                  onChange={handleChange}
                  className="h-5 w-5 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  id={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;

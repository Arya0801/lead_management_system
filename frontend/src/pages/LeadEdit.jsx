import LeadForm from "../components/LeadForm";

const LeadEdit = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Edit Lead
        </h1>
        <LeadForm />
      </div>
    </div>
  );
};

export default LeadEdit;

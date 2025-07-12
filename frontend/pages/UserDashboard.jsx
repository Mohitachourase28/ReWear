
export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200" />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="h-6 bg-gray-100 rounded w-full" />
              <div className="h-6 bg-gray-100 rounded w-full" />
              <div className="h-6 bg-gray-100 rounded w-full" />
              <div className="h-6 bg-gray-100 rounded w-full" />
              <div className="h-6 bg-gray-100 rounded w-full" />
              <div className="h-6 bg-gray-100 rounded w-full" />
            </div>
          </div>
          <div className="mt-6 h-24 bg-gray-100 rounded" />
        </section>

        {/* My Listings Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Listings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded shadow hover:shadow-md transition h-40"
              />
            ))}
          </div>
        </section>

        {/* My Purchases Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">My Purchases</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded shadow hover:shadow-md transition h-40"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
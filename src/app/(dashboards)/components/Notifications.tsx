export default function Notifications() {
  return (
    <div className="w-full max-w-7xl  mx-auto bg-dashboardBarBackground border rounded-xl shadow-sm p-4 border-green">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>

      {/* Appointment */}
      <div className="flex justify-between items-start py-2 border-b border-gray-200">
        <div>
          <p className="text-green font-medium">Appointment</p>
          <p className="text-lightBlack text-sm">
            Your appointment has been booked
          </p>
        </div>
        <span className="text-gray-400 text-sm">10 mins ago</span>
      </div>

      {/* Report Uploaded */}
      <div className="flex justify-between items-start py-2 border-b border-gray-200">
        <div>
          <p className="text-green font-medium">Report Uploaded</p>
          <p className="text-lightBlack text-sm">
            Dentist uploads a new report &amp; video
          </p>
        </div>
        <span className="text-gray-400 text-sm">1 day ago</span>
      </div>

      {/* Plans update */}
      <div className="flex justify-between items-start py-2">
        <div>
          <p className="text-green font-medium">Plans update</p>
          <p className="text-lightBlack text-sm">
            New plans or resources are available
          </p>
        </div>
        <span className="text-gray-400 text-sm">2 day ago</span>
      </div>
    </div>
  );
}

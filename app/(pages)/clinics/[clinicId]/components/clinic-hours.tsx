// components/clinic-hours.tsx

export default function ClinicHours({ hours }: { hours: any }) {
  return (
    <div className="bg-card/70 rounded-xl shadow-sm p-6  last:">
      <h3 className="text-lg font-semibold text-default-900 mb-4">
        Clinic Hours
      </h3>
      <div className="space-y-3">
        {Object.entries(hours).map(([day, hoursObj]: [string, any]) => (
          <div key={day} className="flex justify-between">
            <span className="font-medium text-default-700 capitalize">
              {day}:
            </span>
            <span className="text-default-600">
              {hoursObj.open === "Closed"
                ? "Closed"
                : `${hoursObj.open} - ${hoursObj.close}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

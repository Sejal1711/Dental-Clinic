import React, { useState } from 'react';

// Sample time slots: 9:00 AM to 5:00 PM
const generateTimeSlots = (start = 9, end = 17) => {
  const slots = [];
  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const DoctorSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState({});

  const handleSlotToggle = (slot) => {
    if (!selectedDate) return;

    setAppointments((prev) => {
      const dayAppointments = prev[selectedDate] || [];
      const isBooked = dayAppointments.includes(slot);

      return {
        ...prev,
        [selectedDate]: isBooked
          ? dayAppointments.filter((s) => s !== slot)
          : [...dayAppointments, slot],
      };
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Doctor Schedule</h2>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Select Date:</label>
        <input
          type="date"
          className="border rounded px-3 py-2 w-full"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Slots for {selectedDate}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const isBooked = appointments[selectedDate]?.includes(slot);

              return (
                <button
                  key={slot}
                  onClick={() => handleSlotToggle(slot)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    isBooked
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {slot} {isBooked ? '(Booked)' : '(Available)'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;

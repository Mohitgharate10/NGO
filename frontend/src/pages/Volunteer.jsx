import { useState } from "react";

function Volunteer() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    skill: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Volunteer appointment booked successfully!");
      setForm({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        skill: ""
      });
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Volunteer Appointment
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <select
          name="skill"
          value={form.skill}
          onChange={handleChange}
          className="w-full p-2 border mb-4"
          required
        >
          <option value="">Select Skill</option>
          <option value="Teaching">Teaching</option>
          <option value="Medical">Medical</option>
          <option value="Food Distribution">Food Distribution</option>
          <option value="Event Management">Event Management</option>
        </select>

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default Volunteer;

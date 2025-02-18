import React, { useState } from 'react';


interface RsvpFormProps {
  apiUrl: string;
}

 function RsvpForm({ apiUrl }: RsvpFormProps) {
  // const RsvpForm: React.FC = ({ apiUrl } : RsvpFormProps) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [attending, setAttending] = useState<boolean>(false);
  const [foodAllergy, setFoodAllergy] = useState<string>('');
  const [numPeople, setNumPeople] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, attending, food_allergy: foodAllergy })
      });
      const result = await response.json();
      if (response.ok) {
        console.log('RSVP received:', result);
        alert('RSVP received successfully!');
      } else {
        console.error('Error:', result);
        alert('Failed to submit RSVP.');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Fetch received:', result);
        const n = result.length == 0 ? 1 : result.length;
        setNumPeople(n)
      } else {
        console.error('Error:', result);
        alert('Failed to submit Fetch.');
      }
    } catch (error) {
      console.error('Error submitting Fetch:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const numPeopleOptions = Array.from({ length: 10 }, (_, i) => i);

  return (
    <form onSubmit={numPeople == 0 ? handleFetch : handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {numPeople > 0 &&
        <div>
          <label>Antal personer:</label>
          <select
            name="numPeople"
            id="numPeople"
            value={numPeople}
            onChange={(e) => setNumPeople(+e.target.value)}
          >
            {numPeopleOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      }
      {[...Array(numPeople)].map((_, i) =>
        <div key={i}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Attending:</label>
            <input
              type="checkbox"
              checked={attending}
              onChange={(e) => setAttending(e.target.checked)}
            />
          </div>
          {attending &&
            <div>
              <label>Matallergi:</label>
              <input
                type="text"
                value={foodAllergy}
                onChange={(e) => setFoodAllergy(e.target.value)}
              />
            </div>
          }
        </div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default RsvpForm;

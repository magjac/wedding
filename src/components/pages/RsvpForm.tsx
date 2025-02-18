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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default RsvpForm;

import React, { useState } from 'react';
import '../RsvpForm//styles.scss';
import InputField from '../Input';
import Select from '../Select';
import PersonComponent from '../Person';
import Button from '../Button';

interface RsvpFormProps {
  apiUrl: string;
  hideForm: () => void;
}

export interface Person {
  id: number | null;
  name: string;
  email: string;
  attending: boolean | undefined;
  housing: boolean | undefined;
  foodAllergy: string;
}

interface RawPerson {
  id: number | null;
  name: string;
  email: string;
  attending: boolean | undefined;
  housing: boolean | undefined;
  food_allergy: string;
}

function RsvpForm({ apiUrl, hideForm }: RsvpFormProps) {
  // const RsvpForm: React.FC = ({ apiUrl } : RsvpFormProps) => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState('');
  const [people, setPeople] = useState<Person[]>([]);

  const emptyPerson = {
    id: null,
    name: '',
    email: email,
    attending: undefined,
    housing: undefined,
    foodAllergy: '',
  };

  const updatePerson = (index: number, updatedPerson: Person) => {
    setPeople((prevPeople) =>
      prevPeople.map((person, i) => (i === index ? updatedPerson : person))
    );
  };

  const setNumPeople = (numPeople: number) => {
    setPeople((prevPeople) => {
      if (numPeople > prevPeople.length) {
        // Increase people
        const newPeople = Array.from(
          { length: numPeople - prevPeople.length },
          () => ({
            ...emptyPerson,
            email: email,
          })
        );
        return [...prevPeople, ...newPeople];
      } else {
        // Decrease people
        return prevPeople.slice(0, numPeople);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rsvps = people.map(person => ({
        id: person.id,
        name: person.name,
        email,
        attending: person.attending,
        housing: person.housing,
        food_allergy: person.foodAllergy,
      }));
      const response = await fetch(`${apiUrl}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rsvps }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('RSVP received:', result);
      } else {
        console.error('Error:', result);
        alert('Failed to submit RSVP.');
      }
      alert('RSVP received successfully!');
      hideForm();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleFetch = async (isNewRegistration: boolean) => {
    if (!email) {
      setError('Fyll i en e-post.');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Fetch received:', result);
        const oldPeople = result.map((person: RawPerson) => {
          const { food_allergy, ...rest } = person;
          return {
            ...rest,
            foodAllergy: food_allergy,
          };
        });
        const newPeople =
          result.length === 0 ? [{ ...emptyPerson, email: email }] : oldPeople;

        if (Array.isArray(result) && result.length === 0) {
          // Email does NOT exist
          if (isNewRegistration) {
            setError('');
            setPeople(newPeople);
          } else {
            setError('E-postadressen finns inte registrerad.');
          }
        } else {
          // Email exists
          if (isNewRegistration) {
            setError('E-postadressen är redan registrerad.');
          } else {
            setError('');
            setPeople(newPeople); // Store fetched person details
          }
        }
      } else {
        console.error('Error:', result);
        alert('Failed to submit Fetch.');
      }
    } catch (error) {
      console.error('Error submitting Fetch:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const numPeopleOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const numPeople = people.length;
  return (
    <form
      className="rsvp-form"
      // onSubmit={numPeople === 0 ? handleFetch : handleSubmit}
      // style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <InputField
        label="Fyll i din e-post"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={error}
      />
      {numPeople === 0 && (
        <div className="buttons">
          <Button
            title="Ny anmälan"
            onClick={() => {
              handleFetch(true);
            }}
          />
          <Button title="Ändra anmälan" onClick={() => handleFetch(false)} />
        </div>
      )}
      {!error && numPeople > 0 && (
        <Select
          label="Hur många vill du svara för?"
          name="numPeople"
          options={numPeopleOptions}
          value={numPeople.toString()}
          onChange={(e) => setNumPeople(+e.target.value)}
          required
          width={'16rem'}
        />
      )}
      {!error &&
        people.map((person, i) => (
          <PersonComponent
            key={i}
            index={i}
            person={person}
            updatePerson={updatePerson}
          />
        ))}
      {!error && numPeople > 0 && (
        <div className="buttons">
          <Button
            title="Avbryt"
            onClick={() => {
              hideForm();
            }}
          />
          <Button title="Spara" onClick={handleSubmit} type="submit" />
        </div>
      )}
    </form>
  );
}

export default RsvpForm;

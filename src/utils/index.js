import React, { useEffect, useState } from "react";
import { Text } from "react-native";

export const Check_TextField_Phone = (phone) => {
  const phoneRegex = /^[+]?[0-9]{1,3}[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  if (!phone) {
    return 'Phone number is required';
  }
  if (!phoneRegex.test(phone)) {
    return 'Invalid phone number format';
  }
  // If both input text and phone number pass the validations, return null (indicating no errors)
  return null;
}

export const Check_TextField_Name = (name) => {
  const regex = /\d/;
  if (!name) {
    return 'Name is required';
  }
  if (regex.test(name)) {
    return 'Name should not contain numbers';
  }
  // If both input text and phone number pass the validations, return null (indicating no errors)
  return null;
}

export const Check_TextField_Email = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required'
  }
  if (!regex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

export const Check_TextField_Pass = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (!password || password.length < 4) {
    return 'Password is required and should be at least 4 characters long';
  }
  return null;
};

export const Countdown = (minutes, seconds, callback) => {
  let totalSeconds = minutes * 60 + seconds;

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time.toString();
  };

  const tick = () => {
    const minutesRemaining = Math.floor(totalSeconds / 60);
    const secondsRemaining = totalSeconds % 60;
    const formattedMinutes = formatTime(minutesRemaining);
    const formattedSeconds = formatTime(secondsRemaining);

    console.log(`${formattedMinutes}:${formattedSeconds}`);

    if (totalSeconds > 0) {
      totalSeconds--;
      setTimeout(tick, 1000);
    } else {
      callback();
    }
  };

  tick();
};

export const CountdownComponent = ({getminutes, getseconds}) => {
  const [minutes, setMinutes] = useState(getminutes);
  const [seconds, setSeconds] = useState(getseconds);

  useEffect(() => {
    let totalSeconds = minutes * 60 + seconds;
    const interval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--
        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        setMinutes(newMinutes);
        setSeconds(newSeconds);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time.toString();
  };

  return (
    <Text>
      {formatTime(minutes)}:{formatTime(seconds)}
    </Text>
  );
};

export const formatCurrency = (number) => {
  // Convert the number to an integer (if it's not already)
  const intValue = parseInt(number, 10);

  // Check if the number is valid
  if (Number.isNaN(intValue)) {
    return '-';
  }

  // Convert the number to a formatted string with thousand separators (dots)
  const formattedNumber = intValue.toLocaleString('id-ID');

  // Add the 'Rp.' prefix and return the final formatted string
  return `Rp. ${formattedNumber}`;
};

// Function to check if the provided date of birth is 18+ years old
export const isEighteenOrOlder = (dateOfBirth) => {
  // Parse the dateOfBirth string into a Date object
  const dob = new Date(dateOfBirth);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in years
  const ageDifference = currentDate.getFullYear() - dob.getFullYear();

  // Check if the birthday has occurred for this year
  const hasBirthdayOccurred =
    currentDate.getMonth() > dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() >= dob.getDate());

  // Check if the person is 18+ years old
  return ageDifference > 18 || (ageDifference === 18 && hasBirthdayOccurred);
};

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Convert to meters
  return distance;
}
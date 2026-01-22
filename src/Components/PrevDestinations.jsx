import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setDestination } from '../Redux/riderslice';

// PrevDestinations
// A small component that reads/stores previous destinations in localStorage
// and displays a filtered list as the user types. Selecting an item will
// set the Redux destination and save it to history.

const STORAGE_KEY = 'nvcr_prev_destinations_v1';

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeHistory(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

const PrevDestinations = ({ query = '', max = 6, onSelect: onSelectProp }) => {
  const dispatch = useDispatch();
  const [history, setHistory] = useState(() => readHistory());

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const filtered = useMemo(() => {
    if (!query || query.trim().length === 0) return history.slice(0, max);
    const q = query.toLowerCase();
    return history.filter((d) => d.toLowerCase().includes(q)).slice(0, max);
  }, [history, query, max]);

  const handleSelect = (value) => {
    // update redux
    dispatch(setDestination(value));
    // update local history, move selected to front
    const next = [value, ...history.filter((h) => h !== value)].slice(0, 20);
    setHistory(next);
    writeHistory(next);
    if (onSelectProp) onSelectProp(value);
  };

  if (!filtered || filtered.length === 0) return null;

  return (
    <div className="mt-2 w-full md:w-3/4 bg-white shadow-md rounded-md border border-gray-100">
      <ul className="divide-y">
        {filtered.map((dest, idx) => (
          <li
            key={dest + idx}
            className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-800"
            onClick={() => handleSelect(dest)}
          >
            {dest}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrevDestinations;

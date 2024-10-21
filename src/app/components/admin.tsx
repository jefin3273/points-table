"use client";
import { useState } from "react";
import { io } from "socket.io-client";

export default function Admin() {
  const [groupId, setGroupId] = useState("");
  const [roundNumber, setRoundNumber] = useState(1);
  const [points, setPoints] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = io();
    socket.emit("updatePoints", { groupId, roundNumber, points });
    socket.disconnect();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Update Points</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="groupId"
              className="block text-sm font-medium text-gray-700"
            >
              Group ID
            </label>
            <input
              type="text"
              id="groupId"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="roundNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Round Number
            </label>
            <select
              id="roundNumber"
              value={roundNumber}
              onChange={(e) => setRoundNumber(parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {[1, 2, 3, 4, 5, 6].map((round) => (
                <option key={round} value={round}>
                  Round {round}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="points"
              className="block text-sm font-medium text-gray-700"
            >
              Points
            </label>
            <input
              type="number"
              id="points"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Update Points
          </button>
        </form>
      </div>
    </div>
  );
}

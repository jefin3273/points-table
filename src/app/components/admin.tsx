"use client";
import { useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [groupNumber, setGroupNumber] = useState<number>(1);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [points, setPoints] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const socket = io();

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("updatePoints", { groupNumber, roundNumber, points });
    });

    socket.on("error", (data: { message: string }) => {
      console.error("Error updating points:", data.message);
      setError(data.message);
    });

    socket.on("pointsUpdated", () => {
      console.log("Points updated successfully");
      setSuccess("Points updated successfully");
    });

    setTimeout(() => {
      socket.disconnect();
    }, 5000); // Disconnect after 5 seconds to ensure the event has been processed
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("../Login");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Update Points</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="groupNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Group Number
            </label>
            <select
              id="groupNumber"
              value={groupNumber}
              onChange={(e) => setGroupNumber(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((group) => (
                <option key={group} value={group} className="text-black">
                  Group {group}
                </option>
              ))}
            </select>
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
              onChange={(e) => setRoundNumber(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
            >
              {[1, 2, 3, 4, 5, 6].map((round) => (
                <option key={round} value={round} className="text-black">
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
              onChange={(e) => setPoints(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
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
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {success && <p className="mt-4 text-green-600">{success}</p>}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";

type Round = {
  id: string;
  number: number;
  points: number;
};

type Group = {
  id: string;
  Group_number: number;
  name: string;
  rounds: Round[];
};

export default function HomePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/getData");
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const initSocket = async () => {
      await fetch("/api/socket");
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to server");
      });

      newSocket.on("pointsUpdated", (updatedGroups: Group[]) => {
        console.log("Received updated groups:", updatedGroups);
        setGroups(updatedGroups);
      });

      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    };

    initSocket();

    return () => {
      if (socket) {
        console.log("Disconnecting socket");
        socket.disconnect();
      }
    };
  }, []);

  const getTotalPoints = (group: Group) => {
    return group.rounds.reduce((total, round) => total + round.points, 0);
  };

  const sortedGroups = [...groups].sort(
    (a, b) => getTotalPoints(b) - getTotalPoints(a)
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-black">
          Points Table
        </h1>
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group
                </th>
                {[1, 2, 3, 4, 5, 6].map((round) => (
                  <th
                    key={round}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    R{round}
                  </th>
                ))}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGroups.map((group, index) => (
                <motion.tr
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {group.name}
                  </td>
                  {[1, 2, 3, 4, 5, 6].map((round) => {
                    const roundData = group.rounds.find(
                      (r) => r.number === round
                    );
                    return (
                      <td
                        key={round}
                        className="px-4 py-2 whitespace-nowrap text-sm text-gray-500"
                      >
                        {roundData ? roundData.points : "-"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getTotalPoints(group)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

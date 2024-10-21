"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

type Round = {
  id: string;
  number: number;
  points: number;
};

type Group = {
  id: string;
  name: string;
  rounds: Round[];
};

export default function HomePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      await fetch("/api/socket");
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on("pointsUpdated", (updatedGroups: Group[]) => {
        setGroups(updatedGroups);
      });
    };

    initSocket();

    return () => {
      if (socket) {
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Points Table</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group
                </th>
                {[1, 2, 3, 4, 5, 6].map((round) => (
                  <th
                    key={round}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Round {round}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.name}
                  </td>
                  {[1, 2, 3, 4, 5, 6].map((round) => {
                    const roundData = group.rounds.find(
                      (r) => r.number === round
                    );
                    return (
                      <td
                        key={round}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {roundData ? roundData.points : "-"}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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

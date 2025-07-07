"use client";
import React from "react";

interface PlayerCharacter {
  name: string;
  sunSign: string;
  avatarUrl?: string;
}

export function CharacterList({
  characters,
}: {
  characters: PlayerCharacter[];
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {characters.map((user) => (
        <div key={user.name} className="flex items-center gap-2">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              ☀ {user.sunSign}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

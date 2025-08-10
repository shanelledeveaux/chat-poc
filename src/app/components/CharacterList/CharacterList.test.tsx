import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CharacterList } from "./CharacterList";

const characters = [
  { name: "Lyra", sunSign: "Pisces", avatarUrl: "/avatars/lyra.png" },
  { name: "Sol", sunSign: "Leo" },
];

describe("CharacterList", () => {
  it("renders character names and sun signs", () => {
    render(<CharacterList characters={characters} />);

    expect(screen.getByText("Lyra")).toBeInTheDocument();
    expect(screen.getByText("☀ Pisces")).toBeInTheDocument();
    expect(screen.getByText("Sol")).toBeInTheDocument();
    expect(screen.getByText("☀ Leo")).toBeInTheDocument();
  });

  it("renders avatar image if avatarUrl is provided", () => {
    render(<CharacterList characters={characters} />);

    const avatar = screen.getByRole("img", { name: "Lyra" });
    expect(avatar).toHaveAttribute("src", "/avatars/lyra.png");
  });

  it("does not render image if avatarUrl is missing", () => {
    render(<CharacterList characters={characters} />);

    expect(screen.queryByRole("img", { name: "Sol" })).toBeNull();
  });
});

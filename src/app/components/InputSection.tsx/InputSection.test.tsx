import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InputSection } from "./InputSection";

const mockCharacters = [
  { name: "Lyra", sunSign: "Pisces", avatarUrl: "/avatars/lyra.png" },
  { name: "Sol", sunSign: "Leo" },
];

describe("InputSection", () => {
  it("renders character avatars, names, and sun signs", () => {
    render(
      <InputSection
        characters={mockCharacters}
        question=""
        setQuestion={() => {}}
        onSearch={() => {}}
        disabled={false}
      />
    );

    expect(screen.getByText("Lyra")).toBeInTheDocument();
    expect(screen.getByText("Sol")).toBeInTheDocument();
    expect(screen.getByText("☀ Pisces")).toBeInTheDocument();
    expect(screen.getByText("☀ Leo")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/avatars/lyra.png");
  });

  it("updates question on input change", () => {
    const setQuestion = vi.fn();

    render(
      <InputSection
        characters={[]}
        question=""
        setQuestion={setQuestion}
        onSearch={() => {}}
        disabled={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/keywords/i), {
      target: { value: "alien ruins" },
    });

    expect(setQuestion).toHaveBeenCalledWith("alien ruins");
  });

  it("calls onSearch when button is clicked", () => {
    const onSearch = vi.fn();

    render(
      <InputSection
        characters={[]}
        question="test"
        setQuestion={() => {}}
        onSearch={onSearch}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(onSearch).toHaveBeenCalled();
  });
});

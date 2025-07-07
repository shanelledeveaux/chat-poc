import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InputSection } from "./InputSection";

describe("InputSection", () => {
  it("updates question on input change", () => {
    const setQuestion = vi.fn();

    render(
      <InputSection
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

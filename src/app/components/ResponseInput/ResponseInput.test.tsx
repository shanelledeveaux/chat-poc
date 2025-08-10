import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ResponseInput } from "./ResponseInput";

describe("ResponseInput", () => {
  it("renders textarea and button", () => {
    render(<ResponseInput onSubmit={() => {}} />);
    expect(
      screen.getByPlaceholderText(/what you'd do next/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit response/i })
    ).toBeInTheDocument();
  });

  it("updates textarea value on input", () => {
    render(<ResponseInput onSubmit={() => {}} />);
    const textarea = screen.getByPlaceholderText(/what you'd do next/i);
    fireEvent.change(textarea, { target: { value: "Investigate the ruins" } });
    expect(textarea).toHaveValue("Investigate the ruins");
  });

  it("calls onSubmit with input text and clears field", () => {
    const mockSubmit = vi.fn();
    render(<ResponseInput onSubmit={mockSubmit} />);

    const textarea = screen.getByPlaceholderText(/what you'd do next/i);
    const button = screen.getByRole("button", { name: /submit response/i });

    fireEvent.change(textarea, { target: { value: "Follow the shadow" } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith("Follow the shadow");
    expect(textarea).toHaveValue("");
  });

  it("does not call onSubmit for empty input", () => {
    const mockSubmit = vi.fn();
    render(<ResponseInput onSubmit={mockSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /submit response/i }));
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AnswerDisplay } from "./AnswerDisplay";

describe("AnswerDisplay", () => {
  it("renders Markdown content correctly", () => {
    const markdown = `## Heading\n\nThis is **bold** text and a [link](https://example.com).`;

    render(<AnswerDisplay content={markdown} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Heading"
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });
});

import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MainLayout from "./mainLayout";

import * as ReactRouterDom from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (role) => {
  localStorage.setItem("role", role);
  return render(
    <MemoryRouter>
      <ChakraProvider>
        <MainLayout />
      </ChakraProvider>
    </MemoryRouter>
  );
};

describe("MainLayout Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(ReactRouterDom.useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the correct menu items for ADMIN", () => {
    renderComponent("ADMIN");
    expect(screen.getByText(/Create Asset/i)).toBeInTheDocument();
    expect(screen.getByText(/Asset List/i)).toBeInTheDocument();
    expect(screen.getByText(/User List/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it("renders the correct menu items for EMPLOYEE", () => {
    renderComponent("EMPLOYEE");
    expect(screen.getByText(/Create Request/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/User List/i)).not.toBeInTheDocument();
  });

  it("renders the correct menu items for MANAGER", () => {
    renderComponent("MANAGER");
    expect(screen.getByText(/Asset List/i)).toBeInTheDocument();
    expect(screen.getByText(/Requests List/i)).toBeInTheDocument();
    expect(screen.queryByText(/Create Request/i)).not.toBeInTheDocument();
  });

  it("renders the header correctly", () => {
    renderComponent("ADMIN");
    expect(screen.getByTestId("header")).toHaveTextContent(
      "Asset Management System"
    );
  });

  it("renders icons for menu items", () => {
    renderComponent("ADMIN");

    expect(screen.getByText(/Create Asset/i)).toBeInTheDocument();
    expect(screen.getByText(/Asset List/i)).toBeInTheDocument();
    expect(screen.getByText(/User List/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();

    screen.debug();
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate, useParams } from "react-router-dom";
import { vi } from "vitest";
import { fetchUserDetails } from "../../services/admin";
import UserDetails from "./index";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

vi.mock("../../services/admin", () => ({
  fetchUserDetails: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const queryClient = new QueryClient();
const mockNavigate = vi.fn();

describe("UserDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ userId: "123" });
  });
  test("should render user details when data is loaded successfully", async () => {
    // Mock valid API response
    fetchUserDetails.mockResolvedValue({
      data: {
        history: [
          {
            id: 1,
            type: "Check-in",
            createdOn: "2024-02-01T12:00:00Z",
            Asset: { name: "Laptop", type: "Electronics" },
            user: {
              name: "John Doe",
              email: "john@example.com",
              role: "Admin",
              isActive: true,
            },
          },
        ],
      },
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UserDetails />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText("UserDetails.title"));

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("UserDetails.yes")).toBeInTheDocument();
  });

  test("should render error message if there is an error", async () => {
    fetchUserDetails.mockRejectedValue(
      new Error("Failed to fetch user details")
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UserDetails />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText(/UserDetails.error/i));

    expect(screen.getByText(/UserDetails.error/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Failed to fetch user details/i)
    ).toBeInTheDocument();
  });

  test("should render history if present", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useParams).mockReturnValue({ userId: "123" });

    const mockHistoryData = {
      data: {
        history: [
          {
            user: {
              name: "John Doe",
              email: "john.doe@example.com",
              role: "Admin",
              isActive: true,
            },
            Asset: { name: "Asset 1", type: "Type 1" },
            createdOn: "2025-02-04T12:00:00Z",
          },
        ],
      },
    };

    vi.mocked(fetchUserDetails).mockResolvedValueOnce(mockHistoryData);

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <UserDetails />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("UserDetails.history"));

    expect(screen.getByText("UserDetails.type")).toBeInTheDocument();
    expect(screen.getByText("UserDetails.asset")).toBeInTheDocument();
    expect(screen.getByText("UserDetails.date")).toBeInTheDocument();
  });

  test("should go back when 'Go Back' button is clicked", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useParams).mockReturnValue({ userId: "123" });

    const mockUserData = {
      data: {
        history: [
          {
            user: {
              name: "John Doe",
              email: "john.doe@example.com",
              role: "Admin",
              isActive: true,
            },
            Asset: { name: "Asset 1", type: "Type 1" },
            createdOn: "2025-02-04T12:00:00Z",
          },
        ],
      },
    };

    vi.mocked(fetchUserDetails).mockResolvedValueOnce(mockUserData);

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <UserDetails />
        </QueryClientProvider>
      </MemoryRouter>
    );

    const goBackButton = await screen.findByText("UserDetails.back");

    fireEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

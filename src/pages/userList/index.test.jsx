import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { vi } from "vitest";
import { fetchUsers } from "../../services/admin";
import UserList from "./index";

vi.mock("../../services/admin", () => ({
  fetchUsers: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

describe("UserList Component", () => {
  const mockUsers = [
    {
      id: 1,
      name: "User One",
      email: "userone@example.com",
      role: "Admin",
      isActive: true,
    },
    {
      id: 2,
      name: "User Two",
      email: "usertwo@example.com",
      role: "User",
      isActive: false,
    },
  ];

  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <ChakraProvider>
          <MemoryRouter>
            <UserList />
          </MemoryRouter>
        </ChakraProvider>
      </QueryClientProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders error message if user fetching fails", async () => {
    fetchUsers.mockRejectedValue(new Error("Failed to fetch users"));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("UserList.error")).toBeInTheDocument();
    });
  });

  test("renders user list when data is loaded", async () => {
    fetchUsers.mockResolvedValue({ data: mockUsers });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("User One")).toBeInTheDocument();
      expect(screen.getByText("userone@example.com")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(screen.getByText("User Two")).toBeInTheDocument();
      expect(screen.getByText("usertwo@example.com")).toBeInTheDocument();
      expect(screen.getByText("User")).toBeInTheDocument();
      expect(screen.getByText("No")).toBeInTheDocument();
    });
  });

  test("calls handleViewDetails and navigates when view button is clicked", async () => {
    fetchUsers.mockResolvedValue({ data: mockUsers });
    const mockNavigate = vi.fn();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    renderComponent();

    await waitFor(() => screen.getByText("User One"));

    fireEvent.click(screen.getByTestId("view-button-1"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/app/user-details/1");
    });
  });
});

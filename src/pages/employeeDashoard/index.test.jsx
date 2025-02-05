import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { deleteRequest, fetchRequest } from "../../services/emplyee";
import RequestEmployeeList from "./index";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockToast = vi.fn();
vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

vi.mock("../../services/emplyee", () => ({
  fetchRequest: vi.fn(),
  deleteRequest: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        cacheTime: 0,
      },
    },
  });

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("RequestEmployeeList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows error message if data fetch fails", async () => {
    fetchRequest.mockRejectedValue(new Error("API Error"));

    renderWithProviders(<RequestEmployeeList />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "RequestList.loadError",
          status: "error",
        })
      );
    });
  });

  test("renders a list of requests when data is available", async () => {
    fetchRequest.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Laptop",
          type: "REQUEST_ASSET",
          status: "PENDING",
          reason: "Need it",
          assetId: "123",
        },
        {
          id: 2,
          name: "Monitor",
          type: "RETURN_ASSET",
          status: "APPROVED",
          reason: "No longer needed",
          assetId: "456",
        },
      ],
    });

    renderWithProviders(<RequestEmployeeList />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
      expect(screen.getByText("Monitor")).toBeInTheDocument();
    });
  });

  test("disables delete button for non-pending requests", async () => {
    fetchRequest.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Laptop",
          type: "REQUEST_ASSET",
          status: "PENDING",
          reason: "Need it",
          assetId: "123",
        },
        {
          id: 2,
          name: "Monitor",
          type: "RETURN_ASSET",
          status: "APPROVED",
          reason: "No longer needed",
          assetId: "456",
        },
      ],
    });

    renderWithProviders(<RequestEmployeeList />);

    await waitFor(() => {
      const deleteButton = screen.getByLabelText("RequestList.delete");
      expect(deleteButton).toBeEnabled();

      expect(screen.getByText("RequestList.cannotDelete")).toBeInTheDocument();
    });
  });

  test("deletes a pending request successfully", async () => {
    fetchRequest.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Laptop",
          type: "REQUEST_ASSET",
          status: "PENDING",
          reason: "Need it",
          assetId: "123",
        },
      ],
    });

    deleteRequest.mockResolvedValue({ message: "Deleted successfully" });

    renderWithProviders(<RequestEmployeeList />);

    await waitFor(() => screen.getByText("Laptop"));

    const deleteButton = screen.getByLabelText("RequestList.delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteRequest).toHaveBeenCalledWith(1);
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "RequestList.deleted",
          status: "success",
        })
      );
    });
  });

  test("shows an error toast if delete request fails", async () => {
    fetchRequest.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Laptop",
          type: "REQUEST_ASSET",
          status: "PENDING",
          reason: "Need it",
          assetId: "123",
        },
      ],
    });

    deleteRequest.mockRejectedValue(new Error("Delete failed"));

    renderWithProviders(<RequestEmployeeList />);

    await waitFor(() => screen.getByText("Laptop"));

    const deleteButton = screen.getByLabelText("RequestList.delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "RequestList.deleteError",
          status: "error",
        })
      );
    });
  });
});

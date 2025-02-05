import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import RequestList from "./index";
import { fetchRequest, approveRequest, rejectRequest } from "../../services/manager";

vi.mock("../../services/manager", () => ({
  fetchRequest: vi.fn(),
  approveRequest: vi.fn(),
  rejectRequest: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("RequestList Component", () => {
  const mockRequests = [
    {
      id: 1,
      name: "Request 1",
      type: "NEW_ASSET",
      status: "PENDING",
      reason: "Test Reason",
      assetId: "A123",
      userId: "U001",
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
          <RequestList />
        </ChakraProvider>
      </QueryClientProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders error message if request fetching fails", async () => {
    fetchRequest.mockRejectedValue(new Error("Failed to fetch"));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("ManagerRequestList.error")).toBeInTheDocument();
    });
  });

  test("renders request list when data is loaded", async () => {
    fetchRequest.mockResolvedValue({ data: mockRequests });
    await renderComponent();  // Ensure that the render is awaited
    await waitFor(() => {
      expect(screen.getByText("Request 1")).toBeInTheDocument();
      expect(screen.getByText(/NEW ASSET/i)).toBeInTheDocument();
      expect(screen.getByText("Test Reason")).toBeInTheDocument();
    });
  });

  test("approves a request when approve button is clicked", async () => {
    fetchRequest.mockResolvedValue({ data: mockRequests });
    approveRequest.mockResolvedValue({ success: true });
    renderComponent();
    
    await waitFor(() => expect(screen.getByText("Request 1")).toBeInTheDocument(), { timeout: 5000 });
    fireEvent.click(screen.getByText("ManagerRequestList.approve"));
    
    fireEvent.change(screen.getByLabelText("ManagerRequestList.assetId"), { target: { value: "A123" } });
    fireEvent.change(screen.getByLabelText("ManagerRequestList.approvalComment"), { target: { value: "Approved" } });
    fireEvent.click(screen.getByText("common.submit"));
    
    await waitFor(() => {
      expect(approveRequest).toHaveBeenCalledWith(1, { assetId: "A123", reason: "Approved" });
    }, { timeout: 5000 });
  });

  test("rejects a request when reject button is clicked", async () => {
    fetchRequest.mockResolvedValue({ data: mockRequests });
    rejectRequest.mockResolvedValue({ success: true });
    renderComponent();
    
    await waitFor(() => expect(screen.getByText("Request 1")).toBeInTheDocument(), { timeout: 5000 });
    
    fireEvent.click(screen.getByText("ManagerRequestList.reject"));
    fireEvent.change(screen.getByLabelText("ManagerRequestList.rejectionReason"), { target: { value: "Invalid request" } });
    fireEvent.click(screen.getByText("common.submit"));
    
    await waitFor(() => {
      expect(rejectRequest).toHaveBeenCalledWith(1, { reason: "Invalid request" });
    }, { timeout: 5000 });
  });
});

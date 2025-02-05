import { ChakraProvider, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";
import i18n from "../../i18n";
import { createAsset } from "../../services/admin";
import AddAssetForm from "./index";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: vi.fn(),
  };
});

vi.mock("../../services/admin", () => ({
  createAsset: vi.fn(),
}));

describe("AddAssetForm Component", () => {
  const mockToast = vi.fn();
  const mockNavigate = vi.fn();
  const mockMutate = vi.fn();
  const mockCreateAsset = vi.fn();

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue(mockToast);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: false,
      isLoading: false,
    });
    vi.mocked(createAsset).mockImplementation(mockCreateAsset);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <AddAssetForm />
        </I18nextProvider>
      </ChakraProvider>
    );

  it("renders the form correctly", () => {
    renderComponent();
    expect(screen.getByLabelText(/asset name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asset type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asset identifier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purchase date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/warranty end date/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add asset/i })
    ).toBeInTheDocument();
  });

  it("submits the form with valid data and calls mutation function", async () => {
    renderComponent();

    // Fill in the form fields
    fireEvent.input(screen.getByLabelText(/asset name/i), {
      target: { value: "Laptop" },
    });
    fireEvent.input(screen.getByLabelText(/asset type/i), {
      target: { value: "Electronics" },
    });
    fireEvent.input(screen.getByLabelText(/asset identifier/i), {
      target: { value: "1234" },
    });
    fireEvent.input(screen.getByLabelText(/purchase date/i), {
      target: { value: "2025-02-04" },
    });
    fireEvent.input(screen.getByLabelText(/warranty end date/i), {
      target: { value: "2026-02-04" },
    });

    // Click on the submit button
    fireEvent.click(screen.getByRole("button", { name: /add asset/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: "Laptop",
        type: "Electronics",
        assetIdentifier: "1234",
        purchaseDate: "2025-02-04",
        warrantyEndDate: "2026-02-04",
      });
    });
  });

  it("shows validation errors for empty form fields", async () => {
    renderComponent();

    // Submit the form without filling the fields
    fireEvent.click(screen.getByRole("button", { name: /add asset/i }));

    expect(
      await screen.findByText(/asset name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/asset type is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/asset identifier is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/purchase date is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/warranty end date is required/i)
    ).toBeInTheDocument();
  });

  it("shows success toast and navigates on successful asset creation", async () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isSuccess: true,
      isError: false,
      isLoading: false,
    });

    renderComponent();

    // Fill in valid form data
    fireEvent.input(screen.getByLabelText(/asset name/i), {
      target: { value: "Laptop" },
    });
    fireEvent.input(screen.getByLabelText(/asset type/i), {
      target: { value: "Electronics" },
    });
    fireEvent.input(screen.getByLabelText(/asset identifier/i), {
      target: { value: "1234" },
    });
    fireEvent.input(screen.getByLabelText(/purchase date/i), {
      target: { value: "2025-02-04" },
    });
    fireEvent.input(screen.getByLabelText(/warranty end date/i), {
      target: { value: "2026-02-04" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add asset/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: i18n.t("Asset.successMessage"),
        status: "success",
      });

      expect(mockNavigate).toHaveBeenCalledWith("/app/asset-list");
    });
  });

  it("shows error toast if asset creation fails", async () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: true,
      isLoading: false,
      error: { message: "Error adding asset" },
    });

    renderComponent();

    // Fill in valid form data
    fireEvent.input(screen.getByLabelText(/asset name/i), {
      target: { value: "Laptop" },
    });
    fireEvent.input(screen.getByLabelText(/asset type/i), {
      target: { value: "Electronics" },
    });
    fireEvent.input(screen.getByLabelText(/asset identifier/i), {
      target: { value: "1234" },
    });
    fireEvent.input(screen.getByLabelText(/purchase date/i), {
      target: { value: "2025-02-04" },
    });
    fireEvent.input(screen.getByLabelText(/warranty end date/i), {
      target: { value: "2026-02-04" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add asset/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error adding asset",
        description: "Error adding asset",
        status: "error",
      });
    });
  });
});

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useDeferredValue,
} from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  IconButton,
  Tooltip,
  Modal,
  TextField,
  InputAdornment,
  Autocomplete,
  CircularProgress,
  ButtonGroup,
} from "@mui/material";
import {
  CheckCircleIcon,
  ClipboardList,
  Droplets,
  FileSpreadsheet,
  MapPin,
  RefreshCcw,
  Scissors,
  Syringe,
  Trash2,
} from "lucide-react";
import ExcelLogo from "../assets/excel.png";
import {DataGridPro}  from "@mui/x-data-grid-pro";
import {
  CloudUpload,
  Description,
  Assessment,
  Person,
  LocalHospital,
  DateRange,
  Delete,
  Refresh,
  CheckCircle,
  Close,
  Search,
  Clear,
} from "@mui/icons-material";
import ProfessionalFooter from "./Footer";
import logo from "./logo.png";
import { parseAncillaryDataAsync } from "./utils";
import FloatingDeleteButton from "./FloatingDeleteButton";

import { ToastContainer, toast } from "react-toastify";
import { TestSwitcher } from "./ButtonType";
import PremiumHeader from "./Header";
import FileUpload from "./FileUpload";
import StatsCards, {  statsConfig } from "./StatsCard";
import { motion, useAnimation } from "framer-motion";
import EnterpriseModal from "./StateConfigMode";
import ReportPeriodCard from "./ReportPeriodCard";
import AppleGlassInput from "./AppleGlassInput";
import GlassFileHeader from "./GlassFileHeader";
import {
  appConfig,
  THEME_MODES,
  getResolvedThemeMode,
  subscribeToThemeChanges,
} from "./appConfig";
import AnimatedTabs from "./AnimatedTabs";


// Variants for the Parent Container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each child waits 0.1s before starting
      delayChildren: 0.3, // Initial delay before first child appears
    },
  },
};

// Variants for each Child Component
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

let xlsxModulePromise;

const getXLSX = async () => {
  if (!xlsxModulePromise) {
    xlsxModulePromise = import("xlsx");
  }
  return xlsxModulePromise;
};

const columnsBase = [
  {
    field: "patientName",
    headerName: "Name",
    width: 250,
    editable: true,
    renderCell: (params) => (
      <Box className="flex items-center">
        <Person className="mr-2 text-gray-400" fontSize="small" />
        {params.value}
      </Box>
    ),
  },
  { field: "mrn", headerName: "MRN (Import)", width: 120, editable: true },
  {
    field: "category",
    headerName: "Ancillary Service Category",
    width: 200,
    editable: true,
  },
  { field: "testName", headerName: "Test Name", width: 300, editable: true },
  {
    field: "physician",
    headerName: "Ordering Physician",
    width: 200,
    editable: true,
  },
  {
    field: "dateOrdered",
    headerName: "Date Ordered",
    width: 150,
    renderCell: (params) => (
      <Box className="flex items-center">
        <DateRange className="mr-2 text-gray-400" fontSize="small" />
        {params.value}
      </Box>
    ),
    editable: true,
  },
  { field: "state", headerName: "State", width: 100, editable: true },
  // { field: 'status', headerName: 'Order/Fax Status', width: 250 },
  { field: "uid", headerName: "UID", width: 850 },
];

const clinics = [
  { clinicName: "Personic Virtual Clinic, LLC", stateCode: "MD" },
  { clinicName: "American Wound Care AL, PLLC", stateCode: "AL" },
  { clinicName: "Personic Connecticut, PLLC", stateCode: "CT" },
  { clinicName: "WoundMD", stateCode: "FL" },
  { clinicName: "Personic Wound Care Illinois, PLLC", stateCode: "IL" },
  { clinicName: "American Wound Care KY, PLLC", stateCode: "KY" },
  { clinicName: "American Woundcare Medicine PLLC", stateCode: "NY" },
  { clinicName: "Personic Health Care, LLC", stateCode: "PA" },
  { clinicName: "WoundMD TN PLLC", stateCode: "TN" },
  { clinicName: "Personic Woundcare PLLC", stateCode: "TX" },
  { clinicName: "Permium Healthcare, LLC", stateCode: "VA" },
  { clinicName: "WoundMD SC", stateCode: "WI" },
  { clinicName: "Personic Training & Test", stateCode: "TS" },
];

const US_STATE_CODES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

// Enhanced Dark theme with premium styling
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4f8cff",
      light: "#8ab4ff",
      dark: "#2a6bff",
    },
    secondary: {
      main: "#38bdf8",
      light: "#7dd3fc",
      dark: "#0284c7",
    },
    background: {
      default: "rgba(0, 0, 0, 0)",
      paper: "rgba(12, 14, 20, 0.68)",
    },
    success: {
      main: "#4ade80",
    },
    error: {
      main: "#ef4444",
    },
  },
  typography: {
    fontFamily: '"Manrope", "Space Grotesk", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "rgba(0, 0, 0, 0)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(12, 14, 20, 0.68)",
          borderRadius: 20,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(26px) saturate(170%)",
          boxShadow: "0 26px 70px rgba(0, 0, 0, 0.55)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
          backdropFilter: "blur(12px)",
        },
        contained: {
          background: "rgba(240, 242, 247, 0.9)",
          color: "#0a0e16",
          boxShadow: "0 16px 36px rgba(0, 0, 0, 0.4)",
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.18)",
          color: "rgba(229, 231, 235, 0.9)",
          background: "rgba(8, 10, 14, 0.45)",
        },
        text: {
          color: "#e5e7eb",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          border: "1px solid rgba(255, 255, 255, 0.14)",
          backgroundColor: "rgba(12, 14, 20, 0.62)",
          backdropFilter: "blur(24px) saturate(165%)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "rgba(229, 231, 235, 0.8)",
          backdropFilter: "blur(18px)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "rgba(8, 10, 14, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(18px)",
        },
        notchedOutline: {
          border: "none",
        },
        input: {
          color: "#e5e7eb",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#e5e7eb",
        },
        input: {
          "&::placeholder": {
            color: "rgba(229, 231, 235, 0.5)",
          },
        },
      },
    },
  },

});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2f6bff",
    },
    secondary: {
      main: "#0ea5e9",
    },
    background: {
      default: "rgba(255, 255, 255, 0)",
      paper: "rgba(255, 255, 255, 0.82)",
    },
    text: {
      primary: "#0f172a",
      secondary: "#334155",
    },
  },
  typography: {
    fontFamily: '"Manrope", "Space Grotesk", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "rgba(255, 255, 255, 0)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(255, 255, 255, 0.82)",
          borderRadius: 20,
          border: "1px solid rgba(15, 23, 42, 0.12)",
          backdropFilter: "blur(22px) saturate(150%)",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
        },
      },
    },
  },
});

const tabConfig = {
  ancillary: {
    label: "Ancillary Orders",
    icon: <ClipboardList className="w-4 h-4 mr-2" />,
  },
  surgical: {
    label: "Surgical Debridement Orders",
    icon: <Scissors className="w-4 h-4 mr-2" />,
  },
  ultramist: {
    label: "Ultramist Debridement Orders",
    icon: <Droplets className="w-4 h-4 mr-2" />,
  },
  surveillance: {
    label: "Wound Surveillance Visits Orders",
    icon: <Droplets className="w-4 h-4 mr-2" />,
  },
};

// Main Component
export default function AncillaryDataParser() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("ancillary"); // 'ancillary', 'surgical', 'ultramist', 'mainsheet'
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Multi-file upload states
  const [uploadedFiles, setUploadedFiles] = useState([]); // Array of { id, file, name, stateCode, status, result, error }
  const [viewMode, setViewMode] = useState("upload"); // 'upload', 'config', 'processing', 'results'
  const [globalStateCode, setGlobalStateCode] = useState("");

  const [open, setOpen] = useState(false); // Used for what? Maybe keep for legacy or repurpose
  const [selectedPreviewId, setSelectedPreviewId] = useState(null);
  const [previewCache, setPreviewCache] = useState({});
  const [previewLoadingId, setPreviewLoadingId] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processStart, setProcessStart] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isSelect, setIsSelect] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = React.useState({
    type: "include",
    ids: new Set(),
  });
  const [stateProgress, setStateProgress] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [sortModel, setSortModel] = useState([]);
  const [filterState, setFilterState] = useState("ALL"); // 'ALL' or specific state code like 'IL'
  const [searchQuery, setSearchQuery] = useState("");
  const [showMissingDataOnly, setShowMissingDataOnly] = useState(false);

  const progressRafRef = useRef(null);
  const progressMapRef = useRef(new Map());
  const hasShownMissingPhysicianAlertRef = useRef(false);

  const controls = useAnimation();
  const [resolvedThemeMode, setResolvedThemeMode] = useState(
    getResolvedThemeMode(),
  );
  const isLightMode = resolvedThemeMode === THEME_MODES.LIGHT;
  const pageTextColor = isLightMode ? "#0f172a" : "#e5e7eb";
  const subtleTextColor = isLightMode
    ? "rgba(15, 23, 42, 0.68)"
    : "rgba(255,255,255,0.6)";
  const panelBackground = isLightMode
    ? "rgba(255, 255, 255, 0.78)"
    : "rgba(12, 14, 18, 0.6)";
  const panelBorder = isLightMode
    ? "1px solid rgba(15, 23, 42, 0.12)"
    : "1px solid rgba(255, 255, 255, 0.16)";

  const flushProgressUpdates = useCallback((totalFiles) => {
    const progressEntries = Array.from(progressMapRef.current.entries());

    if (progressEntries.length > 0) {
      setUploadedFiles((prev) =>
        prev.map((fileObj) => {
          const match = progressEntries.find(([id]) => id === fileObj.id);
          if (!match) return fileObj;
          return { ...fileObj, progress: match[1] };
        }),
      );
    }

    if (totalFiles > 0) {
      const totalProgress =
        Array.from(progressMapRef.current.values()).reduce(
          (sum, value) => sum + value,
          0,
        ) / totalFiles;
      setProgress(Number(totalProgress.toFixed(2)));
    }

    progressRafRef.current = null;
  }, []);

  const scheduleProgressUpdate = useCallback(
    (fileId, value, totalFiles) => {
      progressMapRef.current.set(fileId, value);

      if (progressRafRef.current) return;

      progressRafRef.current = requestAnimationFrame(() => {
        flushProgressUpdates(totalFiles);
      });
    },
    [flushProgressUpdates],
  );

  const normalizeClinicName = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  const clinicStateLookup = useMemo(() => {
    const lookup = new Map();
    clinics.forEach((clinic) => {
      lookup.set(normalizeClinicName(clinic.clinicName), clinic.stateCode);
    });
    return lookup;
  }, []);

  const buildStateOptions = useCallback(
    (sourceCode) => {
      const options = new Set();
      if (sourceCode) options.add(sourceCode);
      if (globalStateCode) options.add(globalStateCode);
      US_STATE_CODES.forEach((code) => options.add(code));
      return Array.from(options);
    },
    [globalStateCode],
  );

  useEffect(() => {
    controls.start("hidden").then(() => {
      controls.start("visible");
    });

    document.title = `${appConfig.appName.first + appConfig.appName.second} ${appConfig.version} - Personic Health`;
  }, []);

  useEffect(() => {
    setResolvedThemeMode(getResolvedThemeMode());
    const unsubscribeTheme = subscribeToThemeChanges((nextResolvedMode) => {
      setResolvedThemeMode(nextResolvedMode);
    });

    return () => {
      unsubscribeTheme();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (progressRafRef.current) {
        cancelAnimationFrame(progressRafRef.current);
      }
    };
  }, []);

  // Handle delete rows
  const handleDelete = async () => {
    try {
      setIsDeleting(true);


      let updatedRows = { ...data };


      if (activeTab === "ancillary" || activeTab === "mainsheet") {
        updatedRows.parsedGeneral = (data.parsedGeneral || []).filter(
          (row) => !selectedIds.ids.has(row.id),
        );
      }
      else if (activeTab === "ultramist") {
        updatedRows.parsedTherapies = (data.parsedTherapies || []).filter(
          (row) => !selectedIds.ids.has(row.id),
        );
      }
      else if (activeTab === "surgical") {
        updatedRows.parsedSurgical = (data.parsedSurgical || []).filter(
          (row) => !selectedIds.ids.has(row.id),
        );
      }
      else if (activeTab === "surveillance") {
        updatedRows.parsedWoundSurveilance = (data.parsedWoundSurveilance || []).filter(
          (row) => !selectedIds.ids.has(row.id),
        );
      }


      await new Promise((resolve) => setTimeout(resolve, 300));

      setIsDeleting(false);
      setData(updatedRows);
      setSelectedIds({ type: "include", ids: new Set() });
       toast.success(
        <div className="flex items-center gap-2">
          <Trash2 size={20} className="text-green-600" />
          Deleted successfully!
        </div>,
        {
          position: "top-center",
          theme: isLightMode ? "light" : "dark",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      );
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <Close size={20} className="text-red-600" />
          Failed to delete rows!
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          theme: isLightMode ? "light" : "dark",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      );
      setIsDeleting(false);
    } finally {
     
      setIsSelect(false);
      setIsDeleting(false);
    }
  };

  // Filter data based on active tab and state filter
  const requiredFieldConfig = useMemo(
    () => [
      { key: "patientName", label: "Patient Name" },
      { key: "mrn", label: "MRN" },
      { key: "category", label: "Category" },
      { key: "testName", label: "Test Name" },
      { key: "physician", label: "Ordering Physician" },
      { key: "dateOrdered", label: "Date Ordered" },
      { key: "state", label: "State" },
      { key: "uid", label: "UID" },
    ],
    [],
  );

  const ordersWithMissingColumns = useMemo(() => {
    if (!data) return [];

    return [
      ...(data.parsedGeneral || []).map((row) => ({ ...row, orderType: "Ancillary" })),
      ...(data.parsedSurgical || []).map((row) => ({ ...row, orderType: "Surgical" })),
      ...(data.parsedTherapies || []).map((row) => ({ ...row, orderType: "Ultramist" })),
      ...(data.parsedWoundSurveilance || []).map((row) => ({ ...row, orderType: "Surveillance" })),
    ]
      .map((row) => {
        const missingFields = requiredFieldConfig
          .filter((field) => !String(row[field.key] || "").trim())
          .map((field) => field.label);

        return {
          ...row,
          missingFields,
        };
      })
      .filter((row) => row.missingFields.length > 0);
  }, [data, requiredFieldConfig]);

  const missingPhysicianOrders = useMemo(
    () =>
      ordersWithMissingColumns.filter((row) =>
        row.missingFields.includes("Ordering Physician"),
      ),
    [ordersWithMissingColumns],
  );

  const missingColumnSummary = useMemo(() => {
    const summaryMap = new Map();

    ordersWithMissingColumns.forEach((row) => {
      row.missingFields.forEach((fieldLabel) => {
        summaryMap.set(fieldLabel, (summaryMap.get(fieldLabel) || 0) + 1);
      });
    });

    return Array.from(summaryMap.entries()).map(([label, count]) => ({
      label,
      count,
    }));
  }, [ordersWithMissingColumns]);

  const missingDataIds = useMemo(
    () => new Set(ordersWithMissingColumns.map((row) => row.id)),
    [ordersWithMissingColumns],
  );

  const filteredRows = useMemo(() => {
    if (!data) return [];

    let rows = [];

    if (activeTab === "ancillary") rows = data.parsedGeneral || [];
    else if (activeTab === "surgical") rows = data.parsedSurgical || [];
    else if (activeTab === "ultramist") rows = data.parsedTherapies || [];
    else if (activeTab === "surveillance") rows = data.parsedWoundSurveilance || [];
    else if (activeTab === "mainsheet") {
      // Combine all
      rows = [
        ...(data.parsedGeneral || []).map((r) => ({ ...r, type: "Ancillary" })),
        ...(data.parsedSurgical || []).map((r) => ({ ...r, type: "Surgical" })),
        ...(data.parsedTherapies || []).map((r) => ({
          ...r,
          type: "Ultramist",
        })),
      ];
    }

    if (filterState !== "ALL") {
      rows = rows.filter((r) => r.state === filterState);
    }

    if (showMissingDataOnly) {
      rows = rows.filter((r) => missingDataIds.has(r.id));
    }

    

    return rows;
  }, [
    data,
    activeTab,
    filterState,
    showMissingDataOnly,
    missingDataIds,
  ]);

  useEffect(() => {
    if (!data || ordersWithMissingColumns.length === 0) return;
    if (hasShownMissingPhysicianAlertRef.current) return;

    hasShownMissingPhysicianAlertRef.current = true;
    // setShowMissingDataOnly(true);
    setOpen(true);
  }, [data, ordersWithMissingColumns]);

  const deferredSearchQuery = useDeferredValue(
    searchQuery.trim().toLowerCase(),
  );

  const currentData = useMemo(() => {
    if (!deferredSearchQuery) return filteredRows;

    return filteredRows.filter((row) => {
      const searchableText = [
        row.patientName,
        row.mrn,
        row.category,
        row.testName,
        row.physician,
        row.state,
        row.uid,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(deferredSearchQuery);
    });
  }, [filteredRows, deferredSearchQuery]);

  const handleSortModelChange = useCallback((model) => {
    setSortModel(model);
  }, []);

  // Generate flexible columns
  const columns = useMemo(() => {
    const base =
      activeTab === "ancillary"
        ? columnsBase
        : columnsBase.filter((col) => col.field !== "status");

    // Add type column for mainsheet
    if (activeTab === "mainsheet") {
      return [{ field: "type", headerName: "Type", width: 120 }, ...base];
    }
    return base;
  }, [activeTab]);

  const readSheetRows = async (file) => {
    const XLSX = await getXLSX();
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    return { rows, firstSheetName };
  };

  // Validation helper
  const validateRows = (jsonData) => {
    if (jsonData.length === 0) return { valid: false, error: "Empty file." };

    const headers = jsonData[0];
    const requiredColumns = ["Pending Orders"];
    if (!requiredColumns.every((col) => headers.includes(col))) {
      return {
        valid: false,
        error: "Invalid format. Missing 'Pending Orders'.",
      };
    }

    const reportPeriodRaw = headers[4];
    if (!reportPeriodRaw || !String(reportPeriodRaw).includes("-")) {
      return { valid: false, error: "Invalid report period." };
    }

    return { valid: true, rows: jsonData };
  };

  const validateFile = async (file) => {
    try {
      const { rows } = await readSheetRows(file);
      return validateRows(rows);
    } catch (e) {
      return { valid: false, error: "Read error." };
    }
  };

  const handleFileUpload = async (files) => {
    // Files is now an array
    setLoading(true);
    setIsUploading(true);
    setError(null);

    setSelectedPreviewId(null);
    setPreviewCache({});
    setPreviewLoadingId(null);
    setPreviewError(null);

    const newFiles = Array.isArray(files) ? files : [files];
    const placeholders = newFiles.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      name: f.name,
      stateCode: "",
      sourceStateCode: "",
      status: "loading",
      clinicName: "",
      error: null,
    }));

    setUploadedFiles((prev) => [...prev, ...placeholders]);
    setViewMode("config");

    try {
      const fileObjs = await Promise.all(
        placeholders.map(async (entry) => {
          let clinicName = "";
          let inferredState = "";
          let error = null;
          let status = "pending";
          try {
            const { rows: jsonData } = await readSheetRows(entry.file);

            clinicName = jsonData?.[1]?.[0];

            const validation = validateRows(jsonData);
            if (!validation.valid) {
              error = validation.error;
              status = "error";
            }

            const lookupKey = normalizeClinicName(clinicName);
            inferredState = clinicStateLookup.get(lookupKey) || "";
          } catch (err) {
            inferredState = "";
            status = "error";
            error = "File could not be read.";
          }

          return {
            ...entry,
            stateCode: inferredState,
            sourceStateCode: inferredState,
            status,
            clinicName,
            error,
          };
        }),
      );

      setUploadedFiles((prev) =>
        prev.map((f) => fileObjs.find((updated) => updated.id === f.id) || f),
      );
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((f) => f.id !== id);
      if (newFiles.length === 0) {
        // If no files left, go back to upload, but we handle this in the render usually
        setViewMode("upload");
      }
      return newFiles;
    });

    if (selectedPreviewId === id) {
      setSelectedPreviewId(null);
    }
  };

  const updateFileStateCode = (id, code) => {
    const upper = code.toUpperCase();
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, stateCode: upper } : f)),
    );
    setPreviewCache((prev) => {
      if (!prev[id]) return prev;
      const updatedRows = (prev[id].rows || []).map((row) =>
        row?.state !== undefined ? { ...row, state: upper } : row,
      );
      return {
        ...prev,
        [id]: {
          ...prev[id],
          rows: updatedRows,
        },
      };
    });
  };

  const applyGlobalStateCode = (code) => {
    const upper = code.toUpperCase();
    setGlobalStateCode(upper);
    setUploadedFiles((prev) => prev.map((f) => ({ ...f, stateCode: upper })));
    setPreviewCache((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        const entry = next[key];
        const updatedRows = (entry.rows || []).map((row) =>
          row?.state !== undefined ? { ...row, state: upper } : row,
        );
        next[key] = {
          ...entry,
          rows: updatedRows,
        };
      });
      return next;
    });
  };

  const extractReportPeriod = (rows) => {
    const headerRow = rows?.[0] || [];
    const reportPeriodRaw = headerRow[4];
    if (!reportPeriodRaw || !String(reportPeriodRaw).includes("-")) return null;
    const [startDate, endDate] = String(reportPeriodRaw)
      .split("-")
      .map((value) => value.trim());

    return { startDate, endDate };
  };

  const buildPreviewForFile = async (fileObj) => {
    if (!fileObj?.file) return;

    setPreviewLoadingId(fileObj.id);
    setPreviewError(null);

    try {
      // const { rows: jsonData, firstSheetName } = await readSheetRows(fileObj.file);
      const { rows: jsonData, firstSheetName } = await readSheetRows(fileObj.file);

      
      if (!jsonData.length) {
        throw new Error("No data found in file");
      }

      const clinicNameRaw = jsonData?.[1]?.[0];
      const clinicName = clinicNameRaw ? String(clinicNameRaw).trim() : "";
      const reportPeriod = extractReportPeriod(jsonData);

      const stateToUse = fileObj.stateCode || globalStateCode || "UNK";
      const parsed = await parseAncillaryDataAsync(jsonData, stateToUse);



      const previewColumns = [
        { field: "type", headerName: "Type", width: 120 },
        { field: "patientName", headerName: "Name", minWidth: 160, flex: 1 },
        { field: "mrn", headerName: "MRN", width: 120 },
        { field: "category", headerName: "Category", minWidth: 180, flex: 1 },
        { field: "testName", headerName: "Test", minWidth: 220, flex: 1 },
        { field: "physician", headerName: "Physician", minWidth: 180, flex: 1 },
        { field: "dateOrdered", headerName: "Date", width: 120 },
        { field: "state", headerName: "State", width: 90 },
      ];

      const combinedParsed = [
        ...(parsed.parsedGeneral || []).map((r) => ({
          ...r,
          type: "Ancillary",
        })),
        ...(parsed.parsedSurgical || []).map((r) => ({
          ...r,
          type: "Surgical",
        })),
        ...(parsed.parsedTherapies || []).map((r) => ({
          ...r,
          type: "Ultramist",
        })),
        ...(parsed.parsedSurveillanceVisits || []).map((r) => ({
          ...r,
          type: "Surveillance",
        })),
      ];

      let rows = combinedParsed.slice(0, 20).map((row, index) => ({
        ...row,
        id: `preview-${index}`,
      }));

      if (rows.length === 0) {
        const headerRow = jsonData[0] || [];
        const rawColumns = headerRow.map((header, index) => ({
          field: `c${index}`,
          headerName: header ? String(header) : `Column ${index + 1}`,
          flex: 1,
          minWidth: 140,
        }));

        rows = jsonData.slice(1, 26).map((row, rowIndex) => {
          const rowObj = { id: `row-${rowIndex}` };
          rawColumns.forEach((col, colIndex) => {
            rowObj[col.field] = row?.[colIndex] ?? "";
          });
          return rowObj;
        });

        setPreviewCache((prev) => ({
          ...prev,
          [fileObj.id]: {
            columns: rawColumns,
            rows,
            sheetName: firstSheetName,
            clinicName,
            reportPeriod,
          },
        }));
        return;
      }

      setPreviewCache((prev) => ({
        ...prev,
        [fileObj.id]: {
          columns: previewColumns,
          rows,
          sheetName: firstSheetName,
          clinicName,
          reportPeriod,
        },
      }));
    } catch (err) {
      setPreviewError(err?.message || "Unable to preview file");
    } finally {
      setPreviewLoadingId(null);
    }
  };

  const processAllFiles = async () => {
    setLoading(true);
    setViewMode("config");
    setProgress(0);
    progressMapRef.current = new Map();
    hasShownMissingPhysicianAlertRef.current = false;
    setOpen(false);
    setShowMissingDataOnly(false);

    let mergedGeneral = [];
    let mergedTherapies = [];
    let mergedSurgical = [];
    let mergedWoundSurveilance = [];

    let allSummary = {
      totalParsedCount: 0,
      generalParsedCount: 0,
      therapiesParsedCount: 0,
      surgicalParsedCount: 0,
    };

    const processableFiles = uploadedFiles.filter((f) => f.status !== "error");
    const totalFiles = processableFiles.length;

    const globalSeenUids = new Set(); // To track uniqueness across all files

    if (totalFiles === 0) {
      setLoading(false);
      setViewMode("config");
      setError("No valid files to process.");
      return;
    }

    setUploadedFiles((prev) =>
      prev.map((f) =>
        processableFiles.some((pf) => pf.id === f.id)
          ? { ...f, status: "processing", progress: 0 }
          : f,
      ),
    );

    const results = await Promise.all(
      processableFiles.map(async (fileObj) => {
        try {
          const validation = await validateFile(fileObj.file);
          if (!validation.valid) {
            throw new Error(validation.error);
          }

          // Use individual state code or global
          const stateToUse = fileObj.stateCode || globalStateCode || "UNK";

          // Helper to update progress per file
          const onProgress = (p) => {
            const value = Math.max(0, Math.min(100, Number(p.percentage)));
            scheduleProgressUpdate(fileObj.id, value, totalFiles);
          };

          const reportPeriod = extractReportPeriod(validation.rows);
          const result = await parseAncillaryDataAsync(
            validation.rows,
            stateToUse,
            onProgress,
          );

          
          // Merge results with UNIQUE IDs and UNIQUE UIDs
          const addUniqueId = (arr) =>
            arr.map((r) => ({ ...r, id: crypto.randomUUID() }));

          // Filter duplication logic
          const filterUnique = (arr) =>
            arr.filter((item) => {
              if (globalSeenUids.has(item.uid)) return false;
              globalSeenUids.add(item.uid);
              return true;
            });

          const uniqueGeneral = filterUnique(result.parsedGeneral);
          const uniqueTherapies = filterUnique(result.parsedTherapies);
          const uniqueSurgical = filterUnique(result.parsedSurgical);
          const uniqueWoundSurveillance = filterUnique(result.parsedSurveillanceVisits);

          scheduleProgressUpdate(fileObj.id, 100, totalFiles);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                  ...f,
                  status: "done",
                  progress: 100,
                  summary: result.summary,
                  reportPeriod,
                  stateUsed: stateToUse,
                }
                : f,
            ),
          );

          return {
            status: "done",
            reportPeriod,
            uniqueGeneral,
            uniqueTherapies,
            uniqueSurgical,
            uniqueWoundSurveillance,
            summary: result.summary,
          };
        } catch (err) {
          console.error(err);
          scheduleProgressUpdate(fileObj.id, 0, totalFiles);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, status: "error", error: err.message, progress: 0 }
                : f,
            ),
          );
          return { status: "error", error: err.message };
        }
      }),
    );

    results.forEach((result) => {
      if (result.status !== "done") return;
      mergedGeneral.push(
        ...result.uniqueGeneral.map((r) => ({ ...r, id: crypto.randomUUID() })),
      );
      mergedTherapies.push(
        ...result.uniqueTherapies.map((r) => ({
          ...r,
          id: crypto.randomUUID(),
        })),
      );
      mergedSurgical.push(
        ...result.uniqueSurgical.map((r) => ({
          ...r,
          id: crypto.randomUUID(),
        })),
      );
      mergedWoundSurveilance.push(
        ...result.uniqueWoundSurveillance.map((r) => ({
          ...r,
          id: crypto.randomUUID(),
        })),
      );

      if (!dateRange.startDate && result.reportPeriod) {
        setDateRange({
          startDate: result.reportPeriod.startDate,
          endDate: result.reportPeriod.endDate,
        });
      }
    });

    setProgress(100);

    const mergedMissingPhysicianCount = [
      ...mergedGeneral,
      ...mergedTherapies,
      ...mergedSurgical,
      ...mergedWoundSurveilance,
    ].filter((row) => !String(row.physician || "").trim()).length;

    
    // Set final data
    setData({
      parsedGeneral: mergedGeneral,
      parsedTherapies: mergedTherapies,
      parsedSurgical: mergedSurgical,
      parsedWoundSurveilance: mergedWoundSurveilance,
      summary: {
        totalParsedCount:
        mergedGeneral.length + mergedTherapies.length + mergedSurgical.length,
        generalParsedCount: mergedGeneral.length,
        therapiesParsedCount: mergedTherapies.length,
        surgicalParsedCount: mergedSurgical.length,
        woundSurveillanceParsedCount: mergedWoundSurveilance.length,
        missingPhysicianCount: mergedMissingPhysicianCount,
        totalCount:   results[0]?.summary?.totalCount,
        generalCount: results[0]?.summary?.generalCount,
        therapiesCount: results[0]?.summary?.therapiesCount,
        surgicalCount: results[0]?.summary?.surgicalCount,
        woundSurveillanceCount: results[0]?.summary?.surveillanceCount,
      },
    });

    setLoading(false);
    setViewMode("results");
    setActiveTab("ancillary"); // Default to ancillary
  };

  const handleCancel = () => {
    handleReset();
  };

  const handleReset = () => {
    setData(null);
    setUploadedFiles([]);
    setViewMode("upload");
    setError(null);
    setGlobalStateCode("");
    setProgress(0);
    setSelectedPreviewId(null);
    setPreviewCache({});
    setPreviewLoadingId(null);
    setPreviewError(null);
    setInputValue("");
    setSearchQuery("");
    setOpen(false);
    setShowMissingDataOnly(false);
    hasShownMissingPhysicianAlertRef.current = false;
    setProcessStart(false);
    setActiveTab("ancillary");
    setFilterState("ALL");
  };

  // Helper for mainsheet unique states
  const availableStates = useMemo(() => {
    if (!data) return [];
    const states = new Set();
    (data.parsedGeneral || []).forEach((r) => states.add(r.state));
    (data.parsedTherapies || []).forEach((r) => states.add(r.state));
    (data.parsedSurgical || []).forEach((r) => states.add(r.state));
    return Array.from(states).filter(Boolean).sort();
  }, [data]);

  function getESTDateAndPeriodLabel() {
    const nowUTC = new Date();
    const estDate = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      hour12: true,
      minute: "2-digit",
    }).formatToParts(nowUTC);

    const parts = Object.fromEntries(estDate.map((p) => [p.type, p.value]));
    const label = parts.month + "/" + parts.day + "/" + parts.year;
    const isAM = parts.dayPeriod === "AM";
    const periodLabel = isAM ? "M" : "E";

    return {
      estDate: label,
      period: periodLabel,
    };
  }

  const updateStatesAsync = async (newValue) => {
    const targetState = filterState === "ALL" ? null : filterState;

    let updatedGeneral = (data?.parsedGeneral || []).map((r) => ({ ...r }));
    let updatedTherapies = (data?.parsedTherapies || []).map((r) => ({ ...r }));
    let updatedSurgical = (data?.parsedSurgical || []).map((r) => ({ ...r }));

    const targetRows = [
      ...updatedGeneral.filter((r) => !targetState || r.state === targetState),
      ...updatedTherapies.filter(
        (r) => !targetState || r.state === targetState,
      ),
      ...updatedSurgical.filter((r) => !targetState || r.state === targetState),
    ];

    const total = targetRows.length;
    if (total === 0) {
      setStateProgress(0);
      return;
    }

    let processed = 0;
    const chunkSize = 100;

    for (let start = 0; start < total; start += chunkSize) {
      const end = Math.min(start + chunkSize, total);
      for (let i = start; i < end; i++) {
        targetRows[i].state = newValue;
        processed++;
      }

      setData((prev) => ({
        ...prev,
        parsedGeneral: updatedGeneral,
        parsedTherapies: updatedTherapies,
        parsedSurgical: updatedSurgical,
      }));

      const percent = ((processed / total) * 100).toFixed(2);
      setStateProgress(percent);

      // allow UI to breathe
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  };

  const handleInputChange = (e) => {
    setStateProgress(0);
    const filteredValue = e.target.value.replace(/[^a-zA-Z]/g, "");
    if (filteredValue.length <= 2) {
      setInputValue(filteredValue.toLocaleUpperCase());
      setIsButtonDisabled(filteredValue.length !== 2);
    }
  };

  const handleSubmitStateChange = () => {
    updateStatesAsync(inputValue.toLocaleUpperCase());
  };

  const reportStateLabel = useMemo(() => {
    if (!data) return "MIX";
    if (filterState !== "ALL" && filterState) return filterState;
    const states = new Set(
      (currentData || []).map((r) => r.state).filter(Boolean),
    );
    const list = Array.from(states);
    if (list.length === 0) return globalStateCode || "MIX";
    return list.join(", ");
  }, [data, currentData, filterState, globalStateCode]);

  const reportList = useMemo(() => {
    const entries = [];
    const seen = new Set();

    uploadedFiles.forEach((fileObj) => {
      if (fileObj.status !== "done" || !fileObj.reportPeriod) return;
      const state =
        fileObj.stateUsed || fileObj.stateCode || globalStateCode || "UNK";
      const key = `${state}_${fileObj.reportPeriod.startDate}_${fileObj.reportPeriod.endDate}`;
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({
        state,
        startDate: fileObj.reportPeriod.startDate,
        endDate: fileObj.reportPeriod.endDate,
      });
    });

    return entries;
  }, [uploadedFiles, globalStateCode]);

  const selectedReportEntries = useMemo(() => {
    if (filterState === "ALL") return [];
    return reportList.filter((entry) => entry.state === filterState);
  }, [filterState, reportList]);

  const reportCardDateRange = useMemo(() => {
    if (filterState !== "ALL" && selectedReportEntries.length > 0) {
      return {
        startDate: selectedReportEntries[0].startDate,
        endDate: selectedReportEntries[0].endDate,
      };
    }
    return dateRange;
  }, [filterState, selectedReportEntries, dateRange]);

  const tabCounts = useMemo(() => {
    if (!data) {
      return { ancillary: 0, surgical: 0, ultramist: 0 };
    }

    const filterByState = (rows) => {
      if (filterState === "ALL") return rows;
      return rows.filter((row) => row.state === filterState);
    };

    const ancillary = filterByState(data.parsedGeneral || []).length;
    const surgical = filterByState(data.parsedSurgical || []).length;
    const ultramist = filterByState(data.parsedTherapies || []).length;
    const surveillance = filterByState(data.parsedWoundSurveilance || []).length;

    return { ancillary, surgical, ultramist, surveillance };
  }, [data, filterState]);

  const hasProcessableFiles = useMemo(
    () => uploadedFiles.some((f) => f.status !== "error"),
    [uploadedFiles],
  );


  const activeMUIGridHeader =
    statsConfig.find((s) => s.tab === activeTab) || {
      color: isLightMode ? "#334155" : "rgba(255,255,255,0.7)",
      icon: null,
    };

  return (
    <ThemeProvider theme={isLightMode ? lightTheme : darkTheme}>
      <CssBaseline />
      <ToastContainer theme={isLightMode ? "light" : "dark"} />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", md: 760 },
            maxHeight: "82vh",
            overflow: "auto",
            p: 3,
            borderRadius: 4,
            background: isLightMode ? "rgba(255, 255, 255, 0.92)" : "rgb(8, 8, 8)",
            border: isLightMode
              ? "1px solid rgba(15, 23, 42, 0.14)"
              : "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: isLightMode
              ? "0 24px 70px rgba(15, 23, 42, 0.16)"
              : "0 24px 70px rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(18px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: pageTextColor, fontWeight: 800 }}>
              Data Validation Alert
            </Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            {ordersWithMissingColumns.length} orders have missing required data.
            Please review before final export.
          </Alert>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Chip
              label={`Missing Data: ${ordersWithMissingColumns.length}`}
              sx={{
                background: "rgba(245, 158, 11, 0.16)",
                border: "1px solid rgba(245, 158, 11, 0.45)",
                color: "#fde68a",
              }}
            />
            {/* <Chip
              label={`Missing Physician: ${missingPhysicianOrders.length}`}
              sx={{
                background: "rgba(239, 68, 68, 0.16)",
                border: "1px solid rgba(239, 68, 68, 0.45)",
                color: "#fecaca",
              }}
            /> */}
          {missingColumnSummary.map((item) => (
              <Chip
                key={item.label}
                label={`${item.label}: ${item.count}`}
                sx={{
                  background: isLightMode ? "rgba(15, 23, 42, 0.06)" : "rgba(255,255,255,0.08)",
                  border: isLightMode
                    ? "1px solid rgba(15, 23, 42, 0.14)"
                    : "1px solid rgba(255,255,255,0.16)",
                  color: isLightMode ? "#1e293b" : "rgba(255,255,255,0.9)",
                }}
              />
            ))}
          </Box>
          <Typography
            variant="subtitle2"
            sx={{ color: isLightMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255,255,255,0.8)", mb: 1 }}
          >
            Sample Orders (first 8)
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 2,
              maxHeight: 280,
              overflowY: "auto",
            }}
          >
            {ordersWithMissingColumns.slice(0, 8).map((row) => (
              <Paper
                key={`${row.id}-${row.uid}`}
                sx={{
                  p: 1.2,
                  borderRadius: 2,
                  border: isLightMode
                    ? "1px solid rgba(15, 23, 42, 0.14)"
                    : "1px solid rgba(255,255,255,0.14)",
                  background: isLightMode
                    ? "rgba(15, 23, 42, 0.04)"
                    : "rgba(255,255,255,0.04)",
                }}
              >
                <Typography sx={{ color: pageTextColor, fontWeight: 700, fontSize: 13 }}>
                  {row.orderType} | {row.patientName || "Unknown Patient"} | {row.mrn || "No MRN"}
                </Typography>
                <Typography sx={{ color: subtleTextColor, fontSize: 12 }}>
                  Missing: {row.missingFields.join(", ")}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={() => {
                setShowMissingDataOnly(true);
                setOpen(false);
              }}
            >
              Show Missing Data
            </Button>
           
            <Button
              variant="text"
              onClick={() => {
                setShowMissingDataOnly(false);
                setOpen(false);
              }}
            >
              Show All
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          // backgroundImage: `linear-gradient(135deg, rgba(6, 9, 16, 0.88) 0%, rgba(7, 12, 18, 0.92) 45%, rgba(5, 10, 14, 0.85) 100%), url(${BackgroundImage})`,
          // backgroundImage: `url(${BackgroundImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          // backgroundImage:
          //   "radial-gradient(circle at 15% 15%, rgba(16,185,129,0.2) 0%, transparent 42%), radial-gradient(circle at 85% 12%, rgba(59,130,246,0.18) 0%, transparent 40%), linear-gradient(140deg, #07090f 0%, #0b1118 42%, #080d14 100%)",
          backgroundColor: isLightMode ? "transparent" : "#060608",
          // backgroundImage: `
          //             radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), 
          //             radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
          //             radial-gradient(at 50% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)
          //           `,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.06,
            pointerEvents: "none",
            backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ py: !data ? 6:2 }}>

          {true && <PremiumHeader />}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 3,
                maxWidth: "500px",
                marginX: "auto",
              }}
            >
              {error}
            </Alert>
          )}

          {!data ? (
            <Box>
              {viewMode === "upload" && (
                <motion.div
                  variants={itemVariants}
                  controls={controls}
                  initial="hidden"
                  animate="visible"
                >
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    loading={loading}
                    setFileName={() => { }}
                    error={error}
                  />
                </motion.div>
              )}

              {viewMode === "config" && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Box sx={{ mx: "auto", mt: 4 }}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 8,
                        // background: "rgba(28, 28, 30, 0.5)",
                        background: isLightMode ? "rgba(255, 255, 255, 0.78)" : "#302f2f42",
                        backdropFilter: "blur(20px)",
                        border: isLightMode
                          ? "1px solid rgba(15, 23, 42, 0.12)"
                          : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" color={isLightMode ? "#0f172a" : "white"}>
                          Configuration
                        </Typography>
                        <Box
                          sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                        <Button
                          startIcon={<RefreshCcw className="w-5 h-5" />}
                          color="error"
                          onClick={handleReset}
                          size="small"
                        >
                           Reset
                        </Button>
                          {/* Add File Button - Hidden Input Trick */}
                          <Button
                            variant="outlined"
                            component="label"
                            size="small"
                            startIcon={<CloudUpload />}
                            sx={{
                              borderColor: isLightMode
                                ? "rgba(15, 23, 42, 0.22)"
                                : "rgba(255,255,255,0.2)",
                              color: isLightMode ? "#0f172a" : "white",
                              "&:hover": {
                                borderColor: isLightMode
                                  ? "rgba(15, 23, 42, 0.42)"
                                  : "white",
                                background: isLightMode
                                  ? "rgba(15, 23, 42, 0.05)"
                                  : "rgba(255,255,255,0.06)",
                              },
                            }}
                          >
                            Add Files
                            <input
                              type="file"
                              hidden
                              multiple
                              accept=".xlsx"
                              onChange={(e) => {
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
                                  handleFileUpload(Array.from(e.target.files));
                                  e.target.value = ""; // Reset
                                }
                              }}
                            />
                          </Button>

                          
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={processAllFiles}
                            startIcon={<Assessment />}
                            disabled={
                              loading || isUploading || !hasProcessableFiles
                            }
                          >
                            Run
                          </Button>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: isLightMode ? "rgba(15, 23, 42, 0.7)" : "rgba(255,255,255,0.7)",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                            }}
                          >
                            File Queue
                          </Typography>
                          <Chip
                            size="small"
                            label={`${uploadedFiles.length} files`}
                            sx={{
                              height: 24,
                              fontSize: "0.7rem",
                              background: isLightMode
                                ? "rgba(15, 23, 42, 0.06)"
                                : "rgba(255,255,255,0.06)",
                              color: isLightMode ? "rgba(15, 23, 42, 0.75)" : "rgba(255,255,255,0.7)",
                              border: isLightMode
                                ? "1px solid rgba(15, 23, 42, 0.12)"
                                : "1px solid rgba(255,255,255,0.08)",
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            color: isLightMode ? "rgba(15, 23, 42, 0.55)" : "rgba(255,255,255,0.45)",
                            fontSize: "0.75rem",
                          }}
                        >
                          Select a file to preview parsed data
                        </Typography>
                      </Box>

                      {loading ? (
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: isLightMode ? "rgba(15, 23, 42, 0.62)" : "rgba(255,255,255,0.6)" }}
                            >
                              Processing files
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: isLightMode ? "rgba(15, 23, 42, 0.62)" : "rgba(255,255,255,0.6)" }}
                            >
                              {`${Math.round(Number(progress || 0))}%`}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, Number(progress || 0))}
                            sx={{
                              height: 6,
                              borderRadius: 999,
                              backgroundColor: "rgba(255,255,255,0.12)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#10b981",
                              },
                            }}
                          />
                        </Box>
                      ) : null}

                      {/* Files Grid with Status + Preview */}
                      <Grid container spacing={2} sx={{ backdropFilter: "none" }}>
                        <Grid item size={{ xs: 12, md: 4 }} sx={{ backdropFilter: "none" }}>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0,
                              backdropFilter: "none",

                              px: 0.5,
                              overflowY: "auto",
                              scrollbarWidth: "thin",
                              scrollbarColor: "transparent transparent",
                              transition: "scrollbar-width 0.3s ease",
                              "&:hover": {
                                scrollbarWidth: "thin",
                                scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
                              },
                              "&::-webkit-scrollbar": {
                                width: "8px",
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "transparent",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "transparent",
                                borderRadius: "4px",
                                transition: "background 0.3s ease",
                              },
                              "&:hover::-webkit-scrollbar-thumb": {
                                background: "rgba(255, 255, 255, 0.2)",
                                animation: "slideIn 0.3s ease-in-out",
                              },
                              "&:hover::-webkit-scrollbar-thumb:hover": {
                                background: "rgba(255, 255, 255, 0.35)",
                              },
                              "@keyframes slideIn": {
                                "0%": {
                                  opacity: 0,
                                  transform: "scaleY(0.8)",
                                },
                                "50%": {
                                  opacity: 0.8,
                                },
                                "100%": {
                                  opacity: 1,
                                  transform: "scaleY(1)",
                                },
                              },
                              maxHeight: 600,
                            }
                            }
                          >
                            {uploadedFiles.map((f) => {
                              const statusMeta = {
                                done: {
                                  label: "Done",
                                  color: "#10b981",
                                  bg: "rgba(16, 185, 129, 0.12)",
                                },
                                processing: {
                                  label: "Processing",
                                  color: isLightMode ? "#1d4ed8" : "#f1f2f5",
                                  bg: "rgba(59, 130, 246, 0.12)",
                                },
                                loading: {
                                  label: "Loading",
                                  color: isLightMode
                                    ? "rgba(15,23,42,0.75)"
                                    : "rgba(255,255,255,0.7)",
                                  bg: isLightMode
                                    ? "rgba(15,23,42,0.06)"
                                    : "rgba(255,255,255,0.08)",
                                },
                                error: {
                                  label: "Error",
                                  color: "#ef4444",
                                  bg: "rgba(239, 68, 68, 0.12)",
                                },
                                pending: {
                                  label: "Ready",
                                  color: isLightMode
                                    ? "rgba(15,23,42,0.75)"
                                    : "rgba(255,255,255,0.7)",
                                  bg: isLightMode
                                    ? "rgba(15,23,42,0.06)"
                                    : "rgba(255,255,255,0.08)",
                                },
                              }[f.status || "pending"];

                              return (
                                <Paper
                                  key={f.id}
                                  elevation={0}
                                  onClick={() => {
                                    if (f.status === "loading") return;
                                    setSelectedPreviewId(f.id);
                                    setPreviewError(null);
                                    if (!previewCache[f.id]) {
                                      buildPreviewForFile(f);
                                    }
                                  }}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 1.5,
                                    py: .7,
                                    cursor: "pointer",
                                    // mb:2.5,
                                    boxShadow: "none",
                                    background:
                                      selectedPreviewId === f.id
                                        ? "linear-gradient(90deg, rgba(16, 185, 30, 0.31), rgba(16, 185, 129, 0.02))"
                                        : isLightMode
                                          ? "rgba(255, 255, 255, 0.66)"
                                          : "rgba(25, 28, 31, 0.4)",
                                    border:
                                      selectedPreviewId === f.id
                                        ? "1px solid rgba(16, 185, 129, 0.45)"
                                        : isLightMode
                                          ? "1px solid rgba(15,23,42,0.12)"
                                          : "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 8,
                                    mb: 0.5,
                                    // boxShadow:
                                    //   selectedPreviewId === f.id
                                    //     ? "0 10px 30px rgba(16, 185, 129, 0.12)"
                                    //     : "none",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                      background: isLightMode
                                        ? "rgba(59,130,246,0.08)"
                                        : "rgba(255,255,255,0.06)",
                                      borderColor: isLightMode
                                        ? "rgba(59,130,246,0.3)"
                                        : "rgba(255,255,255,0.2)",
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 38,
                                      height: 38,
                                      borderRadius: 10,
                                      // background: 'rgba(255,255,255,0.06)',
                                      // border: '1px solid rgba(255,255,255,0.08)'
                                    }}
                                  >
                                    {f.status === "done" ? (
                                      <CheckCircle sx={{ color: "#10b981" }} />
                                    ) : f.status === "processing" ? (
                                      <CircularProgress
                                        size={20}
                                        sx={{ color: "#e0e0e0" }}
                                      />
                                    ) : f.status === "loading" ? (
                                      <CircularProgress
                                        size={20}
                                        sx={{ color: "rgba(255,255,255,0.6)" }}
                                      />
                                    ) : f.status === "error" ? (
                                      <Close sx={{ color: "#ef4444" }} />
                                    ) : (
                                      <img
                                        src={ExcelLogo}
                                        alt="Excel Logo"
                                        style={{ width: 25, height: 27 }}
                                      />
                                    )}
                                  </Box>

                                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 0.0,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          color: isLightMode ? "#0f172a" : "white",
                                          fontSize: 12,
                                          fontWeight: 700,
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                        title={f.name}
                                      >
                                        {f.name}
                                      </Typography>
                                      <Chip
                                        size="small"
                                        // label={f.sourceStateCode || 'Not detecte'}
                                        label={statusMeta.label}
                                        sx={{
                                          height: 20,
                                          fontSize: "0.65rem",
                                          color: statusMeta.color,
                                          background: statusMeta.bg,
                                          border: `1px solid ${statusMeta.color}33`,
                                        }}
                                      />
                                    </Box>
                                    {f.error ? (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "#ef4444",
                                          display: "block",
                                        }}
                                      >
                                        {f.error}
                                      </Typography>
                                    ) : (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: isLightMode
                                            ? "rgba(15,23,42,0.62)"
                                            : "rgba(255,255,255,0.6)",
                                        }}
                                      >
                                        {f.status === "done"
                                          ? "Parsed Successfully"
                                          : f.status === "processing"
                                            ? "Processing..."
                                            : f.status === "loading"
                                              ? "Loading file..."
                                              : "Ready to parse"}
                                      </Typography>
                                    )}
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    {f.status === "processing" ? (
                                      <Box
                                        sx={{
                                          position: "relative",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <CircularProgress
                                          variant="determinate"
                                          value={Math.min(100, Number(f.progress || 0))}
                                          size={42}
                                          thickness={4}
                                          sx={{
                                            color: "#dddddd",
                                            "& .MuiCircularProgress-circle": {
                                              strokeLinecap: "round",
                                            },
                                          }}
                                        />
                                        <Box
                                          sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              color: "#e3e5e9",
                                              fontWeight: 700,
                                              fontSize: "0.65rem",
                                            }}
                                          >
                                            {`${Math.round(Number(f.progress || 0))}%`}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    ) : null}

                                    <Autocomplete
                                      disableClearable
                                      freeSolo
                                      openOnFocus
                                      autoHighlight
                                      options={buildStateOptions(
                                        f.sourceStateCode,
                                      )}
                                      value={f.stateCode || ""}
                                      inputValue={f.stateCode || ""}
                                      ListboxProps={{
                                        sx: {
                                          maxHeight: 220,
                                          scrollbarWidth: "none",
                                          "&::-webkit-scrollbar": {
                                            display: "none",
                                          },
                                        },
                                      }}
                                      disabled={f.status === "loading"}
                                      onInputChange={(
                                        event,
                                        newValue,
                                        reason,
                                      ) => {
                                        if (
                                          reason === "input" ||
                                          reason === "clear"
                                        ) {
                                          updateFileStateCode(
                                            f.id,
                                            newValue || "",
                                          );
                                        }
                                      }}
                                      onChange={(event, newValue) => {
                                        updateFileStateCode(
                                          f.id,
                                          newValue || "",
                                        );
                                      }}
                                      onClose={(event, reason) => {
                                        if (
                                          reason === "blur" &&
                                          !String(f.stateCode || "").trim() &&
                                          f.sourceStateCode
                                        ) {
                                          updateFileStateCode(
                                            f.id,
                                            f.sourceStateCode,
                                          );
                                        }
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          placeholder="State"
                                          onClick={(e) => e.stopPropagation()}
                                          inputProps={{
                                            ...params.inputProps,
                                            maxLength: 2,
                                            style: {
                                              textAlign: "center",
                                              textTransform: "uppercase",
                                            },
                                          }}
                                          sx={{
                                            p: 0,
                                            fontWeight: 700,
                                            width: "7ch",
                                            "& .MuiInputBase-root": {
                                              borderRadius: 5,
                                              fontWeight: 700,
                                              minHeight: 30,
                                              background: "rgba(255, 255, 255, 0)",
                                              border: "none"
                                              // color:'green'
                                              // background: 'rgba(255,255,255,0.06)',
                                              // border: '1px solid rgba(255,255,255,0.12)'
                                            },
                                            "& .MuiInputBase-input": {
                                              py: 0.5,
                                              fontSize: "0.75rem",
                                              fontWeight: 700,
                                              letterSpacing: "0.08em",
                                              color: "#ffffff",
                                              color: isLightMode ? "#0f172a" : "#ffffff",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline":
                                            {
                                              border: "none",
                                            },
                                            "&:hover .MuiInputBase-root": {
                                              background:
                                                "rgba(255,255,255,0.1)",
                                            },
                                            "& .Mui-focused.MuiInputBase-root":
                                            {
                                              background:
                                                "rgba(16, 185, 129, 0.12)",
                                              boxShadow:
                                                "0 0 0 1px rgba(16, 185, 129, 0.5)",
                                            },
                                          }}
                                          variant="outlined"
                                        />
                                      )}
                                    />

                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(f.id);
                                      }}
                                      sx={{
                                        color: isLightMode
                                          ? "rgba(15,23,42,0.55)"
                                          : "rgba(255,255,255,0.35)",
                                        background: isLightMode
                                          ? "rgba(15,23,42,0.04)"
                                          : "rgba(255,255,255,0.04)",
                                        border:
                                          isLightMode
                                            ? "1px solid rgba(15,23,42,0.12)"
                                            : "1px solid rgba(255,255,255,0.08)",
                                        "&:hover": {
                                          color: "#ef4444",
                                          borderColor: "rgba(239, 68, 68, 0.4)",
                                        },
                                      }}
                                      size="small"
                                    >
                                      <Trash2 size={16} />
                                    </IconButton>
                                  </Box>
                                </Paper>
                              );
                            })}
                          </Box>

                        </Grid>
                        <Grid item size={{ md: 8, xs: 12 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              minHeight: 420,
                              maxHeight: 600,
                              height: "100%",
                              p: 2,
                              borderRadius: 4,
                              background: isLightMode
                                ? "rgba(255, 255, 255, 0.76)"
                                : "rgba(0, 0, 0, 0.19)",
                              border: isLightMode
                                ? "1px solid rgba(15, 23, 42, 0.12)"
                                : '1px solid rgba(255, 255, 255, 0.08)',
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography
                                  sx={{ color: isLightMode ? "#0f172a" : "white", fontWeight: 700 }}
                                >
                                  File Preview
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: isLightMode ? "rgba(15, 23, 42, 0.55)" : "rgba(255,255,255,0.5)" }}
                                >
                                  {selectedPreviewId
                                    ? uploadedFiles.find(
                                      (f) => f.id === selectedPreviewId,
                                    )?.name || ""
                                    : "Select a file to preview"}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                }}
                              >
                                {selectedPreviewId &&
                                  previewCache[selectedPreviewId]
                                    ?.reportPeriod ? (
                                  <Box
                                    sx={{
                                      px: 1.2,
                                      py: 0.6,
                                      borderRadius: 2,
                                      background: "rgba(59, 130, 246, 0.12)",
                                      border:
                                        "1px solid rgba(59, 130, 246, 0.25)",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: isLightMode
                                          ? "rgba(30,41,59,0.8)"
                                          : "rgba(255,255,255,0.7)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Report:{" "}
                                      {
                                        previewCache[selectedPreviewId]
                                          .reportPeriod.startDate
                                      }{" "}
                                      -{" "}
                                      {
                                        previewCache[selectedPreviewId]
                                          .reportPeriod.endDate
                                      }
                                    </Typography>
                                  </Box>
                                ) : null}
                                {previewLoadingId && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <CircularProgress
                                      size={18}
                                      sx={{ color: "#3b82f6" }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: isLightMode
                                          ? "rgba(30,41,59,0.7)"
                                          : "rgba(255,255,255,0.6)",
                                      }}
                                    >
                                      Loading
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>

                            {previewError && selectedPreviewId ? (
                              <Alert severity="error" sx={{ borderRadius: 2 }}>
                                {previewError}
                              </Alert>
                            ) : null}

                            {!selectedPreviewId && !previewError ? (
                              <Box
                                sx={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "rgba(255,255,255,0.45)",
                                  color: isLightMode
                                    ? "rgba(15,23,42,0.52)"
                                    : "rgba(255,255,255,0.45)",
                                }}
                              >
                                <Typography variant="body2">
                                  Choose a file on the left to preview rows
                                </Typography>
                              </Box>
                            ) : null}

                            {selectedPreviewId &&
                              previewCache[selectedPreviewId] &&
                              !previewError ? (
                              <Box
                                sx={{
                                  flex: 1,
                                  minHeight: 0,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                {previewCache[selectedPreviewId].clinicName ? (
                                  <Box
                                    sx={{
                                      px: 1.5,
                                      py: 1,
                                      borderRadius: 2,
                                      background: "rgba(16, 185, 129, 0.08)",
                                      border:
                                        "1px solid rgba(16, 185, 129, 0.2)",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: isLightMode
                                          ? "rgba(15,23,42,0.62)"
                                          : "rgba(255,255,255,0.6)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Clinic
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: isLightMode ? "#0f172a" : "#fff",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                      }}
                                    >
                                      {
                                        previewCache[selectedPreviewId]
                                          .clinicName
                                      }
                                    </Typography>
                                  </Box>
                                ) : null}
                                <Box sx={{ flex: 1, minHeight: 0 }}>
                                  <DataGridPro
                                    rows={previewCache[selectedPreviewId].rows}
                                    columns={
                                      previewCache[selectedPreviewId].columns
                                    }
                                    density="compact"
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                    getRowId={(row) => row.id ?? `${row.uid || "row"}-${Math.random()}`}
                                    sx={{
                                      // height: '100%',
                                      background: isLightMode
                                        ? "rgba(255, 255, 255, 0.94)"
                                        : "rgba(12, 14, 18, 0.66)",
                                      border: "none",
                                      color: isLightMode ? "#0f172a" : "#fff",
                                      backdropFilter: "blur(16px) ",
                                      "& .MuiDataGrid-cell": {
                                        borderBottom:
                                          isLightMode
                                            ? "1px solid rgba(148, 163, 184, 0.22)"
                                            : "1px solid rgba(255, 255, 255, 0.05)",
                                      },
                                      "& .MuiDataGrid-columnHeaders": {
                                        background:
                                          isLightMode
                                            ? "rgba(241, 245, 249, 0.96)"
                                            : "rgb(0, 0, 0)",
                                        backdropFilter: "blur(16px) ",
                                        borderBottom:
                                          isLightMode
                                            ? "1px solid rgba(148, 163, 184, 0.35)"
                                            : "1px solid rgba(255, 255, 255, 0.16)",
                                        fontWeight: 700,
                                      },
                                      "& .MuiDataGrid-pinnedColumnHeaders": {
                                        background: isLightMode
                                          ? "rgba(248, 250, 252, 0.98)"
                                          : "rgba(6, 8, 12, 0.85)",
                                        backdropFilter: "blur(18px) saturate(160%)",
                                      },
                                      "& .MuiDataGrid-pinnedColumns": {
                                        background: isLightMode
                                          ? "rgba(248, 250, 252, 0.98)"
                                          : "rgba(6, 8, 12, 0.82)",
                                        backdropFilter: "blur(18px) saturate(160%)",
                                      },
                                      "& .MuiDataGrid-cell--pinnedLeft": {
                                        background: isLightMode
                                          ? "rgba(241, 245, 249, 0.96)"
                                          : "rgba(6, 8, 12, 0.78)",
                                        backdropFilter: "blur(18px) saturate(160%)",
                                      },
                                      "& .MuiDataGrid-row:hover": {
                                        background: isLightMode
                                          ? "rgba(59, 130, 246, 0.08)"
                                          : "rgba(255, 255, 255, 0.04)",
                                      },
                                    }}
                                  />
                                </Box>
                              </Box>
                            ) : null}
                          </Paper>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </motion.div>
              )}
              {/* Footer if needed */}
            </Box>
          ) : (
            <>
            <Grid container spacing={2}>
             <Grid item size={{ xs: 12, lg: 10 }}>
              <GlassFileHeader
                fileName={`${uploadedFiles.length} Files Processed`}
                handleReset={handleReset}
              />
               <StatsCards
                    summary={data.summary}
                    setActiveTab={setActiveTab}
                  />
             </Grid>
              <Grid item size={{ xs: 12, lg: 2 }}>
                  <ReportPeriodCard
                    dateRange={reportCardDateRange}
                    reportList={
                      filterState === "ALL"
                        ? reportList
                        : selectedReportEntries.length > 1
                          ? selectedReportEntries
                          : []
                    }
                    stateAbbr={reportStateLabel}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 1 }}>
                <Grid item size={{ xs: 12, md: 9 }} xs={12} md={8}>
                  {/* Custom Tab Switcher */}
                  {/* <Paper
                    sx={{
                      p: 0.5,
                      background: "rgba(20, 20, 22, 0)",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "inline-flex",
                      gap: 0.5,
                    }}
                  >
                    {(() => {

                      const tabStyles = {
                        ancillary: {
                          bg: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                          
                          border: "rgba(16, 185, 129, 0.7)",
                          shadow: "0 8px 20px rgba(16, 185, 129, 0.28)",
                          hover: "linear-gradient(135deg, #10b981 0%, #10b981 100%)",
                        },
                        surgical: {
                          bg: "linear-gradient(135deg, #3885f8 0%, #0e66e9 100%)",
                          border: "rgba(14, 165, 233, 0.7)",
                          shadow: "0 8px 20px rgba(68, 94, 239, 0.25)",
                          hover: "linear-gradient(135deg, #0ea5e9 0%, #0ea5e9 100%)",
                        },
                        ultramist: {
                          bg: "linear-gradient(135deg, #f8ab38 0%, #e9910e 100%)",
                          border: "rgba(248, 171, 56, 0.7)",
                          shadow: "0 8px 20px rgba(248, 171, 56, 0.25)",
                          hover: "linear-gradient(135deg, #f8ab38 0%, #e9910e 100%)",
                        },
                        surveillance: {
                          bg: "linear-gradient(135deg, #be24fb 0%, #700bf5 100%)",
                          border: "rgba(132, 11, 245, 0.7)",
                          shadow: "0 8px 20px rgba(54, 11, 245, 0.25)",
                          hover: "linear-gradient(135deg, #9f0bf5 0%, #7306d9 100%)",
                        },
                      };
                      return [
                        {
                          id: "ancillary",
                          label: `Ancillary (${tabCounts.ancillary.toLocaleString()})`,
                          value: tabCounts.ancillary
                        },
                        {
                          id: "ultramist",
                          label: `Ultramist (${tabCounts.ultramist.toLocaleString()})`,
                          value: tabCounts.ultramist
                        },
                        {
                          id: "surgical",
                          label: `Surgical (${tabCounts.surgical.toLocaleString()})`,
                          value: tabCounts.surgical
                        },
                        {
                          id: "surveillance",
                          label: `Surveillance (${tabCounts.surveillance.toLocaleString()})`,
                          value: tabCounts.surveillance
                        },
                      ].filter(v => v.value != 0).map((tab) => {
                        const isActive = activeTab === tab.id;
                        const style = tabStyles[tab.id];
                        return (
                          <Button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            sx={{
                              borderRadius: 999,
                              px: 2.4,
                              py: 0.6,
                              minHeight: 34,
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              letterSpacing: "0.02em",
                              textTransform: "none",
                              color: isActive && !showMissingDataOnly
                                ? "#0a0a0a"
                                : "rgba(255,255,255,0.7)",
                              background: isActive && !showMissingDataOnly ? style.bg : "transparent",
                              border: isActive && !showMissingDataOnly
                                ? `1px solid ${style.border}`
                                : "1px solid transparent",
                              boxShadow: isActive && !showMissingDataOnly ? style.shadow : "none",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: isActive && !showMissingDataOnly
                                  ? style.hover
                                  : "rgba(255,255,255,0.08)",
                              },
                            }}
                          >
                            {tab.label}
                          </Button>
                        );
                      });
                    })()}
                  </Paper> */}
                <AnimatedTabs
  tabCounts={tabCounts}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  
/>
                </Grid>

                <Grid item size={{ xs: 12, md: 3 }}>
                  {/* Input for State Update (existing functionality) */}
                  <AppleGlassInput
                    handleInputChange={handleInputChange}
                    handleSubmitStateChange={handleSubmitStateChange}
                    inputValue={inputValue}
                    isButtonDisabled={isButtonDisabled}
                    stateProgress={stateProgress}
                  />
                </Grid>
              </Grid>

              {/* Filter Buttons Group */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 1,
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search name, MRN, physician, test, UID..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  sx={{
                    width: { xs: "100%", md: 420 },
                    "& .MuiInputBase-root": {
                      borderRadius: 999,
                      background: isLightMode
                        ? "rgba(255, 255, 255, 0.88)"
                        : "rgba(0, 0, 0, 0.7)",
                      border: isLightMode
                        ? "1px solid rgba(15, 23, 42, 0.14)"
                        : "1px solid rgba(255,255,255,0.14)",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          sx={{
                            color: isLightMode
                              ? "rgba(15,23,42,0.6)"
                              : "rgba(229,231,235,0.7)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery("")}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <ButtonGroup>
                    {[
                      { key: "ALL", label: "All States" },
                      ...availableStates.map((state) => ({
                        key: state,
                        label: state,
                      })),
                    ].map((item) => {
                      const isActive = filterState === item.key;
                      return (
                        <Button
                          key={item.key}
                          onClick={() => setFilterState(item.key)}
                          sx={{
                            px: 2,
                            py: 0.6,
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            textTransform: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 32,
                            color: isActive
                              ? "#0a0a0a"
                              : isLightMode
                                ? "rgba(15,23,42,0.8)"
                                : "rgba(255,255,255,0.75)",
                            background: isActive
                              ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                              : isLightMode
                                ? "rgba(255,255,255,0.86)"
                                : "rgba(13, 22, 39, 0.45)",
                            border: isActive
                              ? "1px solid rgba(16, 185, 129, 0.65)"
                              : isLightMode
                                ? "1px solid rgba(15,23,42,0.14)"
                                : "1px solid rgba(255,255,255,0.08)",
                            boxShadow: isActive
                              ? "0 6px 18px rgba(16, 185, 129, 0.25)"
                              : "none",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: isActive
                                ? "linear-gradient(135deg, #10b981 0%, #10b981 100%)"
                                : isLightMode
                                  ? "rgba(59,130,246,0.08)"
                                  : "rgba(255,255,255,0.12)",
                              borderColor: isActive
                                ? "rgba(16, 185, 129, 0.8)"
                                : isLightMode
                                  ? "rgba(59,130,246,0.32)"
                                  : "rgba(255,255,255,0.18)",
                            },
                          }}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </ButtonGroup>

                 {ordersWithMissingColumns.length > 0 && (<Button
                    onClick={() => {
                      
                      setShowMissingDataOnly((current) => {
                        const next = !current;
                        return next;
                      });
                    }}
                    sx={{
                      borderRadius: 999,
                      px: 2,
                      py: 0.6,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textTransform: "none",
                      minHeight: 32,
                      color: showMissingDataOnly
                        ? "#0a0a0a"
                        : isLightMode
                          ? "rgba(15,23,42,0.82)"
                          : "rgba(255,255,255,0.8)",
                      background: showMissingDataOnly
                        ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
                        : isLightMode
                          ? "rgba(255,255,255,0.86)"
                          : "rgba(13, 22, 39, 0.45)",
                      border: showMissingDataOnly
                        ? "1px solid rgba(245, 158, 11, 0.8)"
                        : isLightMode
                          ? "1px solid rgba(15,23,42,0.14)"
                          : "1px solid rgba(255,255,255,0.12)",
                      boxShadow: showMissingDataOnly
                        ? "0 6px 18px rgba(245, 158, 11, 0.26)"
                        : "none",
                      "&:hover": {
                        background: showMissingDataOnly
                          ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                          : isLightMode
                            ? "rgba(59,130,246,0.08)"
                            : "rgba(255,255,255,0.12)",
                      },
                    }}
                  >
                    Missing Data ({ordersWithMissingColumns.length})
                  </Button>)}

                 
                </Box>
              </Box>
              <Paper
                elevation={0}
                sx={{
                 height: `calc(100vh - 390px)`,
                //  height: `700px`,
                  borderRadius: 5,
                  background: panelBackground,
                  backdropFilter: "blur(24px) saturate(150%)",
                  border: panelBorder,
                  boxShadow: isLightMode
                    ? "0 24px 70px rgba(15, 23, 42, 0.12)"
                    : "0 24px 70px rgba(0, 0, 0, 0.5)",
                  overflow: "hidden",

                }}
              >
                
                <DataGridPro
                  rows={currentData}
                  columns={columns}
                  checkboxSelection
                  disableRowSelectionOnClick
                  density="compact"
                  label={
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: showMissingDataOnly ? "rgb(253, 198, 15)" : activeMUIGridHeader.color }}>
                       {showMissingDataOnly ? "Missing Data - " : <>{activeMUIGridHeader.icon}{tabConfig[activeTab].label}</>} MediExtract - Personic health
                    </div>
                  }
                  initialState={{
                    pinnedColumns: { left: ["__check__", "patientName"] },
                  }}
                  showToolbar
                  rowBufferPx={480}
                  columnBufferPx={180}
                  slotProps={{
                    toolbar: {
                      csvOptions: {
                        fileName:showMissingDataOnly ? `Missing_Data_${tabConfig[activeTab]?.label?.split(" ")?.join("_")}_${filterState == "ALL" ? availableStates?.join("_") : filterState}_${getESTDateAndPeriodLabel().estDate}` :   `${tabConfig[activeTab]?.label?.split(" ")?.join("_")}_${filterState == "ALL" ? availableStates?.join("_") : filterState}_${getESTDateAndPeriodLabel().estDate}`,
                      },


                    },
                  }}
                  sx={{
                    border: "none",
                    background: isLightMode ? "rgba(255, 255, 255, 0.92)" : "#131313",
                    color: isLightMode ? "#0f172a" : "#e5e7eb",
                    "& .MuiDataGrid-columnHeaders": {
                      background: isLightMode ? "rgba(241, 245, 249, 0.96)" : "rgb(8, 3, 3)",
                      borderBottom: isLightMode
                        ? "1px solid rgba(148, 163, 184, 0.35)"
                        : "1px solid rgba(29, 27, 27, 0.45)",
                      backdropFilter: "blur(18px) saturate(160%)",
                    },
                    "& .MuiDataGrid-pinnedColumnHeaders": {
                      background: isLightMode
                        ? "rgba(248, 250, 252, 0.98)"
                        : "rgba(6, 8, 12, 0.85)",
                      backdropFilter: "blur(18px) saturate(160%)",
                    },
                    "& .MuiDataGrid-pinnedColumns": {
                      background: isLightMode
                        ? "rgba(248, 250, 252, 0.98)"
                        : "rgba(12, 11, 6, 0.98)",
                      backdropFilter: "blur(18px) saturate(160%)",
                    },
                    "& .MuiDataGrid-cell--pinnedLeft": {
                      background: isLightMode
                        ? "rgba(255, 255, 255, 0.96)"
                        : "rgba(6, 8, 12, 0.78)",
                      backdropFilter: "blur(18px) saturate(160%)",
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom:
                        isLightMode
                          ? "1px solid rgba(148, 163, 184, 0.22)"
                          : "1px solid rgba(255, 255, 255, 0.05)",
                    },
                    "& .MuiDataGrid-row:hover": {
                      background: isLightMode
                        ? "rgba(59, 130, 246, 0.08)"
                        : "rgba(255, 255, 255, 0.04)",
                    },

                  }}
                  onRowSelectionModelChange={(newSelection) => {
                    if (newSelection.type == "include") {
                      setIsSelect(true);
                      setSelectedIds(newSelection);
                    }
                    if (newSelection.type == "exclude") {
                      setIsSelect(true);
                      const filteredIds = currentData
                        .filter((item) => !newSelection.ids.has(item.id))
                        .map((item) => item.id);
                      setSelectedIds({
                        type: "include",
                        ids: new Set(filteredIds),
                      });
                      return;
                    }
                    if (newSelection.ids.size == 0) setIsSelect(false);
                  }}
                  rowSelectionModel={selectedIds}

                />
              </Paper>
                <FloatingDeleteButton
                  setSelectedIds={setSelectedIds}
                  setIsSelect={setIsSelect}
                  isSelect={selectedIds.type == "exclude" || isSelect}
                  isDeleting={isDeleting}
                  setDeleting={setIsDeleting}
                  handleDelete={handleDelete}
                  selectedCount={selectedIds.ids.size}
                />
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

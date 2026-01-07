import React, { useState, useCallback, useEffect } from 'react';
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
    Autocomplete
} from '@mui/material';
import * as XLSX from 'xlsx';
import { CheckCircleIcon, ClipboardList, Droplets, FileSpreadsheet, MapPin, Scissors, Syringe, Trash2 } from 'lucide-react';

import { DataGridPro } from '@mui/x-data-grid-pro';
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
    Close
} from '@mui/icons-material';
import ProfessionalFooter from './Footer';
import logo from "./logo.png"
import LoadingModal from './ProgressLoader';
import { parseAncillaryDataAsync } from './utils';
import FloatingDeleteButton from './FloatingDeleteButton';

import { ToastContainer, toast } from 'react-toastify';
import { TestSwitcher } from './ButtonType';
import PremiumHeader from './Header';
import FileUpload from './FileUpload';
import StatsCards from './StatsCard';
import { motion, useAnimation } from 'framer-motion';

// Variants for the Parent Container
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Each child waits 0.1s before starting
            delayChildren: 0.3    // Initial delay before first child appears
        }
    }
};

// Variants for each Child Component
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};


const columnsBase = [
    {
        field: 'patientName',
        headerName: 'Name',
        width: 250,
        editable: true,
        renderCell: (params) => (
            <Box className="flex items-center">
                <Person className="mr-2 text-gray-400" fontSize="small" />
                {params.value}
            </Box>
        )
    },
    { field: 'mrn', headerName: 'MRN (Import)', width: 120, editable: true, },
    { field: 'category', headerName: 'Ancillary Service Category', width: 200, editable: true, },
    { field: 'testName', headerName: 'Test Name', width: 300, editable: true, },
    { field: 'physician', headerName: 'Ordering Physician', width: 200, editable: true, },
    {
        field: 'dateOrdered',
        headerName: 'Date Ordered',
        width: 150,
        renderCell: (params) => (
            <Box className="flex items-center">
                <DateRange className="mr-2 text-gray-400" fontSize="small" />
                {params.value}
            </Box>
        ),
        editable: true,
    },
    { field: 'state', headerName: 'State', width: 100, editable: true, },
    { field: 'status', headerName: 'Order/Fax Status', width: 250 },
    { field: 'uid', headerName: 'UID', width: 850 }
];

// Enhanced Dark theme with premium styling
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        secondary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
        },
        background: {
            default: '#0a0a0a',
            paper: '#111111',
        },
        success: {
            main: '#10b981',
        },
        error: {
            main: '#ef4444',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 16,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
    },
});




const tabConfig = {
    ancillary: {
        label: "Ancillary Orders",
        icon: <ClipboardList className="w-4 h-4 mr-2" />
    },
    surgical: {
        label: "Surgical Debridement Orders",
        icon: <Scissors className="w-4 h-4 mr-2" />
    },
    ultramist: {
        label: "Ultramist Debridement Orders",
        icon: <Droplets className="w-4 h-4 mr-2" />
    }
};


import EnterpriseModal from './StateConfigMode';
import ReportPeriodCard from './ReportPeriodCard';
import AppleGlassInput from './AppleGlassInput';
import GlassFileHeader from './GlassFileHeader';
import { appConfig } from './appConfig';
// Main Component
export default function AncillaryDataParser() {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('ancillary');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');
    const [open, setOpen] = useState(false);
    const [stateAbbr, setStateAbbr] = useState('');
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [processStart, setProcessStart] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });
    const [isSelect, setIsSelect] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = React.useState({
        type: 'include',
        ids: new Set(),
    });
    const [stateProgress, setStateProgress] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [sortModel, setSortModel] = useState([]);
    const controls = useAnimation();

    useEffect(() => {
        controls.start("hidden").then(() => {
            controls.start("visible");
        });
    }, []); // dependency change hote hi animation dobara


    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            let updatedRows = data

            if (activeTab == "ancillary") updatedRows.parsedGeneral = data.parsedGeneral.filter((row) => !selectedIds.ids.has(row.id));
            if (activeTab == "ultramist") updatedRows.parsedTherapies = data.parsedTherapies.filter((row) => !selectedIds.ids.has(row.id));

            await new Promise((resolve) => setTimeout(resolve, 300));

            setIsDeleting(false)
            setData(updatedRows);
            setSelectedIds({ type: 'include', ids: new Set() });

        } catch (error) {
            console.error("Delete error:", error);
            toast.error(<div className="flex items-center gap-2">
                <Close size={20} className="text-red-600" />
                Failed to delete rows!
            </div>, {
                position: "top-center",
                autoClose: 2000,
                theme: "dark",
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsDeleting(false)
        } finally {
            toast.success(<div className="flex items-center gap-2">
                <Trash2 size={20} className="text-green-600" />
                Deleted successfully!
            </div>, {
                position: "top-center",
                theme: "dark",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsSelect(false)
            setIsDeleting(false);
        }
    };

    const currentData = data
        ? (activeTab === 'ancillary' ? data.parsedGeneral : activeTab === "surgical" ? data.parsedSurgical : data.parsedTherapies)
        : [];

    const handleSortModelChange = useCallback((model) => {
        setSortModel(model);

        if (model.length === 0) return;

        const { field, sort } = model[0];

        const sortedRows = activeTab == "ancillary" ? [...data.parsedGeneral].sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (aValue < bValue) return sort === 'asc' ? -1 : 1;
            if (aValue > bValue) return sort === 'asc' ? 1 : -1;
            return 0;
        }) : [...data.parsedTherapies].sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (aValue < bValue) return sort === 'asc' ? -1 : 1;
            if (aValue > bValue) return sort === 'asc' ? 1 : -1;
            return 0;
        });

        const finalData = {}
        if (activeTab == "ancillary") finalData.parsedGeneral = sortedRows
        if (activeTab == "ultramist") finalData.parsedTherapies = sortedRows

        setData({ ...data, ...finalData });
    }, [data]);


    const columns =
        activeTab === "ancillary"
            ? columnsBase
            : columnsBase.filter((col) => col.field !== "status");


    // const handleFileUpload = async (file) => {
    //     setLoading(true);
    //     setInputValue("")
    //     setError(null);
    //     setFileName(file.name);

    //     setSelectedFile(file)
    //     setOpen(true)
    //     setStateProgress(0)
    //     setProcessStart(false)
    // };

    const handleFileUpload = async (file) => {
        setLoading(true);
        setInputValue("");
        setError(null);

        try {
            // Read the file as binary
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });

            // Get the first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convert sheet to JSON (first row as header)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length === 0) {
                setError("Excel file is empty.");
                setLoading(false);
                return;
            }

            // Extract headers (first row)
            const headers = jsonData[0];

            // Step 1: Check required column
            const requiredColumns = ["Pending Orders"];
            const missingColumns = requiredColumns.filter(col => !headers.includes(col));
            if (missingColumns.length > 0) {
                setError("Oops! The uploaded file doesn’t match the Ancillary Excel format. Please upload the correct file.");
                setLoading(false);
                return;
            }

            // Step 2: Extract report period
            const reportPeriodRaw = headers[4]; // e.g., "5/1/2025 - 12/31/2025"
            if (!reportPeriodRaw.includes("-")) {
                setError("Report period format is invalid. Expected MM/DD/YYYY - MM/DD/YYYY");
                setLoading(false);
                return;
            }

            const [startStr, endStr] = reportPeriodRaw.split("-").map(s => s.trim());

            // Step 3: Parse dates (US format)
            const startDate = new Date(startStr);
            const endDate = new Date(endStr);

            // Check if dates are valid
            if (isNaN(startDate) || isNaN(endDate)) {
                setError("Report period contains invalid dates. Please use MM/DD/YYYY format.");
                setLoading(false);
                return;
            }

            // Step 4: Check start <= end
            if (startDate > endDate) {
                setError("Report period is invalid. Start date cannot be after end date.");
                setLoading(false);
                return;
            }
            // All good, proceed
            setFileName(file.name);
            setSelectedFile(file);
            setOpen(true);
            setStateProgress(0);
            setProcessStart(false);

        } catch (err) {
            console.error(err);
            setError("Failed to read Excel file.");
            setSelectedFile(null);
            setFileName("");
        } finally {
            setLoading(false);
        }
    };
    const handleConfirm = async (stateAbbr) => {
        setStateAbbr(stateAbbr);

        if (stateAbbr.trim()) {
            try {
                setLoading(true);
                const data = await selectedFile.arrayBuffer();
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const [startDate, endDate] = rows[0][rows[0].length - 1].split("-")
                setDateRange({
                    startDate: startDate,
                    endDate: endDate
                })
                const stateCode = stateAbbr.toUpperCase();

                parseAncillaryDataAsync(rows, stateCode, (progress) => {
                    if (!processStart) setProcessStart(true)
                    setProgress(progress)
                }).then(async (result) => {
                    setData(result);
                    setLoading(false);

                    setActiveTab(result.parsedGeneral.length > 0 ? "ancillary" : result.parsedTherapies.length > 0 ? "ultramist" : "surgical")
                    toast.success(
                        <div className="flex items-start space-x-3 text-white w-full">
                            <div>
                                <div className="font-bold text-md text-gray-300">
                                    Duplicate Clinical Orders Resolved
                                </div>
                                <div className="text-sm mt-1 text-gray-400">
                                    Multiple Ultramist and Surgical Debridement orders were identified for the
                                    same MRN/patient. Only the most recent valid order for each type has been
                                    retained, and all duplicate entries have been automatically removed to
                                    ensure data accuracy.
                                </div>
                            </div>
                        </div>,
                        {
                            className: "rounded-lg shadow-lg px-5 py-4 min-w-[640px] max-w-full border border-white/10",
                            // className: "bg-gray-900 rounded-lg shadow-lg px-5 py-4 min-w-[640px] max-w-full",
                            position: "top-center",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            style: {
                                background: 'rgba(28, 28, 30, 0.5)', // Darker iOS-style glass
                                backdropFilter: 'blur(20px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            },
                            theme: "dark",
                        }
                    );

                    setProcessStart(false)
                }).catch(err => {
                    setError('Error parsing file: ' + err.message);
                    setLoading(false);

                });

            } catch (err) {
                setError('Error parsing file: ' + err.message);
                setProcessStart(false)
                setLoading(false);
            } finally {
                setProcessStart(false)

            }
            setOpen(false);
        }
    };



    const handleCancel = () => {
        setOpen(false);
        setStateAbbr('');
        setFileName(null)
        setLoading(false)
        setSelectedFile(null);
        handleReset()
        setInputValue("")
        setStateProgress(0)
        setProcessStart(false)
        setData(null)
        setProgress(0)
    };



    const handleReset = () => {
        setData(null);
        setFileName('');
        setError(null);
        setStateAbbr('');
        setStateProgress(0)
        setProgress(0)
        setInputValue("")
        
        setProcessStart(false)
        setActiveTab('ancillary');
    };

    function getESTDateAndPeriodLabel() {
        const nowUTC = new Date();
        const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            hour12: true,
            minute: '2-digit',
        }).formatToParts(nowUTC);

        const parts = Object.fromEntries(estDate.map(p => [p.type, p.value]));
        const label = parts.month + '/' + parts.day + '/' + parts.year;
        const isAM = parts.dayPeriod === 'AM';
        const periodLabel = isAM ? 'M' : 'E';

        return {
            estDate: label,
            period: periodLabel
        };
    }

    const updateStatesAsync = async (newValue) => {
        const total =
            data.parsedGeneral.length +
            data.parsedTherapies.length +
            data.parsedSurgical.length;

        let processed = 0;
        const chunkSize = 100;

        let updatedGeneral = data.parsedGeneral.map(r => ({ ...r }));
        let updatedTherapies = data.parsedTherapies.map(r => ({ ...r }));
        let updatedSurgical = data.parsedSurgical.map(r => ({ ...r }));

        for (let start = 0; start < total; start += chunkSize) {
            const end = Math.min(start + chunkSize, total);

            for (let i = start; i < end; i++) {
                if (i < updatedGeneral.length) {
                    updatedGeneral[i].state = newValue;
                }
                else if (i < updatedGeneral.length + updatedTherapies.length) {
                    updatedTherapies[i - updatedGeneral.length].state = newValue;
                }
                else {
                    updatedSurgical[
                        i - updatedGeneral.length - updatedTherapies.length
                    ].state = newValue;
                }

                processed++;
            }

            setData(prev => ({
                ...prev,
                parsedGeneral: updatedGeneral,
                parsedTherapies: updatedTherapies,
                parsedSurgical: updatedSurgical,
            }));

            const percent = ((processed / total) * 100).toFixed(2);
            setStateProgress(percent);

            // allow UI to breathe
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    };


    const handleInputChange = (e) => {
        setStateProgress(0)
        const filteredValue = e.target.value.replace(/[^a-zA-Z]/g, '');
        if (filteredValue.length <= 2) {
            setInputValue(filteredValue.toLocaleUpperCase());
            setIsButtonDisabled(filteredValue.length !== 2);
        }
    };

    const handleSubmitStateChange = () => {
        updateStatesAsync(inputValue.toLocaleUpperCase());
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <ToastContainer />
            {/* {processStart && <LoadingModal progress={progress} />} */}
            {<LoadingModal progress={progress} />}


            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    // The base dark color
                    backgroundColor: '#0a0a0a',
                    // The "Mesh Gradient" layers
                    backgroundImage: `
                      radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), 
                      radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
                      radial-gradient(at 50% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)
                    `,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        // Optional: Add a subtle noise texture to prevent color banding
                        opacity: 0.03,
                        pointerEvents: 'none',
                        backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
                    }
                }}

            >
                <Container maxWidth="xl" sx={{ py: 6 }}>

                    <motion.div variants={itemVariants}>

                        <PremiumHeader />
                    </motion.div>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 4, borderRadius: 3, maxWidth: '500px', marginX: 'auto' }}
                        // onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )}

                    {!data ? (
                        <Box>

                            <motion.div variants={itemVariants} controls={controls} initial="hidden" animate="visible">
                                <FileUpload onFileUpload={handleFileUpload} loading={loading} fileName={fileName} setFileName={setFileName} error={error} />
                            </motion.div>

                            <motion.div variants={itemVariants} controls={controls} initial="hidden" animate="visible">
                                <Box sx={{ mt: 6, textAlign: 'center' }}>
                                    <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
                                        A product of{' '}
                                        <Box component="span" sx={{
                                            background: `linear-gradient(135deg, ${appConfig.color.primary} 0%, ${appConfig.color.primary} 100%)`,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 700
                                        }}>
                                            Personic Health
                                        </Box>
                                    </Typography>
                                    <Typography sx={{ color: '#4b5563', fontSize: '0.875rem', mt: 1 }}>
                                        <Box component="span" sx={{ fontWeight: 700 }}>
                                            © {new Date().getFullYear()} Personic Health.
                                        </Box>
                                        <Box component="span" sx={{ mx: 1, color: '#374151' }}>|</Box>
                                        <Box component="span" sx={{ fontWeight: 600 }}>All Rights Reserved.</Box>
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Box>
                    ) : (
                        <>
                            {/* File Info Bar */}

                            <GlassFileHeader fileName={fileName} handleReset={handleReset} />
                            {/* Stats and Date Range */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid size={{ xs: 12, lg: 9 }} >
                                    <StatsCards summary={{
                                        ...data.summary,
                                        totalParsedCount: data.parsedGeneral.length + data.parsedTherapies.length + data.parsedSurgical.length,
                                        generalParsedCount: data.parsedGeneral.length,
                                        therapiesParsedCount: data.parsedTherapies.length,
                                        surgicalParsedCount: data.parsedSurgical.length
                                    }}
                                        setActiveTab={setActiveTab}

                                    />
                                </Grid>


                                <Grid item size={{ xs: 12, lg: 3 }} xs={12} lg={3}>
                                    <ReportPeriodCard dateRange={dateRange} stateAbbr={stateAbbr} />

                                </Grid>
                            </Grid>

                            {/* Tabs and State Update */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item size={{ xs: 12, md: 8 }} xs={12} md={8}>

                                    <TestSwitcher data={data} activeTab={activeTab} setActiveTab={setActiveTab} />
                                </Grid>

                                <Grid item size={{ xs: 12, md: 4 }} xs={12} md={4}>
                                    <AppleGlassInput handleInputChange={handleInputChange} handleSubmitStateChange={handleSubmitStateChange} inputValue={inputValue} isButtonDisabled={isButtonDisabled} stateProgress={stateProgress} />

                                </Grid>
                            </Grid>

                            {/* Data Grid */}
                            <Paper
                                elevation={0}
                                sx={{
                                    height: 700,
                                    background: 'rgba(17, 17, 17, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    overflow: 'hidden'
                                }}
                            >
                                <DataGridPro
                                    rows={currentData}
                                    columns={columns}
                                    checkboxSelection
                                    label={<Typography
                                        component="div"
                                        variant="subtitle2"
                                        className={`flex items-center gap-2 font-bold tracking-tight ${activeTab === 'ancillary' ? 'text-red-400' : activeTab === 'ultramist' ? 'text-orange-400' : 'text-blue-400'}`}
                                    >
                                        <span className="text-primary-500 flex items-center">
                                            {tabConfig[activeTab]?.icon}
                                        </span>
                                        <span className={`uppercase text-sm font-bold tracking-wider ${activeTab === 'ancillary' ? 'text-red-400' : activeTab === 'ultramist' ? 'text-orange-400' : 'text-blue-400'} opacity-90`}>
                                            {tabConfig[activeTab]?.label}
                                        </span>
                                    </Typography>}
                                    initialState={{
                                        pinnedColumns: {
                                            left: ['__check__', 'patientName'],
                                        },
                                    }}
                                    showToolbar
                                    slotProps={{
                                        toolbar: {
                                            csvOptions: {
                                                fileName: `${tabConfig[activeTab]?.label.split(" ").join("_")}_${stateAbbr}_${getESTDateAndPeriodLabel().estDate}`,
                                            },


                                        },
                                    }}
                                    sx={{
                                        background: 'transparent',
                                        border: 'none',
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                                            borderBottom: '2px solid rgba(16, 185, 129, 0.3)',
                                            fontWeight: 700,
                                        },
                                        '& .MuiDataGrid-virtualScroller': {
                                            backgroundColor: 'transparent',
                                        },
                                        '& .MuiDataGrid-row:hover': {
                                            background: 'rgba(16, 185, 129, 0.05)',
                                        },
                                        '& .MuiDataGrid-row.Mui-selected': {
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            '&:hover': {
                                                background: 'rgba(16, 185, 129, 0.15)',
                                            }
                                        },
                                    }}
                                    sortingMode="server"
                                    sortModel={sortModel}
                                    onSortModelChange={handleSortModelChange}
                                    onRowSelectionModelChange={(newSelection) => {
                                        if (newSelection.type == "include") {
                                            setIsSelect(true)
                                            setSelectedIds(newSelection);
                                        }
                                        if (newSelection.type == "exclude") {
                                            setIsSelect(true)
                                            const filteredIds = currentData
                                                .filter(item => !newSelection.ids.has(item.id))
                                                .map(item => item.id);
                                            setSelectedIds({ type: "include", ids: new Set(filteredIds) });
                                            return
                                        }
                                        if (newSelection.ids.size == 0) setIsSelect(false)
                                    }}
                                    rowSelectionModel={selectedIds}
                                />
                                <FloatingDeleteButton
                                    setSelectedIds={setSelectedIds}
                                    setIsSelect={setIsSelect}
                                    isSelect={selectedIds.type == "exclude" || isSelect}
                                    isDeleting={isDeleting}
                                    setDeleting={setIsDeleting}
                                    handleDelete={handleDelete}
                                    selectedCount={selectedIds.ids.size}
                                />
                            </Paper>
                        </>
                    )}
                </Container>
            </Box>

            <EnterpriseModal open={open} handleCancel={handleCancel} handleConfirm={handleConfirm} selectedFile={selectedFile} />

        </ThemeProvider>
    );
}
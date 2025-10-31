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
import { CheckCircleIcon, FileSpreadsheet, MapPin, Trash2 } from 'lucide-react';

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

// Premium File Upload Component
function FileUpload({ onFileUpload, loading }) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileUpload(e.dataTransfer.files[0]);
        }
    }, [onFileUpload]);

    const handleFileSelect = useCallback((e) => {
        if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0]);
            e.target.value = ""
        }
    }, [onFileUpload]);

    return (
        <Paper
            elevation={0}
            className={`relative border-2 border-dashed transition-all duration-300 ${
                dragActive
                    ? 'border-emerald-400 bg-emerald-400/5 shadow-lg shadow-emerald-500/20'
                    : 'border-emerald-600/40 hover:border-emerald-500/60 hover:bg-emerald-400/5'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
                p: 6,
                textAlign: 'center',
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(16, 185, 129, 0.01) 100%)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                    opacity: dragActive ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }
            }}
        >
            {loading && (
                <LinearProgress 
                    className="absolute top-0 left-0 right-0" 
                    sx={{
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                        }
                    }}
                />
            )}
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
                        display: 'inline-flex',
                        animation: dragActive ? 'pulse 2s ease-in-out infinite' : 'none',
                        '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                            '50%': { transform: 'scale(1.05)', opacity: 0.8 },
                        }
                    }}
                >
                    <CloudUpload sx={{ fontSize: 64, color: '#10b981' }} />
                </Box>

                <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700, color: '#e5e7eb' }}>
                    Drop your Excel file here
                </Typography>

                <Typography variant="body1" sx={{ mb: 3, color: '#9ca3af', maxWidth: 400, mx: 'auto' }}>
                    Or click the button below to browse and select your .xlsx file
                </Typography>

                <Button
                    variant="contained"
                    component="label"
                    disabled={loading}
                    startIcon={<Description />}
                    sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.5)',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    Browse Files
                    <input
                        type="file"
                        accept=".xlsx"
                        hidden
                        onChange={handleFileSelect}
                    />
                </Button>

                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#6b7280' }}>
                    Supported format: .xlsx (Excel)
                </Typography>
            </Box>
        </Paper>
    );
}

// Premium Stats Cards
function StatsCards({ summary }) {
    const stats = [
        {
            title: 'Total Records',
            value: summary?.totalCount || 0,
            parsedValue: summary?.totalParsedCount || 0,
            icon: <Assessment sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
        },
        {
            title: 'General Tests',
            value: summary?.generalCount || 0,
            parsedValue: summary?.generalParsedCount || 0,
            icon: <LocalHospital sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
        },
        {
            title: 'Therapies',
            value: summary?.therapiesCount || 0,
            parsedValue: summary?.therapiesParsedCount || 0,
            icon: <Person sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
            borderColor: 'rgba(249, 115, 22, 0.3)',
        }
    ];

    return (
        <Grid container spacing={3} className="mb-6">
            {stats.map((stat, index) => (
                <Grid item size={{xs:12,md:6,lg:4}} xs={12} md={6} lg={4} key={index}>
                    <Card 
                        elevation={0}
                        sx={{
                            height: '100%',
                            background: stat.bgGradient,
                            border: `1px solid ${stat.borderColor}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `0 12px 24px -10px ${stat.borderColor}`,
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography 
                                        variant="overline" 
                                        sx={{ 
                                            color: '#9ca3af',
                                            fontWeight: 600,
                                            letterSpacing: '0.1em',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>
                                    <Typography 
                                        variant="h3" 
                                        sx={{ 
                                            fontWeight: 700,
                                            background: stat.gradient,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mt: 0.5
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                </Box>
                                <Box 
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 3,
                                        background: stat.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                    Parsed:
                                </Typography>
                                <Chip
                                    label={stat.parsedValue}
                                    size="small"
                                    sx={{
                                        background: stat.gradient,
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

// Main Component
export default function AncillaryDataParser() {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
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

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            let updatedRows = data

            if (activeTab == "general") updatedRows.parsedGeneral = data.parsedGeneral.filter((row) => !selectedIds.ids.has(row.id));
            if (activeTab == "therapies") updatedRows.parsedTherapies = data.parsedTherapies.filter((row) => !selectedIds.ids.has(row.id));

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
        ? (activeTab === 'general' ? data.parsedGeneral : data.parsedTherapies)
        : [];

    const handleSortModelChange = useCallback((model) => {
        setSortModel(model);

        if (model.length === 0) return;

        const { field, sort } = model[0];

        const sortedRows = activeTab == "general" ? [...data.parsedGeneral].sort((a, b) => {
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
        if (activeTab == "general") finalData.parsedGeneral = sortedRows
        if (activeTab == "therapies") finalData.parsedTherapies = sortedRows

        setData({ ...data, ...finalData });
    }, [data]);

    
      const columns =
    activeTab === "general"
      ? columnsBase
      : columnsBase.filter((col) => col.field !== "status");


    const handleFileUpload = async (file) => {
        setLoading(true);
        setInputValue("")
        setError(null);
        setFileName(file.name);
        setSelectedFile(file)
        setOpen(true)
        setStateProgress(0)
        setProcessStart(false)
    };

    const handleConfirm = async () => {
        if (stateAbbr.trim()) {
            try {
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

                    toast.success(
                        <div className="flex items-start space-x-3 text-white">
                            <div>
                                <div className="font-bold text-md text-gray-300">Duplicates Ultramist Records Removed by MRN</div>
                                <div className="text-sm mt-1 text-gray-400">
                                    Only the latest order has been kept. All other duplicates have been removed. Thank you.
                                </div>
                            </div>
                        </div>,
                        {
                            className: "bg-gray-900 rounded-lg shadow-lg px-4 py-3",
                            position: "top-center",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "dark"
                        }
                    );
                    setProcessStart(false)
                });

            } catch (err) {
                setError('Error parsing file: ' + err.message);
                setProcessStart(false)
                setLoading(false);
            } finally {
                setProcessStart(false)
                setLoading(false);
            }
            setOpen(false);
        }
    };

    const handleStateChange = (event) => {
        const value = event.target.value.toUpperCase();
        if (value.length <= 2) {
            setStateAbbr(value);
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
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        bgcolor: 'background.paper',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: "hidden",
        outline: 'none',
    };

    const handleReset = () => {
        setData(null);
        setFileName('');
        setError(null);
        setStateAbbr('');
        setStateProgress(0)
        setInputValue("")
        setProcessStart(false)
        setActiveTab('general');
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
        const total = data.parsedGeneral.length + data.parsedTherapies.length;
        let processed = 0;
        const chunkSize = 100;

        let updatedGeneral = data.parsedGeneral.map((r) => ({ ...r }));
        let updatedTherapies = data.parsedTherapies.map((r) => ({ ...r }));

        for (let start = 0; start < total; start += chunkSize) {
            const end = Math.min(start + chunkSize, total);

            for (let i = start; i < end; i++) {
                if (i < updatedGeneral.length) {
                    updatedGeneral[i].state = newValue;
                } else {
                    updatedTherapies[i - updatedGeneral.length].state = newValue;
                }
                processed++;
            }

            setData({
                ...data,
                parsedGeneral: updatedGeneral,
                parsedTherapies: updatedTherapies,
            });

            const percent = ((processed / total) * 100).toFixed(2);
            setStateProgress(percent);

            await new Promise((resolve) => setTimeout(resolve, 0));
        }
    };

    const handleInputChange = (e) => {
        setStateProgress(0)
        const filteredValue = e.target.value.replace(/[^a-zA-Z]/g, '');
        if (filteredValue.length <= 2) {
            setInputValue(filteredValue.toLocaleUpperCase());
            setIsButtonDisabled(filteredValue.length === 0);
        }
    };

    const handleSubmitStateChange = () => {
        updateStatesAsync(inputValue.toLocaleUpperCase());
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <ToastContainer />
            {processStart && <LoadingModal progress={progress} />}

            <Box sx={{ 
                minHeight: '100vh',
                background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
                backgroundAttachment: 'fixed',
            }}>
                <Container maxWidth="xl" sx={{ py: 6 }}>
                    {/* Premium Header */}
                    <Box sx={{ mb: 6, textAlign: 'center' }}>
                        <Box sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 3,
                            p: 2,
                            px: 4,
                            borderRadius: 6,
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}>
                            <img src={logo} style={{ height: 50 }} alt="Personic Health" />
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography sx={{ 
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.15em',
                                    color: '#9ca3af',
                                    textTransform: 'uppercase'
                                }}>
                                    Personic Health
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        Version
                                    </Typography>
                                    <Chip 
                                        label="4.6.7" 
                                        size="small"
                                        sx={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            height: 22,
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Typography 
                            variant="h3" 
                            sx={{ 
                                mb: 2,
                                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '2rem', md: '3rem' }
                            }}
                        >
                            Ancillary Data Parser Pro
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#9ca3af', fontWeight: 400 }}>
                            Professional healthcare data processing tool
                        </Typography>
                    </Box>

                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 4, borderRadius: 3 }}
                            onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )}

                    {!data ? (
                        <Box>
                            <FileUpload onFileUpload={handleFileUpload} loading={loading} />

                            <Box sx={{ mt: 6, textAlign: 'center' }}>
                                <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
                                    A product of{' '}
                                    <Box component="span" sx={{ 
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                        </Box>
                    ) : (
                        <>
                            {/* File Info Bar */}
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    mb: 4,
                                    p: 3,
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                            <Description sx={{ color: 'white' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {fileName}
                                            </Typography>
                                            <Chip
                                                icon={<CheckCircle />}
                                                label="Parsed Successfully"
                                                size="small"
                                                sx={{
                                                    mt: 0.5,
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Refresh Data">
                                            <IconButton 
                                                onClick={handleReset}
                                                sx={{
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    '&:hover': {
                                                        background: 'rgba(16, 185, 129, 0.2)',
                                                    }
                                                }}
                                            >
                                                <Refresh sx={{ color: '#10b981' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Clear All">
                                            <IconButton 
                                                onClick={handleReset}
                                                sx={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    '&:hover': {
                                                        background: 'rgba(239, 68, 68, 0.2)',
                                                    }
                                                }}
                                            >
                                                <Delete sx={{ color: '#ef4444' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Stats and Date Range */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid  size={{xs:12,lg:9}} >
                                    <StatsCards summary={{
                                        ...data.summary,
                                        totalParsedCount: data.parsedGeneral.length + data.parsedTherapies.length,
                                        generalParsedCount: data.parsedGeneral.length,
                                        therapiesParsedCount: data.parsedTherapies.length
                                    }} />
                                </Grid>
                                
                                <Grid item size={{xs:12,lg:3}} xs={12} lg={3}>
                                    <Card 
                                        elevation={0}
                                        sx={{ 
                                            height: '100%',
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                            border: '1px solid rgba(139, 92, 246, 0.3)',
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <DateRange sx={{ color: '#8b5cf6' }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    Report Period
                                                </Typography>
                                            </Box>
                                            
                                            <Chip 
                                                label={`${stateAbbr} State`}
                                                size="small"
                                                sx={{
                                                    mb: 2,
                                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                }}
                                            />
                                            
                                            <Box sx={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(0, 0, 0, 0.3)',
                                            }}>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>
                                                        Start Date
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ 
                                                        color: '#10b981',
                                                        fontWeight: 700,
                                                        mt: 0.5
                                                    }}>
                                                        {dateRange.startDate}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ color: '#6b7280' }}>→</Box>
                                                
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>
                                                        End Date
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ 
                                                        color: '#10b981',
                                                        fontWeight: 700,
                                                        mt: 0.5
                                                    }}>
                                                        {dateRange.endDate}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Tabs and State Update */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item size={{xs:12,md:8}} xs={12} md={8}>
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Button
                                            variant={activeTab === 'general' ? 'contained' : 'outlined'}
                                            onClick={() => setActiveTab('general')}
                                            sx={{
                                                background: activeTab === 'general' 
                                                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                                    : 'transparent',
                                                borderColor: '#ef4444',
                                                color: activeTab === 'general' ? 'white' : '#ef4444',
                                                '&:hover': {
                                                    background: activeTab === 'general'
                                                        ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                                        : 'rgba(239, 68, 68, 0.1)',
                                                    borderColor: '#ef4444',
                                                },
                                                fontWeight: 600,
                                                px: 3,
                                            }}
                                        >
                                            <LocalHospital sx={{ mr: 1, fontSize: 20 }} />
                                            General Tests ({data.parsedGeneral.length})
                                        </Button>
                                        <Button
                                            variant={activeTab === 'therapies' ? 'contained' : 'outlined'}
                                            onClick={() => setActiveTab('therapies')}
                                            sx={{
                                                background: activeTab === 'therapies' 
                                                    ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                                                    : 'transparent',
                                                borderColor: '#f97316',
                                                color: activeTab === 'therapies' ? 'white' : '#f97316',
                                                '&:hover': {
                                                    background: activeTab === 'therapies'
                                                        ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
                                                        : 'rgba(249, 115, 22, 0.1)',
                                                    borderColor: '#f97316',
                                                },
                                                fontWeight: 600,
                                                px: 3,
                                            }}
                                        >
                                            <Person sx={{ mr: 1, fontSize: 20 }} />
                                            Therapies ({data.parsedTherapies.length})
                                        </Button>
                                    </Box>
                                </Grid>
                                
                                <Grid item size={{xs:12,md:4}} xs={12} md={4}>
                                    <Box sx={{ position: 'relative' }}>
                                        <TextField
                                            fullWidth
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            placeholder="Enter State Code"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MapPin size={20} style={{ color: '#6b7280' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    '&:hover': {
                                                        background: 'rgba(255, 255, 255, 0.08)',
                                                    },
                                                    '&.Mui-focused': {
                                                        background: 'rgba(255, 255, 255, 0.08)',
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={handleSubmitStateChange}
                                            disabled={isButtonDisabled || stateProgress >= 100}
                                            variant="contained"
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                minWidth: 100,
                                                background: stateProgress >= 100
                                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                '&:hover': {
                                                    background: stateProgress >= 100
                                                        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                                        : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                                },
                                                '&:disabled': {
                                                    background: '#374151',
                                                    color: '#6b7280',
                                                }
                                            }}
                                        >
                                            {stateProgress >= 100 ? '✓ Done' : stateProgress > 0 ? `${stateProgress}%` : 'Update'}
                                        </Button>
                                    </Box>
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
                                    initialState={{
                                        pinnedColumns: {
                                            left: ['__check__', 'patientName'],
                                        },
                                    }}
                                    showToolbar
                                    slotProps={{
                                        toolbar: {
                                            csvOptions: {
                                                fileName: `Ancillary ${activeTab[0].toLocaleUpperCase() + activeTab.slice(1)} Parsed - ${stateAbbr} - ${getESTDateAndPeriodLabel().estDate}`,
                                            },
                                        },
                                    }}
                                    label={<div className='flex items-center gap-2' style={{ fontWeight: 'bold' }}><FileSpreadsheet size={20} /> Ancillary {activeTab[0].toLocaleUpperCase() + activeTab.slice(1)} Parsed Output</div>}

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

            {/* Premium Modal */}
            <Modal
                open={open}
                onClose={handleCancel}
                aria-labelledby="file-upload-modal"
                sx={{ 
                    backdropFilter: 'blur(8px)',
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                }}
            >
                <Box sx={modalStyle}>
                    <Box sx={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                        p: 3,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    File Upload Configuration
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                    Configure your data processing settings
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={handleCancel}
                                sx={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    '&:hover': {
                                        background: 'rgba(239, 68, 68, 0.2)',
                                    }
                                }}
                            >
                                <Close sx={{ color: '#ef4444' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ p: 4 }}>
                        {selectedFile && (
                            <Alert 
                                icon={<Description />}
                                severity="success"
                                sx={{ 
                                    mb: 3,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                }}
                            >
                                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>
                                    Selected File
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                                    {selectedFile.name}
                                </Typography>
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            autoFocus
                            label="State Abbreviation"
                            value={stateAbbr}
                            onChange={handleStateChange}
                            placeholder="e.g., MD, PA, VA"
                            variant="outlined"
                            color="success"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && stateAbbr.trim()) {
                                    e.preventDefault();
                                    handleConfirm();
                                }
                            }}
                            helperText="Enter 2-letter state code (MD, PA, VA, etc.)"
                            inputProps={{
                                maxLength: 2,
                                style: { textTransform: 'uppercase', fontSize: '1.125rem', fontWeight: 600 }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MapPin size={20} style={{ color: '#10b981' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    background: 'rgba(16, 185, 129, 0.05)',
                                    '&:hover': {
                                        background: 'rgba(16, 185, 129, 0.08)',
                                    },
                                    '&.Mui-focused': {
                                        background: 'rgba(16, 185, 129, 0.1)',
                                    }
                                }
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{
                                    borderColor: 'rgba(239, 68, 68, 0.5)',
                                    color: '#ef4444',
                                    '&:hover': {
                                        borderColor: '#ef4444',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleConfirm}
                                disabled={!stateAbbr.trim()}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                        boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.5)',
                                    },
                                    '&:disabled': {
                                        background: '#374151',
                                        color: '#6b7280',
                                    }
                                }}
                            >
                                Confirm & Process
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}
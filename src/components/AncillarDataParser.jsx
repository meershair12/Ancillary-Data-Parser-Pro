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

// Dark theme configuration
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00BCD4',
        },
        secondary: {
            main: '#FF4081',
        },
        background: {
            default: '#0a0a0a',
            paper: '#1a1a1a',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});


// File upload component
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
            className={`relative border-2 border-dashed transition-all text-center duration-300 ${dragActive
                ? 'border-green-400 bg-green-400/10'
                : 'border-green-600 hover:border-green-500'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{ p: 4, textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", borderRadius: 7 }}
        >
            {loading && <LinearProgress className="absolute top-0 left-0 right-0" />}
            <span>
                <CloudUpload className='text-green-700' sx={{ fontSize: 64, mb: 2 }} />
            </span>

            <Typography variant="h6" className="mb-2">
                Drag and drop your CSV file here
            </Typography>

            <Typography variant="body2" color="textSecondary" className="mb-4">
                or click to browse files
            </Typography>

            <Button
                variant="contained"
                component="label"
                color='success'
                startIcon={<Description />}
                disabled={loading}
                className="mx-auto"
                sx={{
                    py: 1.4,
                    borderRadius: 3,
                    mt: 2,
                    textTransform: 'capitalize',
                    boxShadow: "none",
                    width: "200px"
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
        </Paper>
    );
}


function StatsCards({ summary }) {
    const stats = [
        {
            title: 'Total Records',
            value: summary?.totalCount || 0,
            parsedValue: summary?.totalParsedCount || 0,
            icon: <Assessment color='success' />,
            color: 'primary',
            sx: {
                bg: "#0e330e",
                text: "#3dff00",
                border: '#2F7F16'
            }
        },
        {
            title: 'General Tests',
            value: summary?.generalCount || 0,
            parsedValue: summary?.generalParsedCount || 0,
            icon: <LocalHospital color='error' />,
            color: 'secondary',
            sx: {
                bg: "#351313",
                text: "#ff6a6a",
                border: '#990F0F'
            }
        },
        {
            title: 'Therapies',
            value: summary?.therapiesCount || 0,
            parsedValue: summary?.therapiesParsedCount || 0,
            icon: <Person />,
            color: 'success',
            sx: {
                bg: "#331D0E",
                text: "#FC7600",
                border: '#FC7600'
            }
        }
    ];

    return (
        <Grid container spacing={3} className="mb-6 mr-4">
            {stats.map((stat, index) => (
                <Grid item size={{ xs: 12, md: 5, lg: 4 }} key={index}>
                    <Card className="h-full" sx={{ borderRadius: '10px', width: "100%" }}>
                        <CardContent className="flex items-center justify-between">
                            <Box className="flex-1 text-left">
                                <Typography color="textSecondary" gutterBottom variant="overline" className='text-left'>
                                    {stat.title}
                                </Typography>
                                <Typography variant="h4" component="div" className="mb-1 text-left">
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className='text-left'>
                                    {stat.title} Parsed: <span style={{
                                        backgroundColor: stat.sx.bg,
                                        border: `1px solid ${stat.sx.border}`,
                                        color: stat.sx.text,
                                        padding: '4px 12px',
                                        borderRadius: '10px',
                                        display: 'inline-block',
                                    }}>{stat.parsedValue}</span>
                                </Typography>
                            </Box>
                            <Box className="text-[#FC7600]">
                                {stat.icon}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}



// Main component
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

    const handleDelete = async () => {
        try {

            setIsDeleting(true);

            // Filter out selected rows
            let updatedRows = data

            if (activeTab == "general") updatedRows.parsedGeneral = data.parsedGeneral.filter((row) => !selectedIds.ids.has(row.id));
            if (activeTab == "therapies") updatedRows.parsedTherapies = data.parsedTherapies.filter((row) => !selectedIds.ids.has(row.id));




            // Simulate small delay (optional, for UX)
            await new Promise((resolve) => setTimeout(resolve, 300));

            setIsDeleting(false)

            // Update rows
            setData(updatedRows);

            // Reset selection
            setSelectedIds({ type: 'include', ids: new Set() });



        } catch (error) {
            console.error("Delete error:", error);
            toast.error(<div className="flex items-center gap-2">
                <XCircle size={20} className="text-red-600" />
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
    const [sortModel, setSortModel] = useState([]);
    const handleSortModelChange = useCallback((model) => {
        setSortModel(model);

        if (model.length === 0) return; // no sort

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


    const columns = [
        {
            field: 'patientName',
            headerName: 'Patient Name',
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
        { field: 'uid', headerName: 'UID', width: 850 }
    ];

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
            // Process the file upload with state abbreviation
            try {
                const data = await selectedFile.arrayBuffer();
                const workbook = XLSX.read(data, { type: 'array' });
                // Get the first worksheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert worksheet to a 2D array
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const [startDate, endDate] = rows[0][rows[0].length - 1].split("-")
                setDateRange({
                    startDate: startDate,
                    endDate: endDate
                })
                // Assuming state code extraction logic or default
                const stateCode = stateAbbr.toUpperCase(); // Update based on actual file logic

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
            // Close modal and reset
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
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 6,
        border: '1px solid #ffffff50',
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

        // Convert to EST using Intl.DateTimeFormat
        const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            hour12: true,
            minute: '2-digit',
        }).formatToParts(nowUTC);

        // Extract parts
        const parts = Object.fromEntries(estDate.map(p => [p.type, p.value]));
        const label = parts.month + '/' + parts.day + '/' + parts.year;

        // Determine AM/PM
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
        const chunkSize = 100; // ✅ Tune for speed vs responsiveness

        // Clone data once (deep enough to allow mutation)
        let updatedGeneral = data.parsedGeneral.map((r) => ({ ...r }));
        let updatedTherapies = data.parsedTherapies.map((r) => ({ ...r }));

        // Process in chunks
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

            // Update state once per chunk (fast!)
            setData({
                ...data,
                parsedGeneral: updatedGeneral,
                parsedTherapies: updatedTherapies,
            });

            // Update progress bar
            const percent = ((processed / total) * 100).toFixed(2);
            setStateProgress(percent);

            // Let UI breathe
            await new Promise((resolve) => setTimeout(resolve, 0));
        }
    };





    const [inputValue, setInputValue] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleInputChange = (e) => {
        setStateProgress(0)
        // Allow only alphabetic characters
        const filteredValue = e.target.value.replace(/[^a-zA-Z]/g, '');
        if (filteredValue.length <= 2) {
            setInputValue(filteredValue.toLocaleUpperCase());
            setIsButtonDisabled(filteredValue.length === 0);

        }
    };

    const handleSubmitStateChange = () => {
        // Here you can call your function with the input value 
        updateStatesAsync(inputValue.toLocaleUpperCase());

        // Optional: Clear input after submission
        // setInputValue('');
        // setIsButtonDisabled(true);
    };


    //     const [stateOptions,setStateOptions] = useState([]);

    // useEffect(() => {
    //   fetch("/state.json")
    //     .then((res) => res.json()) // ✅ directly convert response to JSON
    //     .then((result) => {
    //       setStateOptions(result); // ✅ ab JSON array milega
    //     })
    //     .catch((err) => {
    //       console.error("Error fetching states:", err);
    //     });
    // }, []);



    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
           
            <ToastContainer />
            {processStart && <LoadingModal progress={progress} />}

            <div className="min-h-screen bg-[#0A0A0A]">
                <Container maxWidth="xl" className="py-8">
                    {/* Header */}
                    <Box className="mb-8 text-center flex flex-col ">
                        <Box className="flex items-center gap-1  mb-3  p-2 px-7 rounded-[25px]">
                            <img src={logo} className='h-[50px]' alt="" />
                            <div className='text-left'>
                                <Typography className='uppercase m-0 p-0 text-sm text-muted-foreground font-bold'><b>Personic Health</b></Typography>
                                {/* <Typography className='text-sm m-0'>Ancillary Automation</Typography> */}
                                <Typography className='text-gray-400 m-0' >Version <span className='bg-[#2a432c] p-1 rounded-[10px] px-2 text-white border border-[#74B87B] text-sm'>4.3.5</span></Typography>
                            </div>
                        </Box>
                        <Typography variant="h3" className="mb-2 font-bold font-bold text-green-600">
                            Ancillary Data Parser Pro
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Professional healthcare data processing tool
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {!data ? (
                        <div className='text-center'>
                            <FileUpload onFileUpload={handleFileUpload} loading={loading} />

                            <div className="mt-8 text-center">
                                <p className="text-gray-600 text-sm font-medium tracking-wide">
                                    A product of{' '}
                                    <span className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 cursor-pointer">
                                        Personic Health
                                    </span>
                                </p>
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-gray-700 text-sm font-medium">
                                    <span className="font-bold">© {new Date().getFullYear()} Personic Health.</span>
                                    <span className="mx-2 text-gray-400">|</span>
                                    <span className="font-semibold">All Rights Reserved.</span>
                                </p>
                            </div>

                        </div>

                    ) : (
                        <>

                            {/* File info and actions */}
                            <Paper className="mb-6 p-4">
                                <Box className="flex items-center justify-between">
                                    <Box className="flex items-center">
                                        <Description className="mr-2 text-cyan-400" />
                                        <Typography variant="h6">{fileName}</Typography>
                                        <Chip
                                            label="Parsed Successfully"
                                            color="success"
                                            size="small"
                                            className="ml-2"
                                        />
                                    </Box>
                                    <Box>
                                        <Tooltip title="Reset">
                                            <IconButton onClick={handleReset} color="primary">
                                                <Refresh />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Clear">
                                            <IconButton onClick={handleReset} color="error">
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Stats */}
                            <Grid container >
                                <Grid size={{ xs: 12, md: 7, lg: 9 }}>
                                    <StatsCards summary={{ ...data.summary, totalParsedCount: data.parsedGeneral.length + data.parsedTherapies.length, generalParsedCount: data.parsedGeneral.length, therapiesParsedCount: data.parsedTherapies.length }} />
                                </Grid>
                                {/* reported ate */}
                                <Grid size={{ xs: 12, md: 5, lg: 3 }}>
                                    <Box sx={{ mb: 2, width: '100%' }}>
                                        <div className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden w-full">
                                            <div className="p-6">
                                                <h2 className="text-xl font-semibold text-gray-300 mb-2">Report Period - {stateAbbr} State</h2>
                                                <p className="text-gray-400 mb-6">Viewing data for the following date range:</p>

                                                <div className="flex items-center justify-between bg-[#0A0A0A] rounded-lg p-4 border border-gray-600">
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-400 font-medium">Start Date</p>
                                                        <p className="text-2xl font-bold text-[#74B87B]">{dateRange.startDate}</p>
                                                    </div>

                                                    <div className="mx-4">
                                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </div>

                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-400 font-medium">End Date</p>
                                                        <p className="text-2xl font-bold text-[#74B87B]">{dateRange.endDate}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </Grid>
                            </Grid>
                            {/* Tabs */}
                            <Grid container className="mb-3">
                                <Grid item size={{ md: 8 }}>

                                    <Box className="mb-4 gap-1 flex ">
                                        <Button
                                            variant={activeTab === 'general' ? 'contained' : 'outlined'}
                                            onClick={() => setActiveTab('general')}
                                            color='error'
                                            className="mr-2"
                                            sx={{ textTransform: "capitalize" }}
                                        >
                                            General Tests ({data.parsedGeneral.length})
                                        </Button>
                                        <Button
                                            variant={activeTab === 'therapies' ? 'contained' : 'outlined'}
                                            onClick={() => setActiveTab('therapies')}
                                            sx={{ textTransform: "capitalize" }}
                                        >
                                            Therapies ({data.parsedTherapies.length})
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <div className="w-full mx-auto">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                placeholder="Enter State Code"
                                                className="w-full px-4 py-3 pr-24 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                            />
                                            <button
                                                onClick={handleSubmitStateChange}
                                                disabled={isButtonDisabled || stateProgress == 100}
                                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 py-2 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg active:scale-95
                                            ${isButtonDisabled
                                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                        : `${stateProgress < 100 ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} text-white font-medium`}`}
                                            >
                                                {stateProgress >= 100 ? "Completed" : stateProgress > 0 ? stateProgress + " Processing..." : "Update"}
                                            </button>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>


                            {/* Data Grid */}
                            <Paper className="h-170 text-left bg-[#1A1A1A] border" sx={{ borderColor: "#ffffff30" }} >
                                <DataGridPro
                                    rows={currentData}
                                    columns={columns}
                                    // pinnedColumns={{left:["patientName"]}}
                                    checkboxSelection
                                    initialState={{
                                        pinnedColumns: {
                                            left: ['__check__', 'patientName'], // <-- selection first, then patientName
                                        },
                                    }}


                                    showToolbar
                                    slotProps={{
                                        toolbar: {
                                            csvOptions: {
                                                fileName: `Ancillary ${activeTab[0].toLocaleUpperCase() + activeTab.slice(1)} Parsed - ${stateAbbr} - ${getESTDateAndPeriodLabel().estDate}`, // Set your desired filename here
                                                // You can add other CSV export options here as needed
                                            },
                                        },
                                    }}
                                    label={<div className='flex items-center gap-2' style={{ fontWeight: 'bold' }}><FileSpreadsheet size={20} /> Ancillary {activeTab[0].toLocaleUpperCase() + activeTab.slice(1)} Parsed Output</div>}

                                    sx={{
                                        background: "transparent",
                                        border: 'none',
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: '1px solid rgba(17, 19, 17, 0.38)',
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: 'rgba(0, 188, 212, 0.1)',
                                            borderBottom: '2px solid rgb(47, 119, 33)',
                                        },
                                        '& .MuiDataGrid-virtualScroller': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    sortingMode="server" // 👈 important: tells MUI you're handling sort manually
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
                                <FloatingDeleteButton setSelectedIds={setSelectedIds} setIsSelect={setIsSelect} isSelect={selectedIds.type == "exclude" || isSelect} isDeleting={isDeleting} setDeleting={setIsDeleting} handleDelete={handleDelete} selectedCount={selectedIds.ids.size} />
                            </Paper>
                        </>
                    )}
                </Container>
            </div>

            {/* <ProfessionalFooter/> */}
            <Modal
                open={open}
                onClose={handleCancel}
                aria-labelledby="file-upload-modal-title"
                aria-describedby="file-upload-modal-description"
                sx={{ backdropFilter: 'blur(3px)' }}
            >
                <Box sx={modalStyle}>
                    <Paper className="p-6 relative">
                        {/* Close Button */}
                        <IconButton
                            onClick={handleCancel}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"

                            sx={{ position: "absolute", top: 20, right: 20 }}
                        >
                            <Close />
                        </IconButton>

                        {/* Modal Title */}
                        <Typography
                            id="file-upload-modal-title"
                            variant="h5"
                            component="h2"
                            className="mb-4 font-semibold text-gray-300"
                        >
                            File Upload Configuration
                        </Typography>

                        {/* File Info */}
                        {selectedFile && (
                            <Alert className="my-4 rounded-lg" sx={{ border: "1px solid green", borderRadius: 3 }}>
                                <Typography variant="body2" className="text-gray-600">
                                    Selected File:
                                </Typography>
                                <Typography variant="body1" className="font-medium">
                                    {selectedFile.name}
                                </Typography>
                            </Alert>
                        )}

                        {/* State Input */}
                        <div className="mb-6">
                            {/* <Autocomplete
                                options={stateOptions}
                                value={stateOptions.find((s) => s.abbreviation === stateAbbr) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setStateAbbr(newValue.abbreviation); // 👈 only abbreviation stored
                                    } else {
                                        setStateAbbr("");
                                    }
                                }}
                                getOptionLabel={(option) =>
                                    option ? `${option.name} (${option.abbreviation})` : ""
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        color="success"
                                        label="Enter State"
                                        placeholder="e.g., Maryland (MD)"
                                        helperText="Select state (Name + Abbreviation)"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && stateAbbr.trim()) {
                                                e.preventDefault();
                                                handleConfirm(stateAbbr); // pass abbreviation
                                            }
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MapPin size={18} style={{ color: "#666" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: 2,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3,
                                            },
                                        }}
                                    />
                                )}
                            /> */}

                            <TextField
                                fullWidth
                                focused
                                color='success'
                                autoFocus
                                label="Enter State Abbreviation"
                                value={stateAbbr}
                                onChange={handleStateChange}
                                placeholder="e.g., MD, PA, VA"
                                variant="outlined"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && stateAbbr.trim()) {
                                        e.preventDefault(); // optional: prevent form submission or refresh
                                        handleConfirm();
                                    }
                                }}
                                helperText="Enter 2-letter state code (MD, PA, VA, etc.)"
                                inputProps={{

                                    maxLength: 2,
                                    style: { textTransform: 'uppercase' }
                                }}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MapPin size={18} style={{ color: '#666' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />

                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outlined"
                                color='error'
                                sx={{ borderRadius: 2, textTransform: 'capitalize' }}
                                onClick={handleCancel}
                                className="text-gray-600 border-gray-300 hover:border-gray-400"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleConfirm}
                                sx={{
                                    borderRadius: 2, textTransform: 'capitalize', background: "#52a756ff", ":hover": {
                                        background: "#388E3C"
                                    }
                                }}
                                disabled={!stateAbbr.trim()}
                                className="dark:bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                            >
                                Confirm
                            </Button>
                        </div>
                    </Paper>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}


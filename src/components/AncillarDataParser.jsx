import React, { useState, useCallback } from 'react';
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
    InputAdornment
} from '@mui/material';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, MapPin } from 'lucide-react';

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
import clsx from 'clsx';
import ProfessionalFooter from './Footer';
import logo from "./logo.png"
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
function excelDateToEST(excelSerialDate) {
    // Use 1899-12-31 as the correct base date
    const utcDate = new Date(Date.UTC(1899, 11, 31) + excelSerialDate * 86400000);

    // Convert to EST or EDT depending on date
    const estDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(utcDate);

    return estDate;
}
// Parse function (your existing logic)
function parseAncillaryData(rawRows, stateCode) {
    const bloodTests = [
        "Comprehensive metabolic 2000 panel - Serum or Plasma",
        "Hemoglobin A1c/Hemoglobin.total in Blood",
        "CBC W Auto Differential panel - Blood",
        "Vitamin D+Metabolites [Mass/volume] in Serum or Plasma",
        "Iron [Mass/volume] in Serum or Plasma",
        "Magnesium [Mass/volume] in Serum or Plasma",
        "Prealbumin [Mass/volume] in Serum or Plasma"
    ];

    const parsedGeneral = [];
    const parsedTherapies = [];

    let currentPhysician = "";
    let currentPatient = "";
    let currentMRN = "";
    let currentCategory = "";

    for (let i = 8; i < rawRows.length; i++) {
        const row = Array.from({ length: 5 }, (_, idx) => rawRows[i]?.[idx] ? String(rawRows[i][idx]).trim() : "");
        const firstCell = row[0];

        if (!firstCell) continue;

        // Physician name
        if (firstCell.includes(",") && !firstCell.includes("(M") && !row[1]) {
            currentPhysician = firstCell;
        }
        // Patient & MRN
        else if (firstCell.includes("(M")) {
            currentPatient = firstCell.split(" (M")[0];
            currentMRN = "M" + firstCell.match(/\(M(.*?)\)/)?.[1] || "";
        }
        // Category like "Devices"
        else if (firstCell && (!row[1] && !row[2] || firstCell.toUpperCase().includes("DEVICE"))) {
            currentCategory = firstCell;
        }
        // Test descriptor
        else if (firstCell && currentPatient && currentMRN) {
            const descriptor = firstCell;
            let dateOrdered = row[2] || row[3] || "";
            dateOrdered = excelDateToEST(dateOrdered);
            if (!descriptor || !dateOrdered) continue;

            const isBloodTest = bloodTests.includes(descriptor);
            const finalDescriptor = isBloodTest ? "General Blood Work" : descriptor;

            const uid = `${currentMRN}_${finalDescriptor}_${currentPhysician}_${dateOrdered}`;

            const record = {
                id: i - 7,
                patientName: currentPatient.trim(),
                mrn: currentMRN.trim(),
                category: currentCategory.trim(),
                testName: finalDescriptor.trim(),
                physician: currentPhysician.trim(),
                dateOrdered,
                state: stateCode.trim(),
                uid: uid.trim()
            };

            if (currentCategory.toUpperCase() === "OTHER SERVICES AND THERAPIES" && descriptor.toUpperCase() === "DEBRIDEMENT") {
                parsedTherapies.push(record);
            } else {
                parsedGeneral.push(record);
            }
        }
    }


    // Deduplicate by UID
    const unique = (arr) => {
        const seen = new Set();
        return arr.filter(item => {
            if (seen.has(item.uid)) return false;
            seen.add(item.uid);
            return true;
        });
    };
    return {
        parsedGeneral: unique(parsedGeneral),
        parsedTherapies: unique(parsedTherapies),
        summary: {
            generalCount: parsedGeneral.length,
            therapiesCount: parsedTherapies.length,
            totalCount: parsedGeneral.length + parsedTherapies.length
        }
    };
}


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
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-gray-600 hover:border-cyan-500'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{ p: 4, textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", borderRadius: 7 }}
        >
            {loading && <LinearProgress className="absolute top-0 left-0 right-0" />}
            <span>
                <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
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

// Stats cards component
// function StatsCards({ summary }) {
//     const stats = [
//         {
//             title: 'Total Records',
//             value: summary?.totalCount || 0,
//             icon: <Assessment />,
//             color: 'primary'
//         },
//         {
//             title: 'General Tests',
//             value: summary?.generalCount || 0,
//             icon: <LocalHospital />,
//             color: 'secondary'
//         },
//         {
//             title: 'Therapies',
//             value: summary?.therapiesCount || 0,
//             icon: <Person />,
//             color: 'success'
//         }
//     ];

//     return (
//         <Grid container spacing={3} className="mb-6">
//             {stats.map((stat, index) => (
//                 <Grid item xs={12} md={4} key={index}>
//                     <Card className="h-full">
//                         <CardContent className="flex items-center justify-between">
//                             <Box>
//                                 <Typography color="textSecondary" gutterBottom variant="overline">
//                                     {stat.title}
//                                 </Typography>
//                                 <Typography variant="h4" component="div">
//                                     {stat.value}
//                                 </Typography>
//                             </Box>
//                             <Box className="text-cyan-400">
//                                 {stat.icon}
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// }

function StatsCards({ summary }) {
    const stats = [
        {
            title: 'Total Records',
            value: summary?.totalCount || 0,
            parsedValue: summary?.totalParsedCount || 0,
            icon: <Assessment color='warning' />,
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
        <Grid container spacing={3} className="mb-6">
            {stats.map((stat, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <Card className="h-full " sx={{ borderRadius: '10px', width: 320 }}>
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
                            <Box className="text-cyan-400">
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
    const [selectedFile, setSelectedFile] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });
    const columns = [
        {
            field: 'patientName',
            headerName: 'Patient Name',
            width: 200,
            editable: true,
            renderCell: (params) => (
                <Box className="flex items-center">
                    <Person className="mr-2 text-cyan-400" fontSize="small" />
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
                    <DateRange className="mr-2 text-cyan-400" fontSize="small" />
                    {params.value}
                </Box>
            ),

            editable: true,
        },
        { field: 'state', headerName: 'State', width: 100, editable: true, },
        { field: 'uid', headerName: 'UID', width: 300 }
    ];

    const handleFileUpload = async (file) => {
        setLoading(true);
        setError(null);
        setFileName(file.name);
        setSelectedFile(file)
        setOpen(true)

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
                const [startDate, endDate] = rows[0][rows[0].length-1].split("-")
                setDateRange({
                    startDate: startDate,
                    endDate: endDate
                })
                // Assuming state code extraction logic or default
                const stateCode = stateAbbr.toUpperCase(); // Update based on actual file logic
                const parsed = parseAncillaryData(rows, stateCode);
                setData(parsed);
            } catch (err) {
                setError('Error parsing file: ' + err.message);
            } finally {
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
        setActiveTab('general');
    };

    const currentData = data
        ? (activeTab === 'general' ? data.parsedGeneral : data.parsedTherapies)
        : [];



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

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="min-h-screen bg-[#0A0A0A]">
                <Container maxWidth="xl" className="py-8">
                    {/* Header */}
                    <Box className="mb-8 text-center flex flex-col ">
                        <Box className="flex items-center gap-1  mb-3  p-2 px-7 rounded-[25px]">
                            <img src={logo} className='h-[50px]' alt="" />
                            <div className='text-left'>
                                <Typography className='uppercase m-0 p-0 text-sm text-muted-foreground font-bold'><b>Personic Health</b></Typography>
                                {/* <Typography className='text-sm m-0'>Ancillary Automation</Typography> */}
                                <Typography className='text-gray-400 m-0' >Version <span className='bg-[#2a432c] p-1 rounded-[10px] px-2 text-white border border-[#74B87B] text-sm'>1.0.2</span></Typography>
                            </div>
                        </Box>
                        <Typography variant="h3" className="mb-2 font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
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
                        <FileUpload onFileUpload={handleFileUpload} loading={loading} />
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
                                <Grid size={{xs:12, md:8, lg:9}}>
                            <StatsCards summary={{ ...data.summary, totalParsedCount: data.parsedGeneral.length + data.parsedTherapies.length, generalParsedCount: data.parsedGeneral.length, therapiesParsedCount: data.parsedTherapies.length }} />
                            </Grid>
                        {/* reported ate */}
                        <Grid size={{xs:12,md:4, lg:3}}>
                        <Box sx={{mb:2}}>
                                <div className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-300 mb-2">Report Period - {stateAbbr} State</h2>
                                        <p className="text-gray-400 mb-6">Viewing data for the following date range:</p>

                                        <div className="flex items-center justify-between bg-[#0A0A0A] rounded-lg p-4 border border-gray-600">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-400 font-medium">Start Date</p>
                                                <p className="text-2xl font-bold text-indigo-400">{dateRange.startDate}</p>
                                            </div>

                                            <div className="mx-4">
                                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-sm text-gray-400 font-medium">End Date</p>
                                                <p className="text-2xl font-bold text-indigo-400">{dateRange.endDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                            </Grid>
                            </Grid>
                            {/* Tabs */}
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

                            {/* Data Grid */}
                            <Paper className="h-170 text-left bg-[#1A1A1A] border" sx={{ borderColor: "#ffffff30" }} >
                                <DataGridPro
                                    rows={currentData}
                                    columns={columns}
                                    checkboxSelection
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
                                    disableRowSelectionOnClick
                                    sx={{
                                        background: "transparent",
                                        border: 'none',
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: 'rgba(0, 188, 212, 0.1)',
                                            borderBottom: '2px solid #00BCD4',
                                        },
                                        '& .MuiDataGrid-virtualScroller': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                />
                            </Paper>
                        </>
                    )}
                </Container>
            </div>

            <ProfessionalFooter
            />
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
                            <TextField
                                fullWidth
                                focused
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
                                sx={{ borderRadius: 2, textTransform: 'capitalize' }}
                                disabled={!stateAbbr.trim()}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
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


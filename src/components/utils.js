/**
 * Filters array to keep only the latest record for each MRN.
 * @param {Array} data - Array of objects with at least MRN and Date Ordered.
 * @param {string} dateKey - Key name for date field (default: 'Date Ordered').
 * @returns {Array} Filtered array.
 */
export function getLatestByMRN(data, dateKey = 'dateOrdered') {
    if (!Array.isArray(data)) return [];
    const latestRecords = {};
    
    data.forEach(record => {
      const mrn = record.mrn;
      const dateStr = record[dateKey];
      
      if (!mrn || !dateStr) return; // skip invalid records
      
      const date = new Date(dateStr);
      
      if (isNaN(date)) return; // skip invalid dates
      if (!latestRecords[mrn] || date > new Date(latestRecords[mrn][dateKey])) {
        latestRecords[mrn] = record;
    }
    });
    

    return Object.values(latestRecords);
  }
  

  export function excelDateToEST(excelSerialDate) {
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

export function parseAncillaryDataAsync(rawRows, stateCode, onProgress) {
    return new Promise((resolve) => {
        const bloodTests = new Set([
            "Comprehensive metabolic 2000 panel - Serum or Plasma",
            "Hemoglobin A1c/Hemoglobin.total in Blood",
            "CBC W Auto Differential panel - Blood",
            "Vitamin D+Metabolites [Mass/volume] in Serum or Plasma",
            "Iron [Mass/volume] in Serum or Plasma",
            "Magnesium [Mass/volume] in Serum or Plasma",
            "Prealbumin [Mass/volume] in Serum or Plasma"
        ]);

        const parsedGeneral = [];
        const parsedTherapies = [];
        const npNames = [];

        let currentPhysician = "";
        let currentPatient = "";
        let currentMRN = "";
        let currentCategory = "";

        const totalRows = rawRows.length - 8;
        let processed = 0;
        const chunkSize = 200; // Process 200 rows per loop for speed

        function processChunk(startIndex) {
            const endIndex = Math.min(startIndex + chunkSize, rawRows.length);

            for (let i = startIndex; i < endIndex; i++) {
                const row = Array.from({ length: 5 }, (_, idx) =>
                    rawRows[i]?.[idx] ? String(rawRows[i][idx]).trim() : ""
                );
                
                
                const firstCell = row[0];

                
               
                if (!firstCell) continue;
                if (firstCell.includes(",") && !firstCell.includes("(M") && !row[1] && !row[3]) {
                    
                    currentPhysician = firstCell;
                    npNames.push(currentPhysician.trim());
                } 
                else if (firstCell.includes("(M")) { // ok
                    currentPatient = firstCell.split(" (M")[0];
                    currentMRN = "M" + (firstCell.match(/\(M(.*?)\)/)?.[1] || "");
                } 
                else if ((!row[1] && !row[3]) || firstCell.toUpperCase().includes("DEVICE")) {
                    currentCategory = firstCell;
                } 
                 else if (currentPatient && currentMRN) {
                    const descriptor = firstCell;
                    let dateOrdered = row[2] || row[3] || "";
                    dateOrdered = excelDateToEST(dateOrdered);

                    if (descriptor && dateOrdered) {
                        const finalDescriptor = bloodTests.has(descriptor) ? "General Blood Work" : descriptor;
                        let uid = `${currentMRN}_${finalDescriptor}_${currentPhysician}_${dateOrdered}`;

                        if (currentCategory.toUpperCase() === "OTHER SERVICES AND THERAPIES" &&
                            descriptor.toUpperCase() === "DEBRIDEMENT") {
                            uid = `${currentMRN}_${finalDescriptor}`;
                        }

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
                       
                        if (currentCategory.toUpperCase() === "OTHER SERVICES AND THERAPIES" &&
                            descriptor.toUpperCase() === "DEBRIDEMENT") {
                            parsedTherapies.push(record);
                        } else {
                            parsedGeneral.push(record);
                        }
                    }
                }
               
                processed++;
            }

            onProgress?.({
                percentage: ((processed / totalRows) * 100).toFixed(1),
                processedGeneral: parsedGeneral.length,
                processedTherapies: parsedTherapies.length,
                totalProcessed: processed,
                totalRows
            });

            if (endIndex < rawRows.length) {
                setTimeout(() => processChunk(endIndex), 0);
            } else {
                const unique = (arr) => {
                    const seen = new Set();
                    return arr.filter(item => {
                        if (seen.has(item.uid)) return false;
                        seen.add(item.uid);
                        return true;
                    });
                };

                resolve({
                    parsedGeneral: unique(parsedGeneral),
                    parsedTherapies: unique(getLatestByMRN(parsedTherapies)),
                    npNames,
                    summary: {
                        generalCount: parsedGeneral.length,
                        therapiesCount: parsedTherapies.length,
                        totalCount: parsedGeneral.length + parsedTherapies.length
                    }
                });
            }
        }

        processChunk(8); // Start after header rows
    });
}

// Parse function (your existing logic)
export function parseAncillaryDataAsync1(rawRows, stateCode, onProgress) {
    return new Promise((resolve) => {
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
        const npNames = [];

        let currentPhysician = "";
        let currentPatient = "";
        let currentMRN = "";
        let currentCategory = "";

        const totalRows = rawRows.length - 8;
        let processed = 0;

        const processRow = (i) => {
            if (i >= rawRows.length) {
                const unique = (arr) => {
                    const seen = new Set();
                    return arr.filter(item => {
                        if (seen.has(item.uid)) return false;
                        seen.add(item.uid);
                        return true;
                    });
                };

                const finalResult = {
                    parsedGeneral: unique(parsedGeneral),
                    parsedTherapies: unique(getLatestByMRN(parsedTherapies)),
                    npNames: npNames,
                    summary: {
                        generalCount: parsedGeneral.length,
                        therapiesCount: parsedTherapies.length,
                        totalCount: parsedGeneral.length + parsedTherapies.length
                    }
                };

                resolve(finalResult);
                return;
            }

            const row = Array.from({ length: 5 }, (_, idx) => rawRows[i]?.[idx] ? String(rawRows[i][idx]).trim() : "");
            const firstCell = row[0];
            if (firstCell) {
                if (firstCell.includes(",") && !firstCell.includes("(M") && !row[1]) {
                    currentPhysician = firstCell;
                    npNames.push(currentPhysician.trim())
                } else if (firstCell.includes("(M")) {
                    currentPatient = firstCell.split(" (M")[0];
                    currentMRN = "M" + firstCell.match(/\(M(.*?)\)/)?.[1] || "";
                } else if (firstCell && (!row[1] && !row[2] || firstCell.toUpperCase().includes("DEVICE"))) {
                    currentCategory = firstCell;
                } else if (firstCell && currentPatient && currentMRN) {
                    const descriptor = firstCell;
                    let dateOrdered = row[2] || row[3] || "";
                    dateOrdered = excelDateToEST(dateOrdered);
                    if (descriptor && dateOrdered) {
                        const isBloodTest = bloodTests.includes(descriptor);
                        const finalDescriptor = isBloodTest ? "General Blood Work" : descriptor;

                        // const uid = `${currentMRN}_${finalDescriptor}_${currentPhysician}_${dateOrdered}`;
                        let uid = `${currentMRN}_${finalDescriptor}_${currentPhysician}_${dateOrdered}`;
                        
                        if (currentCategory.toUpperCase() === "OTHER SERVICES AND THERAPIES" && descriptor.toUpperCase() === "DEBRIDEMENT") {
                             uid = `${currentMRN}_${finalDescriptor}`;
                        }

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
            }

            processed++;
            const percent = ((processed / totalRows) * 100).toFixed(1);
            onProgress?.({
                percentage: percent,
                processedGeneral: parsedGeneral.length,
                processedTherapies: parsedTherapies.length,
                totalProcessed: processed,
                totalRows
            });

            // Non-blocking delay (event loop-friendly)
            setTimeout(() => processRow(i + 1), 0);
        };

        processRow(8); // Start from row 8
    });
}

// Parse function (your existing logic)
export function parseAncillaryDataAsyncBackup(rawRows, stateCode, onProgress) {
    return new Promise((resolve) => {
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
        const npNames = [];

        let currentPhysician = "";
        let currentPatient = "";
        let currentMRN = "";
        let currentCategory = "";

        const totalRows = rawRows.length - 8;
        let processed = 0;

        const processRow = (i) => {
            if (i >= rawRows.length) {
                const unique = (arr) => {
                    const seen = new Set();
                    return arr.filter(item => {
                        if (seen.has(item.uid)) return false;
                        seen.add(item.uid);
                        return true;
                    });
                };

                const finalResult = {
                    parsedGeneral: unique(parsedGeneral),
                    parsedTherapies: unique(parsedTherapies),
                    npNames: npNames,
                    summary: {
                        generalCount: parsedGeneral.length,
                        therapiesCount: parsedTherapies.length,
                        totalCount: parsedGeneral.length + parsedTherapies.length
                    }
                };

                resolve(finalResult);
                return;
            }

            const row = Array.from({ length: 5 }, (_, idx) => rawRows[i]?.[idx] ? String(rawRows[i][idx]).trim() : "");
            const firstCell = row[0];
            if (firstCell) {
                if (firstCell.includes(",") && !firstCell.includes("(M") && !row[1]) {
                    currentPhysician = firstCell;
                    npNames.push(currentPhysician.trim())
                } else if (firstCell.includes("(M")) {
                    currentPatient = firstCell.split(" (M")[0];
                    currentMRN = "M" + firstCell.match(/\(M(.*?)\)/)?.[1] || "";
                } else if (firstCell && (!row[1] && !row[2] || firstCell.toUpperCase().includes("DEVICE"))) {
                    currentCategory = firstCell;
                } else if (firstCell && currentPatient && currentMRN) {
                    const descriptor = firstCell;
                    let dateOrdered = row[2] || row[3] || "";
                    dateOrdered = excelDateToEST(dateOrdered);
                    if (descriptor && dateOrdered) {
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
            }

            processed++;
            const percent = ((processed / totalRows) * 100).toFixed(1);
            onProgress?.({
                percentage: percent,
                processedGeneral: parsedGeneral.length,
                processedTherapies: parsedTherapies.length,
                totalProcessed: processed,
                totalRows
            });

            // Non-blocking delay (event loop-friendly)
            setTimeout(() => processRow(i + 1), 0);
        };

        processRow(8); // Start from row 8
    });
}
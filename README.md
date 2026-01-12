# MediExtract Documentation

**Version:** v4.7.6
**Application Name:** MediExtract

---

## Overview

MediExtract is an advanced data processing and parsing platform designed to extract, normalize, and structure patient order records from EMR systems with **99.9% accuracy**. The platform ensures reliable, consistent, and audit-ready data that can be seamlessly integrated into downstream systems such as analytics dashboards and workflow management tools.

MediExtract v4.7.6 focuses on high-precision parsing of **Patient Orders**, enabling healthcare teams to efficiently process **Ancillary**, **Ultramist**, and **Surgical** orders with minimal manual intervention.

---

## Key Features

* High-accuracy EMR data parsing (99.9%)
* Automated order classification (Ancillary, Ultramist, Surgical)
* State-based data validation
* Ready-made dashboard views for processed data
* CSV export for third-party integrations
* Seamless import into Monday.com workspaces

---

## Supported Order Types & Date Rules

When generating pending order reports from the EMR (WoundExpert), ensure the correct **start date** is selected based on the order type:

| Order Type | Start Date Rule        |
| ---------- | ---------------------- |
| Ancillary  | June 30, 2025 onward   |
| Ultramist  | May 1, 2025 onward     |
| Surgical   | January 1, 2025 onward |

⚠️ **Important:** Selecting an incorrect date range may result in missing or incomplete data.

---

## How to Use MediExtract

### Step 1: Generate Pending Order Report

1. Log in to your EMR system (**WoundExpert**).
2. Generate a **Pending Order Report**.
3. Select the appropriate **order type**.
4. Apply the correct **start date** based on the order type (refer to the table above).
5. Export the report file.

---

### Step 2: Upload File to MediExtract

1. Open **MediExtract v4.7.6**.
2. Upload the exported report file.
3. Select the appropriate **State Code** (e.g., FL, MD, KY).
4. Click **Confirm** to start processing.

⏳ **Processing Time:** Data processing may take some time depending on file size and order volume.

---

### Step 3: Review Processed Data

1. Once processing is complete, navigate to the **Dashboard**.
2. Review the parsed and structured data.
3. Select the relevant **Order Type** using the provided buttons:

   * Ancillary
   * Ultramist
   * Surgical

⚠️ **Data Validation Note:** Please review the data carefully to ensure all records are accurate and complete before exporting.

---

### Step 4: Export Data

1. Click the **Export** button.
2. Download the data in **CSV format**.

---

## Integrating with Monday.com

### Step 5: Open Monday.com

1. Log in to **Monday.com**.
2. Navigate to the **Patients Order Workspace**.
3. Open the appropriate board based on the order type.

---

### Step 6: Import Data

1. Click the **three-dot menu** on the right side of the board.
2. From the dropdown menu, select **More Actions**.
3. Click **Import Patients Name**.
4. Drag and drop or browse to upload the downloaded CSV file.
5. Ensure all columns are correctly mapped to their corresponding board columns.
6. Click **Next** to continue.

---

### Step 7: Apply Override Rules

Select the correct override rule based on the order type:

| Order Type | Override Rule   |
| ---------- | --------------- |
| Ancillary  | Override by UID |
| Ultramist  | Override by MRN |
| Surgical   | Override by MRN |

---

### Step 8: Start Upload

1. Confirm the mappings and override rules.
2. Start the upload process.
3. Wait until the import is completed successfully.

---

## Process Completion

Once the upload is complete:

* Patient orders will be fully available in the relevant Monday.com board.
* Data is ready for tracking, assignment, and workflow management.
* The MediExtract processing cycle is complete.

---

## Notes & Best Practices

* Always verify order dates before generating EMR reports.
* Double-check state codes to avoid validation issues.
* Review dashboard data before exporting.
* Ensure column mappings in Monday.com are correct to prevent data misalignment.

---

**MediExtract v4.7.6** ensures efficient, accurate, and scalable patient order data processing from EMR to operational workflows.

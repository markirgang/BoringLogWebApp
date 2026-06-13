# Anti Gravity notes
``` click Ctrl+L to open agent view```
Project saved here
```C:\Users\marki\OneDrive\Desktop\BoringLogWebApp```

# StrataPro

This can also be automated by running 
```Install-And-Run.ps1```

A web-based application designed for managing and recording soil analysis and boring logs, specifically modeled after the standard Burmister Soil Analysis Workflow Properties. This application allows users to enter, track, and export geotechnical drilling data.

## Prerequisites

To run this application, you will need **Node.js** installed on your system. 

### How to Install Node.js
1. Visit the official Node.js website: [https://nodejs.org](https://nodejs.org/)
2. Download the installer for your operating system (Windows, macOS, or Linux). It is recommended to download the **LTS (Long Term Support)** version for better stability.
3. Run the installer and follow the provided installation steps. Include the default tools if prompted.
4. To verify the installation, open your terminal (Command Prompt, PowerShell, or bash) and run:
   ```bash
   node -v
   npm -v
   ```
   If both commands return version numbers, Node.js is correctly installed.

## How to Run the Application

1. Open a terminal or command prompt and navigate to the project directory:
   ```bash
   cd path/to/BoringLogWebApp
   ```
2. Install the necessary project dependencies:
   ```bash
   npm install
   ```
3. Start the application server:
   ```bash
   node server.js
   ```
4. Open your web browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

## Application Documentation: Front Landing Page

The front landing page serves as the primary dashboard ("Caren's StrataPro Manager") and consists of several interactive sections organized by tabs:

### Global Controls
- **Main Form Comments:** An input field for general project or form-wide remarks.
- **Export Button:** A "Download Styled Workbook (.xlsx)" button that exports the currently entered data into a formatted Excel spreadsheet template.

### 1. Boring Cover/Metadata (Tab)
This tab records the core header information for the drilling log. 
- You can specify details such as the Log Reference Number, Project Name, Job Number, Location, Drilling Contractor, Rig Equipment, Hammer Configuration, Sampler Setup, and Groundwater Measurements. 
- **Custom Choices:** Dropdowns support adding on-the-fly custom values if the required option is not present.

### 2. Layer Profiles Overview (Tab)
Displays an overview of all mapped geological strata layers across the project.
- This is a live, read-only table that displays Top and Bottom Depths, Soil Classification, Moisture, and the explicitly linked **Sample ID** for each layer.
- Inline editable comment boxes remain available for row-specific remarks.

### 3. Log Details (Boring Runs) (Tab)
Records individual sample target blowcounts and field data for boring runs.
- **Boring Target Reference:** Explicitly links each logged Sample to a specific Boring ID.
- You can log Sample Index IDs, Start/End Depths, SPT N-Values, Core Matrix Recovery Lengths, and Field Testing Metrics (like PID readings).
- Entries are saved to a live table that also supports inline comment editing per sample.

### 4. Site Class & Bearing Metrics (Tab)
Provides an engineering calculations matrix preview based on the inputted run data. 
- Displays calculated Site Class Metrics (using Harmonic Mean N calculations).
- Shows estimates for Allowable Bearing Capacity.
- Assesses Liquefaction Vulnerability Status based on groundwater and soil properties.

### 5. Reference Soil Types (Tab)
A read-only reference data table summarizing the structural template workbook package data. 
- Includes information on Soil Types, Cohesionless and Cohesive bands (SPT N min/max), and NAVFAC 7.01 Weight Index properties (pcf) to guide data entry.

### 6. Sample-Layer Relations (Tab)
Defines the one-to-many relationship mapping between individual Samples and their underlying Strata Layers.
- Enables you to select an existing **Sample Index ID** from a dropdown.
- Allows you to log multiple layers (Top/Bottom Depth, Soil Classification, Moisture Condition) that exclusively belong to the selected sample.
- Updates the Layer Profiles Overview (Tab 2) and reflects directly in the exported workbook structure.

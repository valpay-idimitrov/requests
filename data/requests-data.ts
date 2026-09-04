export interface RoadmapRequest {
  id: string;
  title: string;
  status: string;
  urgency: string;
  gmvLabel: string;
  gmvValue: number;
  partner: string;
  categories: string[];
  primaryCategory: string;
  audience: string[];
  created: string;
  votes: number;
  submittedBy?: string;
  compliance?: boolean;
  description?: string;
}

const REQUESTS: RoadmapRequest[] = [
 {
  "id": "req-1",
  "title": "Dashboards for partners or extending current dashboard can be dated back much further",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$100,000",
  "gmvValue": 100000,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "August 31, 2026 8:26 PM",
  "votes": 0
 },
 {
  "id": "req-2",
  "title": "Remove Net amount from Receipts",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Miscellaneous Specific Requests",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "August 6, 2026 12:01 PM",
  "votes": 0
 },
 {
  "id": "req-3",
  "title": "Adding Deposit ID to Transaction Report",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "July 27, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-4",
  "title": "Payments V2 - Searchability Options",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "July 15, 2026 11:08 AM",
  "votes": 0
 },
 {
  "id": "req-5",
  "title": "Public status page for payment processing and portal uptime",
  "status": "Not started",
  "urgency": "High",
  "gmvLabel": "$1,000,000,000",
  "gmvValue": 1000000000,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "July 6, 2026 11:04 AM",
  "votes": 0
 },
 {
  "id": "req-6",
  "title": "Include Shopper Reference in Transaction Export, Grid, and Search (SiTX)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$50,000,000",
  "gmvValue": 50000000,
  "partner": "ValPay",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Partner Admins"
  ],
  "created": "July 1, 2026 2:09 PM",
  "votes": 0
 },
 {
  "id": "req-7",
  "title": "Resend Portal User Invite",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "June 26, 2026 4:06 AM",
  "votes": 0
 },
 {
  "id": "req-8",
  "title": "Enhanced Data Scheme from Adyen flow to Snowflake.",
  "status": "Not started",
  "urgency": "Medium",
  "gmvLabel": "$1,000,000",
  "gmvValue": 1000000,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "June 22, 2026 1:44 PM",
  "votes": 0
 },
 {
  "id": "req-9",
  "title": "Dispute API access & lifecycle webhooks for chargeback defense (Pyek Group via CoreCashless)",
  "status": "Backlog",
  "urgency": "High",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "CoreCashless",
  "categories": [
   "Chargeback Process Improvements",
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Chargeback Process Improvements",
  "audience": [
   "Merchants",
   "Partner Admins"
  ],
  "created": "June 17, 2026 6:47 AM",
  "votes": 0
 },
 {
  "id": "req-10",
  "title": "ownership change flag",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Miscellaneous Specific Requests",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "June 16, 2026 2:48 PM",
  "votes": 0
 },
 {
  "id": "req-11",
  "title": "Email Refund Receipt to Guest/Customer",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$30,000,000",
  "gmvValue": 30000000,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "June 16, 2026 2:00 PM",
  "votes": 0
 },
 {
  "id": "req-12",
  "title": "Dispute API access & webhooks for Pyek Group (COREPay)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$16,000,000",
  "gmvValue": 16000000,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchants"
  ],
  "created": "June 15, 2026 8:52 AM",
  "votes": 0
 },
 {
  "id": "req-13",
  "title": "Store-Level Webhooks for Merchants",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins"
  ],
  "created": "June 11, 2026 11:06 AM",
  "votes": 0
 },
 {
  "id": "req-14",
  "title": "Link to tokenize info on VT",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$1,000,000",
  "gmvValue": 1000000,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchants"
  ],
  "created": "June 10, 2026 3:02 PM",
  "votes": 0
 },
 {
  "id": "req-15",
  "title": "Ability to have multiselect when choosing stores on dropdowns",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$8,500,000",
  "gmvValue": 8500000,
  "partner": "Adyen, All Partners, Apero, Aysling, Bluebird, Cott Systems, Cybertill, DockMaster, DumpTruckDispatcher, Fiserv, H&L, Keystone, MacPractice, MemberTrak/Union, Progitek, Progression, RMC US, RMC_AU, Revenova, TDO, Trendex, ValPay, school24",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "June 3, 2026 11:10 AM",
  "votes": 0
 },
 {
  "id": "req-16",
  "title": "Automated Merchant Notifications When Transfer Schedule Becomes Inactive (Adyen)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "TDO",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Partner Admins"
  ],
  "created": "May 20, 2026 12:17 PM",
  "votes": 0
 },
 {
  "id": "req-17",
  "title": "Cross-Border Fee — Not Displaying as Separate Line Item in Merchant Portal",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$1",
  "gmvValue": 1,
  "partner": "H&L",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "May 19, 2026 11:46 AM",
  "votes": 0
 },
 {
  "id": "req-18",
  "title": "Virtual Terminal: Support L2/L3 (Enhanced Scheme Data) for Commercial Cards (BIN-aware fields)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$350,000,000",
  "gmvValue": 350000000,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchants"
  ],
  "created": "May 14, 2026 5:34 PM",
  "votes": 0
 },
 {
  "id": "req-19",
  "title": "Remove \"VOID\" option for all Immediate Capture Merchants",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "Apero, Aysling, Bluebird, Cott Systems, Cybertill, DockMaster, DumpTruckDispatcher, H&L, Keystone, MacPractice, MemberTrak/Union, Progitek, Progression, Revenova, Trendex, ValPay, school24",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "May 13, 2026 3:13 PM",
  "votes": 0
 },
 {
  "id": "req-20",
  "title": "Payments Page Filter Option Request",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "May 13, 2026 8:49 AM",
  "votes": 0
 },
 {
  "id": "req-21",
  "title": "Admin Banner Creator",
  "status": "Not started",
  "urgency": "High",
  "gmvLabel": "$1,000,000",
  "gmvValue": 1000000,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "VP Admins"
  ],
  "created": "May 12, 2026 9:37 AM",
  "votes": 0
 },
 {
  "id": "req-22",
  "title": "Banner on Statements page",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "May 12, 2026 9:32 AM",
  "votes": 0
 },
 {
  "id": "req-23",
  "title": "Add Ability to Delete Stored Card Tokens",
  "status": "Not started",
  "urgency": "Medium",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "MacPractice",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "May 7, 2026 2:19 PM",
  "votes": 0
 },
 {
  "id": "req-24",
  "title": "Dark Mode",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "May 4, 2026 3:06 PM",
  "votes": 0
 },
 {
  "id": "req-25",
  "title": "Popup when turning off AVC and CVV on virtual terminal",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$100,000",
  "gmvValue": 100000,
  "partner": "All Partners, ValPay",
  "categories": [
   "Chargeback Process Improvements",
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Chargeback Process Improvements",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins"
  ],
  "created": "April 29, 2026 10:49 AM",
  "votes": 0
 },
 {
  "id": "req-26",
  "title": "Clear portal filters on logout or session timeout",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$1",
  "gmvValue": 1,
  "partner": "Cott Systems",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "April 17, 2026 11:09 AM",
  "votes": 0
 },
 {
  "id": "req-27",
  "title": "Account-level contact details missing",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "April 17, 2026 10:37 AM",
  "votes": 0
 },
 {
  "id": "req-28",
  "title": "Expose Refund Endpoint to Partners via API Key Authentication",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Partner Admins"
  ],
  "created": "April 17, 2026 6:16 AM",
  "votes": 0
 },
 {
  "id": "req-29",
  "title": "Include ARN number in refund API Responses",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$773,760",
  "gmvValue": 773760,
  "partner": "Trendex",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchants"
  ],
  "created": "April 9, 2026 11:56 AM",
  "votes": 0
 },
 {
  "id": "req-30",
  "title": "Statistics on Merchant Activity on ValPay Portal",
  "status": "Not started",
  "urgency": "High",
  "gmvLabel": "$1",
  "gmvValue": 1,
  "partner": "All Partners, ValPay",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "VP Admins"
  ],
  "created": "April 9, 2026 9:57 AM",
  "votes": 0
 },
 {
  "id": "req-31",
  "title": "Ability to request multiple statements at once",
  "status": "Not started",
  "urgency": "Medium",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality",
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 31, 2026 3:41 PM",
  "votes": 0
 },
 {
  "id": "req-32",
  "title": "Granular Permission Editing by Role — Partner-Level User Access Controls",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$100",
  "gmvValue": 100,
  "partner": "All Partners",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 27, 2026 2:20 PM",
  "votes": 0
 },
 {
  "id": "req-33",
  "title": "Statement Correction Notifications",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "$0",
  "gmvValue": 0,
  "partner": "Cybertill",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchants"
  ],
  "created": "March 26, 2026 8:48 AM",
  "votes": 0
 },
 {
  "id": "req-34",
  "title": "Export Center with scheduling and repository",
  "status": "Not started",
  "urgency": "Medium",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-35",
  "title": "Dashboard quick-view for previous day sales and refunds",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-36",
  "title": "Separate column for Surcharge in transactions view",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-37",
  "title": "Deterministic transaction sorting",
  "status": "Not started",
  "urgency": "Medium",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-38",
  "title": "User guide / documentation for portal permission model",
  "status": "In Review",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-39",
  "title": "Surface Merchant Reference in main Payments table",
  "status": "Not started",
  "urgency": "Medium",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-40",
  "title": "Eliminate duplicate refunds in UI and statements",
  "status": "In progress",
  "urgency": "High",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-41",
  "title": "Fix refunds displaying under wrong store on dashboards",
  "status": "In progress",
  "urgency": "High",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-42",
  "title": "Add totals for filtered views on Dashboard and Payments",
  "status": "Not started",
  "urgency": "High",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 26, 2026 7:30 AM",
  "votes": 0
 },
 {
  "id": "req-43",
  "title": "Multi-User Update",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-44",
  "title": "Adyen \"Created on\" date in Unified",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "Adyen",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-45",
  "title": "Q2 Dev Submission - Convenience Fee Pricing Model \"Customer Pay\"",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-46",
  "title": "Update export date formats to UK standard (DD/MM/YYYY) for UK merchants",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-47",
  "title": "Add Customer Email Field to Payments Tab (Searchable)",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-48",
  "title": "Rationalize & Redesign Portal Permission Model",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-49",
  "title": "Q2 Dev Submission - Adyen API Onboarding",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "Adyen",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-50",
  "title": "Bulk User Creation",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-51",
  "title": "Display Account Holder Code and Store ID in User Management",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-52",
  "title": "Q2 Dev Submission - Full Demo Account",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-53",
  "title": "Q2 Dev Submission - Finance/Statement Overhaul",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-54",
  "title": "Ability to export from the Merchants Overview or Account",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-55",
  "title": "Partner Terminal Fleet Dashboard in ValPay Portal",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-56",
  "title": "Enhance Payment Search Functionality – Clickable Card Number & Merchant Reference",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-57",
  "title": "Add \"Quantity\" column to Refunds, Chargebacks & Adjustments in Merchant section",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-58",
  "title": "Merchant Facing Receipt Generation (ProgressionPay) (Merchant-Branded)",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "Progression",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-59",
  "title": "Create an Inactive button on the store level for Churn status",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-60",
  "title": "Chargeback Visibility & Search Enhancement in Payments Tab",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Chargeback Process Improvements"
  ],
  "primaryCategory": "Chargeback Process Improvements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-61",
  "title": "Raph feature requests - Q2 planning",
  "status": "Not started",
  "urgency": "Low",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "March 23, 2026 8:57 AM",
  "votes": 0
 },
 {
  "id": "req-62",
  "title": "Need a functioning app for drivers and dispatch tools (including GPS/routing improvements)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "DumpTruckDispatcher",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-63",
  "title": "Create a document outlining required weekly, monthly, and yearly reports and the steps to run them (training document)",
  "status": "In Review",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "ValPay",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Partner Admins",
   "VP Admins"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-64",
  "title": "Remove Tap to Pay feature from devices (upon customer request)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-65",
  "title": "Add missing card brand support (Maestro, JCB, Diners, Union Pay)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-66",
  "title": "Enable the \"Read Metrics\" permission by default for new Regular Users",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Partner Admins",
   "VP Admins"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-67",
  "title": "Improve visibility of Guest Profiles during booking (show last stays, VIP status, notes)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "RMC US",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-68",
  "title": "Implement ability for admin users to pull/view full CC numbers",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-69",
  "title": "Add a \"Customer Notes\" field to the short arrival sheet (RoomMaster)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "RMC US",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-70",
  "title": "Offer a training mode in roomMaster",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "RMC US",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-71",
  "title": "Integrate with other systems/PMS providers (e.g., Event Temple, Toast, Square, Stash, Ivvy)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "RMC US",
  "categories": [
   "Miscellaneous Specific Requests"
  ],
  "primaryCategory": "Miscellaneous Specific Requests",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-72",
  "title": "Improve API to include webhooks for changes rather than requiring updated-since-last calls (especially for deleted elements)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-73",
  "title": "Ability to receive customer signature information as part of chargeback paperwork",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Chargeback Process Improvements"
  ],
  "primaryCategory": "Chargeback Process Improvements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-74",
  "title": "Include the Merchant Reference number (rental agreement number) in the body of the chargeback email",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "RMC US",
  "categories": [
   "Chargeback Process Improvements"
  ],
  "primaryCategory": "Chargeback Process Improvements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-75",
  "title": "Add the Reference Number to the subject line of chargeback emails (to prevent emails from being grouped)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Chargeback Process Improvements"
  ],
  "primaryCategory": "Chargeback Process Improvements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-76",
  "title": "Implement a feature allowing more than one computer to use the same credit card terminal",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-77",
  "title": "Customize the API calls to not apply credit memos when a customer pays, or revise API to pull all open invoices regardless of balance",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants",
   "Partner Admins"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-78",
  "title": "Fix the Yield Management tool that auto changes rates, as it currently does not work",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "RMC US",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-79",
  "title": "Ability to charge only the available amount on HSA/Medicare cards (instead of returning a denial when requested amount exceeds available balance)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "MacPractice",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-80",
  "title": "Offer better fee rates for level 2 & 3 interchange processing",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-81",
  "title": "Ability to change the automatic daily deposit time to 11:59 pm MST or later to match the business audit day end",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-82",
  "title": "Feature to allow passing along credit card processing fees to the customer (surcharging)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-83",
  "title": "Add the 'capture' action to transactions for relevant users in the portal",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-84",
  "title": "Ability to invoice a customer through the portal (sends email/QR code link to secure payment page)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-85",
  "title": "Implement Automatic Credit Card payments",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-86",
  "title": "Ability to process unreferenced refunds without the card being present",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Feature Enhancements & Functionality"
  ],
  "primaryCategory": "Feature Enhancements & Functionality",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-87",
  "title": "Bank deposits need to be labeled with more details (Day, Date, etc.)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-88",
  "title": "Functionality to view all transactions for a single customer in the portal",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-89",
  "title": "Valpay portal search capability needed to find transactions by guest/customer name",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "RMC US",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-90",
  "title": "Ensure transaction detail reports show Card Holder Name/Patient Name instead of generic values (like \"NUTTERCASH\") or blank fields for identifying information",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "MacPractice",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-91",
  "title": "Disbursements/deposits need to be split by day (e.g., separate deposits for Fri, Sat, Sun transactions)",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-92",
  "title": "Remove pending transactions from the deposit report",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "All Partners",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [
   "Merchant Admins",
   "Merchants"
  ],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-93",
  "title": "Deposit report needs to be driven by deposit date instead of transaction date",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-94",
  "title": "Add totals at the bottom of the report exports",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-95",
  "title": "Provide a specific report for fees only",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-96",
  "title": "Include more fields in report exports for better reconciliation",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-97",
  "title": "Ability to run a deposit report for \"all sites\"",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-98",
  "title": "Reporting should be consistently broken down and totaled by day to match daily deposits",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-99",
  "title": "Enable notification when statements are available",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-100",
  "title": "Ability to download Chargeback & Refused transactions in Excel",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-101",
  "title": "Ability to download statement reports in Excel format",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-102",
  "title": "Detailed monthly merchant statements showing gross amount, discount deduction, and net deposit for each charge",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 },
 {
  "id": "req-103",
  "title": "Provide an annual report showing bank fees withheld",
  "status": "Not started",
  "urgency": "",
  "gmvLabel": "",
  "gmvValue": 0,
  "partner": "",
  "categories": [
   "Reporting & Data Transparency Enhancements"
  ],
  "primaryCategory": "Reporting & Data Transparency Enhancements",
  "audience": [],
  "created": "November 25, 2025 8:43 AM",
  "votes": 0
 }
];
export default REQUESTS;

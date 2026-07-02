import * as XLSX from 'xlsx';
import type { Lead } from '../../types/leads';

export const exportLeads = (leads: Lead[]) => {
  const rows = leads.map((l) => ({
    Name: l.name || '',
    Email: l.email || '',
    Phone: l.phone || '',
    Company: l.company || '',
    Status: l.status || '',
    Source: l.source || '',
    Priority: l.priority || '',
    'Assigned To': l.assignedTo?.name || '',
    City: l.city || '',
    State: l.state || '',
    Zip: l.zip || '',
    Address: l.address || '',
    Tags: (l.tags || []).join(', '),
    'Lead Value': l.leadValue || '',
    'Created By': l.createdBy?.name || '',
    'Created At': l.createdAt
      ? new Date(l.createdAt).toLocaleDateString('en-IN')
      : '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');
  XLSX.writeFile(
    wb,
    `leads_export_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

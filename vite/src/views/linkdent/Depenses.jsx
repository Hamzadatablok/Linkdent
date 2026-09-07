import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { 
    Typography, Grid, TextField, Button, Box, Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    MenuItem, IconButton, Chip, Tooltip, CircularProgress, Card, CardContent, Avatar 
} from '@mui/material';
import { 
    IconPlus, IconTrash, IconDownload, IconUpload, IconFileDescription,
    IconTrendingUp, IconTrendingDown, IconWallet
} from '@tabler/icons-react';
import { useAppContext } from '../../AppContext'; // تأكد من مسار الملف

const categories = [
    { value: 'Laboratory', label: 'Dental Laboratory' },
    { value: 'Consumables', label: 'Consumables' },
    { value: 'Equipment', label: 'Equipment & Maintenance' },
    { value: 'Rent', label: 'Rent (Loyer)' },
    { value: 'Salaries', label: 'Salaries' },
    { value: 'Other', label: 'Other (Autre)' }
];

const Depenses = () => {
    const { slug } = useParams();
    const { clinicSettings } = useAppContext(); 
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [locationId, setLocationId] = useState(null);
    
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [expenses, setExpenses] = useState([]);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Laboratory');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [invoiceFile, setInvoiceFile] = useState(null);

    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                // 1. تحديد هوية العيادة
                const urlParams = new URLSearchParams(window.location.search);
                let locId = urlParams.get('locationId') || clinicSettings?.locationId || "Pcs1fgeS5R661dISdRmM";
                setLocationId(locId);

                // 🔥 إصلاح المشكلة الثالثة: حساب المداخيل أوتوماتيكياً من الفواتير المحلية التي تم إنشاؤها 🔥
                const savedInvoices = JSON.parse(localStorage.getItem('linkdent_invoices')) || [];
                // نقوم بجمع كل المبالغ (paid) من الفواتير
                const totalRevenueLocal = savedInvoices.reduce((acc, curr) => acc + Number(curr.paid || 0), 0);
                
                setMonthlyRevenue(totalRevenueLocal); // تعيين المدخول الفوري

                // جلب المصاريف من الـ API (أو يمكن جعلها محلية لاحقاً إذا أردت)
                const resExp = await fetch(`https://linkdent.onrender.com/api/expenses/${locId}`);
                const dataExp = await resExp.json();
                if (dataExp.success) setExpenses(dataExp.expenses);

            } catch (error) {
                console.error("Error fetching financial data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFinancialData();
    }, [slug, clinicSettings]);

    const handleAddExpense = async () => {
        if (!amount || !locationId) return;
        setIsSaving(true);

        const newExpense = {
            title: title.trim() || 'General Expense',
            amount: parseFloat(amount),
            category,
            date: paymentDate,
            hasAttachment: !!invoiceFile
        };
        
        try {
            const response = await fetch(`https://linkdent.onrender.com/api/expenses/${locationId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExpense)
            });
            const data = await response.json();
            
            if (data.success) {
                setExpenses([data.expense, ...expenses]); 
                setTitle(''); 
                setAmount('');
                setInvoiceFile(null); 
            }
        } catch (error) {
            alert("Error saving expense");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        
        try {
            const response = await fetch(`https://linkdent.onrender.com/api/expenses/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                setExpenses(expenses.filter(e => e._id !== id && e.id !== id));
            }
        } catch (error) {
            alert("Failed to delete expense");
        }
    };

    const handleDownloadMonthly = () => {
        alert("The comprehensive financial report (revenues and expenses) will be generated and downloaded...");
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = monthlyRevenue - totalExpenses;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <MainCard 
            title="Financial Management & Audit (P&L)" 
            secondary={
                <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<IconDownload size={18} />}
                    onClick={handleDownloadMonthly}
                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                >
                    Download Monthly Report
                </Button>
            }
            sx={{ backgroundColor: 'transparent', border: 'none' }}
        >
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.4)', borderLeft: '6px solid #10b981', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 'bold', mb: 1 }}>Revenues (Invoices)</Typography>
                                    <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 800 }}>{monthlyRevenue.toLocaleString()} MAD</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><IconTrendingUp /></Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, backgroundColor: 'rgba(15, 23, 42, 0.4)', borderLeft: '6px solid #ef4444', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 'bold', mb: 1 }}>Operating Expenses</Typography>
                                    <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 800 }}>{totalExpenses.toLocaleString()} MAD</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><IconTrendingDown /></Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #673ab7 0%, #311b92 100%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', mb: 1 }}>Net Profit (Bénéfice Net)</Typography>
                                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>{netProfit.toLocaleString()} MAD</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}><IconWallet /></Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#ffffff' }}>➕ Record New Expense</Typography>
            <Paper elevation={0} sx={{ mb: 5, p: 3, borderRadius: 3, backgroundColor: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Description (Optional)" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' } }} />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <TextField fullWidth label="Amount (MAD)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' } }} />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <TextField fullWidth label="Payment Date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' } }} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField select fullWidth label="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' } }}>
                            {categories.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    
                    <Grid item xs={6} md={2}>
                        <Button component="label" variant={invoiceFile ? "contained" : "outlined"} color={invoiceFile ? "success" : "primary"} startIcon={<IconUpload size={18} />} sx={{ height: '56px', width: '100%', whiteSpace: 'nowrap', borderRadius: 2 }}>
                            {invoiceFile ? "Attached" : "Attach Invoice"}
                            <input type="file" hidden accept="application/pdf, image/jpeg, image/png" onChange={(e) => setInvoiceFile(e.target.files[0])} />
                        </Button>
                    </Grid>

                    <Grid item xs={6} md={1}>
                        <Button fullWidth variant="contained" disabled={isSaving} onClick={handleAddExpense} sx={{ height: '56px', backgroundColor: '#673ab7', borderRadius: 2 }}>
                            {isSaving ? <CircularProgress size={20} color="inherit" /> : <IconPlus />}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#ffffff' }}>📋 Detailed Expenses Log</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 3, overflowX: 'auto', backgroundColor: '#0f172a' }}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Category</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Attachments</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Amount</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses.length === 0 ? (
                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8', borderBottom: 'none' }}>No expenses recorded.</TableCell></TableRow>
                        ) : (
                            expenses.map((row, index) => (
                                <TableRow key={row._id || row.id || index} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                                    <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.title}</TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Chip label={row.category} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#e2e8f0', fontWeight: 'bold' }} />
                                    </TableCell>
                                    
                                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        {row.hasAttachment ? (
                                            <Tooltip title="Attached Invoice">
                                                <IconButton color="primary" size="small" sx={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}><IconFileDescription size={18} /></IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="caption" color="#64748b">-</Typography>
                                        )}
                                    </TableCell>

                                    <TableCell align="center" sx={{ color: '#ef4444', fontWeight: 800, whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        - {row.amount} MAD
                                    </TableCell>
                                    
                                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <IconButton color="error" size="small" onClick={() => handleDeleteExpense(row._id || row.id)} sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}>
                                            <IconTrash size={18} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
};

export default Depenses;
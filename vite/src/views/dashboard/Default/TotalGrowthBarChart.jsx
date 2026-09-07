import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import barChartOptions from './chart-data/total-growth-bar-chart';

const status = [
  { value: 'year', label: 'هذه السنة (This Year)' }
];

export default function TotalGrowthBarChart({ isLoading }) {
  const theme = useTheme();
  const { state: { fontFamily } } = useConfig();

  const [value, setValue] = useState('year');
  const [chartOptions, setChartOptions] = useState(barChartOptions);
  
  // بيانات حقيقية للمخطط
  const [chartSeries, setChartSeries] = useState([]);
  const [totalGrowth, setTotalGrowth] = useState(0);

  const textPrimary = theme.vars.palette.text.primary;
  const divider = theme.vars.palette.divider;
  const grey500 = theme.vars.palette.grey[500];
  const primaryDark = theme.vars.palette.primary.dark;
  const secondaryMain = theme.vars.palette.secondary.main;

  useEffect(() => {
    // تجميع الإحصائيات حسب الشهر
    const invoices = JSON.parse(localStorage.getItem('linkdent_invoices')) || [];
    let paidArr = Array(12).fill(0);
    let debtArr = Array(12).fill(0);
    let total = 0;

    invoices.forEach(inv => {
        const month = new Date(inv.date || Date.now()).getMonth(); // جلب شهر الفاتورة
        paidArr[month] += Number(inv.paid || 0);
        debtArr[month] += Number(inv.remaining || 0);
        total += Number(inv.paid || 0);
    });

    setChartSeries([
        { name: 'المداخيل (Revenus)', data: paidArr },
        { name: 'الديون (Crédits)', data: debtArr }
    ]);
    setTotalGrowth(total);

    setChartOptions({
      ...barChartOptions,
      chart: { ...barChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryDark, secondaryMain], // لونين فقط للمداخيل والديون
      xaxis: { ...barChartOptions.xaxis, labels: { style: { colors: textPrimary } } },
      yaxis: { ...barChartOptions.yaxis, labels: { style: { colors: textPrimary } } },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { ...(barChartOptions.legend ?? {}), labels: { ...(barChartOptions.legend?.labels ?? {}), colors: grey500 } }
    });
  }, [fontFamily, primaryDark, secondaryMain, textPrimary, grey500, divider]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Stack sx={{ gap: gridSpacing }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack sx={{ gap: 1 }}>
                <Typography variant="subtitle2">النمو المالي للعيادة (Croissance Financière)</Typography>
                <Typography variant="h3">{totalGrowth.toLocaleString()} MAD</Typography>
              </Stack>
              <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Box sx={{ ...theme.applyStyles('light', { '& .apexcharts-series:nth-of-type(4) path:hover': { filter: `brightness(0.95)`, transition: 'all 0.3s ease' } }) }}>
              <Chart options={chartOptions} series={chartSeries} type="bar" height={480} />
            </Box>
          </Stack>
        </MainCard>
      )}
    </>
  );
}

TotalGrowthBarChart.propTypes = { isLoading: PropTypes.bool };
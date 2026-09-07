import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

// icons
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SecurityIcon from '@mui/icons-material/Security';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HubIcon from '@mui/icons-material/Hub';
import InsightsIcon from '@mui/icons-material/Insights';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [totalDebt, setTotalDebt] = useState(0);
  const [toothTilt, setToothTilt] = useState({ x: 0, y: 0 });
  const [toothActive, setToothActive] = useState(false);

  useEffect(() => {
    setLoading(false);

    const invoices =
      JSON.parse(localStorage.getItem('linkdent_invoices')) || [];

    let debt = 0;

    invoices.forEach((inv) => {
      debt += Number(inv.remaining || 0);
    });

    setTotalDebt(debt);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        p: {
          xs: 1.5,
          sm: 2,
          md: 3
        },
        position: 'relative',
        overflow: 'hidden',

        background: `
          radial-gradient(
            circle at 8% 5%,
            rgba(67, 216, 255, 0.12),
            transparent 28%
          ),
          radial-gradient(
            circle at 92% 10%,
            rgba(125, 131, 255, 0.12),
            transparent 30%
          ),
          radial-gradient(
            circle at 50% 100%,
            rgba(77, 224, 188, 0.07),
            transparent 35%
          ),
          linear-gradient(
            145deg,
            #071525 0%,
            #0a1b2e 48%,
            #081421 100%
          )
        `,

        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.13,

          backgroundImage: `
            linear-gradient(
              rgba(67, 216, 255, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(67, 216, 255, 0.08) 1px,
              transparent 1px
            )
          `,

          backgroundSize: '44px 44px'
        }
      }}
    >
      {/* =====================================================
          LINKDENT CLINICAL COMMAND CENTER
      ===================================================== */}

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          mb: 3,
          p: {
            xs: 2.5,
            md: 3.5
          },

          borderRadius: '24px',

          border:
            '1px solid rgba(120, 210, 255, 0.15)',

          background: `
            linear-gradient(
              135deg,
              rgba(18, 42, 65, 0.96),
              rgba(8, 25, 42, 0.90)
            )
          `,

          backdropFilter: 'blur(18px)',

          boxShadow: `
            0 22px 65px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <Grid
            size={{
              xs: 12,
              md: 8
            }}
          >
            <Stack spacing={1.5}>
              {/* Brand line */}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    background:
                      'linear-gradient(135deg, #43d8ff, #5278ff)',

                    boxShadow:
                      '0 8px 28px rgba(67,216,255,0.22)'
                  }}
                >
                  <MedicalServicesIcon
                    sx={{
                      color: '#ffffff',
                      fontSize: 23
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '0.18em',
                      color: '#70dfff'
                    }}
                  >
                    LINKDENT
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 9,
                      letterSpacing: '0.16em',
                      color:
                        'rgba(190,220,235,0.52)'
                    }}
                  >
                    CLINICAL INTELLIGENCE
                  </Typography>
                </Box>
              </Stack>

              {/* Main title */}

              <Typography
                sx={{
                  fontSize: {
                    xs: 28,
                    sm: 35,
                    md: 42
                  },

                  fontWeight: 800,
                  lineHeight: 1.04,

                  letterSpacing:
                    '-0.035em',

                  color: '#f2f8ff'
                }}
              >
                Your clinic.
                <br />

                <Box
                  component="span"
                  sx={{
                    background:
                      'linear-gradient(90deg, #43d8ff, #8b8fff, #4de0bc)',

                    WebkitBackgroundClip:
                      'text',

                    WebkitTextFillColor:
                      'transparent'
                  }}
                >
                  Intelligent by design.
                </Box>
              </Typography>

              <Typography
                sx={{
                  maxWidth: 680,

                  color:
                    'rgba(210,228,242,0.66)',

                  fontSize: 14,
                  lineHeight: 1.75
                }}
              >
                A modern clinical workspace connecting
                patient records, digital anatomy,
                financial intelligence and secure
                dental workflows.
              </Typography>

              {/* Status chips */}

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  icon={
                    <AutoAwesomeIcon
                      sx={{
                        fontSize: 15
                      }}
                    />
                  }
                  label="AI READY"
                  size="small"
                  sx={{
                    color: '#73e5ff',

                    border:
                      '1px solid rgba(67,216,255,0.24)',

                    background:
                      'rgba(67,216,255,0.07)',

                    fontWeight: 800,
                    fontSize: 10
                  }}
                />

                <Chip
                  icon={
                    <SecurityIcon
                      sx={{
                        fontSize: 15
                      }}
                    />
                  }
                  label="CLINICAL SECURE"
                  size="small"
                  sx={{
                    color: '#78e4c2',

                    border:
                      '1px solid rgba(77,224,188,0.20)',

                    background:
                      'rgba(77,224,188,0.06)',

                    fontWeight: 800,
                    fontSize: 10
                  }}
                />

                <Chip
                  icon={
                    <HubIcon
                      sx={{
                        fontSize: 15
                      }}
                    />
                  }
                  label="LIVE DATA"
                  size="small"
                  sx={{
                    color: '#a8adff',

                    border:
                      '1px solid rgba(125,131,255,0.22)',

                    background:
                      'rgba(125,131,255,0.07)',

                    fontWeight: 800,
                    fontSize: 10
                  }}
                />
              </Stack>
            </Stack>
          </Grid>

          {/* =================================================
              RIGHT SIDE — 3D DENTAL CORE
          ================================================= */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >
            <Box
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const px = (event.clientX - rect.left) / rect.width;
                const py = (event.clientY - rect.top) / rect.height;

                setToothTilt({
                  x: (0.5 - py) * 22,
                  y: (px - 0.5) * 30
                });
                setToothActive(true);
              }}
              onMouseLeave={() => {
                setToothTilt({ x: 0, y: 0 });
                setToothActive(false);
              }}
              sx={{
                minHeight: 270,

                position: 'relative',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                overflow: 'hidden',

                perspective: '900px',
                transformStyle: 'preserve-3d',
                cursor: 'pointer',

                /* ==========================================
                   3D ANIMATIONS
                ========================================== */

                '@keyframes linkdentToothFloat': {
                  '0%': {
                    transform:
                      'translateY(0px) rotateX(-8deg) rotateY(-15deg) rotateZ(-2deg)'
                  },

                  '25%': {
                    transform:
                      'translateY(-11px) rotateX(8deg) rotateY(10deg) rotateZ(2deg)'
                  },

                  '50%': {
                    transform:
                      'translateY(0px) rotateX(-4deg) rotateY(18deg) rotateZ(0deg)'
                  },

                  '75%': {
                    transform:
                      'translateY(10px) rotateX(7deg) rotateY(-9deg) rotateZ(-2deg)'
                  },

                  '100%': {
                    transform:
                      'translateY(0px) rotateX(-8deg) rotateY(-15deg) rotateZ(-2deg)'
                  }
                },

                '@keyframes linkdentOrbit': {
                  from: {
                    transform:
                      'rotate(0deg)'
                  },

                  to: {
                    transform:
                      'rotate(360deg)'
                  }
                },

                '@keyframes linkdentOrbitReverse': {
                  from: {
                    transform:
                      'rotate(360deg)'
                  },

                  to: {
                    transform:
                      'rotate(0deg)'
                  }
                },

                '@keyframes linkdentScan': {
                  '0%': {
                    top: '18%',
                    opacity: 0
                  },

                  '15%': {
                    opacity: 1
                  },

                  '85%': {
                    opacity: 1
                  },

                  '100%': {
                    top: '78%',
                    opacity: 0
                  }
                },

                '@keyframes linkdentPulse': {
                  '0%': {
                    transform:
                      'scale(0.8)',
                    opacity: 0.35
                  },

                  '50%': {
                    transform:
                      'scale(1.25)',
                    opacity: 0.08
                  },

                  '100%': {
                    transform:
                      'scale(0.8)',
                    opacity: 0.35
                  }
                },

                '@keyframes linkdentCorePulse': {
                  '0%': {
                    opacity: 0.55
                  },

                  '50%': {
                    opacity: 1
                  },

                  '100%': {
                    opacity: 0.55
                  }
                }
              }}
            >
              {/* ==========================================
                  OUTER ORBIT
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',

                  width: 220,
                  height: 220,

                  borderRadius: '50%',

                  border:
                    '1px solid rgba(67,216,255,0.16)',

                  transform:
                    'rotateX(68deg) rotateZ(8deg)',

                  animation:
                    'linkdentOrbit 18s linear infinite',

                  boxShadow:
                    '0 0 45px rgba(67,216,255,0.04)'
                }}
              />

              {/* ==========================================
                  SECOND ORBIT
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',

                  width: 180,
                  height: 180,

                  borderRadius: '50%',

                  border:
                    '1px dashed rgba(125,131,255,0.25)',

                  transform:
                    'rotateX(72deg) rotateZ(-15deg)',

                  animation:
                    'linkdentOrbitReverse 12s linear infinite'
                }}
              />

              {/* ==========================================
                  VERTICAL ORBIT
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',

                  width: 145,
                  height: 205,

                  borderRadius: '50%',

                  border:
                    '1px solid rgba(77,224,188,0.13)',

                  transform:
                    'rotateY(65deg) rotateZ(12deg)',

                  animation:
                    'linkdentOrbit 15s linear infinite'
                }}
              />

              {/* ==========================================
                  ORBIT DOT 1
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',

                  width: 8,
                  height: 8,

                  borderRadius: '50%',

                  background: '#43d8ff',

                  boxShadow:
                    '0 0 18px rgba(67,216,255,0.95)',

                  top: 30,
                  right: 66
                }}
              />

              {/* ==========================================
                  ORBIT DOT 2
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',

                  width: 7,
                  height: 7,

                  borderRadius: '50%',

                  background: '#7d83ff',

                  boxShadow:
                    '0 0 18px rgba(125,131,255,0.85)',

                  bottom: 48,
                  left: 64
                }}
              />

              {/* ==========================================
                  ORBIT DOT 3
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',

                  width: 6,
                  height: 6,

                  borderRadius: '50%',

                  background: '#4de0bc',

                  boxShadow:
                    '0 0 15px rgba(77,224,188,0.85)',

                  top: 105,
                  right: 17
                }}
              />

              {/* ==========================================
                  LIVE SCAN HUD
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',
                  top: 18,
                  left: 18,
                  zIndex: 30,
                  px: 1.2,
                  py: 0.8,
                  border: '1px solid rgba(67,216,255,0.18)',
                  borderRadius: 2,
                  background: 'rgba(4,18,34,0.55)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: toothActive
                    ? '0 0 24px rgba(67,216,255,0.16)'
                    : 'none',
                  transition: 'all .25s ease'
                }}
              >
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#4de0bc',
                      boxShadow: '0 0 10px rgba(77,224,188,.9)'
                    }}
                  />
                  <Typography
                    sx={{
                      color: '#9feaff',
                      fontSize: 8,
                      fontWeight: 900,
                      letterSpacing: '.16em'
                    }}
                  >
                    LIVE 3D SCAN
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    mt: .35,
                    color: 'rgba(190,225,240,.48)',
                    fontSize: 7.5,
                    letterSpacing: '.08em'
                  }}
                >
                  {toothActive ? 'TRACKING ANATOMY' : 'AI READY'}
                </Typography>
              </Box>

              {/* ==========================================
                  INTERACTION TARGET
              ========================================== */}

              <Box
                onClick={() => {
                  window.location.href = '/linkdent/odontogram';
                }}
                sx={{
                  position: 'absolute',
                  right: 18,
                  top: 20,
                  zIndex: 30,
                  px: 1.15,
                  py: 0.75,
                  border: '1px solid rgba(125,131,255,0.20)',
                  borderRadius: 2,
                  background: 'rgba(9,20,42,0.48)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all .25s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    background: 'rgba(20,38,70,0.72)',
                    borderColor: 'rgba(67,216,255,0.42)'
                  }
                }}
              >
                <Typography
                  sx={{
                    color: '#aeb5ff',
                    fontSize: 7.5,
                    fontWeight: 900,
                    letterSpacing: '.12em'
                  }}
                >
                  OPEN ODONTOGRAM →
                </Typography>
              </Box>

              {/* ==========================================
                  AI PULSE
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',

                  width: 125,
                  height: 125,

                  borderRadius: '50%',

                  background:
                    'radial-gradient(circle, rgba(67,216,255,0.20), transparent 68%)',

                  animation:
                    'linkdentPulse 3s ease-in-out infinite'
                }}
              />

              {/* ==========================================
                  3D TOOTH CONTAINER
              ========================================== */}

              <Box
                sx={{
                  position: 'relative',

                  zIndex: 5,

                  width: 115,
                  height: 155,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  transformStyle:
                    'preserve-3d',

                  animation:
                    'linkdentToothFloat 6s ease-in-out infinite',

                  filter:
                    'drop-shadow(0 18px 25px rgba(0,0,0,0.38))'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${toothTilt.x}deg) rotateY(${toothTilt.y}deg) scale(${toothActive ? 1.05 : 1})`,
                    transition: 'transform 180ms cubic-bezier(.2,.8,.2,1)'
                  }}
                >
                {/* ======================================
                    TOOTH BACK / DEPTH
                ====================================== */}

                <Box
                  sx={{
                    position: 'absolute',

                    width: 74,
                    height: 116,

                    background:
                      'linear-gradient(145deg, #315b7c, #0d273e)',

                    clipPath:
                      'polygon(18% 4%, 82% 4%, 96% 25%, 87% 58%, 74% 100%, 58% 78%, 42% 78%, 26% 100%, 13% 58%, 4% 25%)',

                    transform:
                      'translateZ(-14px) scale(0.92)',

                    opacity: 0.78
                  }}
                />

                {/* ======================================
                    MAIN TOOTH
                ====================================== */}

                <Box
                  sx={{
                    position: 'absolute',

                    width: 86,
                    height: 130,

                    background: `
                      linear-gradient(
                        145deg,
                        rgba(255,255,255,0.98) 0%,
                        rgba(202,239,250,0.96) 32%,
                        rgba(86,185,216,0.94) 100%
                      )
                    `,

                    clipPath:
                      'polygon(18% 3%, 82% 3%, 96% 24%, 87% 57%, 73% 100%, 58% 78%, 42% 78%, 27% 100%, 13% 57%, 4% 24%)',

                    transform:
                      'translateZ(18px)',

                    boxShadow: `
                      inset 0 0 22px rgba(255,255,255,0.60),
                      0 0 30px rgba(67,216,255,0.30)
                    `
                  }}
                />

                {/* ======================================
                    INNER GLASS LAYER
                ====================================== */}

                <Box
                  sx={{
                    position: 'absolute',

                    width: 61,
                    height: 92,

                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.38), rgba(67,216,255,0.06))',

                    clipPath:
                      'polygon(18% 3%, 82% 3%, 96% 24%, 87% 57%, 73% 100%, 58% 78%, 42% 78%, 27% 100%, 13% 57%, 4% 24%)',

                    transform:
                      'translateZ(27px)',

                    opacity: 0.72
                  }}
                />

                {/* ======================================
                    SCAN LINE
                ====================================== */}

                <Box
                  sx={{
                    position: 'absolute',

                    zIndex: 10,

                    width: 73,
                    height: 2,

                    borderRadius: 10,

                    background:
                      'linear-gradient(90deg, transparent, #43d8ff, transparent)',

                    boxShadow:
                      '0 0 14px rgba(67,216,255,0.95)',

                    animation:
                      'linkdentScan 3.2s ease-in-out infinite',

                    transform:
                      'translateZ(35px)'
                  }}
                />

                {/* ======================================
                    AI CORE
                ====================================== */}

                <Box
                  sx={{
                    position: 'absolute',

                    zIndex: 12,

                    width: 19,
                    height: 19,

                    borderRadius: '50%',

                    background:
                      'radial-gradient(circle, #ffffff 0%, #43d8ff 35%, #1976a8 100%)',

                    transform:
                      'translateZ(43px)',

                    boxShadow: `
                      0 0 8px #ffffff,
                      0 0 20px rgba(67,216,255,0.95),
                      0 0 42px rgba(67,216,255,0.48)
                    `,

                    animation:
                      'linkdentCorePulse 2s ease-in-out infinite'
                  }}
                />
                </Box>
              </Box>

              {/* ==========================================
                  CORE LABEL
              ========================================== */}

              <Box
                sx={{
                  position: 'absolute',

                  bottom: 8,
                  left: '50%',

                  transform:
                    'translateX(-50%)',

                  textAlign: 'center',

                  zIndex: 20
                }}
              >
                <Typography
                  sx={{
                    color: '#bfe9f7',

                    fontSize: 10,

                    fontWeight: 800,

                    letterSpacing:
                      '0.18em',

                    whiteSpace:
                      'nowrap'
                  }}
                >
                  4D DIGITAL DENTAL CORE
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.7}
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    mt: 0.4
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,

                      borderRadius: '50%',

                      background:
                        '#4de0bc',

                      boxShadow:
                        '0 0 10px rgba(77,224,188,0.9)'
                    }}
                  />

                  <Typography
                    sx={{
                      color: '#4de0bc',

                      fontSize: 8,

                      fontWeight: 700,

                      letterSpacing:
                        '0.12em'
                    }}
                  >
                    AI SYSTEM ONLINE
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* =====================================================
          CLINICAL INTELLIGENCE
      ===================================================== */}

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          mb: 3
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mb: 1
          }}
        >
          <PsychologyIcon
            sx={{
              color: '#43d8ff',
              fontSize: 21
            }}
          />

          <Typography
            sx={{
              color: '#e5f4ff',
              fontSize: 16,
              fontWeight: 800
            }}
          >
            Clinical Intelligence
          </Typography>

          <Chip
            label="LINKDENT AI"
            size="small"
            sx={{
              height: 21,

              color: '#8b8fff',

              background:
                'rgba(125,131,255,0.09)',

              border:
                '1px solid rgba(125,131,255,0.18)',

              fontSize: 9,
              fontWeight: 800
            }}
          />
        </Stack>

        <Typography
          sx={{
            color:
              'rgba(210,228,242,0.54)',

            fontSize: 12,

            mb: 2
          }}
        >
          A clean operational view of your dental workspace.
        </Typography>

        <Grid
          container
          spacing={2}
        >
          {/* Patient Intelligence */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >
            <IntelligenceCard
              icon={InsightsIcon}
              title="Patient Intelligence"
              text="Patient records connected to the clinical workspace and ready for analysis."
              color="#43d8ff"
            />
          </Grid>

          {/* Digital Anatomy */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >
            <IntelligenceCard
              icon={MedicalServicesIcon}
              title="Digital Anatomy"
              text="The 4D Odontogram keeps tooth-level clinical states organized per patient."
              color="#8b8fff"
            />
          </Grid>

          {/* Security */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >
            <IntelligenceCard
              icon={SecurityIcon}
              title="Clinical Security"
              text="Authenticated access protects the clinical workspace and patient records."
              color="#4de0bc"
            />
          </Grid>
        </Grid>
      </Box>

      {/* =====================================================
          PRACTICE ANALYTICS
      ===================================================== */}

      <Box
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mb: 2
          }}
        >
          <StorefrontTwoToneIcon
            sx={{
              color: '#43d8ff',
              fontSize: 21
            }}
          />

          <Typography
            sx={{
              color: '#e8f5ff',
              fontSize: 16,
              fontWeight: 800
            }}
          >
            Practice Analytics
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Chip
            label="LIVE OVERVIEW"
            size="small"
            sx={{
              color: '#4de0bc',

              border:
                '1px solid rgba(77,224,188,0.20)',

              background:
                'rgba(77,224,188,0.06)',

              fontSize: 9,
              fontWeight: 800
            }}
          />
        </Stack>

        <Divider
          sx={{
            mb: 2,

            borderColor:
              'rgba(130,190,220,0.10)'
          }}
        />

        {/* ===================================================
            EXISTING LINKDENT CARDS
        =================================================== */}

        <Grid
          container
          spacing={gridSpacing}
        >
          <Grid size={12}>
            <Grid
              container
              spacing={gridSpacing}
            >
              {/* Revenue */}

              <Grid
                size={{
                  lg: 4,
                  md: 6,
                  sm: 6,
                  xs: 12
                }}
              >
                <EarningCard
                  isLoading={isLoading}
                />
              </Grid>

              {/* Appointments */}

              <Grid
                size={{
                  lg: 4,
                  md: 6,
                  sm: 6,
                  xs: 12
                }}
              >
                <TotalOrderLineChartCard
                  isLoading={isLoading}
                />
              </Grid>

              {/* Finance */}

              <Grid
                size={{
                  lg: 4,
                  md: 12,
                  sm: 12,
                  xs: 12
                }}
              >
                <Grid
                  container
                  spacing={gridSpacing}
                >
                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                      md: 6,
                      lg: 12
                    }}
                  >
                    <TotalIncomeDarkCard
                      isLoading={isLoading}
                    />
                  </Grid>

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                      md: 6,
                      lg: 12
                    }}
                  >
                    <TotalIncomeLightCard
                      isLoading={isLoading}
                      total={totalDebt}
                      label="الديون المتبقية (Crédits)"
                      icon={
                        <StorefrontTwoToneIcon
                          fontSize="inherit"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* =================================================
              CHARTS
          ================================================= */}

          <Grid size={12}>
            <Grid
              container
              spacing={gridSpacing}
            >
              <Grid
                size={{
                  xs: 12,
                  md: 8
                }}
              >
                <TotalGrowthBarChart
                  isLoading={isLoading}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4
                }}
              >
                <PopularCard
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

/* ============================================================
   INTELLIGENCE CARD
============================================================ */

function IntelligenceCard({
  icon: Icon,
  title,
  text,
  color
}) {
  return (
    <Box
      sx={{
        height: '100%',

        p: 2.3,

        borderRadius: '20px',

        border:
          '1px solid rgba(130,190,220,0.12)',

        background:
          'linear-gradient(145deg, rgba(18,42,64,0.92), rgba(10,28,45,0.82))',

        backdropFilter:
          'blur(14px)',

        transition:
          'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',

        '&:hover': {
          transform:
            'translateY(-4px)',

          borderColor:
            `${color}55`,

          boxShadow:
            `0 15px 38px ${color}12`
        }
      }}
    >
      <Stack spacing={1.3}>
        {/* Icon */}

        <Box
          sx={{
            width: 43,
            height: 43,

            borderRadius: '13px',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            color: color,

            background:
              `${color}12`,

            border:
              `1px solid ${color}30`
          }}
        >
          <Icon />
        </Box>

        {/* Title */}

        <Typography
          sx={{
            color: '#eaf5ff',

            fontSize: 14,

            fontWeight: 750
          }}
        >
          {title}
        </Typography>

        {/* Description */}

        <Typography
          sx={{
            color:
              'rgba(194,217,232,0.56)',

            fontSize: 11.5,

            lineHeight: 1.65
          }}
        >
          {text}
        </Typography>
      </Stack>
    </Box>
  );
}
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  IconBrandGoogle,
  IconBrandApple,
  IconBrandLinkedin,
  IconEye,
  IconEyeOff,
  IconShieldCheck,
  IconSparkles,
  IconActivity,
  IconBrain,
  IconScan,
  IconArrowRight
} from '@tabler/icons-react';

import { auth } from '../../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import AuthWrapper1 from './AuthWrapper1';

/*
  LINKdent — 4D Dental Intelligence Login
  ------------------------------------------------
  UI only: keeps the existing JWT login endpoint.
  No new packages required.
*/

const keyframes = {
  '@keyframes floatTooth': {
    '0%, 100%': { transform: 'translateY(0) rotateX(0deg) rotateY(-8deg)' },
    '50%': { transform: 'translateY(-14px) rotateX(4deg) rotateY(8deg)' }
  },
  '@keyframes orbit': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  },
  '@keyframes orbitReverse': {
    from: { transform: 'rotate(360deg)' },
    to: { transform: 'rotate(0deg)' }
  },
  '@keyframes pulse': {
    '0%, 100%': { opacity: 0.35, transform: 'scale(0.92)' },
    '50%': { opacity: 0.8, transform: 'scale(1.08)' }
  },
  '@keyframes scan': {
    '0%': { transform: 'translateY(-130px)', opacity: 0 },
    '15%': { opacity: 0.9 },
    '85%': { opacity: 0.9 },
    '100%': { transform: 'translateY(130px)', opacity: 0 }
  },
  '@keyframes particle': {
    '0%, 100%': { opacity: 0.15, transform: 'scale(0.7)' },
    '50%': { opacity: 1, transform: 'scale(1.25)' }
  },
  '@keyframes breathe': {
    '0%, 100%': { boxShadow: '0 0 20px rgba(42,189,255,.12)' },
    '50%': { boxShadow: '0 0 55px rgba(42,189,255,.3)' }
  }
};

function HoloTooth() {
  const miniTeeth = [
    { x: '5%', y: '30%', r: -20, s: 0.55 },
    { x: '17%', y: '12%', r: -10, s: 0.48 },
    { x: '36%', y: '4%', r: -3, s: 0.45 },
    { x: '58%', y: '5%', r: 5, s: 0.45 },
    { x: '77%', y: '15%', r: 12, s: 0.48 },
    { x: '91%', y: '32%', r: 20, s: 0.55 },
    { x: '8%', y: '68%', r: 20, s: 0.55 },
    { x: '20%', y: '84%', r: 10, s: 0.48 },
    { x: '40%', y: '92%', r: 3, s: 0.45 },
    { x: '60%', y: '92%', r: -4, s: 0.45 },
    { x: '80%', y: '84%', r: -12, s: 0.48 },
    { x: '92%', y: '68%', r: -20, s: 0.55 }
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: 320, sm: 390, md: 500 },
        height: { xs: 330, sm: 390, md: 500 },
        perspective: '900px',
        ...keyframes
      }}
    >
      {/* atmospheric glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: '18%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,211,238,.22), rgba(37,99,235,.08) 42%, transparent 72%)',
          filter: 'blur(20px)',
          animation: 'pulse 4.5s ease-in-out infinite'
        }}
      />

      {/* orbital rings */}
      <Box
        sx={{
          position: 'absolute',
          inset: '4%',
          border: '1px solid rgba(56,189,248,.24)',
          borderRadius: '50%',
          transform: 'rotateX(68deg)',
          animation: 'orbit 18s linear infinite'
        }}
      >
        <Box sx={{
          position: 'absolute',
          left: '50%',
          top: -4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#67e8f9',
          boxShadow: '0 0 20px #22d3ee'
        }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: '12%',
          border: '1px dashed rgba(96,165,250,.25)',
          borderRadius: '50%',
          transform: 'rotateY(68deg)',
          animation: 'orbitReverse 12s linear infinite'
        }}
      />

      {/* floating tooth markers */}
      {miniTeeth.map((t, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: t.x,
            top: t.y,
            width: 22 * t.s + 12,
            height: 29 * t.s + 14,
            borderRadius: '48% 48% 42% 42%',
            border: '1px solid rgba(125,211,252,.48)',
            background:
              'linear-gradient(145deg, rgba(255,255,255,.2), rgba(56,189,248,.05))',
            boxShadow: '0 0 16px rgba(56,189,248,.12)',
            transform: `rotate(${t.r}deg)`,
            animation: `particle ${2.5 + (i % 4) * 0.45}s ease-in-out infinite`
          }}
        />
      ))}

      {/* central dental hologram */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: { xs: 155, sm: 185, md: 215 },
          height: { xs: 190, sm: 225, md: 260 },
          transform: 'translate(-50%, -50%)',
          animation: 'floatTooth 6s ease-in-out infinite',
          filter: 'drop-shadow(0 0 22px rgba(34,211,238,.3))'
        }}
      >
        {/* outer tooth */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            clipPath:
              'polygon(20% 8%, 38% 0%, 62% 0%, 80% 8%, 92% 22%, 89% 48%, 79% 63%, 70% 98%, 55% 100%, 50% 78%, 45% 100%, 30% 98%, 21% 63%, 11% 48%, 8% 22%)',
            background:
              'linear-gradient(135deg, rgba(224,251,255,.92), rgba(56,189,248,.42) 42%, rgba(37,99,235,.16) 72%, rgba(255,255,255,.72))',
            border: '1px solid rgba(186,230,253,.7)'
          }}
        />
        {/* inner tooth */}
        <Box
          sx={{
            position: 'absolute',
            inset: '13%',
            clipPath:
              'polygon(20% 8%, 38% 0%, 62% 0%, 80% 8%, 92% 22%, 89% 48%, 79% 63%, 70% 98%, 55% 100%, 50% 78%, 45% 100%, 30% 98%, 21% 63%, 11% 48%, 8% 22%)',
            background:
              'linear-gradient(160deg, rgba(255,255,255,.82), rgba(125,211,252,.3), rgba(30,64,175,.16))',
            boxShadow: 'inset 0 0 30px rgba(255,255,255,.45)'
          }}
        />
        {/* scan grid */}
        <Box
          sx={{
            position: 'absolute',
            inset: '8%',
            overflow: 'hidden',
            clipPath:
              'polygon(20% 8%, 38% 0%, 62% 0%, 80% 8%, 92% 22%, 89% 48%, 79% 63%, 70% 98%, 55% 100%, 50% 78%, 45% 100%, 30% 98%, 21% 63%, 11% 48%, 8% 22%)',
            backgroundImage:
              'linear-gradient(rgba(34,211,238,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.18) 1px, transparent 1px)',
            backgroundSize: '12px 12px'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #67e8f9, transparent)',
              boxShadow: '0 0 15px #22d3ee',
              animation: 'scan 3.2s ease-in-out infinite'
            }}
          />
        </Box>

        {/* neural core */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '34%',
            width: 48,
            height: 48,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #fff 0 10%, #67e8f9 28%, rgba(59,130,246,.2) 68%, transparent 72%)',
            boxShadow: '0 0 35px rgba(34,211,238,.7)'
          }}
        />
      </Box>

      {/* 4D label */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '7%',
          transform: 'translateX(-50%)',
          px: 1.8,
          py: 0.75,
          borderRadius: 99,
          border: '1px solid rgba(103,232,249,.3)',
          background: 'rgba(2,6,23,.65)',
          backdropFilter: 'blur(12px)',
          whiteSpace: 'nowrap',
          animation: 'breathe 4s ease-in-out infinite'
        }}
      >
        <Typography sx={{
          color: '#67e8f9',
          fontSize: '.68rem',
          fontWeight: 800,
          letterSpacing: '2px'
        }}>
          4D ODONTOGRAM
        </Typography>
      </Box>
    </Box>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const from = location.state?.from?.pathname || '/dashboard/default';

  const handleChange = (prop) => (event) =>
    setCredentials({ ...credentials, [prop]: event.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      alert('⚠️ يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:10000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.error || '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        return;
      }

      localStorage.setItem('linkdent_token', data.token);
      localStorage.setItem('linkdent_user', JSON.stringify(data.user));

      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ تعذر الاتصال بالخادم. تأكد أن Backend يعمل على port 10000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('linkdent_token', result.user.uid);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      minHeight: 56,
      color: '#f8fafc',
      background: 'rgba(8,20,39,.72)',
      borderRadius: '15px',
      transition: 'all .25s ease',
      '& fieldset': { borderColor: 'rgba(125,211,252,.14)' },
      '&:hover fieldset': { borderColor: 'rgba(56,189,248,.42)' },
      '&.Mui-focused': {
        boxShadow: '0 0 0 4px rgba(34,211,238,.07)',
        background: 'rgba(8,20,39,.9)'
      },
      '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
      '& input': { color: '#f8fafc', fontWeight: 500 },
      '& input::placeholder': { color: '#64748b', opacity: 1 },
      '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px #081427 inset',
        WebkitTextFillColor: '#fff'
      }
    }
  };

  return (
    <AuthWrapper1>
      <Box
        sx={{
          ...keyframes,
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1.5, md: 3 },
          background:
            'radial-gradient(circle at 20% 45%, rgba(37,99,235,.13), transparent 32%), radial-gradient(circle at 78% 55%, rgba(6,182,212,.12), transparent 32%), #020617',
          fontFamily: '"Inter","Roboto",sans-serif'
        }}
      >
        {/* grid */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          opacity: .14,
          backgroundImage:
            'linear-gradient(rgba(125,211,252,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at center, black, transparent 82%)',
          pointerEvents: 'none'
        }} />

        {/* main shell */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 1280,
            minHeight: { md: 730 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.08fr .92fr' },
            overflow: 'hidden',
            border: '1px solid rgba(148,163,184,.14)',
            borderRadius: { xs: 3, md: 5 },
            background: 'rgba(3,10,24,.72)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 40px 120px rgba(0,0,0,.6)'
          }}
        >
          {/* LEFT */}
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 560, md: 730 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: { xs: 3, sm: 5, md: 7 },
              py: 5,
              overflow: 'hidden',
              borderRight: { md: '1px solid rgba(148,163,184,.1)' }
            }}
          >
            {/* brand */}
            <Box sx={{
              position: 'absolute',
              top: 28,
              left: { xs: 24, md: 42 },
              display: 'flex',
              alignItems: 'center',
              gap: 1.2
            }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg,#2563eb,#06b6d4)',
                boxShadow: '0 0 30px rgba(37,99,235,.32)'
              }}>
                <IconSparkles size={21} color="#fff" />
              </Box>
              <Box>
                <Typography sx={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  letterSpacing: 1
                }}>
                  LINK<span style={{ color: '#38bdf8' }}>dent</span>
                </Typography>
                <Typography sx={{
                  color: '#64748b',
                  fontSize: '.57rem',
                  letterSpacing: '2px'
                }}>
                  SMART DENTAL CARE
                </Typography>
              </Box>
            </Box>

            {/* online */}
            <Box sx={{
              position: 'absolute',
              top: 34,
              right: 35,
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: .8,
              px: 1.4,
              py: .65,
              borderRadius: 99,
              border: '1px solid rgba(34,197,94,.18)',
              background: 'rgba(34,197,94,.05)'
            }}>
              <Box sx={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 12px #22c55e'
              }} />
              <Typography sx={{
                color: '#86efac',
                fontSize: '.62rem',
                letterSpacing: 1
              }}>
                CLINICAL AI ONLINE
              </Typography>
            </Box>

            <Box sx={{ mt: { xs: 4, md: 2 }, textAlign: 'center' }}>
              <Typography sx={{
                color: '#f8fafc',
                fontSize: { xs: '1.8rem', md: '2.55rem' },
                lineHeight: 1.05,
                fontWeight: 850,
                letterSpacing: '-1.5px'
              }}>
                Dentistry, reimagined.
              </Typography>
              <Typography sx={{
                mt: 1,
                color: '#38bdf8',
                fontSize: { xs: '1.15rem', md: '1.45rem' },
                fontWeight: 700
              }}>
                Intelligent by design.
              </Typography>
            </Box>

            <HoloTooth />

            {/* insight cards */}
            <Box sx={{
              display: { xs: 'none', sm: 'flex' },
              gap: 1.2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mt: -2
            }}>
              {[
                { icon: <IconScan size={15} />, title: '4D Scan', sub: 'Visual precision' },
                { icon: <IconBrain size={15} />, title: 'AI Ready', sub: 'Clinical intelligence' },
                { icon: <IconActivity size={15} />, title: 'Live Data', sub: 'Patient context' }
              ].map((item) => (
                <Box key={item.title} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.4,
                  py: 1,
                  minWidth: 135,
                  borderRadius: 2,
                  border: '1px solid rgba(125,211,252,.12)',
                  background: 'rgba(255,255,255,.025)'
                }}>
                  <Box sx={{
                    width: 30, height: 30, borderRadius: 1,
                    display: 'grid', placeItems: 'center',
                    color: '#67e8f9',
                    background: 'rgba(34,211,238,.07)'
                  }}>
                    {item.icon}
                  </Box>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ color: '#dbeafe', fontSize: '.68rem', fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '.57rem' }}>
                      {item.sub}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Typography sx={{
              textAlign: 'center',
              color: '#475569',
              fontSize: '.62rem',
              letterSpacing: '2.5px',
              mt: 3
            }}>
              PEOPLE • TECHNOLOGY • HEALTHIER SMILES
            </Typography>
          </Box>

          {/* RIGHT */}
          <Box sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, sm: 5, md: 6 }
          }}>
            {/* ambient vertical glow */}
            <Box sx={{
              position: 'absolute',
              top: '15%',
              bottom: '15%',
              left: 0,
              width: 1,
              background: 'linear-gradient(transparent, rgba(34,211,238,.5), transparent)',
              opacity: .45
            }} />

            <Box sx={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 2 }}>
              <Typography sx={{
                color: '#38bdf8',
                fontSize: '.68rem',
                fontWeight: 800,
                letterSpacing: '2.4px',
                mb: 1.5
              }}>
                SECURE CLINICAL ACCESS
              </Typography>

              <Typography sx={{
                color: '#f8fafc',
                fontSize: { xs: '2rem', md: '2.6rem' },
                fontWeight: 850,
                letterSpacing: '-1.5px',
                lineHeight: 1.05
              }}>
                Welcome back.
              </Typography>

              <Typography sx={{
                color: '#64748b',
                mt: 1.2,
                mb: 3.5,
                fontSize: '.88rem',
                lineHeight: 1.6
              }}>
                Access your intelligent dental workspace.
              </Typography>

              {/* social */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1 }}>
                {[
                  { icon: <IconBrandGoogle size={19} color="#ea4335" />, onClick: handleGoogleSignIn },
                  { icon: <IconBrandApple size={19} color="#fff" /> },
                  { icon: <IconBrandLinkedin size={19} color="#0a66c2" /> }
                ].map((item, i) => (
                  <Button
                    key={i}
                    variant="outlined"
                    onClick={item.onClick}
                    sx={{
                      height: 49,
                      minWidth: 0,
                      borderRadius: 1.8,
                      borderColor: 'rgba(148,163,184,.14)',
                      background: 'rgba(255,255,255,.025)',
                      '&:hover': {
                        background: 'rgba(56,189,248,.06)',
                        borderColor: 'rgba(56,189,248,.35)'
                      }
                    }}
                  >
                    {item.icon}
                  </Button>
                ))}
              </Box>

              <Divider sx={{
                my: 3,
                '&::before,&::after': { borderColor: 'rgba(148,163,184,.11)' }
              }}>
                <Typography sx={{
                  color: '#475569',
                  fontSize: '.62rem',
                  letterSpacing: 1
                }}>
                  EMAIL ACCESS
                </Typography>
              </Divider>

              <form onSubmit={handleLogin}>
                <Typography sx={{
                  color: '#cbd5e1',
                  fontSize: '.7rem',
                  fontWeight: 700,
                  letterSpacing: 1,
                  mb: 1
                }}>
                  EMAIL ADDRESS
                </Typography>

                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={credentials.email}
                  onChange={handleChange('email')}
                  sx={{ ...inputStyle, mb: 2.2 }}
                />

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography sx={{
                    color: '#cbd5e1',
                    fontSize: '.7rem',
                    fontWeight: 700,
                    letterSpacing: 1
                  }}>
                    PASSWORD
                  </Typography>
                  <Link to="#" style={{
                    color: '#38bdf8',
                    fontSize: '.7rem',
                    textDecoration: 'none'
                  }}>
                    Forgot password?
                  </Link>
                </Box>

                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange('password')}
                  sx={{ ...inputStyle, mb: 1.5 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          sx={{ color: '#64748b' }}
                        >
                          {showPassword ? <IconEyeOff size={19} /> : <IconEye size={19} />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        sx={{
                          color: '#334155',
                          '&.Mui-checked': { color: '#38bdf8' }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: '#64748b', fontSize: '.72rem' }}>
                        Remember me
                      </Typography>
                    }
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: .6 }}>
                    <IconShieldCheck size={14} color="#22c55e" />
                    <Typography sx={{ color: '#475569', fontSize: '.65rem' }}>
                      Encrypted
                    </Typography>
                  </Box>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  endIcon={!isLoading ? <IconArrowRight size={18} /> : null}
                  sx={{
                    height: 57,
                    borderRadius: 1.9,
                    textTransform: 'none',
                    fontSize: '.95rem',
                    fontWeight: 800,
                    color: '#fff',
                    background: 'linear-gradient(100deg,#2563eb,#0891b2)',
                    boxShadow: '0 14px 38px rgba(37,99,235,.22)',
                    transition: 'all .25s ease',
                    '&:hover': {
                      background: 'linear-gradient(100deg,#3b82f6,#06b6d4)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 18px 48px rgba(37,99,235,.34)'
                    },
                    '&.Mui-disabled': {
                      color: '#cbd5e1',
                      background: 'rgba(37,99,235,.25)'
                    }
                  }}
                >
                  {isLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign in to Linkdent'}
                </Button>
              </form>

              <Typography sx={{
                textAlign: 'center',
                color: '#475569',
                fontSize: '.75rem',
                mt: 3.5
              }}>
                New to Linkdent?{' '}
                <Link
                  to="/pages/register"
                  style={{
                    color: '#38bdf8',
                    fontWeight: 800,
                    textDecoration: 'none'
                  }}
                >
                  Create your workspace
                </Link>
              </Typography>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: .7,
                mt: 3.5
              }}>
                <IconShieldCheck size={13} color="#334155" />
                <Typography sx={{
                  color: '#334155',
                  fontSize: '.6rem',
                  letterSpacing: '.8px'
                }}>
                  LINKDENT • SECURE CLINICAL PLATFORM
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </AuthWrapper1>
  );
}

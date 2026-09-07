import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';

import {
  IconBrandGoogle,
  IconBrandApple,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react';

import {
  auth
} from '../../../firebase';

import {
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import AuthWrapper1 from './AuthWrapper1';

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleChange = (prop) => (event) => {
    setFormData({
      ...formData,
      [prop]: event.target.value
    });
  };

  // =========================================================
  // REGISTER WITH LINKDENT BACKEND + MONGODB
  // =========================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert('⚠️ يرجى ملء جميع الحقول.');
      return;
    }

    if (formData.password.length < 6) {
      alert('❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:10000'}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            doctorName: formData.name,
            email: formData.email,
            password: formData.password,
            clinicName: 'Linkdent Clinic'
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'حدث خطأ أثناء إنشاء الحساب.'
        );
      }

      alert(
        '✅ تم إنشاء الحساب بنجاح!\n\nيمكنك الآن تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور.'
      );

      navigate('/pages/login');

    } catch (error) {
      console.error('Register error:', error);

      alert(
        '❌ حدث خطأ أثناء إنشاء الحساب:\n\n' +
        error.message
      );

    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // GOOGLE SIGN IN
  // =========================================================

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);

      navigate('/dashboard/default');

    } catch (error) {
      console.error('Google Sign-In error:', error);

      alert(
        '❌ تعذر تسجيل الدخول باستخدام Google.\n\n' +
        error.message
      );
    }
  };

  // =========================================================
  // STYLES
  // =========================================================

  const socialButtonStyle = {
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: '#e2e8f0',
    textTransform: 'none',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    py: 1.2,
    fontSize: '0.95rem',
    fontWeight: '500',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.2)'
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      color: '#000000',
      backgroundColor: '#ffffff',
      borderRadius: '12px',

      '& fieldset': {
        borderColor: 'transparent'
      },

      '&:hover fieldset': {
        borderColor: '#cbd5e1'
      },

      '&.Mui-focused fieldset': {
        borderColor: '#3b82f6',
        borderWidth: '2px'
      },

      '& input': {
        color: '#000000',
        fontWeight: '600'
      },

      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
        {
          WebkitBoxShadow:
            '0 0 0 1000px #ffffff inset !important',

          WebkitTextFillColor:
            '#000000 !important',

          transition:
            'background-color 5000s ease-in-out 0s'
        }
    },

    '& .MuiInputBase-input::placeholder': {
      color: '#64748b',
      opacity: 1
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <AuthWrapper1>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',

          backgroundColor: '#02040a',

          backgroundImage:
            `radial-gradient(
              circle at 50% 80%,
              rgba(37, 99, 235, 0.3) 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 50% 80%,
              rgba(59, 130, 246, 0.15) 0%,
              transparent 60%
            )`,

          position: 'relative',
          overflow: 'hidden',
          p: 2,

          fontFamily: '"Inter", sans-serif'
        }}
      >

        {/* Border */}

        <Box
          sx={{
            position: 'absolute',
            top: '2%',
            bottom: '2%',
            left: '2%',
            right: '2%',

            border:
              '1px solid rgba(59, 130, 246, 0.3)',

            borderRadius: '24px',

            pointerEvents: 'none',

            zIndex: 0
          }}
        />

        {/* TITLE */}

        <Typography
          variant="h1"
          sx={{
            color: '#1d4ed8',

            fontSize: {
              xs: '3rem',
              md: '4.5rem'
            },

            fontWeight: '900',

            letterSpacing: '4px',

            mb: 4,

            zIndex: 1,

            textShadow:
              '0 0 20px rgba(37, 99, 235, 0.5)'
          }}
        >
          SIGN UP
        </Typography>

        {/* CARD */}

        <Box
          sx={{
            width: '100%',
            maxWidth: '440px',

            background:
              'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',

            backdropFilter: 'blur(20px)',

            borderRadius: '24px',

            border:
              '1px solid rgba(255, 255, 255, 0.05)',

            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',

            p: {
              xs: 3,
              md: 5
            },

            zIndex: 1,

            display: 'flex',
            flexDirection: 'column',

            gap: 3
          }}
        >

          <Typography
            variant="h3"
            align="center"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              mb: 1
            }}
          >
            Create an account
          </Typography>

          {/* SOCIAL LOGIN */}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >

            <Button
              variant="outlined"
              fullWidth
              sx={socialButtonStyle}
              startIcon={
                <IconBrandGoogle
                  size={20}
                  color="#ea4335"
                />
              }
              onClick={handleGoogleSignIn}
            >
              Continue with Google
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={socialButtonStyle}
              startIcon={
                <IconBrandApple
                  size={20}
                  color="#fff"
                />
              }
            >
              Continue with Apple
            </Button>

          </Box>

          {/* REGISTER FORM */}

          <form
            onSubmit={handleRegister}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >

            {/* NAME */}

            <Box>

              <Typography
                variant="body2"
                sx={{
                  color: '#ffffff',
                  mb: 1,
                  ml: 0.5,
                  fontWeight: 'bold'
                }}
              >
                Full Name
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Dr. John Doe"

                value={formData.name}

                onChange={handleChange('name')}

                sx={inputStyle}
              />

            </Box>

            {/* EMAIL */}

            <Box>

              <Typography
                variant="body2"
                sx={{
                  color: '#ffffff',
                  mb: 1,
                  ml: 0.5,
                  fontWeight: 'bold'
                }}
              >
                Email address
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="you@example.com"

                type="email"

                value={formData.email}

                onChange={handleChange('email')}

                sx={inputStyle}
              />

            </Box>

            {/* PASSWORD */}

            <Box>

              <Typography
                variant="body2"
                sx={{
                  color: '#ffffff',
                  mb: 1,
                  ml: 0.5,
                  fontWeight: 'bold'
                }}
              >
                Password
              </Typography>

              <TextField
                fullWidth
                variant="outlined"

                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }

                placeholder="Create a strong password"

                value={formData.password}

                onChange={handleChange('password')}

                sx={inputStyle}

                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">

                      <IconButton
                        onClick={
                          handleClickShowPassword
                        }

                        edge="end"

                        sx={{
                          color: '#000000'
                        }}
                      >

                        {showPassword ? (
                          <IconEyeOff size={20} />
                        ) : (
                          <IconEye size={20} />
                        )}

                      </IconButton>

                    </InputAdornment>
                  )
                }}
              />

            </Box>

            {/* CREATE ACCOUNT */}

            <Button
              type="submit"
              fullWidth
              variant="contained"

              disabled={isLoading}

              sx={{
                bgcolor: '#fff',

                color: '#02040a',

                fontWeight: 'bold',

                borderRadius: '12px',

                py: 1.5,

                mt: 1,

                textTransform: 'none',

                fontSize: '1rem',

                boxShadow:
                  '0 4px 14px rgba(255, 255, 255, 0.2)',

                '&:hover': {
                  bgcolor: '#e2e8f0',

                  boxShadow:
                    '0 6px 20px rgba(255, 255, 255, 0.3)'
                },

                '&.Mui-disabled': {
                  bgcolor:
                    'rgba(255,255,255,0.5)',

                  color: '#333'
                }
              }}
            >

              {isLoading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                'Create Account'
              )}

            </Button>

          </form>

        </Box>

        {/* LOGIN LINK */}

        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            mt: 4,
            zIndex: 1
          }}
        >

          Already have an account?{' '}

          <Link
            to="/pages/login"

            style={{
              color: '#fff',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            Sign in
          </Link>

        </Typography>

      </Box>

    </AuthWrapper1>
  );
}
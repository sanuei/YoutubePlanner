import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import LogoComponent from './LogoComponent';

// 图标组件
const PersonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  
  // 根据路由确定初始模式
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // 监听路由变化
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  // 密码强度检查
  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`！]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // 用户名验证
    if (!formData.username) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = '用户名长度必须在3-20个字符之间';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线';
    }

    // 注册时需要验证邮箱
    if (!isLogin) {
      if (!formData.email) {
        newErrors.email = '邮箱不能为空';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '请输入有效的邮箱地址';
      }
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (!isLogin) {
      const { score } = getPasswordStrength(formData.password);
      if (score < 5) {
        newErrors.password = '密码必须包含大小写字母、数字和特殊字符';
      }
    }

    // 注册时需要确认密码
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '请确认密码';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次输入的密码不一致';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      let result;
      if (isLogin) {
        result = await login(formData.username, formData.password);
      } else {
        result = await register(formData.username, formData.password, formData.email);
      }
      
      if (result.success) {
        enqueueSnackbar(result.message || (isLogin ? '登录成功' : '注册成功'), { 
          variant: 'success',
          autoHideDuration: 2000
        });
        
        if (!isLogin) {
          // 注册成功后切换到登录模式
          setIsLogin(true);
          navigate('/login', { replace: true });
          setFormData(prev => ({ ...prev, email: '', password: '', confirmPassword: '' }));
        }
      } else {
        enqueueSnackbar(result.message || (isLogin ? '登录失败' : '注册失败'), { 
          variant: 'error',
          autoHideDuration: 3000
        });
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors.reduce((acc: any, err: any) => {
          acc[err.field] = err.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        enqueueSnackbar(error.message || (isLogin ? '登录失败' : '注册失败'), { 
          variant: 'error',
          autoHideDuration: 3000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // 清除对应字段的错误
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    navigate(newMode ? '/login' : '/register', { replace: true });
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const passwordStrength = !isLogin ? getPasswordStrength(formData.password) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <LogoComponent size="large" showText={true} color="#f97316" />
          </div>
        </div>

        {/* 主表单卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? '欢迎回来' : '创建账号'}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? '登录以继续使用 YouTube Planner' 
                : '加入 YouTube Planner 开始规划你的内容'
              }
            </p>
          </div>

          {/* 模式切换 */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            <button
              type="button"
              onClick={() => !isLogin && toggleMode()}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                isLogin 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => isLogin && toggleMode()}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                !isLogin 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              注册
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名 */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <PersonIcon />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="用户名"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors.username ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <XIcon />
                  <span className="ml-1">{errors.username}</span>
                </p>
              )}
            </div>

            {/* 邮箱（仅注册时显示） */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EmailIcon />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="电子邮箱"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <XIcon />
                    <span className="ml-1">{errors.email}</span>
                  </p>
                )}
              </div>
            )}

            {/* 密码 */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="密码"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <XIcon />
                  <span className="ml-1">{errors.password}</span>
                </p>
              )}
              
              {/* 密码强度指示器（仅注册时显示） */}
              {!isLogin && formData.password && passwordStrength && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.score < 3 ? 'bg-red-500' :
                          passwordStrength.score < 5 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score < 3 ? 'text-red-500' :
                      passwordStrength.score < 5 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {passwordStrength.score < 3 ? '弱' :
                       passwordStrength.score < 5 ? '中' : '强'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries({
                      length: '8个字符以上',
                      lowercase: '小写字母',
                      uppercase: '大写字母',
                      number: '数字',
                      special: '特殊字符'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-1">
                        {passwordStrength.checks[key as keyof typeof passwordStrength.checks] ? (
                          <CheckIcon />
                        ) : (
                          <XIcon />
                        )}
                        <span className={
                          passwordStrength.checks[key as keyof typeof passwordStrength.checks] 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 确认密码（仅注册时显示） */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="确认密码"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <XIcon />
                    <span className="ml-1">{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-4 rounded-2xl font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {isLogin ? '登录中...' : '注册中...'}
                </div>
              ) : (
                isLogin ? '登录' : '注册'
              )}
            </button>
          </form>

          {/* 底部链接 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>

          {/* 返回首页 */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              ← 返回首页
            </button>
          </div>
        </div>

        {/* 底部特性展示 */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-gray-600">
            <div className="text-lg font-semibold text-gray-900">1,000+</div>
            <div className="text-sm">思维导图</div>
          </div>
          <div className="text-gray-600">
            <div className="text-lg font-semibold text-gray-900">5,000+</div>
            <div className="text-sm">管理脚本</div>
          </div>
          <div className="text-gray-600">
            <div className="text-lg font-semibold text-gray-900">500+</div>
            <div className="text-sm">活跃用户</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 
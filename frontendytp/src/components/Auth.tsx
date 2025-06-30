import React, { useState, useEffect, startTransition } from 'react';
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

// 新增图标组件
const PlayIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
          startTransition(() => {
            navigate('/login', { replace: true });
          });
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
    startTransition(() => {
      navigate(newMode ? '/login' : '/register', { replace: true });
    });
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleHomeNavigation = () => {
    startTransition(() => {
      navigate('/');
    });
  };

  const passwordStrength = !isLogin ? getPasswordStrength(formData.password) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* 左侧品牌展示区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-600 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
                     {/* Logo */}
           <div className="mb-8 cursor-pointer" onClick={handleHomeNavigation}>
             <LogoComponent size="large" showText={true} color="white" />
           </div>
          
          {/* 主标题 */}
          <h1 className="text-4xl font-bold text-center mb-6">
            专业的 YouTube 内容管理平台
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl text-center mb-12 text-white/90 max-w-md">
            从创意到发布，一站式管理您的YouTube频道内容
          </p>
          
          {/* 特性列表 */}
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <BrainIcon />
              </div>
              <div>
                <h3 className="font-semibold">思维导图规划</h3>
                <p className="text-sm text-white/80">可视化内容规划，激发创作灵感</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <PlayIcon />
              </div>
              <div>
                <h3 className="font-semibold">脚本编辑器</h3>
                <p className="text-sm text-white/80">专业的脚本编辑和管理工具</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <UsersIcon />
              </div>
              <div>
                <h3 className="font-semibold">频道管理</h3>
                <p className="text-sm text-white/80">多频道统一管理，提升效率</p>
              </div>
            </div>
          </div>
          
          {/* 统计数据 */}
          <div className="flex space-x-8 mt-12 text-center">
            <div>
              <div className="text-2xl font-bold">1,000+</div>
              <div className="text-sm text-white/80">思维导图</div>
            </div>
            <div>
              <div className="text-2xl font-bold">5,000+</div>
              <div className="text-sm text-white/80">管理脚本</div>
            </div>
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/80">活跃用户</div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧表单区域 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* 移动端 Logo */}
                     <div className="lg:hidden text-center mb-8">
             <div 
               className="inline-flex items-center cursor-pointer hover:opacity-80 transition-opacity"
               onClick={handleHomeNavigation}
             >
               <LogoComponent size="large" showText={true} color="#f97316" />
             </div>
           </div>

          {/* 表单卡片 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* 标题区域 */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? '欢迎回来' : '创建账号'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isLogin 
                  ? '登录以继续使用 YouTube Planner' 
                  : '加入 YouTube Planner 开始规划你的内容'
                }
              </p>
            </div>

            {/* 模式切换 */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => !isLogin && toggleMode()}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
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
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  !isLogin 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                注册
              </button>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 用户名 */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PersonIcon />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="用户名"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                      errors.username ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <XIcon />
                    <span className="ml-1">{errors.username}</span>
                  </p>
                )}
              </div>

              {/* 邮箱（仅注册时显示） */}
              {!isLogin && (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EmailIcon />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="电子邮箱"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <XIcon />
                      <span className="ml-1">{errors.email}</span>
                    </p>
                  )}
                </div>
              )}

              {/* 密码 */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="密码"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <XIcon />
                    <span className="ml-1">{errors.password}</span>
                  </p>
                )}
                
                {/* 密码强度指示器（仅注册时显示） */}
                {!isLogin && formData.password && passwordStrength && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all ${
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
                    <div className="grid grid-cols-2 gap-1 text-xs">
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="确认密码"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
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
                className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    {isLogin ? '登录中...' : '注册中...'}
                  </div>
                ) : (
                  isLogin ? '登录' : '注册'
                )}
              </button>
            </form>

            {/* 底部链接 */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-xs">
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
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleHomeNavigation}
                className="text-gray-500 hover:text-gray-700 text-xs transition-colors"
              >
                ← 返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 
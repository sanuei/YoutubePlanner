import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoComponent from './LogoComponent';

// 图标组件
const BrainIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const AIIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TeleprompterIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const safeNavigate = (path: string) => {
    navigate(path);
  };

  // 核心功能数据
  const coreFeatures = [
    {
      icon: <AIIcon />,
      title: 'AI智能创作',
      description: '集成OpenAI、Claude等多种AI服务，支持三种生成模式，流式实时输出',
      color: 'bg-blue-500',
      features: ['多AI服务支持', '三种生成模式', '流式实时输出', '智能内容解析']
    },
    {
      icon: <BrainIcon />,
      title: '思维导图编辑',
      description: 'React Flow专业图形编辑引擎，拖拽式节点编辑，支持无限层级',
      color: 'bg-purple-500',
      features: ['React Flow引擎', '拖拽式编辑', '自动布局算法', '历史版本管理']
    },
    {
      icon: <TeleprompterIcon />,
      title: '智能提词器',
      description: '专业视频录制提词器，自动滚动，字体大小可调，提升录制效率',
      color: 'bg-orange-500',
      features: ['自动滚动提词器', '字体大小调节', '全屏录制模式', '一键开始暂停']
    },
    {
      icon: <EditIcon />,
      title: '专业脚本管理',
      description: 'Notion风格编辑器界面，多章节管理自动编号，10秒防抖自动保存',
      color: 'bg-green-500',
      features: ['Notion风格界面', '多章节管理', '状态跟踪', '高级筛选搜索']
    },
   
  ];

  // 详细功能介绍
  const detailedFeatures = [
    {
      title: 'AI智能文案生成',
      description: '强大的AI创作助手，支持多种AI服务和生成模式',
      image: '/app-screenshot/FireShot Capture 010 - YouTube Planner - 专业的YouTube内容管理平台 - 频道管理 - 脚本编辑 - 发布规划 - [localhost].png',
      features: [
        '支持OpenAI、Claude等多种AI服务',
        '三种生成模式：简化/标准/专业',
        '流式输出，实时显示生成过程',
        '智能解析，自动提取标题和章节',
        'API配置管理，支持自定义密钥'
      ]
    },
    {
      title: '思维导图编辑器',
      description: '专业的可视化编辑器，让创意构思更加直观',
      image: '/app-screenshot/FireShot Capture 002 - YouTube Planner - 专业的YouTube内容管理平台 - 频道管理 - 脚本编辑 - 发布规划 - [localhost].png',
      features: [
        'React Flow可视化编辑器',
        '拖拽式节点编辑，支持无限层级',
        '自动布局算法（水平/垂直）',
        '实时编辑，Enter保存，ESC取消',
        '思维导图历史版本管理'
      ]
    },
    {
      title: '智能提词器',
      description: '专业的视频录制提词器，让内容表达更流畅自然',
      image: '/app-screenshot/FireShot Capture 012 - YouTube Planner - 专业的YouTube内容管理平台 - 频道管理 - 脚本编辑 - 发布规划 - [localhost].png',
      features: [
        '自动滚动提词器，可调节滚动速度',
        '字体大小自由调节，适应不同场景',
        '全屏模式，专注录制体验',
        '一键开始/暂停，操作简单直观',
        '完美适配脚本章节结构'
      ]
    },
    {
      title: '脚本管理系统',
      description: 'Notion风格的专业脚本管理，让内容创作更高效',
      image: '/app-screenshot/FireShot Capture 001 - YouTube Planner - 专业的YouTube内容管理平台 - 频道管理 - 脚本编辑 - 发布规划 - [localhost].png',
      features: [
        'Notion风格编辑器界面',
        '多章节管理，自动编号',
        '难度等级设置（1-5级）',
        '状态跟踪（草稿、编写中、审核、完成）',
        '实时保存（10秒防抖）'
      ]
    }
  ];

  // 技术亮点
  const techHighlights = [
    {
      category: '技术创新',
      items: [
        'AI智能创作：集成多种AI服务，支持流式文案生成',
        '可视化编辑：React Flow思维导图编辑器',
        '智能提词器：自动滚动提词器，支持全屏录制模式',
        '现代技术栈：React 18 + Spring Boot 3 + PostgreSQL 15'
      ]
    },
    {
      category: '工程实践',
      items: [
        '自动化部署：GitHub Actions + Docker容器化',
        '安全设计：HTTPS + JWT + 权限控制',
        '性能优化：分页查询 + 前端优化',
        '代码质量：TypeScript + 统一规范'
      ]
    },
    {
      category: '用户体验',
      items: [
        '响应式设计：桌面端和移动端适配',
        '实时反馈：流式输出 + 自动保存',
        '直观操作：拖拽编辑 + 快捷键支持',
        '完整工作流：从构思到录制的无缝体验'
      ]
    }
  ];

  // 统计数据
  const stats = [
    { number: '1,000+', label: '思维导图' },
    { number: '5,000+', label: '管理脚本' },
    { number: '500+', label: '活跃用户' },
    { number: '99.9%', label: '正常运行时间' },
  ];

  // 用户评价
  const testimonials = [
    {
      name: '张小明',
      role: 'YouTube 科技频道主',
      avatar: 'ZM',
      rating: 5,
      comment: 'AI智能创作系统太强大了！支持多种AI服务，从思维导图构思到脚本生成，整个创作流程变得非常高效。',
    },
    {
      name: '李美丽',
      role: '教育内容创作者',
      avatar: 'LM',
      rating: 5,
      comment: '智能提词器功能简直是录制神器！自动滚动和字体调节让我录制视频时再也不用担心忘词，表达更流畅自然。',
    },
    {
      name: '王大力',
      role: '生活方式博主',
      avatar: 'WD',
      rating: 5,
      comment: 'React Flow思维导图编辑器用起来很舒服，拖拽式操作很直观。从构思到脚本再到提词器录制，整个工作流程无缝衔接。',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => safeNavigate('/')}>
              <LogoComponent size="medium" showText={true} color="#f97316" />
            </div>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                产品介绍
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                功能特色
              </button>
              <a
                href="https://github.com/sanuei/YoutubePlanner"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                开源项目
              </a>
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                帮助文档
              </button>
            </div>

            {/* 右侧按钮 */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <button
                  onClick={() => safeNavigate('/scripts')}
                  className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  进入应用 →
                </button>
              ) : (
                <button
                  onClick={() => safeNavigate('/register')}
                  className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  免费试用 →
                </button>
              )}
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium"
              >
                产品介绍
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium"
              >
                功能特色
              </button>
              <a
                href="https://github.com/sanuei/YoutubePlanner"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-gray-900 font-medium"
              >
                开源项目
              </a>
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <button
                    onClick={() => safeNavigate('/scripts')}
                    className="w-full bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  >
                    进入应用 →
                  </button>
                ) : (
                                      <button
                      onClick={() => safeNavigate('/register')}
                      className="w-full bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                      免费试用 →
                    </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 主要内容区域 */}
      <main>
        {/* Hero Section */}
        <section id="about" className="pt-24 pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 评分展示 */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
                <span className="text-sm text-gray-600">用户评分</span>
                <span className="font-semibold text-gray-900">GitHub</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(0+)</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* 左侧内容 */}
              <div className={`space-y-8 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    您的智能AI
                    <br />
                    助手，适用于
                    <br />
                    <span className="text-primary-500">每个创作任务</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    集成AI文案生成、思维导图编辑、脚本管理等功能，
                    帮助YouTube创作者高效创作，节省时间。
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {user ? (
                    <button
                      onClick={() => safeNavigate('/scripts')}
                      className="bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-all"
                    >
                      进入应用
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => safeNavigate('/register')}
                        className="bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-all"
                      >
                        立即开始
                      </button>
                      <button
                        onClick={() => window.open('https://youtubeplanner.duckdns.org/', '_blank')}
                        className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-gray-400 transition-all"
                      >
                        在线演示
                      </button>
                    </>
                  )}
                </div>

                {/* 数据统计展示 */}
                <div className="pt-8">
                  <p className="text-sm text-gray-500 mb-4">已被众多创作者信赖</p>
                  <p className="text-xs text-gray-400 mb-6">全平台覆盖支持</p>
                  <div className="grid grid-cols-4 gap-6 items-center opacity-60">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-semibold text-gray-600">{stat.number}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 右侧产品界面 */}
              <div className={`relative ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <div className="relative bg-gray-50 rounded-2xl p-6">
                  <img
                    src="/app-screenshot/FireShot Capture 001 - YouTube Planner - 专业的YouTube内容管理平台 - 频道管理 - 脚本编辑 - 发布规划 - [localhost].png"
                    alt="YouTube Planner 应用界面"
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能介绍区 */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide mb-4">
                什么是 YouTube Planner？
              </h2>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                YouTube Planner 是一个AI驱动的智能内容创作管理系统，
                通过智能 🧠 自动化、数据驱动洞察和无缝的
                创作流程，提升营销策略 🤝。
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 详细功能介绍区 */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                深入了解核心功能
              </h2>
              <p className="text-xl text-gray-600">
                每个功能都经过精心设计，为您的创作流程提供最佳体验
              </p>
            </div>

            <div className="space-y-20">
              {detailedFeatures.map((feature, index) => (
                <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* 功能描述 */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-xl text-gray-600 leading-relaxed mb-6">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 功能截图 */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="relative bg-gray-100 rounded-2xl p-4 shadow-lg">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 技术亮点区 */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                项目亮点
              </h2>
              <p className="text-xl text-gray-600">
                现代化技术栈 + 企业级工程实践 + 卓越用户体验
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {techHighlights.map((highlight, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    {highlight.category}
                  </h3>
                  <div className="space-y-4">
                    {highlight.items.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

       

        {/* 功能演示流程 */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                功能演示流程
              </h2>
              <p className="text-xl text-gray-600">
                从创意构思到内容发布的完整工作流程
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* AI文案生成流程 */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                  <AIIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  AI文案生成流程
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <span className="text-gray-700 text-sm">在思维导图中构建内容结构</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">2</span>
                    </div>
                    <span className="text-gray-700 text-sm">选择AI生成模式（简化/标准/专业）</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">3</span>
                    </div>
                    <span className="text-gray-700 text-sm">配置API密钥（OpenAI/Claude）</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">4</span>
                    </div>
                    <span className="text-gray-700 text-sm">点击"AI生成文案"按钮</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">5</span>
                    </div>
                    <span className="text-gray-700 text-sm">实时查看流式生成过程</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">6</span>
                    </div>
                    <span className="text-gray-700 text-sm">保存为脚本继续编辑</span>
                  </div>
                </div>
              </div>

              {/* 思维导图编辑流程 */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                  <BrainIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  思维导图编辑
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-xs font-bold">1</span>
                    </div>
                    <span className="text-gray-700 text-sm">创建新的思维导图</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-xs font-bold">2</span>
                    </div>
                    <span className="text-gray-700 text-sm">点击节点进行编辑</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-xs font-bold">3</span>
                    </div>
                    <span className="text-gray-700 text-sm">使用绿色+按钮添加子节点</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-xs font-bold">4</span>
                    </div>
                    <span className="text-gray-700 text-sm">拖拽节点调整位置</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-xs font-bold">5</span>
                    </div>
                    <span className="text-gray-700 text-sm">使用自动布局优化结构</span>
                  </div>
                </div>
              </div>

              {/* 智能提词器流程 */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                  <TeleprompterIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  智能提词器
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 text-xs font-bold">1</span>
                    </div>
                    <span className="text-gray-700 text-sm">打开脚本预览页面</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 text-xs font-bold">2</span>
                    </div>
                    <span className="text-gray-700 text-sm">点击"提词器模式"按钮</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 text-xs font-bold">3</span>
                    </div>
                    <span className="text-gray-700 text-sm">调节滚动速度和字体大小</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 text-xs font-bold">4</span>
                    </div>
                    <span className="text-gray-700 text-sm">点击"开始"按钮自动滚动</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 text-xs font-bold">5</span>
                    </div>
                    <span className="text-gray-700 text-sm">专注录制，提升表达效率</span>
                  </div>
                </div>
              </div>

              {/* 管理员功能 */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                  <SecurityIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  管理员功能
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">1</span>
                    </div>
                    <span className="text-gray-700 text-sm">使用管理员账户登录</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">2</span>
                    </div>
                    <span className="text-gray-700 text-sm">访问"用户管理"页面</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">3</span>
                    </div>
                    <span className="text-gray-700 text-sm">查看所有用户列表</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">4</span>
                    </div>
                    <span className="text-gray-700 text-sm">编辑用户信息和角色</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">5</span>
                    </div>
                    <span className="text-gray-700 text-sm">管理用户权限</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 客户评价区 */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                听听我们的
                <br />
                <span className="text-primary-500">满意用户</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-2xl p-8"
                >
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 技术栈展示 */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                现代化技术栈
              </h2>
              <p className="text-xl text-gray-600">
                基于企业级技术架构，确保系统稳定性和扩展性
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 前端技术栈 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  前端技术栈
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>React 18</strong> - 现代化前端框架</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>TypeScript 4.9</strong> - 类型安全</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Material-UI 5.x</strong> - UI组件库</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>React Flow 11.x</strong> - 思维导图编辑器</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Framer Motion</strong> - 动画效果</span>
                  </div>
                </div>
              </div>

              {/* 后端技术栈 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  后端技术栈
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Spring Boot 3.2.3</strong> - Java框架</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Java 17</strong> - 现代Java版本</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Spring Security</strong> - 安全认证</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                    <span className="text-gray-700"><strong>PostgreSQL 15</strong> - 关系型数据库</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>MyBatis</strong> - SQL映射框架</span>
                  </div>
                </div>
              </div>

              {/* 部署和运维 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  部署和运维
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-700"><strong>Docker</strong> - 容器化部署</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>AWS EC2</strong> - 云服务器</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Nginx</strong> - 反向代理</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                    <span className="text-gray-700"><strong>GitHub Actions</strong> - CI/CD</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                    <span className="text-gray-700"><strong>Let's Encrypt</strong> - SSL证书</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 安全特性 */}
            <div className="mt-16 bg-gray-900 rounded-3xl p-8 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">🔒 安全特性</h3>
                <p className="text-gray-300">企业级安全保障，保护您的数据安全</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <SecurityIcon />
                  </div>
                  <h4 className="font-semibold mb-2">JWT身份验证</h4>
                  <p className="text-gray-400 text-sm">无状态安全认证 + 自动刷新</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <SecurityIcon />
                  </div>
                  <h4 className="font-semibold mb-2">RBAC权限控制</h4>
                  <p className="text-gray-400 text-sm">基于角色的访问控制</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <SecurityIcon />
                  </div>
                  <h4 className="font-semibold mb-2">HTTPS加密</h4>
                  <p className="text-gray-400 text-sm">全站SSL加密传输</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <SecurityIcon />
                  </div>
                  <h4 className="font-semibold mb-2">数据保护</h4>
                  <p className="text-gray-400 text-sm">SQL注入防护 + XSS防护</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 区域 */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              准备好开始了吗？
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              体验AI驱动的智能创作，让YouTube内容创作变得更简单高效
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <button
                  onClick={() => safeNavigate('/scripts')}
                  className="bg-primary-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-600 transition-all"
                >
                  进入应用
                </button>
              ) : (
                <>
                  <button
                    onClick={() => safeNavigate('/register')}
                    className="bg-primary-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-600 transition-all"
                  >
                    免费注册
                  </button>
                  <button
                    onClick={() => safeNavigate('/login')}
                    className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-gray-400 transition-all"
                  >
                    立即登录
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo 和描述 */}
            <div className="col-span-2">
              <div className="mb-6">
                <LogoComponent size="medium" showText={true} color="white" />
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                YouTube智能内容创作管理系统，集成AI文案生成、思维导图编辑、管理员系统等先进功能。
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/sanuei/YoutubePlanner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.youtube.com/@sonicyann"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/sonic_yann/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* 产品链接 */}
            <div>
              <h3 className="font-medium mb-4">产品</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="block text-gray-400 hover:text-white transition-colors text-left"
                >
                  功能特色
                </button>
                <a
                  href="https://youtubeplanner.duckdns.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  在线演示
                </a>
                <a
                  href="https://github.com/sanuei/YoutubePlanner/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  更新日志
                </a>
                <a
                  href="https://github.com/sanuei/YoutubePlanner/blob/main/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  API文档
                </a>
              </div>
            </div>

            {/* 开发者 */}
            <div>
              <h3 className="font-medium mb-4">开发者</h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/sanuei/YoutubePlanner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  源代码
                </a>
                <a
                  href="https://github.com/sanuei/YoutubePlanner/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  部署指南
                </a>
                <a
                  href="https://github.com/sanuei/YoutubePlanner/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  问题反馈
                </a>
                <a
                  href="https://github.com/sanuei/YoutubePlanner/pulls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  贡献代码
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 YouTube Planner. sonic_yann保留所有权利。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
import React, { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoComponent from './LogoComponent';

const Changelog: React.FC = () => {
  const navigate = useNavigate();

  console.log('Changelog component loaded'); // 添加调试信息

  const safeNavigate = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const releases = [
    {
      version: 'v2.1.0',
      date: '2025-01-15',
      type: 'feature',
      title: '外键约束修复 & 用户删除优化',
      changes: [
        {
          type: 'fix',
          description: '修复删除用户时的外键约束问题，确保数据完整性'
        },
        {
          type: 'improvement',
          description: '优化用户删除流程，支持级联删除相关数据'
        },
        {
          type: 'improvement',
          description: '添加原生SQL删除方法，提升删除操作性能'
        },
        {
          type: 'fix',
          description: '修复React Suspense错误，优化页面导航体验'
        }
      ]
    },
    {
      version: 'v2.0.0',
      date: '2025-01-10',
      type: 'major',
      title: '前端重构 & 组件优化',
      changes: [
        {
          type: 'feature',
          description: '合并Login和Register组件到Auth组件，简化认证流程'
        },
        {
          type: 'improvement',
          description: '优化App组件的路由结构，提升导航性能'
        },
        {
          type: 'improvement',
          description: '改进HomePage组件的导航逻辑，增强用户体验'
        },
        {
          type: 'improvement',
          description: '优化ScriptEdit和ScriptPreview组件，提升编辑体验'
        },
        {
          type: 'removal',
          description: '删除冗余的Login和Register组件，减少代码冗余'
        }
      ]
    },
    {
      version: 'v1.9.0',
      date: '2024-12-25',
      type: 'feature',
      title: '思维导图编辑器重大更新',
      changes: [
        {
          type: 'feature',
          description: '集成React Flow 11.x，提供专业级思维导图编辑体验'
        },
        {
          type: 'feature',
          description: '支持拖拽式节点编辑，无限层级扩展'
        },
        {
          type: 'feature',
          description: '添加自动布局算法（水平/垂直布局）'
        },
        {
          type: 'feature',
          description: '实现思维导图历史版本管理'
        },
        {
          type: 'improvement',
          description: '优化节点编辑交互：Enter保存，ESC取消'
        }
      ]
    },
    {
      version: 'v1.8.0',
      date: '2024-12-15',
      type: 'feature',
      title: '智能提词器功能上线',
      changes: [
        {
          type: 'feature',
          description: '全新智能提词器，支持自动滚动和速度调节'
        },
        {
          type: 'feature',
          description: '字体大小自由调节，适应不同录制场景'
        },
        {
          type: 'feature',
          description: '全屏录制模式，专注内容表达'
        },
        {
          type: 'feature',
          description: '一键开始/暂停，操作简单直观'
        },
        {
          type: 'improvement',
          description: '完美适配脚本章节结构，提升录制效率'
        }
      ]
    },
    {
      version: 'v1.7.0',
      date: '2024-12-01',
      type: 'feature',
      title: 'AI智能创作系统升级',
      changes: [
        {
          type: 'feature',
          description: '支持OpenAI、Claude等多种AI服务'
        },
        {
          type: 'feature',
          description: '三种生成模式：简化/标准/专业'
        },
        {
          type: 'feature',
          description: '流式输出，实时显示生成过程'
        },
        {
          type: 'feature',
          description: '智能解析，自动提取标题和章节'
        },
        {
          type: 'improvement',
          description: 'API配置管理，支持自定义密钥'
        }
      ]
    },
    {
      version: 'v1.6.0',
      date: '2024-11-20',
      type: 'feature',
      title: '管理员系统完善',
      changes: [
        {
          type: 'feature',
          description: '完整的用户管理系统，支持用户增删改查'
        },
        {
          type: 'feature',
          description: 'RBAC权限控制，基于角色的访问管理'
        },
        {
          type: 'feature',
          description: '用户统计信息展示，数据可视化'
        },
        {
          type: 'security',
          description: 'JWT身份验证 + 自动刷新机制'
        },
        {
          type: 'improvement',
          description: '管理员界面优化，操作更直观'
        }
      ]
    },
    {
      version: 'v1.5.0',
      date: '2024-11-01',
      type: 'feature',
      title: '脚本管理系统优化',
      changes: [
        {
          type: 'feature',
          description: 'Notion风格编辑器界面，提升编辑体验'
        },
        {
          type: 'feature',
          description: '多章节管理，自动编号系统'
        },
        {
          type: 'feature',
          description: '难度等级设置（1-5级），内容分类管理'
        },
        {
          type: 'feature',
          description: '状态跟踪：草稿、编写中、审核、完成'
        },
        {
          type: 'improvement',
          description: '实时保存（10秒防抖），防止数据丢失'
        }
      ]
    },
    {
      version: 'v1.4.0',
      date: '2024-10-15',
      type: 'feature',
      title: '频道和分类管理',
      changes: [
        {
          type: 'feature',
          description: '频道管理系统，支持多频道内容管理'
        },
        {
          type: 'feature',
          description: '分类标签系统，内容分类更清晰'
        },
        {
          type: 'feature',
          description: '高级筛选和搜索功能'
        },
        {
          type: 'improvement',
          description: '响应式设计优化，移动端体验提升'
        }
      ]
    },
    {
      version: 'v1.3.0',
      date: '2024-10-01',
      type: 'feature',
      title: '安全性增强',
      changes: [
        {
          type: 'security',
          description: 'HTTPS全站加密，保护数据传输安全'
        },
        {
          type: 'security',
          description: 'SQL注入防护，增强数据库安全'
        },
        {
          type: 'security',
          description: 'XSS攻击防护，保护用户数据'
        },
        {
          type: 'improvement',
          description: '密码强度验证，提升账户安全'
        }
      ]
    },
    {
      version: 'v1.2.0',
      date: '2024-09-15',
      type: 'feature',
      title: '部署和运维优化',
      changes: [
        {
          type: 'feature',
          description: 'Docker容器化部署，简化部署流程'
        },
        {
          type: 'feature',
          description: 'GitHub Actions CI/CD，自动化部署'
        },
        {
          type: 'feature',
          description: 'AWS EC2云服务器部署'
        },
        {
          type: 'improvement',
          description: 'Nginx反向代理配置优化'
        },
        {
          type: 'improvement',
          description: 'Let\'s Encrypt SSL证书自动续期'
        }
      ]
    },
    {
      version: 'v1.1.0',
      date: '2024-09-01',
      type: 'feature',
      title: '技术栈升级',
      changes: [
        {
          type: 'improvement',
          description: '升级到React 18，提升性能和开发体验'
        },
        {
          type: 'improvement',
          description: '升级到Spring Boot 3.2.3，支持Java 17'
        },
        {
          type: 'improvement',
          description: '升级到PostgreSQL 15，提升数据库性能'
        },
        {
          type: 'feature',
          description: '集成TypeScript 4.9，提供类型安全'
        }
      ]
    },
    {
      version: 'v1.0.0',
      date: '2024-08-15',
      type: 'major',
      title: '首次发布',
      changes: [
        {
          type: 'feature',
          description: '基础脚本管理功能'
        },
        {
          type: 'feature',
          description: '用户认证和授权系统'
        },
        {
          type: 'feature',
          description: '基础的内容编辑器'
        },
        {
          type: 'feature',
          description: '响应式用户界面'
        }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-green-100 text-green-800';
      case 'improvement':
        return 'bg-blue-100 text-blue-800';
      case 'fix':
        return 'bg-yellow-100 text-yellow-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'removal':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return '✨';
      case 'improvement':
        return '🚀';
      case 'fix':
        return '🐛';
      case 'security':
        return '🔒';
      case 'removal':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const getReleaseTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-red-500';
      case 'feature':
        return 'bg-green-500';
      case 'fix':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => safeNavigate('/')}>
              <LogoComponent size="medium" showText={true} color="#f97316" />
            </div>

            {/* 导航按钮 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => safeNavigate('/')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                返回首页
              </button>
              <a
                href="https://github.com/sanuei/YoutubePlanner"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            更新日志
          </h1>
          <p className="text-xl text-gray-600">
            YouTube Planner 的版本更新记录和功能演进历程
          </p>
        </div>

        {/* 版本列表 */}
        <div className="space-y-8">
          {releases.map((release, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* 版本头部 */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getReleaseTypeColor(release.type)}`}></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {release.version}
                    </h2>
                    <span className="text-gray-500">{release.date}</span>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {release.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* 更新内容 */}
              <div className="p-6">
                <div className="space-y-4">
                  {release.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start space-x-3">
                      <span className="text-lg">{getTypeIcon(change.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(change.type)}`}>
                            {change.type}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {change.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              想要了解更多？
            </h3>
            <p className="text-gray-600 mb-6">
              查看我们的GitHub仓库获取最新的开发进展和技术文档
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/sanuei/YoutubePlanner"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                查看源代码
              </a>
              <a
                href="https://github.com/sanuei/YoutubePlanner/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors"
              >
                反馈问题
              </a>
              <button
                onClick={() => window.open('https://youtu.be/lBBRBwim64o?si=o2PrudATqwxpgONF', '_blank')}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a2.998 2.998 0 0 0-2.11-2.11C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.388.53A2.998 2.998 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.998 2.998 0 0 0 2.11 2.11c1.883.53 9.388.53 9.388.53s7.505 0 9.388-.53a2.998 2.998 0 0 0 2.11-2.11C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>功能演示</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Changelog; 
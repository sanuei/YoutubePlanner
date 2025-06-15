"use client"

import { motion } from "framer-motion"
import { 
  Calendar, 
  FileText, 
  BarChart3, 
  Users, 
  Zap, 
  Shield,
  Smartphone,
  Globe,
  Clock
} from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "智能内容规划",
    description: "AI 驱动的内容日历，帮助您规划和安排视频发布时间，优化观众参与度。",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: FileText,
    title: "脚本管理系统",
    description: "强大的脚本编辑器，支持协作编辑、版本控制和模板库，提升创作效率。",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: BarChart3,
    title: "数据分析洞察",
    description: "深度分析视频表现，提供可操作的洞察，帮助您优化内容策略。",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Users,
    title: "团队协作",
    description: "无缝的团队协作功能，支持角色管理、任务分配和实时沟通。",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Zap,
    title: "自动化工作流",
    description: "自动化重复性任务，从内容创建到发布，节省宝贵时间。",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "安全可靠",
    description: "企业级安全保护，确保您的内容和数据始终安全可靠。",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Smartphone,
    title: "移动优先",
    description: "完美适配移动设备，随时随地管理您的 YouTube 频道。",
    color: "from-teal-500 to-blue-500"
  },
  {
    icon: Globe,
    title: "多语言支持",
    description: "支持多种语言和地区，帮助您触达全球观众。",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Clock,
    title: "实时同步",
    description: "云端实时同步，确保您的团队始终保持同步。",
    color: "from-cyan-500 to-teal-500"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* 标题部分 */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            强大功能，
            <span className="text-gradient">助力创作</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            从内容规划到数据分析，YouTube Planner 提供全方位的创作者工具，
            让您专注于创造优质内容，其他的交给我们。
          </motion.p>
        </motion.div>

        {/* 功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* 背景装饰 */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-full -translate-y-16 translate-x-16`} />
                
                {/* 图标 */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* 内容 */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* 悬停效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部 CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            探索所有功能
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 
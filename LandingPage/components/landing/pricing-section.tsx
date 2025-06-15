"use client"

import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Check, Star, Zap } from "lucide-react"

const plans = [
  {
    name: "免费版",
    price: "¥0",
    period: "/月",
    description: "适合个人创作者开始使用",
    features: [
      "最多 3 个视频项目",
      "基础脚本编辑器",
      "简单数据分析",
      "社区支持",
      "基础模板库"
    ],
    buttonText: "免费开始",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "专业版",
    price: "¥99",
    period: "/月",
    description: "适合专业创作者和小团队",
    features: [
      "无限视频项目",
      "高级脚本编辑器",
      "深度数据分析",
      "团队协作功能",
      "优先客服支持",
      "高级模板库",
      "自动化工作流",
      "品牌定制"
    ],
    buttonText: "立即升级",
    buttonVariant: "gradient" as const,
    popular: true
  },
  {
    name: "企业版",
    price: "¥299",
    period: "/月",
    description: "适合大型团队和企业",
    features: [
      "专业版所有功能",
      "无限团队成员",
      "企业级安全",
      "专属客户经理",
      "定制集成",
      "高级分析报告",
      "白标解决方案",
      "SLA 保障"
    ],
    buttonText: "联系销售",
    buttonVariant: "youtube" as const,
    popular: false
  }
]

export function PricingSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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
            选择适合您的
            <span className="text-gradient">价格方案</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            从免费开始，随着您的频道成长而升级。
            所有方案都包含 30 天免费试用，随时可以取消。
          </motion.p>
        </motion.div>

        {/* 价格卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative group ${plan.popular ? 'md:-mt-8' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* 热门标签 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    最受欢迎
                  </div>
                </div>
              )}

              <div className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                plan.popular 
                  ? 'border-gradient-to-r from-orange-500 to-red-500 shadow-orange-100' 
                  : 'border-gray-100 hover:border-gray-200'
              } overflow-hidden ${plan.popular ? 'scale-105' : ''}`}>
                
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16" />
                
                {/* 方案名称 */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* 价格 */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-500 ml-2">{plan.period}</span>
                  </div>
                </div>

                {/* 功能列表 */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={feature}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (index * 0.2) + (featureIndex * 0.1) }}
                        viewport={{ once: true }}
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* 按钮 */}
                <Button 
                  variant={plan.buttonVariant}
                  size="lg"
                  className="w-full group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {plan.buttonText}
                    {plan.popular && <Zap className="w-4 h-4" />}
                  </span>
                </Button>

                {/* 悬停效果 */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部信息 */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              还有疑问？我们来帮您选择
            </h3>
            <p className="text-gray-600 mb-6">
              不确定哪个方案最适合您？我们的专家团队随时为您提供个性化建议。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                预约咨询
              </Button>
              <Button variant="ghost" size="lg">
                查看功能对比
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
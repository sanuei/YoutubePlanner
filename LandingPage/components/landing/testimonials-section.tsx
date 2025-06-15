"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "李明",
    role: "科技频道创作者",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "YouTube Planner 彻底改变了我的内容创作流程。从脚本规划到数据分析，一切都变得如此简单高效。我的频道订阅量在使用后的三个月内增长了 200%！",
    rating: 5,
    subscribers: "50万订阅"
  },
  {
    name: "王小雨",
    role: "美食频道博主",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    content: "作为一个美食博主，我需要管理大量的视频内容和食谱。这个平台的模板库和协作功能让我的团队工作效率提升了至少 3 倍。强烈推荐！",
    rating: 5,
    subscribers: "120万订阅"
  },
  {
    name: "张教授",
    role: "教育频道运营者",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "我运营着一个教育频道，需要制作大量的课程内容。YouTube Planner 的智能规划功能帮我合理安排发布时间，学生的参与度明显提高了。",
    rating: 5,
    subscribers: "80万订阅"
  },
  {
    name: "陈小姐",
    role: "生活方式博主",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "界面设计非常美观，功能也很实用。特别是数据分析功能，让我能够清楚地了解观众喜好，调整内容策略。现在我的视频平均观看时长提升了 40%。",
    rating: 5,
    subscribers: "30万订阅"
  },
  {
    name: "刘先生",
    role: "游戏频道主播",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "作为游戏主播，我需要快速响应热门游戏趋势。这个平台的自动化工作流让我能够更快地制作和发布内容，抓住每一个热点机会。",
    rating: 5,
    subscribers: "200万订阅"
  },
  {
    name: "赵女士",
    role: "亲子频道创作者",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    content: "团队协作功能太棒了！我和我的编辑团队可以实时协作，大大提高了视频制作效率。现在我们每周可以发布更多高质量的亲子内容。",
    rating: 5,
    subscribers: "90万订阅"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
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
            创作者们的
            <span className="text-gradient">真实反馈</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            来自全球数万名创作者的真实使用体验，
            看看他们如何通过 YouTube Planner 实现频道增长。
          </motion.p>
        </motion.div>

        {/* 评价网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full">
                {/* 引用图标 */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-12 h-12 text-gray-400" />
                </div>

                {/* 评分 */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* 评价内容 */}
                <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                  "{testimonial.content}"
                </p>

                {/* 用户信息 */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600 font-semibold">{testimonial.subscribers}</p>
                  </div>
                </div>

                {/* 悬停效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 统计数据 */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">4.9/5</div>
                <div className="text-gray-600">平均评分</div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                <div className="text-gray-600">活跃用户</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-600">用户满意度</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
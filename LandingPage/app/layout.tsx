import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YouTube Planner - 现代化的 YouTube 内容管理系统',
  description: '帮助创作者高效管理频道内容和视频脚本的现代化工具',
  keywords: 'YouTube, 内容管理, 视频脚本, 创作者工具',
  authors: [{ name: 'YouTube Planner Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 
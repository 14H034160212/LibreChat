#!/bin/bash

# LibreChat 重启脚本 - 包含新的表格提取功能
# 此脚本将重新编译前端以显示新添加的功能

echo "🔄 正在重启 LibreChat 以启用表格提取功能..."

# 进入项目目录
cd /mnt/LibreChat_new

# 停止现有服务
echo "⏹️  停止现有服务..."
pkill -f "npm.*dev" || true
pkill -f "vite" || true
pkill -f "node.*LibreChat" || true

# 等待进程完全停止
sleep 3

echo "📦 清理缓存..."
# 清理前端缓存
rm -rf client/dist
rm -rf client/.vite
rm -rf client/node_modules/.vite

echo "🔨 重新构建前端（这可能需要几分钟）..."
# 方式 1: 如果您使用 npm
npm run frontend

# 或者，如果上面的命令不起作用，使用这个：
# cd client && npm run build && cd ..

echo "✅ 前端构建完成！"

echo "🚀 启动服务..."
# 启动后端和前端
npm run dev

echo ""
echo "=========================================="
echo "✨ LibreChat 已重启！"
echo "=========================================="
echo ""
echo "📊 新功能使用方法："
echo "1. 在浏览器中打开 http://localhost:3080"
echo "2. 上传一个 PDF 或 Word 文档"
echo "3. 在上传的文件消息下方会看到 [📊 提取文档图表] 按钮"
echo "4. 点击按钮，等待 AI 分析"
echo "5. 分析完成后会显示 [下载 Excel] [下载 PDF] [预览图表] 按钮"
echo ""
echo "📖 详细文档请查看："
echo "   - CONTRACT_TABLE_EXTRACTION_GUIDE.md (中文完整指南)"
echo "   - QUICK_START_TABLE_EXTRACTION.md (快速开始)"
echo ""

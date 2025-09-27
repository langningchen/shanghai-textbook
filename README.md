# 上海教材项目 — 爬虫仓库

本项目用于自动化爬取上海教材内容，协同数据仓库和服务端展示实现教材数字化。你可以访问示例网站：[textbook.langningchen.com](https://textbook.langningchen.com)。

## 项目相关仓库

- **爬虫仓库（当前仓库）:** [langningchen/shanghai-textbook](https://github.com/langningchen/shanghai-textbook)
- **数据仓库:** [langningchen/shanghai-textbook-data](https://github.com/langningchen/shanghai-textbook-data)
- **服务端仓库:** [langningchen/shanghai-textbook-server](https://github.com/langningchen/shanghai-textbook-server)

## 功能介绍

- 自动化爬取上海教材官方或指定来源的内容
- 数据清洗与结构化处理
- 支持多个学科和教材格式
- 爬取结果自动同步至数据仓库

## 快速开始

1. 克隆仓库：
   ```bash
   git clone https://github.com/langningchen/shanghai-textbook.git
   cd shanghai-textbook
   ```
2. 安装依赖：
   ```bash
   npm install
   # 或
   pnpm install
   ```
3. 配置爬虫参数，运行爬虫脚本：
   ```bash
   npm start
   # 或
   pnpm start
   ```
4. 爬取的数据将自动推送至数据仓库。

## 许可证

本项目采用 [GNU Affero 通用公共许可证 v3.0](https://github.com/langningchen/shanghai-textbook/blob/main/LICENSE) 授权。

## 已知问题

请参见 [GitHub Issues](https://github.com/langningchen/shanghai-textbook/issues)。

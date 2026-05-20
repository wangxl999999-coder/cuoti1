# 中小学生错题记录小程序

一款专为中小学生设计的智能错题管理工具，贴合学习场景，助力高效复习。

## ✨ 功能特性

### 📝 错题录入
- **拍照录入**：拍摄试卷、作业中的错题
- **文字录入**：手动输入题目内容和解答
- **语音录入**：语音输入，解放双手

### 📚 分类管理
- **学科分类**：语文、数学、英语、物理、化学、生物、历史、地理、政治等
- **年级选择**：小学1-6年级、初中初一至初三、高中高一至高三
- **知识点标签**：内置各学科常用知识点，支持自定义标签

### 🏷️ 智能标记
- **错误原因**：概念不清、粗心大意、审题错误、思路卡壳、计算错误、其他
- **难度等级**：1-5星难度评分
- **掌握程度**：待订正 → 已理解 → 需巩固 → 已掌握

### 📖 错题本
- 按学科、知识点、时间筛选
- 按错误原因筛选
- 按掌握程度筛选
- 统计错题总数、待订正、已掌握数量

### 🎯 练习模式
- 遮住答案模式，先做后对
- 多题批量练习
- 标记掌握状态

### ⏱️ 重做挑战
- 限时重做，模拟考试
- 自定义题目数量（5/10/15/20题）
- 自定义时间限制（5/10/15/20/30分钟）
- 按学科筛选题目
- 成绩统计和答案解析

### 🧠 智能复习提醒
- 基于艾宾浩斯遗忘曲线
- 科学安排复习间隔：1天 → 2天 → 4天 → 7天 → 15天 → 30天
- 今日待复习、即将到来分类显示
- 紧急复习提醒
- 每日提醒时间设置

## 📁 项目结构

```
cuoti/
├── app.js                 # 小程序入口文件
├── app.json               # 小程序全局配置
├── app.wxss               # 全局样式
├── sitemap.json           # 站点地图配置
├── pages/
│   ├── index/             # 错题本首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── add/               # 错题录入页面
│   │   ├── add.js
│   │   ├── add.json
│   │   ├── add.wxml
│   │   └── add.wxss
│   ├── detail/            # 错题详情页面
│   │   ├── detail.js
│   │   ├── detail.json
│   │   ├── detail.wxml
│   │   └── detail.wxss
│   ├── practice/          # 练习模式页面
│   │   ├── practice.js
│   │   ├── practice.json
│   │   ├── practice.wxml
│   │   └── practice.wxss
│   ├── exam/              # 重做挑战页面
│   │   ├── exam.js
│   │   ├── exam.json
│   │   ├── exam.wxml
│   │   └── exam.wxss
│   └── remind/            # 复习提醒页面
│       ├── remind.js
│       ├── remind.json
│       ├── remind.wxml
│       └── remind.wxss
├── utils/                 # 工具函数
└── images/                # 图片资源
```

## 🚀 快速开始

### 环境要求
- 微信开发者工具
- 小程序开发账号

### 运行步骤
1. 打开微信开发者工具
2. 选择「导入项目」
3. 选择项目目录 `d:\my\zhongq\cuoti`
4. 填写 AppID（测试可使用「测试号」）
5. 点击「导入」即可运行

## 🎨 技术栈
- 微信小程序原生框架
- WXML / WXSS / JavaScript
- 本地存储（wx.setStorageSync / wx.getStorageSync）
- 微信录音、拍照、选择图片 API

## 📊 数据模型

### 错题数据结构
```javascript
{
  id: Number,              // 唯一标识
  question: String,        // 题目内容
  questionImage: String,   // 题目图片路径
  voicePath: String,       // 语音路径
  subject: String,         // 学科 key
  grade: String,           // 年级
  knowledge: Array,        // 知识点标签
  errorReason: String,     // 错误原因
  difficulty: Number,      // 难度等级 1-5
  wrongAnswer: String,     // 错误解法
  correctAnswer: String,   // 正确解析
  mastery: String,         // 掌握程度: pending/understood/consolidate/mastered
  reviewCount: Number,     // 复习次数
  createTime: String,      // 创建时间
  updateTime: String,      // 更新时间
  nextReviewTime: String   // 下次复习时间
}
```

## 🤝 功能说明

### 核心设计理念
- **简单易用**：面向学生，操作简单直观
- **科学复习**：基于遗忘曲线，智能提醒复习
- **多维度统计**：从学科、知识点、错误原因多维度管理
- **离线可用**：所有数据本地存储，无需网络

### 使用建议
1. 每天花10-15分钟录入当天错题
2. 按照提醒时间进行复习
3. 每周进行一次重做挑战
4. 及时标记掌握状态，优化复习计划

## 📄 许可证
MIT License

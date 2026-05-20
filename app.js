App({
  onLaunch() {
    this.initDatabase()
    this.loadSubjects()
  },

  globalData: {
    userInfo: null,
    subjects: {},
    wrongQuestions: []
  },

  initDatabase() {
    const db = wx.cloud.database()
    this.db = db
  },

  loadSubjects() {
    this.globalData.subjects = {
      chinese: { name: '语文', icon: '📖', color: '#E74C3C', knowledge: ['生字词', '古诗词', '阅读理解', '作文', '文言文', '病句修改', '标点符号', '修辞手法'] },
      math: { name: '数学', icon: '📐', color: '#3498DB', knowledge: ['四则运算', '分数', '小数', '几何图形', '方程', '函数', '概率统计', '应用题'] },
      english: { name: '英语', icon: '🔤', color: '#2ECC71', knowledge: ['单词', '语法', '阅读理解', '完形填空', '写作', '听力', '音标', '时态'] },
      physics: { name: '物理', icon: '⚡', color: '#F39C12', knowledge: ['力学', '电学', '光学', '热学', '声学', '能量守恒', '运动学'] },
      chemistry: { name: '化学', icon: '🧪', color: '#9B59B6', knowledge: ['元素周期表', '化学反应', '化学方程式', '有机物', '无机物', '实验操作'] },
      biology: { name: '生物', icon: '🌱', color: '#1ABC9C', knowledge: ['细胞', '遗传学', '生态学', '人体生理', '植物学', '动物学'] },
      history: { name: '历史', icon: '📜', color: '#E67E22', knowledge: ['中国古代史', '中国近代史', '世界历史', '历史事件', '历史人物'] },
      geography: { name: '地理', icon: '🌍', color: '#16A085', knowledge: ['自然地理', '人文地理', '地图知识', '气候', '地形地貌'] },
      politics: { name: '政治', icon: '⚖️', color: '#8E44AD', knowledge: ['道德与法治', '经济常识', '政治常识', '哲学常识'] }
    }
  },

  getGrades() {
    return {
      primary: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      junior: ['初一', '初二', '初三'],
      senior: ['高一', '高二', '高三']
    }
  },

  getErrorReasons() {
    return [
      { id: 'concept', name: '概念不清', icon: '❓' },
      { id: 'careless', name: '粗心大意', icon: '😓' },
      { id: 'misread', name: '审题错误', icon: '👀' },
      { id: 'stuck', name: '思路卡壳', icon: '🤔' },
      { id: 'calculation', name: '计算错误', icon: '🧮' },
      { id: 'other', name: '其他', icon: '📝' }
    ]
  },

  getMasteryLevels() {
    return [
      { id: 'pending', name: '待订正', color: '#E74C3C' },
      { id: 'understood', name: '已理解', color: '#F39C12' },
      { id: 'consolidate', name: '需巩固', color: '#3498DB' },
      { id: 'mastered', name: '已掌握', color: '#2ECC71' }
    ]
  },

  saveWrongQuestion(question) {
    const questions = this.getWrongQuestions()
    question.id = Date.now()
    question.createTime = new Date().toISOString()
    question.updateTime = question.createTime
    question.mastery = 'pending'
    question.reviewCount = 0
    question.nextReviewTime = this.calculateNextReviewTime(question, 0)
    questions.unshift(question)
    wx.setStorageSync('wrongQuestions', questions)
    return question
  },

  getWrongQuestions() {
    return wx.getStorageSync('wrongQuestions') || []
  },

  updateWrongQuestion(id, updates) {
    const questions = this.getWrongQuestions()
    const index = questions.findIndex(q => q.id === id)
    if (index !== -1) {
      questions[index] = { ...questions[index], ...updates, updateTime: new Date().toISOString() }
      wx.setStorageSync('wrongQuestions', questions)
      return true
    }
    return false
  },

  deleteWrongQuestion(id) {
    let questions = this.getWrongQuestions()
    questions = questions.filter(q => q.id !== id)
    wx.setStorageSync('wrongQuestions', questions)
  },

  calculateNextReviewTime(question, reviewCount) {
    const intervals = [1, 2, 4, 7, 15, 30]
    const interval = intervals[Math.min(reviewCount, intervals.length - 1)]
    const nextTime = new Date()
    nextTime.setDate(nextTime.getDate() + interval)
    return nextTime.toISOString()
  },

  getReviewQuestions() {
    const questions = this.getWrongQuestions()
    const now = new Date().toISOString()
    return questions.filter(q => q.nextReviewTime <= now && q.mastery !== 'mastered')
  }
})

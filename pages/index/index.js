const app = getApp()

Page({
  data: {
    questions: [],
    filteredQuestions: [],
    subjects: [],
    masteryLevels: [],
    errorReasons: [],
    filterSubject: '',
    filterMastery: '',
    filterReason: '',
    totalCount: 0,
    pendingCount: 0,
    masteredCount: 0
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const questions = app.getWrongQuestions()
    const subjects = Object.entries(app.globalData.subjects).map(([key, value]) => ({ key, value }))
    const masteryLevels = app.getMasteryLevels()
    const errorReasons = app.getErrorReasons()

    const pendingCount = questions.filter(q => q.mastery === 'pending').length
    const masteredCount = questions.filter(q => q.mastery === 'mastered').length

    this.setData({
      questions,
      subjects,
      masteryLevels,
      errorReasons,
      totalCount: questions.length,
      pendingCount,
      masteredCount
    })

    this.applyFilters()
  },

  applyFilters() {
    let filtered = [...this.data.questions]

    if (this.data.filterSubject) {
      filtered = filtered.filter(q => q.subject === this.data.filterSubject)
    }

    if (this.data.filterMastery) {
      filtered = filtered.filter(q => q.mastery === this.data.filterMastery)
    }

    if (this.data.filterReason) {
      filtered = filtered.filter(q => q.errorReason === this.data.filterReason)
    }

    this.setData({ filteredQuestions: filtered })
  },

  filterBySubject(e) {
    this.setData({ filterSubject: e.currentTarget.dataset.subject })
    this.applyFilters()
  },

  filterByMastery(e) {
    this.setData({ filterMastery: e.currentTarget.dataset.mastery })
    this.applyFilters()
  },

  filterByReason(e) {
    this.setData({ filterReason: e.currentTarget.dataset.reason })
    this.applyFilters()
  },

  clearFilter() {
    this.setData({
      filterSubject: '',
      filterMastery: '',
      filterReason: ''
    })
    this.applyFilters()
  },

  getSubjectName(subjectKey) {
    return app.globalData.subjects[subjectKey]?.name || ''
  },

  getSubjectIcon(subjectKey) {
    return app.globalData.subjects[subjectKey]?.icon || ''
  },

  getSubjectColor(subjectKey) {
    return app.globalData.subjects[subjectKey]?.color || '#999'
  },

  getMasteryName(masteryId) {
    const level = app.getMasteryLevels().find(l => l.id === masteryId)
    return level?.name || masteryId
  },

  getMasteryColor(masteryId) {
    const level = app.getMasteryLevels().find(l => l.id === masteryId)
    return level?.color || '#999'
  },

  formatTime(timeStr) {
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    return `${date.getMonth() + 1}/${date.getDate()}`
  },

  goToDetail(e) {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`
    })
  }
})

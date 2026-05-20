const app = getApp()

Page({
  data: {
    allQuestions: [],
    todayList: [],
    upcomingList: [],
    urgentCount: 0,
    todayCount: 0,
    masteredCount: 0,
    memoryPoints: [
      { day: 1, retention: 100 },
      { day: 2, retention: 58 },
      { day: 4, retention: 44 },
      { day: 7, retention: 36 },
      { day: 15, retention: 33 },
      { day: 30, retention: 28 }
    ],
    reviewIntervals: [1, 2, 4, 7, 15, 30],
    intervals: [0, 1, 2, 3, 4, 5],
    remindTime: '20:00',
    remindEnabled: true
  },

  onLoad() {
    this.loadData()
    this.loadSettings()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const questions = app.getWrongQuestions()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const todayList = []
    const upcomingList = []
    let urgentCount = 0
    let masteredCount = 0

    questions.forEach(q => {
      if (q.mastery === 'mastered') {
        masteredCount++
        return
      }

      const nextReview = new Date(q.nextReviewTime)
      const nextReviewDay = new Date(nextReview.getFullYear(), nextReview.getMonth(), nextReview.getDate())
      
      q.nextReviewText = this.formatReviewDate(nextReview)
      
      if (nextReviewDay <= today) {
        todayList.push(q)
        if (nextReview < now) {
          q.isUrgent = true
          urgentCount++
        }
      } else if (nextReviewDay <= nextWeek) {
        upcomingList.push(q)
      }
    })

    todayList.sort((a, b) => new Date(a.nextReviewTime) - new Date(b.nextReviewTime))
    upcomingList.sort((a, b) => new Date(a.nextReviewTime) - new Date(b.nextReviewTime))

    this.setData({
      allQuestions: questions,
      todayList,
      upcomingList,
      urgentCount,
      todayCount: todayList.length,
      masteredCount
    })
  },

  loadSettings() {
    const settings = wx.getStorageSync('reviewSettings')
    if (settings) {
      this.setData({
        remindTime: settings.remindTime || '20:00',
        remindEnabled: settings.remindEnabled !== false
      })
    }
  },

  formatReviewDate(date) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const reviewDate = new Date(date)
    const reviewDay = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate())
    
    const diffDays = Math.floor((reviewDay - today) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '明天'
    if (diffDays < 7) return `${diffDays}天后`
    
    return `${reviewDate.getMonth() + 1}/${reviewDate.getDate()}`
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

  goToDetail(e) {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },

  startTodayReview() {
    if (this.data.todayList.length === 0) return
    
    const ids = this.data.todayList.map(q => q.id)
    const idsStr = ids.join(',')
    
    wx.navigateTo({
      url: `/pages/practice/practice?ids=${idsStr}`
    })
  },

  onTimeChange(e) {
    const remindTime = e.detail.value
    this.setData({ remindTime })
    this.saveSettings()
    wx.showToast({ title: '提醒时间已更新', icon: 'success' })
  },

  onSwitchChange(e) {
    this.setData({ remindEnabled: e.detail.value })
    this.saveSettings()
    wx.showToast({ 
      title: e.detail.value ? '提醒已开启' : '提醒已关闭', 
      icon: 'success' 
    })
  },

  saveSettings() {
    wx.setStorageSync('reviewSettings', {
      remindTime: this.data.remindTime,
      remindEnabled: this.data.remindEnabled
    })
  }
})

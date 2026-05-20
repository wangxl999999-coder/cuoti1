const app = getApp()

Page({
  data: {
    questionId: null,
    question: {},
    subjectName: '',
    subjectIcon: '',
    subjectColor: '',
    masteryName: '',
    masteryColor: '',
    errorReasonName: '',
    masteryLevels: [],
    currentMastery: ''
  },

  onLoad(options) {
    this.setData({ 
      questionId: parseInt(options.id),
      masteryLevels: app.getMasteryLevels()
    })
    this.loadQuestion()
  },

  loadQuestion() {
    const questions = app.getWrongQuestions()
    const question = questions.find(q => q.id === this.data.questionId)
    
    if (question) {
      const subject = app.globalData.subjects[question.subject]
      const masteryLevel = app.getMasteryLevels().find(l => l.id === question.mastery)
      const errorReason = question.errorReason ? 
        app.getErrorReasons().find(r => r.id === question.errorReason) : null

      this.setData({
        question,
        subjectName: subject?.name || '',
        subjectIcon: subject?.icon || '',
        subjectColor: subject?.color || '#999',
        masteryName: masteryLevel?.name || '',
        masteryColor: masteryLevel?.color || '#999',
        errorReasonName: errorReason ? `${errorReason.icon} ${errorReason.name}` : '未标记',
        currentMastery: question.mastery
      })
    }
  },

  previewImage() {
    wx.previewImage({
      urls: [this.data.question.questionImage]
    })
  },

  updateMastery(e) {
    const mastery = e.currentTarget.dataset.mastery
    app.updateWrongQuestion(this.data.questionId, { mastery })
    this.loadQuestion()
    wx.showToast({ title: '状态已更新', icon: 'success' })
  },

  deleteQuestion() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这道错题吗？',
      success: (res) => {
        if (res.confirm) {
          app.deleteWrongQuestion(this.data.questionId)
          wx.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  },

  editQuestion() {
    wx.showToast({ title: '编辑功能开发中', icon: 'none' })
  },

  practiceOne() {
    wx.navigateTo({
      url: `/pages/practice/practice?id=${this.data.questionId}`
    })
  }
})

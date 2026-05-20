const app = getApp()

Page({
  data: {
    allQuestions: [],
    subjects: [],
    selectSubject: '',
    filteredQuestions: [],
    selectedIds: [],
    practiceList: [],
    currentIndex: 0,
    currentQuestion: null,
    showAnswer: false,
    subjectName: '',
    subjectIcon: '',
    subjectColor: '',
    isCompleted: false,
    correctCount: 0,
    wrongCount: 0,
    progressPercent: 0
  },

  onLoad(options) {
    this.loadQuestions()

    if (options.id) {
      const id = parseInt(options.id)
      this.setData({ selectedIds: [id] })
      this.startPractice()
    } else if (options.ids) {
      const ids = options.ids.split(',').map(id => parseInt(id))
      this.setData({ selectedIds: ids })
      this.startPractice()
    }
  },

  onShow() {
    if (!this.data.currentQuestion) {
      this.loadQuestions()
    }
  },

  loadQuestions() {
    const questions = app.getWrongQuestions()
    const subjects = Object.entries(app.globalData.subjects).map(([key, value]) => ({ key, value }))
    
    this.setData({ allQuestions: questions, subjects })
    this.applySelectFilter()
  },

  applySelectFilter() {
    let filtered = [...this.data.allQuestions]
    
    if (this.data.selectSubject) {
      filtered = filtered.filter(q => q.subject === this.data.selectSubject)
    }

    this.setData({ filteredQuestions: filtered })
  },

  selectFilterSubject(e) {
    this.setData({ selectSubject: e.currentTarget.dataset.subject })
    this.applySelectFilter()
  },

  toggleSelect(e) {
    const id = parseInt(e.currentTarget.dataset.id)
    const selected = [...this.data.selectedIds]
    const index = selected.indexOf(id)
    
    if (index > -1) {
      selected.splice(index, 1)
    } else {
      selected.push(id)
    }
    
    this.setData({ selectedIds: selected })
  },

  startPractice() {
    const practiceList = this.data.allQuestions.filter(q => this.data.selectedIds.includes(q.id))
    
    this.setData({
      practiceList,
      currentIndex: 0,
      isCompleted: false,
      correctCount: 0,
      wrongCount: 0
    })

    this.loadCurrentQuestion()
  },

  loadCurrentQuestion() {
    if (this.data.currentIndex >= this.data.practiceList.length) {
      this.setData({ isCompleted: true, currentQuestion: null })
      return
    }

    const question = this.data.practiceList[this.data.currentIndex]
    const subject = app.globalData.subjects[question.subject]
    const progressPercent = ((this.data.currentIndex + 1) / this.data.practiceList.length) * 100

    this.setData({
      currentQuestion: question,
      showAnswer: false,
      subjectName: subject?.name || '',
      subjectIcon: subject?.icon || '',
      subjectColor: subject?.color || '#999',
      progressPercent
    })
  },

  showAnswerClick() {
    this.setData({ showAnswer: true })
  },

  markWrong() {
    const question = this.data.currentQuestion
    app.updateWrongQuestion(question.id, { mastery: 'consolidate' })
    this.setData({ wrongCount: this.data.wrongCount + 1 })
    this.nextQuestion()
  },

  markCorrect() {
    const question = this.data.currentQuestion
    app.updateWrongQuestion(question.id, { mastery: 'mastered' })
    this.setData({ correctCount: this.data.correctCount + 1 })
    this.nextQuestion()
  },

  prevQuestion() {
    if (this.data.currentIndex > 0) {
      this.setData({ currentIndex: this.data.currentIndex - 1 })
      this.loadCurrentQuestion()
    }
  },

  nextQuestion() {
    if (this.data.currentIndex < this.data.practiceList.length - 1) {
      this.setData({ currentIndex: this.data.currentIndex + 1 })
      this.loadCurrentQuestion()
    } else {
      this.setData({ isCompleted: true, currentQuestion: null })
    }
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

  goBack() {
    this.setData({
      isCompleted: false,
      practiceList: [],
      selectedIds: [],
      correctCount: 0,
      wrongCount: 0
    })
    this.loadQuestions()
  }
})

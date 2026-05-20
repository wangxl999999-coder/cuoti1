const app = getApp()

Page({
  data: {
    allQuestions: [],
    subjects: [],
    countOptions: [5, 10, 15, 20],
    timeOptions: [5, 10, 15, 20, 30],
    questionCount: 10,
    timeLimit: 10,
    filterSubject: '',
    availableCount: 0,
    isStarted: false,
    isCompleted: false,
    examList: [],
    currentIndex: 0,
    currentQuestion: null,
    subjectName: '',
    subjectIcon: '',
    subjectColor: '',
    userAnswers: [],
    userAnswer: '',
    timeRemaining: 0,
    timer: null,
    startTime: 0,
    usedTime: 0,
    progressPercent: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    showReview: false
  },

  onLoad() {
    const questions = app.getWrongQuestions()
    const subjects = Object.entries(app.globalData.subjects).map(([key, value]) => ({ key, value }))
    
    this.setData({ allQuestions: questions, subjects })
    this.calculateAvailable()
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  calculateAvailable() {
    let available = [...this.data.allQuestions]
    
    if (this.data.filterSubject) {
      available = available.filter(q => q.subject === this.data.filterSubject)
    }

    this.setData({ availableCount: available.length })
  },

  setQuestionCount(e) {
    this.setData({ questionCount: parseInt(e.currentTarget.dataset.count) })
  },

  setTimeLimit(e) {
    this.setData({ timeLimit: parseInt(e.currentTarget.dataset.time) })
  },

  setFilterSubject(e) {
    this.setData({ filterSubject: e.currentTarget.dataset.subject })
    this.calculateAvailable()
  },

  startExam() {
    let questions = [...this.data.allQuestions]
    
    if (this.data.filterSubject) {
      questions = questions.filter(q => q.subject === this.data.filterSubject)
    }

    questions = questions.sort(() => Math.random() - 0.5).slice(0, this.data.questionCount)

    const timeRemaining = this.data.timeLimit * 60
    const userAnswers = new Array(questions.length).fill('')

    this.setData({
      isStarted: true,
      isCompleted: false,
      examList: questions,
      currentIndex: 0,
      userAnswers,
      timeRemaining,
      startTime: Date.now(),
      showReview: false
    })

    this.loadCurrentQuestion()
    this.startTimer()
  },

  startTimer() {
    const timer = setInterval(() => {
      const newTime = this.data.timeRemaining - 1
      if (newTime <= 0) {
        clearInterval(timer)
        this.autoSubmit()
      } else {
        this.setData({ timeRemaining: newTime })
      }
    }, 1000)
    
    this.setData({ timer })
  },

  loadCurrentQuestion() {
    const question = this.data.examList[this.data.currentIndex]
    const subject = app.globalData.subjects[question.subject]
    const progressPercent = ((this.data.currentIndex + 1) / this.data.examList.length) * 100
    const userAnswer = this.data.userAnswers[this.data.currentIndex] || ''

    this.setData({
      currentQuestion: question,
      subjectName: subject?.name || '',
      subjectIcon: subject?.icon || '',
      subjectColor: subject?.color || '#999',
      progressPercent,
      userAnswer
    })
  },

  onAnswerInput(e) {
    const userAnswers = [...this.data.userAnswers]
    userAnswers[this.data.currentIndex] = e.detail.value
    this.setData({ userAnswers, userAnswer: e.detail.value })
  },

  prevQuestion() {
    if (this.data.currentIndex > 0) {
      this.setData({ currentIndex: this.data.currentIndex - 1 })
      this.loadCurrentQuestion()
    }
  },

  nextQuestion() {
    if (this.data.currentIndex < this.data.examList.length - 1) {
      this.setData({ currentIndex: this.data.currentIndex + 1 })
      this.loadCurrentQuestion()
    }
  },

  submitExam() {
    wx.showModal({
      title: '确认交卷',
      content: `还有 ${this.data.examList.length - this.data.userAnswers.filter(a => a).length} 题未作答，确定交卷吗？`,
      success: (res) => {
        if (res.confirm) {
          this.finishExam()
        }
      }
    })
  },

  autoSubmit() {
    wx.showToast({ title: '时间到，自动交卷', icon: 'none' })
    this.finishExam()
  },

  finishExam() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }

    const usedTime = Math.floor((Date.now() - this.data.startTime) / 1000)
    let correctCount = 0
    let wrongCount = 0

    this.data.examList.forEach((q, i) => {
      const answered = this.data.userAnswers[i]
      if (answered) {
        correctCount++
      } else {
        wrongCount++
      }
    })

    const totalCount = this.data.examList.length
    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

    this.data.examList.forEach((q, i) => {
      const answered = this.data.userAnswers[i]
      if (answered) {
        app.updateWrongQuestion(q.id, { reviewCount: (q.reviewCount || 0) + 1 })
      }
    })

    this.setData({
      isStarted: false,
      isCompleted: true,
      usedTime,
      correctCount,
      wrongCount,
      score
    })
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  reviewAnswers() {
    this.setData({ showReview: true })
  },

  closeReview() {
    this.setData({ showReview: false })
  },

  retryExam() {
    this.setData({
      isStarted: false,
      isCompleted: false,
      showReview: false
    })
    this.calculateAvailable()
  }
})

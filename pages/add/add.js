const app = getApp()

Page({
  data: {
    inputMethod: 'text',
    question: '',
    questionImage: '',
    voicePath: '',
    isRecording: false,
    recordDuration: 0,
    subjectIndex: -1,
    subjectNames: [],
    gradeIndex: -1,
    gradeNames: [],
    defaultKnowledge: [],
    selectedKnowledge: [],
    customTag: '',
    errorReason: '',
    errorReasons: [],
    difficulty: 3,
    wrongAnswer: '',
    correctAnswer: '',
    recorderManager: null,
    recordTimer: null
  },

  onLoad() {
    const subjectNames = Object.values(app.globalData.subjects).map(s => s.name)
    const grades = app.getGrades()
    const gradeNames = [...grades.primary, ...grades.junior, ...grades.senior]
    const errorReasons = app.getErrorReasons()

    this.setData({
      subjectNames,
      gradeNames,
      errorReasons
    })

    this.initRecorder()
  },

  onUnload() {
    if (this.data.recordTimer) {
      clearInterval(this.data.recordTimer)
    }
  },

  initRecorder() {
    const recorderManager = wx.getRecorderManager()
    
    recorderManager.onStart(() => {
      console.log('录音开始')
    })

    recorderManager.onStop((res) => {
      console.log('录音结束', res)
      this.setData({
        voicePath: res.tempFilePath,
        isRecording: false
      })
      if (this.data.recordTimer) {
        clearInterval(this.data.recordTimer)
      }
    })

    recorderManager.onError((err) => {
      console.error('录音错误', err)
      wx.showToast({ title: '录音失败', icon: 'none' })
      this.setData({ isRecording: false })
    })

    this.setData({ recorderManager })
  },

  switchMethod(e) {
    this.setData({ inputMethod: e.currentTarget.dataset.method })
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ questionImage: res.tempFiles[0].tempFilePath })
      }
    })
  },

  toggleRecording() {
    if (this.data.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  },

  startRecording() {
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        this.data.recorderManager.start({
          format: 'mp3'
        })
        this.setData({
          isRecording: true,
          recordDuration: 0
        })
        const timer = setInterval(() => {
          this.setData({ recordDuration: this.data.recordDuration + 1 })
        }, 1000)
        this.setData({ recordTimer: timer })
      },
      fail: () => {
        wx.showToast({ title: '请授权录音权限', icon: 'none' })
      }
    })
  },

  stopRecording() {
    this.data.recorderManager.stop()
  },

  onQuestionInput(e) {
    this.setData({ question: e.detail.value })
  },

  onSubjectChange(e) {
    const index = parseInt(e.detail.value)
    const subjectKeys = Object.keys(app.globalData.subjects)
    const selectedSubject = subjectKeys[index]
    const defaultKnowledge = app.globalData.subjects[selectedSubject].knowledge
    
    this.setData({
      subjectIndex: index,
      defaultKnowledge,
      selectedKnowledge: []
    })
  },

  onGradeChange(e) {
    this.setData({ gradeIndex: parseInt(e.detail.value) })
  },

  toggleKnowledge(e) {
    const tag = e.currentTarget.dataset.tag
    const selected = [...this.data.selectedKnowledge]
    const index = selected.indexOf(tag)
    
    if (index > -1) {
      selected.splice(index, 1)
    } else {
      selected.push(tag)
    }
    
    this.setData({ selectedKnowledge: selected })
  },

  onCustomTagInput(e) {
    this.setData({ customTag: e.detail.value })
  },

  addCustomTag() {
    const tag = this.data.customTag.trim()
    if (tag && !this.data.selectedKnowledge.includes(tag)) {
      this.setData({
        selectedKnowledge: [...this.data.selectedKnowledge, tag],
        customTag: ''
      })
    }
  },

  selectErrorReason(e) {
    this.setData({ errorReason: e.currentTarget.dataset.reason })
  },

  setDifficulty(e) {
    this.setData({ difficulty: parseInt(e.currentTarget.dataset.level) })
  },

  onWrongAnswerInput(e) {
    this.setData({ wrongAnswer: e.detail.value })
  },

  onCorrectAnswerInput(e) {
    this.setData({ correctAnswer: e.detail.value })
  },

  submitQuestion() {
    if (!this.data.question.trim()) {
      wx.showToast({ title: '请输入题目内容', icon: 'none' })
      return
    }
    if (this.data.subjectIndex < 0) {
      wx.showToast({ title: '请选择学科', icon: 'none' })
      return
    }
    if (this.data.gradeIndex < 0) {
      wx.showToast({ title: '请选择年级', icon: 'none' })
      return
    }

    const subjectKeys = Object.keys(app.globalData.subjects)
    const grades = app.getGrades()
    const allGrades = [...grades.primary, ...grades.junior, ...grades.senior]

    const questionData = {
      question: this.data.question,
      questionImage: this.data.questionImage,
      voicePath: this.data.voicePath,
      subject: subjectKeys[this.data.subjectIndex],
      grade: allGrades[this.data.gradeIndex],
      knowledge: this.data.selectedKnowledge,
      errorReason: this.data.errorReason,
      difficulty: this.data.difficulty,
      wrongAnswer: this.data.wrongAnswer,
      correctAnswer: this.data.correctAnswer
    }

    app.saveWrongQuestion(questionData)

    wx.showToast({ title: '保存成功', icon: 'success' })
    
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }
})

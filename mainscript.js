// ===========================
// acadify — Main Script
// ===========================

const DEMO = { firstName:'Juan', lastName:'Dela Cruz', email:'demo@acadify.edu', studentId:'2024-00001', grade:'3rd Year College', password:'password123' };

// ---- STORAGE ----
function getAccounts() {
  let a = JSON.parse(localStorage.getItem('acadify_accounts') || '[]');

  if (!a.find(x => x.email === DEMO.email)) {
    a.push(DEMO);
    localStorage.setItem('acadify_accounts', JSON.stringify(a));
  }

  return a;
}
function saveAccounts(a) { localStorage.setItem('acadify_accounts', JSON.stringify(a)); }
function getSession()    { return JSON.parse(localStorage.getItem('acadify_session') || 'null'); }
function setSession(u)   { localStorage.setItem('acadify_session', JSON.stringify(u)); }
function clearSession()  { localStorage.removeItem('acadify_session'); }
function dataKey(k)      { const s = getSession(); return s ? `acadify_${s.email}_${k}` : null; }
function getUserData(k, def) { const dk = dataKey(k); return dk ? JSON.parse(localStorage.getItem(dk) || JSON.stringify(def)) : def; }
function setUserData(k, v)   { const dk = dataKey(k); if (dk) localStorage.setItem(dk, JSON.stringify(v)); }

// ---- AUTH ----
function showLogin()    { document.getElementById('register-page').style.display='none'; document.getElementById('login-page').style.display='flex'; clearAlerts(); }
function showRegister() { document.getElementById('login-page').style.display='none'; document.getElementById('register-page').style.display='flex'; clearAlerts(); }
function clearAlerts()  { ['login-error','register-error','register-success'].forEach(id=>{ const el=document.getElementById(id); if(el){el.style.display='none';el.innerHTML='';} }); }
function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  el.innerHTML = `<i class="fas fa-${type==='error'?'exclamation-circle':'check-circle'}"></i> ${msg}`;
  el.style.display = 'flex';
}
function togglePw(id, btn) {
  const inp = document.getElementById(id);
  inp.type = inp.type==='password' ? 'text' : 'password';
  btn.querySelector('i').className = inp.type==='password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}
function checkPwStrength(pw) {
  const wrap=document.getElementById('pw-strength'), fill=document.getElementById('pw-strength-fill'), lbl=document.getElementById('pw-strength-label');
  if (!pw) { wrap.style.display='none'; return; }
  wrap.style.display='flex';
  let s=0; if(pw.length>=8)s++; if(/[A-Z]/.test(pw))s++; if(/[0-9]/.test(pw))s++; if(/[^A-Za-z0-9]/.test(pw))s++;
  const lvls=[{p:'25%',c:'#ef4444',t:'Weak'},{p:'50%',c:'#f97316',t:'Fair'},{p:'75%',c:'#eab308',t:'Good'},{p:'100%',c:'#22c55e',t:'Strong'}];
  const l=lvls[s-1]||lvls[0]; fill.style.width=l.p; fill.style.background=l.c; lbl.textContent=l.t; lbl.style.color=l.c;
}
function doLogin() {
  clearAlerts();
  const email=document.getElementById('login-email').value.trim(), pw=document.getElementById('login-pw').value;
  if (!email||!pw) { showAlert('login-error','Please enter your email and password.','error'); return; }
  const user = getAccounts().find(a=>(a.email.toLowerCase()===email.toLowerCase()||a.studentId===email)&&a.password===pw);
  if (!user) { showAlert('login-error','Incorrect email or password.','error'); return; }
  setSession(user); launchApp(user);
}
function doRegister() {
  clearAlerts();
  const fn=document.getElementById('reg-fn').value.trim(), ln=document.getElementById('reg-ln').value.trim();
  const email=document.getElementById('reg-email').value.trim(), sid=document.getElementById('reg-sid').value.trim();
  const grade=document.getElementById('reg-grade').value;
  const pw=document.getElementById('reg-pw').value, pw2=document.getElementById('reg-pw2').value;
  const agreed=document.getElementById('reg-agree').checked;
  if (!fn||!ln) { showAlert('register-error','Please enter your full name.','error'); return; }
  if (!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showAlert('register-error','Please enter a valid email.','error'); return; }
  if (!sid) { showAlert('register-error','Please enter your Student ID.','error'); return; }
  if (!grade) { showAlert('register-error','Please select your grade/year level.','error'); return; }
  if (!pw||pw.length<8) { showAlert('register-error','Password must be at least 8 characters.','error'); return; }
  if (pw!==pw2) { showAlert('register-error','Passwords do not match.','error'); return; }
  if (!agreed) { showAlert('register-error','Please agree to the Terms & Conditions.','error'); return; }
  const accounts=getAccounts();
  if (accounts.find(a=>a.email.toLowerCase()===email.toLowerCase()||a.studentId===sid)) { showAlert('register-error','Account already exists.','error'); return; }
  const newUser={firstName:fn,lastName:ln,email,studentId:sid,grade,password:pw};
  accounts.push(newUser); saveAccounts(accounts);
  showAlert('register-success','Account created! Redirecting to login…','success');
  setTimeout(showLogin, 2000);
}
function logout() {
  clearSession();
  document.getElementById('app').style.display='none';
  document.getElementById('login-page').style.display='flex';
  document.getElementById('login-email').value='';
  document.getElementById('login-pw').value='';
}
function launchApp(user) {
  document.getElementById('login-page').style.display='none';
  document.getElementById('register-page').style.display='none';
  document.getElementById('app').style.display='grid';
  document.querySelector('.user-name').textContent = user.firstName+' '+user.lastName;
  document.querySelector('.avatar').textContent = user.firstName[0]+user.lastName[0];
  document.getElementById('dash-greeting').textContent = `Good day, ${user.firstName}! 👋`;
  showPage('dashboard', document.querySelector('.nav-btn'));
  renderDashboard();
}

// ---- MOBILE MENU ----
function toggleMobileMenu() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('active');
}
function closeMobileMenu() {
  const navbar = document.getElementById('navbar');
  navbar.classList.remove('active');
}

// ---- NAVIGATION ----
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  closeMobileMenu();
  if (name==='reports')  renderReports();
  if (name==='tracker')  renderTracker();
  if (name==='reviewer') renderReviewerWeakList();
}

// ---- DASHBOARD ----
function renderDashboard() {
  const lessons   = getUserData('lessons_count', 0);
  const quizzes   = getUserData('quiz_history', []);
  const topicData = getUserData('topic_scores', {});
  const reviewers = getUserData('reviewer_count', 0);
  document.getElementById('m-lessons').textContent  = lessons;
  document.getElementById('m-quizzes').textContent  = quizzes.length;
  document.getElementById('m-reviewers') && (document.getElementById('m-reviewers').textContent = reviewers);
  const avg = quizzes.length ? Math.round(quizzes.reduce((s,q)=>s+q.score,0)/quizzes.length) : null;
  document.getElementById('m-score').textContent = avg!==null ? avg+'%' : '—';
  const weak = Object.entries(topicData).filter(([,v])=>v.avg<60);
  document.getElementById('m-weak').textContent = weak.length;
  // Recent activity
  const actEl = document.getElementById('recent-activity');
  const activity = getUserData('activity_log', []);
  if (!activity.length) {
    actEl.innerHTML='<div class="empty-state"><i class="fas fa-book-open"></i><p>No activity yet. Start by asking the AI Tutor!</p></div>'; 
  } else {
    actEl.innerHTML = activity.slice(-6).reverse().map(a=>`
      <div class="activity-item">
        <div class="activity-icon" style="background:${a.bg};color:${a.color};"><i class="fas ${a.icon}"></i></div>
        <div class="activity-text"><strong>${a.title}</strong><div class="activity-time">${a.time}</div></div>
      </div>`).join('');
  }
  // Weak topics on dashboard
  const weakEl = document.getElementById('dash-weak-topics');
  if (!weak.length) {
    weakEl.innerHTML='<div class="empty-state"><i class="fas fa-check-circle" style="color:#1D9E75;"></i><p>No weak topics yet!</p></div>';
  } else {
    weakEl.innerHTML = weak.slice(0,5).map(([topic,v])=>`
      <div class="weak-item">
        <span>${topic}</span>
        <span class="chip chip-red">${v.avg}%</span>
      </div>`).join('');
  }
  // Render dynamic courses
  renderDynamicCourses(topicData, quizzes);
}

// Render courses based on actual student data (quizzes + topics)
function renderDynamicCourses(topicData, quizzes) {
  const coursesEl = document.getElementById('courses-grid');
  if (!coursesEl) return;
  
  // Get unique subjects from topic data
  const subjects = Object.keys(topicData);
  
  if (!subjects.length) {
    coursesEl.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-book"></i><p>No courses yet. Take a quiz or ask the AI Tutor to get started!</p></div>';
    return;
  }
  
  // Subject to course info mapping
  const courseInfo = {
    'mathematics': { name: 'Mathematics', category: 'Math', gradient: 'linear-gradient(135deg,#667EEA 0%,#764BA2 100%)', icon: '√', emoji: '📐' },
    'math': { name: 'Mathematics', category: 'Math', gradient: 'linear-gradient(135deg,#667EEA 0%,#764BA2 100%)', icon: '√', emoji: '📐' },
    'chemistry': { name: 'Chemistry', category: 'Science', gradient: 'linear-gradient(135deg,#FF6B6B 0%,#FF8E72 100%)', icon: '⚗', emoji: '🧪' },
    'biology': { name: 'Biology', category: 'Science', gradient: 'linear-gradient(135deg,#4ECDC4 0%,#44A08D 100%)', icon: '🧬', emoji: '🔬' },
    'physics': { name: 'Physics', category: 'Science', gradient: 'linear-gradient(135deg,#F093FB 0%,#F5576C 100%)', icon: '⚛', emoji: '🌀' },
    'english': { name: 'English', category: 'Language', gradient: 'linear-gradient(135deg,#F093FB 0%,#F5576C 100%)', icon: '✏', emoji: '📚' },
    'science': { name: 'Science', category: 'Science', gradient: 'linear-gradient(135deg,#4ECDC4 0%,#44A08D 100%)', icon: '🔬', emoji: '🧬' },
    'history': { name: 'History', category: 'Social Studies', gradient: 'linear-gradient(135deg,#FFB347 0%,#FFA07A 100%)', icon: '🏛', emoji: '📜' },
    'computer science': { name: 'Computer Science', category: 'Tech', gradient: 'linear-gradient(135deg,#667EEA 0%,#764BA2 100%)', icon: '💻', emoji: '⌨' }
  };
  
  const courses = subjects.map(subject => {
    const info = courseInfo[subject.toLowerCase()] || { 
      name: subject.charAt(0).toUpperCase() + subject.slice(1), 
      category: 'General',
      gradient: 'linear-gradient(135deg,#7FBA00 0%,#107C10 100%)',
      emoji: '📖'
    };
    
    const topicScores = topicData[subject];
    const avgScore = topicScores.avg || 0;
    const attempts = topicScores.attempts || 0;
    const topicList = topicScores.topics || [];
    
    return {
      subject,
      ...info,
      avgScore: Math.round(avgScore),
      attempts,
      topicList: topicList.slice(0, 3)
    };
  });
  
  coursesEl.innerHTML = courses.map(course => `
    <div class="course-card" style="background:${course.gradient};">
      <div class="course-visual">${course.emoji}</div>
      <div class="course-header">
        <div class="course-info">
          <h4>${course.name}</h4>
          <p class="course-category">${course.category}</p>
          ${course.topicList.length > 0 ? `<p class="course-topics">${course.topicList.join(', ')}</p>` : ''}
        </div>
      </div>
      <div class="course-progress">
        <div class="progress-bar"><div class="progress-fill" style="width:${course.avgScore}%"></div></div>
        <span class="progress-text">${course.avgScore}%</span>
      </div>
      <div class="course-stats">
        <div class="stat"><span class="stat-value">${course.attempts}</span><span class="stat-label">quizzes</span></div>
      </div>
    </div>
  `).join('');
}

function logActivity(icon, bg, color, title) {
  const log = getUserData('activity_log', []);
  log.push({ icon, bg, color, title, time: new Date().toLocaleString() });
  if (log.length > 20) log.shift();
  setUserData('activity_log', log);
}

// ==============
// AI TUTOR
// ==============
function setQuestion(q) { document.getElementById('tutor-question').value = q; }
function handleTutorKey(e) { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); askTutor(); } }

async function askTutor() {
  const q = document.getElementById('tutor-question').value.trim();
  if (!q) return;
  const subject  = document.getElementById('tutor-subject').value || 'General';
  const level    = document.getElementById('tutor-level').value;
  const style    = document.getElementById('tutor-style').value;
  const chatBox  = document.getElementById('chat-box');
  const btn      = document.getElementById('ask-btn');

  // Clear welcome screen
  const welcome = chatBox.querySelector('.chat-welcome');
  if (welcome) welcome.remove();

  // Add user message
  chatBox.innerHTML += `
    <div class="chat-msg user">
      <div class="chat-avatar user"><i class="fas fa-user"></i></div>
      <div class="chat-bubble user">${escHtml(q)}</div>
    </div>`;

  document.getElementById('tutor-question').value = '';
  btn.disabled = true;

  // Typing indicator
  const typingId = 'typing-'+Date.now();
  chatBox.innerHTML += `
    <div class="chat-msg" id="${typingId}">
      <div class="chat-avatar ai"><i class="fas fa-robot"></i></div>
      <div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
    </div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  const styleMap = { simple:'Use simple, clear language', examples:'Use real-world examples', stepbystep:'Explain step-by-step with numbered steps', visual:'Use visual formatting with symbols and diagrams' };
  const levelMap = { beginner:'Explain as if to a complete beginner', intermediate:'Explain at standard student level', advanced:'Give an in-depth, advanced explanation' };

// WITH THIS:
const availableSubjects = ['Mathematics', 'Science', 'English', 'Filipino', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Statistics'];

const subjectConstraint = subject !== 'other' ? `
IMPORTANT: The student selected "${subject}" as their subject. The available subjects in the system are: ${availableSubjects.join(', ')}, and "Other" (for anything not in that list).

1. If the question IS directly related to ${subject}, answer it thoroughly.
2. If the question is NOT related to ${subject}, do NOT answer it. Instead:
   a. Identify which subject from this list best fits the question: ${availableSubjects.join(', ')}.
   b. If a subject from the list fits, respond EXACTLY like this (fill in the blanks):
      "It looks like your question is about [CORRECT SUBJECT], not ${subject}! 😊 Please select **[CORRECT SUBJECT]** from the subject dropdown and ask again — I'll be happy to help you there! 📚"
   c. If the question doesn't fit ANY subject in the list, respond EXACTLY like this:
      "It looks like your question doesn't fall under ${subject} or any of the listed subjects. Please select **Other** from the subject dropdown and ask again — I can help you with any topic! 📚"
3. Only answer non-${subject} questions if they are tangential learning skills (e.g. "how to study", "time management").` : '';

  const prompt = `You are a friendly, expert AI tutor. ${levelMap[level]}. ${styleMap[style]}.
Subject: ${subject}
Student question: ${q}

${subjectConstraint}

Give a clear, well-structured explanation. Use headings, bullet points, examples, and formatting to make it easy to understand. Be encouraging and educational.`;

  try {
    const res = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt}) });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'AI error');
    const reply = data.content[0].text;

    document.getElementById(typingId).remove();
    chatBox.innerHTML += `
      <div class="chat-msg">
        <div class="chat-avatar ai"><i class="fas fa-robot"></i></div>
        <div class="chat-bubble ai">${formatAIText(reply)}</div>
      </div>`;

    // Update stats
    setUserData('lessons_count', getUserData('lessons_count',0)+1);
    logActivity('robot','#E1F5EE','#0F6E56', `Asked: ${q.substring(0,40)}${q.length>40?'…':''}`);
    renderDashboard();
  } catch(err) {
    document.getElementById(typingId).remove();
    chatBox.innerHTML += `
      <div class="chat-msg">
        <div class="chat-avatar ai"><i class="fas fa-robot"></i></div>
        <div class="chat-bubble ai" style="color:#dc2626;"><i class="fas fa-exclamation-circle"></i> Error: ${err.message}</div>
      </div>`;
  }
  btn.disabled = false;
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ================================================================
// QUIZ GENERATOR
// ================================================================
let currentQuiz = [], currentQIndex = 0, currentAnswers = [], quizTopic = '';

async function generateQuiz() {
  const topic   = document.getElementById('quiz-topic').value.trim();
  const count   = document.getElementById('quiz-count').value;
  const diff    = document.getElementById('quiz-difficulty').value;
  const type    = document.getElementById('quiz-type').value;
  const btn     = document.getElementById('gen-quiz-btn');

  if (!topic) { alert('Please enter a topic for the quiz.'); return; }
  quizTopic = topic;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;"></span> Generating...';

  const typeInstr = type==='multiple' ? 'All multiple choice (4 options each)' : type==='truefalse' ? 'All True or False' : 'Mix of multiple choice and true/false';

  const prompt = `Generate a ${count}-question quiz about "${topic}". Difficulty: ${diff}. ${typeInstr}.

Return ONLY a valid JSON array, no markdown, no explanation:
[
  {
    "question": "Question text here?",
    "type": "multiple",
    "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
    "answer": "A. Option 1",
    "explanation": "Brief explanation of why this is correct."
  }
]
For true/false: type="truefalse", options=["True","False"], answer="True" or "False".
Return ONLY the JSON array.`;

  try {
    const res = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt}) });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error||'AI error');
    let raw = data.content[0].text.trim().replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/```\s*$/,'').trim();
    const questions = JSON.parse(raw);
    currentQuiz = questions; currentQIndex = 0; currentAnswers = [];
    renderQuestion();
    logActivity('question-circle','#E6F1FB','#185FA5', `Quiz: ${topic}`);
  } catch(err) {
    document.getElementById('quiz-main').innerHTML = `
      <div class="quiz-card"><div style="text-align:center;padding:32px;color:#dc2626;">
        <i class="fas fa-exclamation-circle" style="font-size:32px;display:block;margin-bottom:12px;"></i>
        <p><strong>Failed to generate quiz.</strong></p><p style="font-size:13px;margin-top:8px;">${err.message}</p>
      </div></div>`;
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-magic"></i> Generate Quiz';
}

function renderQuestion() {
  const q = currentQuiz[currentQIndex];
  const pct = Math.round(((currentQIndex)/currentQuiz.length)*100);
  document.getElementById('quiz-main').innerHTML = `
    <div class="quiz-card">
      <div class="quiz-progress">
        <span>Question ${currentQIndex+1} of ${currentQuiz.length}</span>
        <span><strong>${quizTopic}</strong></span>
      </div>
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
      <div class="question-text">${escHtml(q.question)}</div>
      <div class="options-list">
        ${q.options.map((opt,i)=>`
          <button class="option-btn" onclick="selectAnswer('${escHtml(opt).replace(/'/g,"\\'")}', this)" data-opt="${i}">
            <span class="option-letter">${String.fromCharCode(65+i)}</span>
            ${escHtml(opt.replace(/^[A-D]\.\s*/,''))}
          </button>`).join('')}
      </div>
      <div class="quiz-nav">
        <button class="btn-next" onclick="nextQuestion()" id="next-btn" style="display:none;">
          ${currentQIndex===currentQuiz.length-1 ? '<i class="fas fa-flag-checkered"></i> Finish Quiz' : 'Next Question <i class="fas fa-arrow-right"></i>'}
        </button>
      </div>
      <div id="answer-feedback" style="margin-top:12px;"></div>
    </div>`;
}

function selectAnswer(selected, btn) {
  const q = currentQuiz[currentQIndex];
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);
  const isCorrect = selected.replace(/^[A-D]\.\s*/,'') === q.answer.replace(/^[A-D]\.\s*/,'') || selected === q.answer;
  btn.classList.add(isCorrect ? 'correct' : 'wrong');
  // Show correct answer
  allBtns.forEach(b => { if (b.dataset.opt !== undefined) { const opt = currentQuiz[currentQIndex].options[b.dataset.opt]; if (opt===q.answer || opt.replace(/^[A-D]\.\s*/,'')=== q.answer.replace(/^[A-D]\.\s*/,'')) b.classList.add('correct'); } });
  currentAnswers.push({ question:q.question, selected, correct:q.answer, isCorrect, explanation:q.explanation });
  document.getElementById('answer-feedback').innerHTML = `
    <div style="padding:12px 16px;border-radius:var(--radius);background:${isCorrect?'#f0fdf4':'#fef2f2'};color:${isCorrect?'#166534':'#991b1b'};font-size:13px;">
      <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}</strong> ${escHtml(q.explanation)}
    </div>`;
  document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
  currentQIndex++;
  if (currentQIndex >= currentQuiz.length) { finishQuiz(); return; }
  renderQuestion();
}

function finishQuiz() {
  const correct = currentAnswers.filter(a=>a.isCorrect).length;
  const total   = currentQuiz.length;
  const score   = Math.round((correct/total)*100);
  const grade   = score>=90?'Excellent! 🎉':score>=75?'Good Job! 👍':score>=60?'Keep Practicing 📚':'Needs Review 📖';
  const color   = score>=90?'#1D9E75':score>=75?'#378ADD':score>=60?'#EF9F27':'#EF4444';

  // Save to history
  const history = getUserData('quiz_history', []);
  const entry   = { topic:quizTopic, score, correct, total, date:new Date().toLocaleString(), answers:currentAnswers };
  history.push(entry);
  setUserData('quiz_history', history);

  // Update topic scores for tracker
  updateTopicScore(quizTopic, score);
  renderDashboard();
  renderQuizHistory();

  document.getElementById('quiz-main').innerHTML = `
    <div class="quiz-card quiz-result">
      <h3 style="font-size:18px;">Quiz Complete!</h3>
      <p style="color:var(--text-secondary);margin-top:4px;">${quizTopic}</p>
      <div class="result-score" style="color:${color};">${score}%</div>
      <div class="result-label">${correct}/${total} correct · ${grade}</div>
      <div class="result-breakdown">
        ${currentAnswers.map((a,i)=>`
          <div class="result-item">
            <span style="max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Q${i+1}: ${escHtml(a.question.substring(0,50))}${a.question.length>50?'…':''}</span>
            <span style="color:${a.isCorrect?'#1D9E75':'#EF4444'};font-weight:600;">${a.isCorrect?'✓ Correct':'✗ Wrong'}</span>
          </div>`).join('')}
      </div>
      <button class="btn-primary" onclick="generateQuiz()" style="max-width:280px;margin:0 auto;">
        <i class="fas fa-redo"></i> Take Another Quiz
      </button>
    </div>`;
}

function updateTopicScore(topic, score) {
  const data = getUserData('topic_scores', {});
  const normalized = topic.toLowerCase();
  if (!data[normalized]) data[normalized] = { scores:[], avg:0, attempts:0, topics:[] };
  data[normalized].scores.push(score);
  data[normalized].attempts = (data[normalized].attempts || 0) + 1;
  if (!data[normalized].topics.includes(topic)) data[normalized].topics.push(topic);
  data[normalized].avg = Math.round(data[normalized].scores.reduce((s,v)=>s+v,0)/data[normalized].scores.length);
  setUserData('topic_scores', data);
}

function renderQuizHistory() {
  const history = getUserData('quiz_history', []);
  const el = document.getElementById('quiz-history-list');
  if (!history.length) { el.innerHTML='<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No quizzes yet.</p></div>'; return; }
  el.innerHTML = history.slice(-5).reverse().map(h=>`
    <div class="quiz-history-item">
      <span style="font-weight:500;">${h.topic}</span>
      <span class="chip ${h.score>=75?'chip-green':'chip-red'}">${h.score}%</span>
    </div>`).join('');
}

// ================================================================
// WEAK TOPICS TRACKER
// ================================================================
function renderTracker() {
  const data = getUserData('topic_scores', {});
  const entries = Object.entries(data).sort((a,b)=>a[1].avg-b[1].avg);
  const barsEl  = document.getElementById('tracker-bars');
  const weakEl  = document.getElementById('weak-list');
  const strongEl= document.getElementById('strong-list');
  const weakBadge  = document.getElementById('weak-count-badge');
  const strongBadge= document.getElementById('strong-count-badge');

  if (!entries.length) {
    barsEl.innerHTML  = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>Take quizzes to see your topic performance.</p></div>';
    weakEl.innerHTML  = '<div class="empty-state"><i class="fas fa-smile" style="color:#1D9E75;"></i><p>No data yet.</p></div>';
    strongEl.innerHTML= '<div class="empty-state"><i class="fas fa-star"></i><p>No data yet.</p></div>';
    return;
  }

  barsEl.innerHTML = entries.map(([topic,v])=>{
    const col = v.avg>=75 ? '#1D9E75' : v.avg>=60 ? '#EF9F27' : '#EF4444';
    return `<div class="prog-bar-section">
      <div class="prog-bar-label"><span>${topic}</span><span style="color:${col};font-weight:600;">${v.avg}% avg (${v.scores.length} quiz${v.scores.length>1?'zes':''})</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${v.avg}%;background:${col};"></div></div>
    </div>`;
  }).join('');

  const weak   = entries.filter(([,v])=>v.avg<60);
  const medium = entries.filter(([,v])=>v.avg>=60&&v.avg<75);
  const strong = entries.filter(([,v])=>v.avg>=75);

  weakBadge.textContent   = weak.length + medium.length;
  strongBadge.textContent = strong.length;

  weakEl.innerHTML = [...weak,...medium].length ? [...weak,...medium].map(([topic,v])=>`
    <div class="topic-item">
      <span>${topic}</span>
      <span class="topic-score" style="background:${v.avg<60?'#FEE2E2':'#FAEEDA'};color:${v.avg<60?'#b91c1c':'#854F0B'};">${v.avg}%</span>
    </div>
    <button style="font-size:11px;background:var(--green-light);color:var(--green-dark);border:none;border-radius:6px;padding:3px 10px;cursor:pointer;margin-bottom:6px;" onclick="quickReview('${topic}')">
      <i class="fas fa-book-open"></i> Generate Reviewer
    </button>`).join('') : '<div class="empty-state"><i class="fas fa-smile" style="color:#1D9E75;"></i><p>No weak topics!</p></div>';

  strongEl.innerHTML = strong.length ? strong.map(([topic,v])=>`
    <div class="topic-item">
      <span>${topic}</span>
      <span class="topic-score" style="background:#f0fdf4;color:#166534;">${v.avg}%</span>
    </div>`).join('') : '<div class="empty-state"><i class="fas fa-star"></i><p>Complete quizzes to see strong topics.</p></div>';
}

function quickReview(topic) {
  document.getElementById('reviewer-topic').value = topic;
  showPage('reviewer', document.querySelectorAll('.nav-btn')[4]);
}

// ================================================================
// PERSONALIZED REVIEWER
// ================================================================
function renderReviewerWeakList() {
  const data = getUserData('topic_scores', {});
  const weak = Object.entries(data).filter(([,v])=>v.avg<75).sort((a,b)=>a[1].avg-b[1].avg);
  const el   = document.getElementById('reviewer-weak-list');
  if (!weak.length) { el.innerHTML='<div class="empty-state"><i class="fas fa-clipboard-check"></i><p>Take quizzes to identify weak topics.</p></div>'; return; }
  el.innerHTML = weak.map(([topic,v])=>`
    <div class="reviewer-weak-tag" onclick="document.getElementById('reviewer-topic').value='${topic}'">
      <span>${topic}</span><span class="chip ${v.avg<60?'chip-red':'chip-amber'}">${v.avg}%</span>
    </div>`).join('');
}

let lastReviewerContent = '';
let lastReviewerTopic   = '';

async function generateReviewer() {
  const topic = document.getElementById('reviewer-topic').value.trim();
  const type  = document.getElementById('reviewer-type').value;
  const level = document.getElementById('reviewer-level').value;
  const btn   = document.getElementById('gen-reviewer-btn');

  if (!topic) { alert('Please enter a topic to review.'); return; }
  lastReviewerTopic = topic;

  const outputEl = document.getElementById('reviewer-output');
  outputEl.innerHTML = '<div class="ai-loading"><div class="spinner"></div><span>Generating your personalized reviewer…</span></div>';
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;"></span> Generating...';

  const typeMap = {
    summary:'Write a comprehensive topic summary',
    keypoints:'List all key points, concepts, and terms',
    formulas:'List all important formulas, definitions, and equations',
    examples:'Provide worked examples and practice problems with solutions',
    complete:'Write a complete study reviewer with summary, key points, formulas, and examples'
  };
  const levelMap = { basic:'Keep it basic and simple', standard:'Standard academic level', detailed:'Be very detailed and comprehensive' };

  const prompt = `You are an expert academic tutor creating a personalized study reviewer.
Topic: "${topic}"
Task: ${typeMap[type]}. ${levelMap[level]}.

Format the reviewer clearly with:
- A title header
- Organized sections with headings
- Bullet points for key information
- Examples where appropriate
- Easy to read and study from

Make it comprehensive, accurate, and student-friendly.`;

  try {
    const res = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt}) });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error||'AI error');
    const text = data.content[0].text;
    lastReviewerContent = text;

    outputEl.innerHTML = `
      <div class="reviewer-actions">
        <button class="btn-dl" onclick="downloadPDF('reviewer_content')"><i class="fas fa-download"></i> Download Reviewer PDF</button>
        <button class="btn-dl" style="background:#378ADD;" onclick="generateReviewer()"><i class="fas fa-redo"></i> Regenerate</button>
      </div>
      <div class="reviewer-content">${formatAIText(text)}</div>`;

    setUserData('reviewer_count', getUserData('reviewer_count',0)+1);
    // Save reviewer history
    const revHistory = getUserData('reviewer_history', []);
    revHistory.push({ topic, type, date:new Date().toLocaleString(), content:text });
    if (revHistory.length>10) revHistory.shift();
    setUserData('reviewer_history', revHistory);

    logActivity('book-open','#EEEDFE','#3C3489', `Reviewer: ${topic}`);
    renderDashboard();
  } catch(err) {
    outputEl.innerHTML = `<div class="reviewer-content" style="color:#dc2626;text-align:center;padding:32px;">
      <i class="fas fa-exclamation-circle" style="font-size:32px;display:block;margin-bottom:12px;"></i>
      <strong>Failed to generate reviewer.</strong><p style="margin-top:8px;font-size:13px;">${err.message}</p>
    </div>`;
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-magic"></i> Generate Reviewer';
}

// ================================================================
// REPORTS
// ================================================================
function renderReports() {
  const lessons  = getUserData('lessons_count', 0);
  const quizzes  = getUserData('quiz_history', []);
  const topicData= getUserData('topic_scores', {});
  const reviewers= getUserData('reviewer_count', 0);
  const revHistory = getUserData('reviewer_history', []);

  document.getElementById('rpt-lessons').textContent  = lessons;
  document.getElementById('rpt-quizzes').textContent  = quizzes.length;
  document.getElementById('rpt-reviewers').textContent= reviewers;

  const avg = quizzes.length ? Math.round(quizzes.reduce((s,q)=>s+q.score,0)/quizzes.length) : null;
  const best= quizzes.length ? Math.max(...quizzes.map(q=>q.score)) : null;
  const scoreEl = document.getElementById('rpt-score');
  scoreEl.textContent = avg!==null ? avg+'%' : '—';
  if (avg!==null) scoreEl.style.color = avg>=75?'#1D9E75':'#EF4444';
  document.getElementById('rpt-best').textContent = best!==null ? best+'%' : '—';

  // Quiz list
  const quizEl = document.getElementById('rpt-quiz-list');
  quizEl.innerHTML = quizzes.length ? quizzes.slice(-5).reverse().map(q=>`
    <div class="report-stat">
      <span class="key">${q.topic}</span>
      <span class="val" style="color:${q.score>=75?'#1D9E75':'#EF4444'};">${q.score}% (${q.correct}/${q.total})</span>
    </div>`).join('') : '<p style="font-size:13px;color:var(--text-muted);padding:8px 0;">No quizzes taken yet.</p>';

  // Weak topics
  const weakEl = document.getElementById('rpt-weak-list');
  const weak = Object.entries(topicData).filter(([,v])=>v.avg<75).sort((a,b)=>a[1].avg-b[1].avg);
  weakEl.innerHTML = weak.length ? weak.map(([t,v])=>`
    <div class="report-stat">
      <span class="key">${t}</span>
      <span class="val" style="color:${v.avg<60?'#EF4444':'#EF9F27'};">${v.avg}% avg</span>
    </div>`).join('') : '<p style="font-size:13px;color:var(--text-muted);padding:8px 0;">No weak topics identified yet.</p>';

  // Reviewer history
  const revEl = document.getElementById('rpt-reviewer-list');
  revEl.innerHTML = revHistory.length ? revHistory.slice(-5).reverse().map(r=>`
    <div class="report-stat">
      <span class="key">${r.topic}</span>
      <span class="val" style="font-size:11px;color:var(--text-muted);">${r.date}</span>
    </div>`).join('') : '<p style="font-size:13px;color:var(--text-muted);padding:8px 0;">No reviewers generated yet.</p>';
}

// ================================================================
// PDF DOWNLOAD
// ================================================================
function downloadPDF(type) {
  const user       = getSession();
  const lessons    = getUserData('lessons_count', 0);
  const quizzes    = getUserData('quiz_history', []);
  const topicData  = getUserData('topic_scores', {});
  const revHistory = getUserData('reviewer_history', []);
  const reviewers  = getUserData('reviewer_count', 0);
  const now        = new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'});
  const name       = user ? `${user.firstName} ${user.lastName}` : 'Student';
  const sid        = user?.studentId || '—';
  const grade      = user?.grade || '—';
  const avg        = quizzes.length ? Math.round(quizzes.reduce((s,q)=>s+q.score,0)/quizzes.length) : null;
  const weak       = Object.entries(topicData).filter(([,v])=>v.avg<75).sort((a,b)=>a[1].avg-b[1].avg);
  const strong     = Object.entries(topicData).filter(([,v])=>v.avg>=75);

  const pdfStyles = `
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1A1A2E;background:#fff;padding:40px;font-size:14px;}
    .pdf-header{display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:3px solid #1D9E75;margin-bottom:28px;}
    .pdf-logo{display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;}
    .pdf-logo .dot{width:12px;height:12px;border-radius:50%;background:#1D9E75;display:inline-block;}
    .pdf-meta{text-align:right;font-size:12px;color:#6B7280;}
    .pdf-meta strong{display:block;font-size:14px;color:#1A1A2E;}
    .student-bar{background:#f0f9f5;border:1px solid #b6ecd8;border-radius:10px;padding:14px 20px;margin-bottom:28px;display:flex;gap:32px;flex-wrap:wrap;}
    .student-bar .item{display:flex;flex-direction:column;}
    .student-bar .lbl{font-size:11px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
    .student-bar .val{font-size:14px;font-weight:600;color:#1A1A2E;margin-top:2px;}
    .pdf-section{margin-bottom:32px;page-break-inside:avoid;}
    .pdf-section h2{font-size:16px;font-weight:700;color:#1D9E75;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #e2e4ea;display:flex;align-items:center;gap:8px;}
    .info-table{width:100%;border-collapse:collapse;}
    .info-table tr{border-bottom:1px solid #f0f1f5;}
    .info-table td{padding:10px 12px;font-size:13px;}
    .info-table td:first-child{color:#6B7280;width:220px;}
    .info-table .v{font-weight:600;}
    .data-table{width:100%;border-collapse:collapse;font-size:13px;}
    .data-table th{background:#f0f9f5;color:#0F6E56;font-weight:600;padding:10px 12px;text-align:left;border-bottom:2px solid #b6ecd8;}
    .data-table td{padding:10px 12px;border-bottom:1px solid #f0f1f5;}
    .data-table tbody tr:nth-child(even){background:#fafafa;}
    .reviewer-body{background:#f9fafb;border:1px solid #e2e4ea;border-radius:10px;padding:20px;font-size:13px;line-height:1.7;white-space:pre-wrap;}
    .pdf-footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e4ea;display:flex;justify-content:space-between;font-size:11px;color:#9CA3AF;}
    @media print{body{padding:20px;}.pdf-section{page-break-inside:avoid;}}`;

  const studentBar = `
    <div class="student-bar">
      <div class="item"><span class="lbl">Name</span><span class="val">${name}</span></div>
      <div class="item"><span class="lbl">Student ID</span><span class="val">${sid}</span></div>
      <div class="item"><span class="lbl">Grade/Year</span><span class="val">${grade}</span></div>
      <div class="item"><span class="lbl">Date</span><span class="val">${now}</span></div>
    </div>`;

  const sections = {
    summary: `<div class="pdf-section">
      <h2>📊 Learning Summary</h2>
      <table class="info-table">
        <tr><td>Total Lessons Studied</td><td class="v">${lessons}</td></tr>
        <tr><td>Total Quizzes Taken</td><td class="v">${quizzes.length}</td></tr>
        <tr><td>Average Quiz Score</td><td class="v" style="color:#1D9E75;">${avg!==null?avg+'%':'—'}</td></tr>
        <tr><td>Best Quiz Score</td><td class="v">${quizzes.length?Math.max(...quizzes.map(q=>q.score))+'%':'—'}</td></tr>
        <tr><td>Reviewers Generated</td><td class="v">${reviewers}</td></tr>
        <tr><td>Weak Topics Count</td><td class="v" style="color:#EF4444;">${weak.length}</td></tr>
        <tr><td>Strong Topics Count</td><td class="v" style="color:#1D9E75;">${strong.length}</td></tr>
      </table>
    </div>`,

    quizzes: `<div class="pdf-section">
      <h2>📝 Quiz Performance</h2>
      <table class="data-table">
        <thead><tr><th>Topic</th><th>Score</th><th>Correct</th><th>Date</th></tr></thead>
        <tbody>${quizzes.length ? quizzes.map(q=>`
          <tr>
            <td>${q.topic}</td>
            <td style="font-weight:700;color:${q.score>=75?'#1D9E75':'#EF4444'};">${q.score}%</td>
            <td>${q.correct}/${q.total}</td>
            <td style="font-size:12px;color:#6B7280;">${q.date}</td>
          </tr>`).join('') : '<tr><td colspan="4" style="text-align:center;color:#888;padding:16px;">No quizzes taken yet.</td></tr>'}
        </tbody>
      </table>
    </div>`,

    weaktopics: `<div class="pdf-section">
      <h2>⚠️ Weak Topics Report</h2>
      <p style="font-size:13px;color:#6B7280;margin-bottom:14px;">Topics where your average score is below 75%. Focus your review on these areas.</p>
      <table class="data-table">
        <thead><tr><th>Topic</th><th>Average Score</th><th>Quizzes Taken</th><th>Status</th></tr></thead>
        <tbody>${weak.length ? weak.map(([t,v])=>`
          <tr>
            <td style="font-weight:500;">${t}</td>
            <td style="font-weight:700;color:${v.avg<60?'#EF4444':'#EF9F27'};">${v.avg}%</td>
            <td>${v.scores.length}</td>
            <td><span style="background:${v.avg<60?'#FEE2E2':'#FAEEDA'};color:${v.avg<60?'#b91c1c':'#854F0B'};padding:2px 10px;border-radius:10px;font-size:12px;">${v.avg<60?'Needs Review':'Review Recommended'}</span></td>
          </tr>`).join('') : '<tr><td colspan="4" style="text-align:center;color:#1D9E75;padding:16px;">No weak topics — great job!</td></tr>'}
        </tbody>
      </table>
      ${strong.length ? `<h2 style="margin-top:24px;">✅ Strong Topics</h2>
      <table class="data-table">
        <thead><tr><th>Topic</th><th>Average Score</th><th>Quizzes Taken</th></tr></thead>
        <tbody>${strong.map(([t,v])=>`<tr><td>${t}</td><td style="color:#1D9E75;font-weight:700;">${v.avg}%</td><td>${v.scores.length}</td></tr>`).join('')}</tbody>
      </table>` : ''}
    </div>`,

    reviewer: `<div class="pdf-section">
      <h2>📚 Reviewer History</h2>
      <table class="data-table">
        <thead><tr><th>Topic</th><th>Type</th><th>Date Generated</th></tr></thead>
        <tbody>${revHistory.length ? revHistory.map(r=>`
          <tr><td style="font-weight:500;">${r.topic}</td><td>${r.type||'—'}</td><td style="font-size:12px;color:#6B7280;">${r.date}</td></tr>`).join('')
          : '<tr><td colspan="3" style="text-align:center;color:#888;padding:16px;">No reviewers generated yet.</td></tr>'}
        </tbody>
      </table>
    </div>`,

    reviewer_content: `<div class="pdf-section">
      <h2>📖 Personalized Reviewer: ${lastReviewerTopic}</h2>
      <div class="reviewer-body">${lastReviewerContent}</div>
    </div>`
  };

  let body  = '';
  let title = '';
  if (type==='all') {
    body  = sections.summary + sections.quizzes + sections.weaktopics + sections.reviewer;
    title = 'Complete Learning Report';
  } else {
    body  = sections[type] || '';
    const titles = { summary:'Learning Summary', quizzes:'Quiz Performance', weaktopics:'Weak Topics Report', reviewer:'Reviewer History', reviewer_content:`Personalized Reviewer — ${lastReviewerTopic}` };
    title = titles[type] || 'Report';
  }

  const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Acadify — ${title}</title>
<style>${pdfStyles}</style></head><body>
<div class="pdf-header">
  <div class="pdf-logo"><div class="dot"></div> Acadify</div>
  <div class="pdf-meta"><strong>${title}</strong>Generated: ${now}</div>
</div>
${studentBar}
${body}
<div class="pdf-footer">
  <span>Acadify — AI Learning Management System</span>
  <span>Confidential — For Student Use Only</span>
  <span>${now}</span>
</div>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`;

  const blob = new Blob([htmlContent], {type:'text/html'});
  const url  = URL.createObjectURL(blob);
  const filename = `Acadify_${title.replace(/\s+/g,'_')}_${now.replace(/\s+/g,'_').replace(/,/g,'')}.html`;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

// ================================================================
// HELPERS
// ================================================================
function escHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function formatAIText(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^### (.+)$/gm,'<h4 style="font-size:14px;font-weight:700;margin:14px 0 6px;color:var(--green-dark);">$1</h4>')
    .replace(/^## (.+)$/gm,'<h3 style="font-size:15px;font-weight:700;margin:16px 0 8px;color:var(--green-dark);">$1</h3>')
    .replace(/^# (.+)$/gm,'<h2 style="font-size:16px;font-weight:700;margin:18px 0 10px;color:var(--green-dark);">$1</h2>')
    .replace(/^- (.+)$/gm,'<li style="margin-bottom:4px;">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm,'<li style="margin-bottom:4px;"><strong>$1.</strong> $2</li>')
    .replace(/(<li.*<\/li>)/gs, '<ul style="padding-left:20px;margin:8px 0;">$1</ul>')
    .replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');
}

function closeModal() { document.getElementById('modal-overlay').style.display='none'; }

document.addEventListener('keydown', e => {
  if (e.key==='Escape') closeModal();
  if (e.key==='Enter' && document.getElementById('login-page').style.display!=='none') doLogin();
});

window.addEventListener('load', () => {
  const user = getSession();
  if (user) { launchApp(user); renderQuizHistory(); }
});
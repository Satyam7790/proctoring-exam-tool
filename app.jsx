import { useState } from 'react';
import './App.css';

const initialEvents = [
  {
    id: 1,
    time: '09:41:12',
    type: 'System',
    message: 'Demo workspace is ready.',
    level: 'info',
  },
  {
    id: 2,
    time: '09:41:16',
    type: 'Privacy',
    message: 'Camera and screen sharing are not connected in this scaffold.',
    level: 'notice',
  },
];

const questions = [
  {
    id: 1,
    prompt: 'Which data structure follows the FIFO principle?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
  },
  {
    id: 2,
    prompt: 'What is the average time complexity of binary search on a sorted array?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
  },
  {
    id: 3,
    prompt: 'Which HTTP method is commonly used to retrieve a resource?',
    options: ['GET', 'PATCH', 'DELETE', 'TRACE'],
  },
];

function Icon({ children }) {
  return <span className="nav-icon" aria-hidden="true">{children}</span>;
}

function App() {
  const [activePage, setActivePage] = useState('Overview');
  const [examStarted, setExamStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [events, setEvents] = useState(initialEvents);
  const [nextEventId, setNextEventId] = useState(3);
  const [showSetupNote, setShowSetupNote] = useState(true);

  function addDemoEvent() {
    const now = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setEvents((current) => [
      {
        id: nextEventId,
        time: now,
        type: 'Demo flag',
        message: 'Sample tab-visibility event added manually for UI testing.',
        level: 'warning',
      },
      ...current,
    ]);
    setNextEventId((current) => current + 1);
  }

  function chooseAnswer(questionId, option) {
    setAnswers((current) => ({ ...current, [questionId]: option }));
  }

  const pageSubtitle = {
    Overview: 'A simple workspace for exam monitoring and review.',
    'Candidate exam': 'Candidate-side exam interface preview.',
    'Event log': 'Review demo events recorded in this browser session.',
  }[activePage];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">HP</div>
          <div>
            <div className="brand-name">HACKATHON</div>
            <div className="brand-subtitle">PROCTOR</div>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {[
            { label: 'Overview', icon: '◫' },
            { label: 'Candidate exam', icon: '▣' },
            { label: 'Event log', icon: '≋' },
          ].map((item) => (
            <button
              className={`nav-item ${activePage === item.label ? 'active' : ''}`}
              key={item.label}
              onClick={() => setActivePage(item.label)}
            >
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status-dot" />
          <div>
            <div className="sidebar-status-title">Local prototype</div>
            <div className="sidebar-status-copy">No external services connected</div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {activePage}</div>
          <div className="topbar-right">
            <span className="prototype-badge"><span /> Prototype scaffold</span>
            <div className="avatar" title="Demo proctor">DP</div>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">REMOTE ASSESSMENT WORKSPACE</p>
            <h1>{activePage}</h1>
            <p className="page-description">{pageSubtitle}</p>
          </div>
          {activePage === 'Overview' && (
            <button className="primary-button" onClick={() => setActivePage('Candidate exam')}>
              <span aria-hidden="true">＋</span> Preview exam
            </button>
          )}
        </section>

        {showSetupNote && (
          <div className="setup-notice">
            <div className="notice-icon">i</div>
            <div className="notice-copy">
              <strong>Starter template only</strong>
              <span>Webcam streaming, identity verification, and automated detection are not implemented yet.</span>
            </div>
            <button className="icon-button" aria-label="Dismiss notice" onClick={() => setShowSetupNote(false)}>×</button>
          </div>
        )}

        {activePage === 'Overview' && (
          <>
            <section className="metric-grid" aria-label="Workspace summary">
              <MetricCard label="Active candidates" value="01" meta="Demo session" icon="♙" />
              <MetricCard label="Events logged" value={String(events.length).padStart(2, '0')} meta="This browser session" icon="≋" />
              <MetricCard label="Exam status" value={examStarted ? 'Live' : 'Ready'} meta={examStarted ? 'Local preview running' : 'Not started'} icon="◷" accent={examStarted} />
            </section>

            <section className="content-grid">
              <div className="panel candidate-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Candidate overview</h2>
                    <p>Sample candidate record</p>
                  </div>
                  <span className="status-pill neutral">Demo</span>
                </div>
                <div className="candidate-profile">
                  <div className="candidate-avatar">AR</div>
                  <div className="candidate-info">
                    <strong>Alex Rivera</strong>
                    <span>Candidate ID: HACK-0001</span>
                    <span className="candidate-email">candidate@example.test</span>
                  </div>
                  <span className={`status-pill ${examStarted ? 'success' : 'neutral'}`}>{examStarted ? 'In session' : 'Ready'}</span>
                </div>
                <div className="candidate-details">
                  <Detail label="Assessment" value="Hackathon qualifier" />
                  <Detail label="Duration" value="30 minutes (sample)" />
                  <Detail label="Monitoring" value="Not connected" />
                </div>
                <div className="panel-actions">
                  <button className="primary-button" onClick={() => setActivePage('Candidate exam')}>Open candidate preview <span aria-hidden="true">↗</span></button>
                  <button className="secondary-button" onClick={addDemoEvent}>Add sample event</button>
                </div>
              </div>

              <div className="panel events-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent events</h2>
                    <p>Local demonstration log</p>
                  </div>
                  <button className="text-button" onClick={() => setActivePage('Event log')}>View all <span aria-hidden="true">→</span></button>
                </div>
                <EventList events={events.slice(0, 4)} />
              </div>
            </section>

            <section className="panel roadmap-panel">
              <div className="panel-heading">
                <div>
                  <h2>Development checklist</h2>
                  <p>Suggested next steps for this prototype</p>
                </div>
                <span className="status-pill neutral">In progress</span>
              </div>
              <div className="checklist-grid">
                <ChecklistItem state="done" title="React + Vite setup" description="Project shell and navigation" />
                <ChecklistItem state="todo" title="Camera permission" description="Connect browser webcam preview" />
                <ChecklistItem state="todo" title="Screen sharing" description="Request display-capture permission" />
                <ChecklistItem state="todo" title="Remote proctor feed" description="Prototype WebRTC connection" />
              </div>
            </section>
          </>
        )}

        {activePage === 'Candidate exam' && (
          <section className="exam-layout">
            <div className="panel exam-panel">
              <div className="panel-heading">
                <div>
                  <h2>Programming fundamentals</h2>
                  <p>Sample multiple-choice assessment</p>
                </div>
                <span className={`status-pill ${examStarted ? 'success' : 'neutral'}`}>{examStarted ? 'Preview started' : 'Not started'}</span>
              </div>
              <div className="exam-instructions">
                <strong>Before you begin</strong>
                <p>This is a UI preview. Answers stay in the current browser session and are not submitted to a server.</p>
              </div>
              {questions.map((question, index) => (
                <div className="question-card" key={question.id}>
                  <div className="question-number">QUESTION {String(index + 1).padStart(2, '0')}</div>
                  <h3>{question.prompt}</h3>
                  <div className="option-list">
                    {question.options.map((option) => (
                      <label className={`option-row ${answers[question.id] === option ? 'selected' : ''}`} key={option}>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={answers[question.id] === option}
                          onChange={() => chooseAnswer(question.id, option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="exam-footer">
                <span>{Object.keys(answers).length} of {questions.length} answered</span>
                <button className="primary-button" onClick={() => setExamStarted(true)}>
                  {examStarted ? 'Preview in progress' : 'Start local preview'}
                </button>
              </div>
            </div>

            <aside className="panel monitoring-panel">
              <div className="panel-heading">
                <div><h2>Monitoring preview</h2><p>Browser permissions not connected</p></div>
              </div>
              <div className="media-placeholder">
                <div className="media-symbol">▣</div>
                <strong>Camera preview</strong>
                <span>Not connected</span>
              </div>
              <div className="media-placeholder screen-placeholder">
                <div className="media-symbol">▤</div>
                <strong>Screen share</strong>
                <span>Not connected</span>
              </div>
              <p className="privacy-note">No audio or video is being recorded or transmitted by this starter template.</p>
            </aside>
          </section>
        )}

        {activePage === 'Event log' && (
          <section className="panel full-events-panel">
            <div className="panel-heading">
              <div><h2>Event log</h2><p>Events added during this local session</p></div>
              <button className="secondary-button" onClick={addDemoEvent}>Add sample event</button>
            </div>
            <EventList events={events} expanded />
            <button className="text-button clear-events" onClick={() => setEvents([])}>Clear local log</button>
          </section>
        )}

        <footer className="footer-note">
          <span>Hackathon Proctor</span>
          <span>Educational prototype · Synthetic demo data only</span>
        </footer>
      </main>
    </div>
  );
}

function MetricCard({ label, value, meta, icon, accent = false }) {
  return (
    <div className="metric-card">
      <div className="metric-topline"><span>{label}</span><span className="metric-icon">{icon}</span></div>
      <div className={`metric-value ${accent ? 'metric-live' : ''}`}>{value}</div>
      <div className="metric-meta"><span className={accent ? 'live-dot' : 'muted-dot'} />{meta}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return <div className="detail-row"><span>{label}</span><strong>{value}</strong></div>;
}

function EventList({ events, expanded = false }) {
  if (events.length === 0) {
    return <div className="empty-state">No events in this session.</div>;
  }

  return (
    <div className={`event-list ${expanded ? 'expanded' : ''}`}>
      {events.map((event) => (
        <div className="event-row" key={event.id}>
          <div className={`event-symbol ${event.level}`}>{event.level === 'warning' ? '!' : event.level === 'notice' ? 'i' : '✓'}</div>
          <div className="event-body">
            <div className="event-title-row"><strong>{event.type}</strong><time>{event.time}</time></div>
            <p>{event.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChecklistItem({ state, title, description }) {
  return (
    <div className="checklist-item">
      <span className={`check-icon ${state}`}>{state === 'done' ? '✓' : '·'}</span>
      <div><strong>{title}</strong><p>{description}</p></div>
      <span className={`check-state ${state}`}>{state === 'done' ? 'Done' : 'Planned'}</span>
    </div>
  );
}

export default App;

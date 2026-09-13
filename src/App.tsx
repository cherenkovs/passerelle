import { Suspense, lazy, useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { requestPersistence } from '@/lib/storage'
import { CoursePage } from '@/pages/Course'
import { Dashboard } from '@/pages/Dashboard'
import { ExamPage } from '@/pages/Exam'
import { LessonPage } from '@/pages/Lesson'
import { LibraryPage, StoryPage } from '@/pages/Library'
import { NotebookPage } from '@/pages/Notebook'
import { Onboarding } from '@/pages/Onboarding'
import { PlacementPage } from '@/pages/Placement'
import { QuizPage } from '@/pages/Quiz'
import { ReferencePage } from '@/pages/Reference'
import { ReviewPage } from '@/pages/Review'
import { SettingsPage } from '@/pages/Settings'
import { ScenarioPage, TutorPage } from '@/pages/Tutor'
import { VideoPage, VideosPage } from '@/pages/Videos'
import { VocabularyPage } from '@/pages/Vocabulary'
import { WritingPage, WritingTaskPage } from '@/pages/Writing'
import { useLearner } from '@/store/learner'

// Charts pull in Recharts, which is by far the heaviest dependency — and the
// progress screen is the one page a learner rarely opens mid-lesson.
const ProgressPage = lazy(() =>
  import('@/pages/Progress').then((m) => ({ default: m.ProgressPage })),
)

function PageFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="border-line border-t-primary size-8 animate-spin rounded-full border-2" />
    </div>
  )
}

/** Everything behind the app shell requires a learner profile. */
function RequireProfile({ children }: { children: React.ReactNode }) {
  const hasProfile = useLearner((s) => s.profiles.some((p) => p.id === s.activeId))
  const location = useLocation()

  if (!hasProfile) return <Navigate to="/onboarding" replace state={{ from: location }} />
  return <AppShell>{children}</AppShell>
}

export default function App() {
  useEffect(() => {
    // Ask the browser not to evict this origin's data on its own when space
    // runs short. It does nothing against a deliberate clear-out — see
    // lib/storage.ts — but it removes the one loss the learner never chose.
    void requestPersistence()
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          path="/*"
          element={
            <RequireProfile>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/course" element={<CoursePage />} />
                <Route path="/placement" element={<PlacementPage />} />
                <Route path="/lesson/:id" element={<LessonPage />} />
                <Route path="/quiz/:moduleId" element={<QuizPage />} />
                <Route path="/exam/:courseId" element={<ExamPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/vocabulary" element={<VocabularyPage />} />
                <Route path="/reference" element={<ReferencePage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/story/:id" element={<StoryPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/writing" element={<WritingPage />} />
                <Route path="/writing/:id" element={<WritingTaskPage />} />
                <Route path="/video/:id" element={<VideoPage />} />
                <Route path="/tutor" element={<TutorPage />} />
                <Route path="/tutor/:id" element={<ScenarioPage />} />
                <Route path="/notebook" element={<NotebookPage />} />
                <Route
                  path="/progress"
                  element={
                    <Suspense fallback={<PageFallback />}>
                      <ProgressPage />
                    </Suspense>
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </RequireProfile>
          }
        />
      </Routes>
    </HashRouter>
  )
}

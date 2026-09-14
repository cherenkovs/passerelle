import { Loader2, RefreshCw, WifiOff } from 'lucide-react'
import { Suspense, lazy, useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/common/toaster'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { initSync, useSync } from '@/lib/sync'
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
  const restoring = useSync((s) => s.restoring)
  const syncError = useSync((s) => s.error)
  const location = useLocation()

  // The account's data is still arriving. Sending them to onboarding here would
  // mean a returning learner is asked to set up a course they already have,
  // every time they open the app.
  if (restoring && !hasProfile) return <Loading />

  // Nothing is kept in this browser, so without a connection there is genuinely
  // nothing to show. Say that, rather than spinning forever on a request that
  // cannot arrive.
  if (syncError && !hasProfile) return <Offline message={syncError} />

  if (!hasProfile) return <Navigate to="/onboarding" replace state={{ from: location }} />
  return <AppShell>{children}</AppShell>
}

function Loading() {
  return (
    <div className="bg-bg grid min-h-[100dvh] place-items-center px-6">
      <div className="text-fg-muted flex flex-col items-center gap-3">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">Завантажую твій акаунт…</p>
      </div>
    </div>
  )
}

function Offline({ message }: { message: string }) {
  return (
    <div className="bg-bg grid min-h-[100dvh] place-items-center px-6">
      <div className="max-w-sm text-center">
        <WifiOff className="text-fg-subtle mx-auto size-8" />
        <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight">Немає зв’язку</h1>
        <p className="text-fg-muted mt-2 text-[14px] leading-relaxed text-pretty">
          Прогрес зберігається у твоєму акаунті, тож для навчання потрібен інтернет. Перевір
          з’єднання і спробуй ще раз.
        </p>
        <p className="text-fg-subtle mt-3 font-mono text-[11px] break-words">{message}</p>
        <Button className="mt-5" onClick={() => window.location.reload()}>
          <RefreshCw className="size-4" /> Спробувати ще раз
        </Button>
      </div>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    // Asks Firebase who is signed in, and follows that for the session.
    void initSync()
  }, [])

  return (
    <HashRouter>
      {/* At the root, not in the shell: onboarding has no shell, and signing
          in — which is the first thing worth reporting — happens there. */}
      <Toaster />
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

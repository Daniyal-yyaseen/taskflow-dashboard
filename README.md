# Taskflow — Task Management and Activity Dashboard

React assignment solution for Web Engineering / Frontend Development (CLO1 & CLO2). Runs locally with Vite. No backend, account, API key, or deployment is required to run the app.

## Run locally

Use Node.js 24.15+ (the project was verified with Node.js 24.19). Then open a terminal in this folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Local URL printed in the terminal (normally http://127.0.0.1:5173). On Windows, `npm.cmd` works even when PowerShell blocks `npm.ps1`. On other operating systems, use `npm` instead. Press Ctrl+C to stop the server.

```powershell
npm.cmd run build
npm.cmd run preview
```

Run `npm.cmd test` for automated DOM interaction checks covering validation, task operations, combined filtering, activity logging, theme, persistence, empty states, and corrupt storage recovery.

The build command creates the production files in `dist/`; preview serves them locally.

## Features

- Add, edit, delete, complete, reopen, and change the status of tasks.
- Task title validation, optional description and due date, three priorities, and overdue labels.
- Status tabs, priority filter, and case-insensitive search across titles and descriptions. Filters combine together.
- Live total, in-progress, completed, and active high-priority metrics; completion progress.
- Light and dark themes using React Context, responsive layout, labeled inputs, and keyboard access.
- Tasks, theme, and the latest 50 activity entries persist in browser localStorage. New users see three sample tasks; deleting all tasks preserves an empty workspace after refresh.
- Class component activity timeline and timed notifications for task operations, filter changes, and theme changes.

Data stays in the current browser and origin. Different ports or browsers have separate workspaces. The optional Google Fonts stylesheet uses the internet; the application falls back to system fonts offline. No other external services are used.

## Assignment requirements and implementation

| Requirement | Implementation |
| --- | --- |
| Task 1: modular component architecture | `src/components/class/ActivityLogger.jsx`, `src/components/functional/TaskForm.jsx`, `TaskList.jsx`, `TaskCard.jsx`, `CardWrapper.jsx`, plus Header, MetricsSummary, ThemeToggle, and Icon |
| Task 2: functional components, props, callbacks, children | App owns task data and passes props and callback handlers to the functional components. CardWrapper renders `children` in a reusable section. |
| Task 3: class component and lifecycle | ActivityLogger extends Component and explicitly uses `this.state` and `this.setState`. `componentDidMount` restores logs; `componentDidUpdate` processes new events, persists logs, and starts notification timers; `componentWillUnmount` clears the timer. |
| Task 4: JSX and JavaScript | JSX expressions display counts and computed values; ternaries render empty states and theme labels; `&&` renders descriptions, validation, and priority indicators; `.map()` uses unique keys; React synthetic handlers cover clicks, changes, and submits. |
| useState | App task/filter/edit/event state; controlled TaskForm fields; custom storage hook. |
| useEffect | Persist localStorage, apply document theme, update document title with active tasks, and reset/focus form when editing changes. |
| useContext | `src/context/ThemeContext.jsx` provides theme and toggle without prop drilling. ThemeToggle consumes it through useTheme. |
| useRef | TaskForm focuses the main input on mount, when editing, after invalid input, and after submission. |
| useMemo | Memoized combined task filtering and theme context value. |
| useCallback | Stable save/delete/status/filter/log handlers and theme toggle; TaskCard uses React.memo. |
| hooks directory | `src/hooks/useLocalStorage.js` provides reusable validated reads and state persistence with storage error handling. |

## Project layout

```text
src/
  components/
    class/
      ActivityLogger.jsx
    functional/
      CardWrapper.jsx
      Header.jsx
      Icon.jsx
      MetricsSummary.jsx
      TaskCard.jsx
      TaskForm.jsx
      TaskList.jsx
      ThemeToggle.jsx
  context/
    ThemeContext.jsx
  hooks/
    useLocalStorage.js
  App.jsx
  main.jsx
  styles.css
```

## Local review checklist

1. Add a task with whitespace-only title: validation should display and focus the input. Add a valid task and check the totals, notification, and activity timeline.
2. Edit its title/priority/date; change its status and toggle completion; check the metrics and progress.
3. Combine status, priority, and search filters; use Clear filters for a no-results state.
4. Switch the theme and refresh. Check that tasks, theme, and logs persist.
5. Delete a task; delete all tasks to inspect the empty state and refresh to verify it stays empty.
6. Resize the browser to a phone width and test keyboard focus through form fields and task actions.

The source is available as a public GitHub repository. Public deployment and the Word screenshot submission remain deferred; use the commands above to run locally.

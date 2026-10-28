import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost:5173' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.HTMLElement.prototype.scrollIntoView = () => {};

const React = await import('react');
const { createRoot } = await import('react-dom/client');
const { act } = React;
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
let root;
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { ThemeProvider } = await server.ssrLoadModule('/src/context/ThemeContext.jsx');
  const mount = async () => {
    root = createRoot(document.getElementById('root'));
    await act(async () => root.render(React.createElement(React.StrictMode, null, React.createElement(ThemeProvider, null, React.createElement(App)))));
  };
  const click = async element => { assert.ok(element, 'Expected clickable element'); await act(async () => element.click()); };
  const fill = async (selector, value) => {
    const element = document.querySelector(selector);
    assert.ok(element, selector);
    const proto = element.tagName === 'SELECT' ? dom.window.HTMLSelectElement.prototype : dom.window.HTMLInputElement.prototype;
    await act(async () => {
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(element, value);
      element.dispatchEvent(new dom.window.Event(element.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    });
  };
  const submit = async () => { await act(async () => document.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }))); };
  const storedTasks = () => JSON.parse(localStorage.getItem('taskflow-tasks'));
  const buttonNamed = name => [...document.querySelectorAll('button')].find(button => button.textContent === name);

  await mount();
  assert.equal(document.querySelectorAll('.task-item').length, 3);
  assert.equal(document.activeElement.id, 'task-title');
  assert.equal(document.title, '2 active tasks · Taskflow');
  await fill('#task-title', '   ');
  await submit();
  assert.match(document.getElementById('title-error').textContent, /enter a task title/);
  assert.equal(storedTasks().length, 3);

  await fill('#task-title', 'Integration task');
  await fill('#priority', 'high');
  await fill('#due-date', '2025-01-01');
  await submit();
  assert.equal(storedTasks().length, 4);
  assert.equal(storedTasks()[0].title, 'Integration task');
  assert.match(document.querySelector('.activity-list').textContent, /Added “Integration task”/);
  assert.match(document.querySelector('.toast').textContent, /Added/);
  assert.equal(document.activeElement.id, 'task-title');
  assert.match(document.querySelector('.overdue').textContent, /Overdue/);

  await click(document.querySelector('[aria-label="Edit Integration task"]'));
  await fill('#task-title', 'Revised task');
  await submit();
  assert.equal(storedTasks()[0].title, 'Revised task');
  await click(document.querySelector('[aria-label="Complete Revised task"]'));
  assert.equal(storedTasks()[0].status, 'completed');
  assert.equal(document.title, '2 active tasks · Taskflow');
  await click(document.querySelector('[aria-label="Reopen Revised task"]'));
  assert.equal(storedTasks()[0].status, 'pending');
  await fill('[aria-label="Status of Revised task"]', 'in-progress');
  assert.equal(storedTasks()[0].status, 'in-progress');

  await click(buttonNamed('In progress'));
  await fill('[aria-label="Filter by priority"]', 'high');
  await fill('[aria-label="Search tasks"]', 'REVISED');
  assert.equal(document.querySelectorAll('.task-item').length, 1);
  await fill('[aria-label="Search tasks"]', 'no such task');
  assert.match(document.querySelector('.empty-state').textContent, /No matching tasks/);
  await click(buttonNamed('Clear filters'));
  assert.equal(document.querySelectorAll('.task-item').length, 4);

  await click(document.querySelector('.theme-toggle'));
  assert.equal(document.documentElement.dataset.theme, 'dark');
  const logsBefore = JSON.parse(localStorage.getItem('taskflow-activity')).length;
  assert.ok(logsBefore >= 8);
  await act(async () => root.unmount());
  await mount();
  assert.equal(storedTasks().length, 4);
  assert.equal(document.documentElement.dataset.theme, 'dark');
  assert.equal(JSON.parse(localStorage.getItem('taskflow-activity')).length, logsBefore);
  await click(document.querySelector('[aria-label="Delete Revised task"]'));
  assert.equal(storedTasks().length, 3);
  while (document.querySelector('.delete-button')) await click(document.querySelector('.delete-button'));
  assert.match(document.querySelector('.empty-state').textContent, /A fresh start/);
  await act(async () => root.unmount());
  await mount();
  assert.equal(document.querySelectorAll('.task-item').length, 0);
  assert.equal(document.title, '0 active tasks · Taskflow');

  await act(async () => root.unmount());
  localStorage.setItem('taskflow-tasks', '{invalid json');
  localStorage.setItem('taskflow-activity', '{invalid json');
  await mount();
  assert.equal(document.querySelectorAll('.task-item').length, 3);
  assert.equal(JSON.parse(localStorage.getItem('taskflow-activity')).length, 0);
  console.log('PASS: validation, focus, add/edit/delete, statuses, combined filters, search, activity notifications, theme, remount persistence, empty state, and corrupt storage recovery.');
} finally {
  if (root) await act(async () => root.unmount());
  await server.close();
  dom.window.close();
}

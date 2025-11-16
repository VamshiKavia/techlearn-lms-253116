import React from 'react';
import { Link } from 'react-router-dom';

/**
 * StudentSoftwareTesting
 * PUBLIC_INTERFACE
 * A mock content page for the Software Testing path. Displays tracks, modules, lessons and resources.
 * Lessons link to the existing LessonPlayer using /student/courses/:courseId/lessons/:lessonId.
 */
const StudentSoftwareTesting = () => {
  // Mock structure for Software Testing path
  const tracks = [
    {
      id: 'manual-testing',
      title: 'Manual Testing Fundamentals',
      description: 'Core concepts of software quality, SDLC/STLC, and test case design.',
      modules: [
        {
          id: 'mt-mod-1',
          title: 'Testing Basics',
          lessons: [
            { id: 'mt-vid-1', title: 'What is Software Testing?', type: 'video' },
            { id: 'mt-pdf-1', title: 'SDLC vs STLC (PDF)', type: 'pdf' },
            { id: 'mt-text-1', title: 'Test Case Design Principles', type: 'text' },
          ],
          resources: [
            { title: 'ISTQB Foundation Syllabus (PDF)', url: '#', kind: 'pdf' },
            { title: 'TestRail - Test Case Management', url: '#', kind: 'link' },
          ],
        },
        {
          id: 'mt-mod-2',
          title: 'Test Planning & Execution',
          lessons: [
            { id: 'mt-vid-2', title: 'Writing Effective Test Plans', type: 'video' },
            { id: 'mt-pdf-2', title: 'Bug Reporting Templates (PDF)', type: 'pdf' },
          ],
          resources: [
            { title: 'Sample Test Plan (Google Docs)', url: '#', kind: 'link' },
          ],
        },
      ],
    },
    {
      id: 'automation-testing',
      title: 'Automation Testing with Selenium & Cypress',
      description: 'Set up frameworks, write robust tests, and integrate with CI/CD.',
      modules: [
        {
          id: 'at-mod-1',
          title: 'Selenium with JavaScript',
          lessons: [
            { id: 'at-vid-1', title: 'Selenium WebDriver Setup', type: 'video' },
            { id: 'at-pdf-1', title: 'Selectors Cheat Sheet (PDF)', type: 'pdf' },
          ],
          resources: [
            { title: 'Selenium Docs', url: 'https://www.selenium.dev/documentation/', kind: 'link' },
          ],
        },
        {
          id: 'at-mod-2',
          title: 'Cypress for Frontend E2E',
          lessons: [
            { id: 'at-vid-2', title: 'Cypress Test Runner Overview', type: 'video' },
            { id: 'at-text-2', title: 'Best Practices: Flake Reduction', type: 'text' },
          ],
          resources: [
            { title: 'Cypress Docs', url: 'https://docs.cypress.io', kind: 'link' },
          ],
        },
      ],
    },
    {
      id: 'performance-security',
      title: 'Performance and Security Testing',
      description: 'Understand load testing, basic security testing, and tooling.',
      modules: [
        {
          id: 'ps-mod-1',
          title: 'Performance Testing with k6',
          lessons: [
            { id: 'ps-vid-1', title: 'Getting Started with k6', type: 'video' },
          ],
          resources: [
            { title: 'k6 Docs', url: 'https://k6.io/docs/', kind: 'link' },
          ],
        },
        {
          id: 'ps-mod-2',
          title: 'Security Testing Basics',
          lessons: [
            { id: 'ps-text-2', title: 'OWASP Top 10 Overview', type: 'text' },
          ],
          resources: [
            { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', kind: 'link' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="page-wrap">
      <h1 className="section-title mb-2">Software Testing Paths</h1>
      <p className="section-subtitle mb-6">
        Explore curated tracks to become a well-rounded QA engineer. Select a lesson to start learning.
      </p>

      <div className="space-y-8">
        {tracks.map((track) => (
          <div key={track.id} className="track-card">
            <div className="track-card__head">
              <h2 className="track-card__title">{track.title}</h2>
              {track.description && <p className="track-card__desc">{track.description}</p>}
            </div>

            <div className="modules-wrap">
              {track.modules.map((mod) => (
                <div key={mod.id}>
                  <h3 className="module-title mb-2">{mod.title}</h3>

                  <div className="lesson-grid">
                    {mod.lessons.map((lesson) => (
                      <Link
                        data-testid={`testing-lesson-${lesson.id}`}
                        key={lesson.id}
                        className="lesson-card"
                        to={`/student/courses/mock-course/lessons/${lesson.id}`}
                      >
                        <div className="lesson-card__row">
                          <span className="lesson-title">{lesson.title}</span>
                          <span className="badge">{lesson.type}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {mod.resources?.length > 0 && (
                    <div className="resources">
                      <h4 className="resources-title">Resources</h4>
                      <ul className="resource-list">
                        {mod.resources.map((res, idx) => (
                          <li key={idx}>
                            <a
                              className="resource-link"
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {res.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSoftwareTesting;

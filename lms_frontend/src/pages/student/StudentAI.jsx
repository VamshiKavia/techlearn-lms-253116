import React from 'react';
import { Link } from 'react-router-dom';

/**
 * StudentAI
 * PUBLIC_INTERFACE
 * A mock content page for the AI path. Displays tracks, modules, lessons and resources.
 * Lessons link to the existing LessonPlayer using /student/courses/:courseId/lessons/:lessonId.
 */
const StudentAI = () => {
  const tracks = [
    {
      id: 'ai-foundations',
      title: 'AI Foundations',
      description: 'Math basics and machine learning fundamentals.',
      modules: [
        {
          id: 'aif-mod-1',
          title: 'Math & ML Basics',
          lessons: [
            { id: 'ai-vid-1', title: 'Linear Algebra for ML', type: 'video' },
            { id: 'ai-pdf-1', title: 'Probability Refresher (PDF)', type: 'pdf' },
            { id: 'ai-text-1', title: 'Supervised vs Unsupervised', type: 'text' },
          ],
          resources: [
            { title: 'Andrew Ng ML Notes', url: '#', kind: 'link' },
          ],
        },
      ],
    },
    {
      id: 'deep-learning',
      title: 'Deep Learning',
      description: 'Neural networks, CNNs, RNNs, and training best practices.',
      modules: [
        {
          id: 'dl-mod-1',
          title: 'Neural Networks',
          lessons: [
            { id: 'dl-vid-1', title: 'Feedforward Networks', type: 'video' },
            { id: 'dl-text-1', title: 'Activation Functions Explained', type: 'text' },
          ],
          resources: [
            { title: 'DeepLearning.ai', url: 'https://www.deeplearning.ai', kind: 'link' },
          ],
        },
        {
          id: 'dl-mod-2',
          title: 'Computer Vision & NLP',
          lessons: [
            { id: 'dl-vid-2', title: 'CNN Intuition', type: 'video' },
            { id: 'dl-pdf-2', title: 'Attention Is All You Need (Paper PDF)', type: 'pdf' },
          ],
          resources: [
            { title: 'Papers with Code', url: 'https://paperswithcode.com/', kind: 'link' },
          ],
        },
      ],
    },
    {
      id: 'genai-llms',
      title: 'Generative AI & LLMs',
      description: 'Prompt engineering, fine-tuning, and RAG systems.',
      modules: [
        {
          id: 'gen-mod-1',
          title: 'Prompt Engineering',
          lessons: [
            { id: 'gen-vid-1', title: 'Prompting Patterns', type: 'video' },
            { id: 'gen-text-1', title: 'Chain-of-Thought Basics', type: 'text' },
          ],
          resources: [
            { title: 'OpenAI Cookbook', url: 'https://github.com/openai/openai-cookbook', kind: 'link' },
          ],
        },
        {
          id: 'gen-mod-2',
          title: 'RAG and Fine-tuning',
          lessons: [
            { id: 'gen-vid-2', title: 'RAG System Overview', type: 'video' },
            { id: 'gen-pdf-2', title: 'Vector Databases 101 (PDF)', type: 'pdf' },
          ],
          resources: [
            { title: 'LangChain Docs', url: 'https://python.langchain.com', kind: 'link' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="page-wrap">
      <h1 className="section-title mb-2">AI Learning Paths</h1>
      <p className="section-subtitle mb-6">
        Learn AI foundations, deep learning, and generative AI. Select a lesson to start learning.
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
                        data-testid={`ai-lesson-${lesson.id}`}
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

export default StudentAI;

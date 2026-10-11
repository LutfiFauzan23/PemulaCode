import { useProgressStore } from '../progress-store';

const getState = () => useProgressStore.getState();

beforeEach(() => {
  getState().resetProgress();
});

describe('progress-store initial state', () => {
  test('starts with the first module of each course available', () => {
    const { modules } = getState();

    expect(modules['html-01'].status).toBe('available');
    expect(modules['css-01'].status).toBe('available');
    expect(modules['js-01'].status).toBe('available');
  });

  test('starts with later modules locked and the last one coming soon', () => {
    const { modules } = getState();

    expect(modules['html-02'].status).toBe('locked');
    expect(modules['html-03'].status).toBe('coming_soon');
  });

  test('reports zero progress before anything is completed', () => {
    expect(getState().getOverallProgress()).toBe(0);
    expect(getState().getCourseProgress('html')).toBe(0);
  });
});

describe('completeQuiz', () => {
  test('marks the module completed and unlocks the next one', () => {
    getState().completeQuiz('html', 'html-01');

    const { modules } = getState();
    expect(modules['html-01']).toMatchObject({
      status: 'completed',
      progress: 100,
      quizCompleted: true,
    });
    expect(modules['html-02'].status).toBe('available');
  });

  test('accepts legacy module id aliases', () => {
    getState().completeQuiz('html', 'html-module-1');

    expect(getState().modules['html-01'].status).toBe('completed');
  });

  test('does not unlock a module that is still coming soon', () => {
    getState().completeQuiz('html', 'html-02');

    expect(getState().modules['html-02'].status).toBe('completed');
    expect(getState().modules['html-03'].status).toBe('coming_soon');
  });

  test('ignores unknown module ids without throwing', () => {
    expect(() => getState().completeQuiz('html', 'does-not-exist')).not.toThrow();
    expect(getState().modules['html-01'].status).toBe('available');
  });
});

describe('updateModuleProgress', () => {
  test('ignores progress for a locked module', () => {
    getState().updateModuleProgress('html', 'html-02', 50);

    expect(getState().modules['html-02']).toMatchObject({ status: 'locked', progress: 0 });
  });

  test('moves an available module into progress', () => {
    getState().updateModuleProgress('html', 'html-01', 40);

    expect(getState().modules['html-01']).toMatchObject({ status: 'in_progress', progress: 40 });
  });

  test('never regresses and clamps at 100', () => {
    getState().updateModuleProgress('html', 'html-01', 60);
    getState().updateModuleProgress('html', 'html-01', 20);
    expect(getState().modules['html-01'].progress).toBe(60);

    getState().updateModuleProgress('html', 'html-01', 150);
    expect(getState().modules['html-01'].progress).toBe(100);
  });

  test('does not overwrite a completed module', () => {
    getState().completeQuiz('html', 'html-01');
    getState().updateModuleProgress('html', 'html-01', 10);

    expect(getState().modules['html-01']).toMatchObject({ status: 'completed', progress: 100 });
  });
});

describe('progress calculations', () => {
  test('computes course progress while excluding coming-soon modules', () => {
    getState().completeQuiz('html', 'html-01');

    // html-01 and html-02 count, html-03 is coming soon.
    expect(getState().getCourseProgress('html')).toBe(50);
  });

  test('normalizes the js course alias to javascript', () => {
    getState().completeQuiz('javascript', 'js-01');

    expect(getState().getCourseProgress('js')).toBe(50);
    expect(getState().getCourseProgress('javascript')).toBe(50);
  });

  test('computes overall progress across non-coming-soon modules', () => {
    getState().completeQuiz('html', 'html-01');

    // 6 modules are not coming soon; 1 of them is complete.
    expect(getState().getOverallProgress()).toBe(17);
  });
});

describe('resetProgress', () => {
  test('restores the initial state', () => {
    getState().completeQuiz('html', 'html-01');
    getState().resetProgress();

    expect(getState().modules['html-01'].status).toBe('available');
    expect(getState().getOverallProgress()).toBe(0);
  });
});

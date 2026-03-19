import React from 'react';
import { PopupCalendar } from './components/Calendar';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * 万年历应用主界面
 */
function App(): React.JSX.Element {
  return (
    <div className="bg-transparent">
      <ErrorBoundary>
        <PopupCalendar />
      </ErrorBoundary>
    </div>
  );
}

export default App;

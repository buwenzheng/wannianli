import React from 'react';
import { PopupCalendar } from './components/Calendar';

/**
 * 万年历应用主界面
 */
function App(): React.JSX.Element {
  return (
    <div className="bg-transparent">
      <PopupCalendar />
    </div>
  );
}

export default App;

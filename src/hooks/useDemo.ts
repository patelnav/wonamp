import { useCallback, useEffect, useState } from 'react';

interface DemoState {
  isRunning: boolean;
  currentStep: number;
  targetElement: HTMLElement | null;
  isClicking: boolean;
  isDragging: boolean;
}

interface CustomWindow extends Window {
  __handleDemoFile?: () => Promise<void>;
}

export function useDemo() {
  const [state, setState] = useState<DemoState>({
    isRunning: false,
    currentStep: 0,
    targetElement: null,
    isClicking: false,
    isDragging: false,
  });

  const startDemo = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const stopDemo = useCallback(() => {
    setState({
      isRunning: false,
      currentStep: 0,
      targetElement: null,
      isClicking: false,
      isDragging: false,
    });
  }, []);

  const moveToElement = useCallback((element: HTMLElement) => {
    setState(prev => ({ ...prev, targetElement: element }));
  }, []);

  const simulateClick = useCallback(() => {
    setState(prev => ({ ...prev, isClicking: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isClicking: false }));
    }, 300);
  }, []);

  const startDragging = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const stopDragging = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  useEffect(() => {
    if (!state.isRunning) return;

    const sequence = async () => {
      try {
        // Start from top right corner
        // const startPosition = { x: 0, y: 0 };
        // moveToElement({
        //   getBoundingClientRect: () => ({
        //     left: startPosition.x - 50,
        //     top: startPosition.y + 100,
        //     width: 100,
        //     height: 100
        //   })
        // } as HTMLElement);

        // await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 1: Move to and click the image button
        const imageButton = document.querySelector('[data-demo="upload-button"]');
        if (!(imageButton instanceof HTMLElement)) {
          console.error('Image button not found');
          return;
        }

        console.log('Moving to image button');
        moveToElement(imageButton);
        await new Promise(resolve => setTimeout(resolve, 1500));
        simulateClick();
        imageButton.click();

        // Step 2: Wait for dialog and start dragging the demo file
        await new Promise(resolve => setTimeout(resolve, 1000));
        startDragging(); // This shows californication.jpg being dragged
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 3: Move to dropzone and drop the file
        const dropZone = document.querySelector('[data-demo="drop-zone"]');
        if (!(dropZone instanceof HTMLElement)) {
          console.error('Drop zone not found');
          return;
        }

        console.log('Moving to drop zone');
        moveToElement(dropZone);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Drop the file
        stopDragging();
        simulateClick();

        // Step 4: Process the file
        console.log('Processing file');
        const handleDemoFile = (window as CustomWindow).__handleDemoFile;
        if (handleDemoFile) {
          await handleDemoFile();
        }

        // End demo after file is processed
        await new Promise(resolve => setTimeout(resolve, 1500));
        stopDemo();
      } catch (error) {
        console.error('Demo sequence error:', error);
        stopDemo();
      }
    };

    sequence();
  }, [state.isRunning, moveToElement, simulateClick, startDragging, stopDragging, stopDemo]);

  return {
    isRunning: state.isRunning,
    targetElement: state.targetElement,
    isClicking: state.isClicking,
    isDragging: state.isDragging,
    startDemo,
    stopDemo,
  };
} 
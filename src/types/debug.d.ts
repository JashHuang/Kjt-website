interface KjtDebugController {
  mounted: boolean;
  markMounted: () => void;
  setStatus: (message: string) => void;
  show: (message: string) => void;
}

interface Window {
  __KJT_DEBUG__?: KjtDebugController;
}

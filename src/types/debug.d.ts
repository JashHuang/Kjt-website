interface KjtDebugController {
  mounted: boolean;
  markMounted: () => void;
  show: (message: string) => void;
}

interface Window {
  __KJT_DEBUG__?: KjtDebugController;
}

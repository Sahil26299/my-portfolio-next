import Lottie from "react-lottie";

/**
 * LottieProvider interface
 */
interface LottieFileType {
  v: string;
  fr: number;
  ip: number;
  op: number;
  layers: any[];
  assets: any[];
}
export interface lottieAnimProviderProptypes {
  animationFile: LottieFileType;
  height?: number;
  width?: number;
  autoplay?: boolean;
  loop?: boolean;
}
function LottieAnimProvider({
  animationFile,
  height = 250,
  width = 250,
  autoplay = true,
  loop = true,
}: lottieAnimProviderProptypes) {
  const defaultOptions = {
    loop: loop,
    autoplay: autoplay,
    animationData: animationFile,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      <Lottie
        options={defaultOptions}
        isClickToPauseDisabled={true}
        height={height}
        width={width}
      />
    </>
  );
}

export default LottieAnimProvider;

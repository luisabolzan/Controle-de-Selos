import { BlackButton, RedButton, TransparentButton, } from "./styles";

import {IButton} from "./types"

const GenericButton = ({ width, buttonType = "Primário", isDisabled = false, highlighted = false, content, onClick, height, $flex=false, paddingV, paddingH, flexStatus="1", fontSize="clamp(20px, 15px + 1.2vw, 30px)", fontWeight="300"}: IButton) => {
    return ( 
      <>
      
        {(buttonType === "Red") ? (
          <RedButton $width={width} onClick={onClick} disabled={isDisabled} $highlighted={highlighted} $height={height} $flex={$flex} $paddingV={paddingV} $paddingH={paddingH} $flexStatus={flexStatus} $fontSize={fontSize} $fontWeight={fontWeight}>{content}</RedButton>
        ) : (buttonType === "Transparent") ? (
            <TransparentButton $width={width} onClick={onClick} disabled={isDisabled} $highlighted={highlighted} $height={height} $flex={$flex} $paddingV={paddingV} $paddingH={paddingH} $flexStatus={flexStatus} $fontSize={fontSize} $fontWeight={fontWeight}>{content}</TransparentButton>
        ) : (
            <BlackButton $width={width} onClick={onClick} disabled={isDisabled} $highlighted={highlighted} $height={height} $flex={$flex} $paddingV={paddingV} $paddingH={paddingH} $flexStatus={flexStatus} $fontSize={fontSize} $fontWeight={fontWeight}>{content}</BlackButton>
        )}
        
      </>
    )
  };

  export default GenericButton;
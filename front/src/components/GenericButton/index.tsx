import { BlackButton, RedButton, TransparentButton, } from "./styles";

import {IButton} from "./types"

const GenericButton = ({ width, buttonType = "Primário", isDisabled = false, highlighted = false, content, onClick, height, $flex=false, paddingV, paddingH}: IButton) => {
    return ( 
      <>
      
        {(buttonType === "Red") ? (
          <RedButton $width={width} onClick={onClick} disabled={isDisabled} $highlighted={highlighted} $height={height} $flex={$flex} $paddingV={paddingV} $paddingH={paddingH}><h3>{content}</h3></RedButton>
        ) : (buttonType === "Transparent") ? (
            <TransparentButton $width={width} onClick={onClick} disabled={isDisabled} $highlighted={highlighted} $height={height} $flex={$flex} $paddingV={paddingV} $paddingH={paddingH}><h3>{content}</h3></TransparentButton>
        ) : (
            <BlackButton $width={width} onClick={onClick} disabled={isDisabled} $highlighted={highlighted} $height={height} $flex={$flex} $paddingV={paddingV} $paddingH={paddingH}><h3>{content}</h3></BlackButton>
        )}
        
      </>
    )
  };

  export default GenericButton;